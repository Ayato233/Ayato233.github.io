---
title: 博客改造 · 04 · 全站视觉体系
published: 2026-08-29
description: 全站拟态玻璃：--card-shadow/--card-bg 令牌、去卡套卡、卡片透明度滑块、交互控件去描边、筛选 chips 与搜索框填充化——视觉令牌与组件样式改造全记录。
image: ""
tags: [博客改造, 前端, 样式]
category: 博客改造
draft: true
lang: ""
pinned: false
---

# 全站视觉体系

本系列按功能分类记录博客相对 Shirone 原版的全部改造。本篇：**全站视觉**——卡片拟态玻璃与令牌、去卡套卡、卡片透明度设置、交互控件去描边、筛选 chips 与搜索框。

---

## 一、设计令牌：`--card-shadow` 与 `--card-bg`

页面背景与卡片底色的「层次」由几个全局令牌统一决定（`variables.styl`，一处修改全站生效）。

### 实现细节

```stylus
/* variables.styl :root（亮色） */
--card-bg: unquote("color-mix(in srgb, #ffffff calc(var(--card-opacity, 1) * 100%), transparent)")
/* 默认 1 = 纯白实体卡；滑块下调 → 白卡变透明，露出背景纹理 + 毛玻璃生效 */
--card-opacity: 1
/* 卡片柔和阴影（8 位 hex 避开 Stylus 对 rgba 空格语法的除法坑） */
--card-shadow: 0 2px 12px #0000001d, 0 1px 3px #00000012

:root.dark
	--card-bg: unquote("color-mix(in srgb, var(--surface-container-high) calc(var(--card-opacity, 1) * 100%), transparent)")
	--card-shadow: 0 2px 12px #00000057, 0 1px 3px #00000038
```

**关键说明**：

- 混合目标是 `transparent` 而不是背景色——保证半透明时**真正穿透**（看到页面背景纹理/毛玻璃），而不是混成一坨不透明的混合色（当时踩过：混 `var(--page-bg)` 后滑低看不出纹理，被主人否掉）。
- 默认 `--card-opacity: 1`：常态实体白卡（暗色深卡）；滑块往下 → 通透玻璃。

**Stylus 踩坑（高频）**：

1. 现代空格语法（`color-mix(...)`、`rgb(0 0 0 / 0.08)`）在 Stylus 里必须整体 `unquote("...")`，否则 `/` 当除法、逗号被拆、声明被吞；
2. 阴影用 8 位 hex（`#00000014`）最稳；
3. `variables.styl` **不走 Vite 热更**——改完必须重启 dev。

---

## 二、去「卡套卡」（8 个 Section + 友链申请区）

### 问题

番剧/友链/相册/罗盘等页面：外层包了一张整块大 `Card`（同 `--card-bg`），里面每张卡片又是同一底色 → **两层同色平叠**，透明度双重叠加、层级混乱。

### 修复

把外层 `<Card color="var(--card-bg)">` 改为普通容器（透出页面背景），内层卡片成为唯一卡片层：

```astro
<!-- 改前 -->
<Card color="var(--card-bg)" radius="l" class="friend-section px-8 py-6">…</Card>
<!-- 改后 -->
<div class="friend-section px-8 py-6">…</div>
```

涉及 8 个 Section（Album/Anime/Compass/Timeline/Project/Skill/Friend/Device）+ `friends.astro` 申请区外层。注意闭合标签 `</Card>` → `</div>`（跨文件时曾因结束标签残留导致 Svelte parse 报错）。

### 评论区同理

`CommentSection.astro` 外层 Card 保留（作为评论区的统一卡底），**内层评论卡 `.tk-comment` 背景改透明**——评论条目直接浮在外层卡底上：

```stylus
/* Twikoo.astro */
.tk-comment
	border: none !important
	background: transparent !important
	box-shadow: none !important
	&:hover
		background: unquote("color-mix(in oklab, var(--on-surface) 3%, transparent)") !important
```

---

## 三、卡片透明度设置（设置面板滑块）

**目标**：右下设置面板加「卡片透明度」滑块，拖动实时控制全站卡片通透度，持久化 + 首帧防闪。

### 实现链路（四个落点）

**1. 工具（setting-utils.ts）**：

```ts
const CARD_OPACITY_KEY = "shirone:card-opacity";
export const DEFAULT_CARD_OPACITY = 0.39; // 主人定：默认 39%（半透明玻璃）

export function getCardOpacity(): number {
	const raw = localStorage.getItem(CARD_OPACITY_KEY);
	const v = raw === null ? DEFAULT_CARD_OPACITY : Number.parseFloat(raw);
	return Number.isFinite(v) && v >= 0.3 && v <= 1 ? v : DEFAULT_CARD_OPACITY;
}
export function setCardOpacity(opacity: number): void {
	localStorage.setItem(CARD_OPACITY_KEY, String(opacity));
	document.documentElement.style.setProperty("--card-opacity", String(opacity));
}
```

**2. Layout `<head>` 内联脚本**（首帧读 localStorage 设变量，防刷新闪变）：

```js
const cardOpacity = localStorage.getItem('shirone:card-opacity');
if (cardOpacity !== null && Number.isFinite(Number(cardOpacity))) {
	const v = Number(cardOpacity);
	if (v >= 0.3 && v <= 1) document.documentElement.style.setProperty('--card-opacity', String(v));
}
```

**3. DisplaySettings（滑块 + 实时应用）**：

```svelte
<script>
let cardOpacity = $state(getCardOpacity());
$effect(() => { setCardOpacity(cardOpacity); });
</script>
<span class="opacity-badge">透明度 {Math.round(cardOpacity * 100)}%</span>
<Slider bind:value={cardOpacity} min={0.3} max={1} step={0.01} label={i18n(I18nKey.cardOpacity)} />
```

**4. 滑块轨道「透明度样式」**（棋盘格 + 透明→白渐变，覆盖默认彩虹轨道）：

```stylus
:global(.card-opacity-slider .m3-slider-wrap)
	background-image: unquote("linear-gradient(90deg, transparent, color-mix(in srgb, #ffffff 92%, transparent)), conic-gradient(rgb(0 0 0 / 0.14) 25%, transparent 0 50%, rgb(0 0 0 / 0.14) 0 75%, transparent 0)")
	background-size: unquote("100% 100%, 10px 10px")
```

（渐变/棋盘必须整条 `unquote`，否则 Stylus 崩。）

---

## 四、交互控件去描边（填充式 + 主题聚焦）

原版控件（输入框/按钮/选择器/chip）大量 `border: 1px solid var(--outline-variant)`。统一改为**填充式**：无描边、surface 底、聚焦主题 ring。

### 输入类（TextField/Select/Autocomplete/ExposedDropdownMenu）

```stylus
/* 原 outlined 变体：1px 描边 + surface 底 */
&--outlined
	border-radius: var(--shape-corner-xs)
	border: none
	background: var(--surface-container-low)
	&:hover
		box-shadow: 0 0 0 1px var(--outline)
	&:focus-within
		box-shadow: 0 0 0 2px var(--primary)
```

### 按钮类（Button/IconButton/SplitButton/ToggleButton outlined）

```stylus
&--outlined
	border: none
	background: var(--surface-container-high)
	color: var(--primary)
	&:hover
		background: var(--surface-container-highest)
```

### Chip 全形态（assist/filter/suggestion/input）

```stylus
&--assist, &--filter, &--suggestion, &--input
	background: var(--surface-container-low)
	border: none
	&.m3-chip--selected
		background: var(--secondary-container)
		color: var(--on-secondary-container)
```

（此前只改了 `Chips.svelte` 的 filter/input；`Chip.astro` 的 assist/filter/suggestion 也在同一批收敛。）

### 番剧页网格/列表切换按钮

```stylus
.anime-section__layout-switch
	background: var(--surface-container-high)
	/* border: 1px solid var(--outline-variant)  删除 */
```

---

## 五、页面搜索框（TextField → filled）

7 个 Section 的搜索框原本 `variant="outlined"`（细描边）。统一改为 **filled**（M3 填充式：表面底 + 焦点主题下划线，无描边）：

```astro
<TextField
	type="search"
	variant="filled"
	class="!rounded-(--shape-corner-l)"
/>
```

批量子替换（每个文件定位 `placeholder={i18n(I18nKey.search)}` 相邻的 `variant="outlined"` 行改为 `"filled"`，避免误伤密码框/发布框等其他输入）。

---

## 六、卡片拟态玻璃与独立感（AnimeCard 实例）

番剧卡片经历「玻璃 → 实体 → 玻璃+淡边+阴影」的演进，最终形态（独立感与通透感的平衡）：

```stylus
.anime-card
	border: 1px solid unquote("color-mix(in oklab, var(--on-surface) 8%, transparent)") /* 极淡浅边（非黑） */
	box-shadow: unquote("inset 0 1px 0 rgb(255 255 255 / 0.08)"), var(--card-shadow), unquote("0 4px 16px rgb(0 0 0 / 0.1)")
	transition:
		box-shadow 0.45s var(--m3e-easing-emphasized-decelerate),
		transform 0.45s var(--m3e-easing-emphasized-decelerate),
		border-color 0.45s var(--m3e-easing-standard)
	&:hover
		border-color: unquote("color-mix(in oklab, var(--on-surface) 15%, transparent)")
		transform: translateY(-3px)
```

要点：淡边给「边界独立感」（不是黑线），外投影给「悬浮纸片」立体感，动画时长 0.45~0.8s 丝滑化。

---

## 小结

全站视觉收敛到**令牌 + 三条规则**：深浅由 `--card-opacity` 决定、层次由 `--card-shadow` 决定、控件统一「填充式 + 主题聚焦」；视觉问题优先改令牌（一处生效），组件级例外才局部覆写。下一篇：《数据驱动页面》（番剧页 Bangumi 风、罗盘书签、友链页、评论区）。