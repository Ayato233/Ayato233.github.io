---
title: 博客改造 · 06 · 功能启用与历史继承
published: 2026-08-29
description: 留言板、站内搜索（pagefind）、一键字体切换、关键默认值，以及引入 Shirone 前 Firefly 时代沉淀下来的历史定制（相册拍立得/加密/音乐/追番/字体）。
image: ""
tags: [博客改造, 前端, 工程]
category: 博客改造
draft: true
lang: ""
pinned: false
---

# 功能启用与历史继承

本系列按功能分类记录博客相对 Shirone 原版的全部改造。本篇：**功能启用**（留言板、站内搜索、字体切换、默认值）+ **历史继承**（引入 Shirone 前 Firefly 时代的沉淀定制）。

---

## 一、留言板页

### 目标

`spec/guestbook.md` 内容本来就存在（主题模板），但**没有任何页面渲染它**（孤儿）。要一个 `/guestbook/` 页面：内容卡 + Twikoo 评论区。

### 实现

```astro
<!-- src/pages/guestbook.astro -->
import { getEntry, render } from "astro:content";
import CommentSection from "@components/organisms/comment/CommentSection.astro";

const guestbookPost = await getEntry("spec", "guestbook");
const { Content } = await render(guestbookPost);

<MainGridLayout title={i18n(I18nKey.guestbook)} description={i18n(I18nKey.guestbook)} page="guestbook" hasComments>
	<div class="flex w-full rounded-[var(--radius-large)] overflow-hidden relative min-h-32">
		<Card color="var(--card-bg)" radius="l" class="z-10 px-5 py-6 sm:px-7 relative w-full">
			<Markdown class="mt-2"><Content /></Markdown>
		</Card>
	</div>
	<CommentSection
		context={{ key: "guestbook", path: "/guestbook/", title: i18n(I18nKey.guestbook), language: siteConfig.lang }}
		postCommentEnabled={true}
		class="onload-animation mt-8"  <!-- mt-8 与内容卡拉开距离，避免粘连 -->
	/>
</MainGridLayout>
```

配套：
- `SidebarPage` 联合类型加 `"guestbook"`（页面标识，供 Swup/侧栏过滤）；
- `navBarConfig` 加 `LinkPresets.Guestbook`（icon forum）并放入「社交」子菜单（与友链同组）；
- 新 i18n key `guestbook`（十语言，遵循「每个 key 十语言非空」）。

---

## 二、站内全站搜索（pagefind）

### 关键认知

主题的 `package.json` **build 脚本本来就包含** `npx pagefind --site dist`：
```
build: … && astro build && npx pagefind --site dist && …
```
搜索「不可用」的真正原因是从头到尾只跑 `pnpm astro build`（**跳过 pagefind**）——**以后构建请用完整的 `pnpm.cmd build`**，搜索索引才会生成（`dist/pagefind/`）。

### 结果

- `dist/pagefind/pagefind-entry.json`（v1.5.2、zh-cn、12 页收录）；
- 顶栏搜索/各页搜索框全部走 `window.pagefind.search(keyword)`；dev 环境显示占位假结果（设计如此）。

> 提醒：build 末尾的 `exit 1` 是 pagefind 对中文词干处理的提示噪音，索引已正常生成。

---

## 三、一键字体切换（顶栏按钮：默认 ⇄ MiSans）

### 目标

顶栏「搜索 ▸ 字体切换 ▸ 主题配色」之间加按钮，一键在「当前字体」与「MiSans（更利阅读）」间切换，持久化 + 首帧防闪 + 按需加载。

### 实现

**1. CSS 变量覆盖**（Layout head，`html.font-misans` 时中文正文切 MiSans，失败回退原字体）：

```html
<style is:inline>
	html.font-misans { --font-cjk: "MiSans", "MiSans Normal", "Yozai Medium", system-ui, sans-serif; }
</style>
```

（正文中文字体变量是 `--font-cjk`，由 `font-options.ts` 的 ROLE_VARIABLES 定义。）

**2. head 首帧防闪**：

```js
// Layout head is:inline
const fontMode = localStorage.getItem('shirone:font');
if (fontMode === 'misans') document.documentElement.classList.add('font-misans');
```

**3. 按钮与行为**（TopAppBar 按钮 + Layout body 内联脚本，**按钮只放组件、行为放 Layout is:inline**——组件 module 脚本在长开发周期后可能有 HMR 失效风险，is:inline 必定执行）：

```svelte
<IconButton id="font-switch" label={i18n(I18nKey.fontToggle)} class="shrink-0">
	<Icon name="material-symbols:text-fields-rounded" class="text-[1.25rem]"></Icon>
</IconButton>
```

```js
// Layout body is:inline
function __dshFontToggle() {
	const enabled = document.documentElement.classList.toggle('font-misans');
	try { localStorage.setItem('shirone:font', enabled ? 'misans' : ''); } catch (e) {}
	if (enabled && !document.getElementById('misans-stylesheet')) {
		const link = document.createElement('link');
		link.id = 'misans-stylesheet'; link.rel = 'stylesheet';
		link.href = 'https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Regular.min.css'; // 中文全量分段字
		document.head.appendChild(link);
	} else if (!enabled) { document.getElementById('misans-stylesheet')?.remove(); }
}
document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('font-switch')?.addEventListener('click', __dshFontToggle);
	// 首帧已开启则补齐样式链
	…
});
```

**MiSans 资源来源**（探测过程）：`unpkg.com/misans@4.1.0`（DSRKafuU 的 MiSans 子集包，Apache-2.0），CSS 内含几十个 `unicode-range` 分段 @font-face——浏览器按需下载用到的分段；`font-family: "MiSans"`。

> 注意：`--font-cjk` 原值来自 `createFontRoleStyle`（构建期生成）——直接覆盖时要把原字体名写进回退链。

---

## 四、关键默认值（三处对齐）

| 项 | 值 | 位置 |
|---|---|---|
| 卡片默认透明度 | `0.39`（半透明玻璃） | `setting-utils.DEFAULT_CARD_OPACITY` + `variables.styl --card-opacity` |
| 主题配色色相 | `180`（青） | `siteConfig.themeColor.hue` |
| 音乐默认音量 | `1`（100%） | `musicConfig.defaultVolume` |

> 类似其他设置，localStorage 已有值会覆盖默认——想体验新默认需清站点 storage 或手动调一次。

---

## 五、历史继承（引入 Shirone 前 Firefly 时代的沉淀）

以下定制诞生于 Fuwari/Firefly 时代，迁移到 Shirone 时被继承保留，**同样属于「与主题原版不同」的改造**：

### 1. 相册拍立得体系

- 三层堆叠相纸：次层灰度/透明、主层白框拍立得；hover 扇形摊开、渐变遮罩浮现（张数/点击打开）、封面慢缩放；
- 列表双列错落 + 入场顺序 + 日期 `2026.01`；
- 配套脚本 3 个（缩略图生成/封面优化/本地外部相册），真机相册 4 个（fufu/genshin/encrypted-test/firefly-2026）。

### 2. 加密内容

- 服务端 AES-256-GCM 加密 slot HTML 存 `data-encrypted`，客户端输密码解密；
- 正确密码写入 `sessionStorage`（`pw:{slug}`）——同会话再访免密自动解密。

### 3. 音乐播放器（轻涟）

- 播放器换为《La vaguelette》曲目/歌词/封面（本地资源）；
- 删除原版示例音乐。

### 4. 追番数据同步脚本

- `anime:sync --provider bilibili|bangumi`：拉取收藏 → 归一（五态/评分/进度/标签）→ 写快照；
- B 站观看进度需 `SESSDATA`（登录态，放 `.env` 不提交）；Bangumi 公开 UID 匿名可拉。

### 5. 正文字体（Yozai / 思源宋体）

- `fontConfig`：body=Outfit、cjk=Yozai Medium、mono=JetBrains Mono，`fonts:subset` 子集构建。

---

## 小结

功能启用类改造的共同点：**接线优先于新建**（留言板接 spec、搜索接 build 流程、字体切换接 CSS 变量）、**默认值配置化**、**i18n 十语言同步**；历史继承类说明 Firefly 时代的定制资产在迁移中完整保留，构成了「引入前后都算改造」的完整版图。全系列共 6 篇，至此完成。<br><br>

> 本系列为本地备忘（draft 待检查），不参与正式发布流程。