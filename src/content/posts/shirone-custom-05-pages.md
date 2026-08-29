---
title: 博客改造 · 05 · 数据驱动页面：番剧 / 罗盘 / 友链 / 评论区
published: 2026-08-29
description: 番剧页 Bangumi 风重构（统计行/全部Tab/大封面/hover简介/9页分页）、罗盘书签导航、友链三要素卡与申请区接线、Twikoo 评论造型——数据驱动页面的实现全记录。
image: ""
tags: [博客改造, 前端, 组件]
category: 博客改造
lang: ""
pinned: false
---

# 数据驱动页面：番剧 / 罗盘 / 友链 / 评论区

本系列按功能分类记录博客相对 Shirone 原版的全部改造。本篇：**数据驱动页面**——番剧页 Bangumi 风、罗盘（浏览器书签导航）、友链页、评论区。

---

## 一、番剧页 Bangumi 风重构

### 数据链路

```
scripts/anime/providers/{bangumi,bilibili}.mjs  →  快照 JSON（src/data/anime-snapshots/）  →  getAnimeList()（构建期）  →  AnimeSection
```

- **快照信封**：`{ schemaVersion, provider, fetchedAt, accountRef, items }`——`fetchedAt` 是「数据更新于」来源；
- **双源可切**：`animeConfig.source.provider: "bilibili" | "bangumi"`（B 站 523 条 / Bangumi 6 条备份），主数据 523 条用 B 站；
- **元数据导出**（页头更新时间）：

```ts
// utils/anime-data.ts
export function getAnimeSyncMeta(): { provider?: string; fetchedAt?: string } {
	const options = resolveAnimeOptions(animeConfig);
	if (options.source.kind !== "snapshot" || !options.source.file) return {};
	const result = parseAnimeSnapshot(readFileSync(join(dir, options.source.file), "utf-8"));
	// 读 envelope.fetchedAt，格式化为 `YYYY-MM-DD HH:mm`
}
```

```astro
<!-- anime.astro -->
<AnimeSection animes={animes} syncAt={syncMeta.fetchedAt} client:visible />
```

### 页头统计行 + 全部 Tab

- 统计行（i18n 不支持参数，手动替换占位符）：

```js
const metaText = $derived.by(
	() =>
		i18n(I18nKey.animeMeta)
			.replace("{count}", String(animes.length))
			.replace("{date}", syncAt || "—"),
);
```

- Tab 列表：「全部」置首（总数）+ 五态（在看/看过/想看/搁置/抛弃），默认选中「全部」：

```js
type AnimeTab = "all" | AnimeStatus;
const tabs = $derived([
	{ status: "all" as AnimeTab, total: filtered.length },
	...STATUS_ORDER.flatMap((s) => {
		const total = filtered.filter((a) => a.status === s).length;
		return total > 0 ? [{ status: s as AnimeTab, total }] : [];
	}),
]);
```

### 9 张/页真分页（替换「加载更多」）

```js
const ANIME_PAGE_SIZE = 9;
const activeGroup = $derived.by(() => {
	const total = activeTab === "all" ? filtered.length
		: (statusGroups.find((g) => g.status === activeTab)?.total ?? 0);
	const totalPages = Math.max(1, Math.ceil(total / ANIME_PAGE_SIZE));
	const page = Math.min(Math.max(groupPage[activeTab] ?? 1, 1), totalPages);
	const base = activeTab === "all" ? filtered : filtered.filter((a) => a.status === activeTab);
	return { status: activeTab, total, page, totalPages,
		hasPrev: page > 1, hasNext: page < totalPages,
		items: base.slice((page - 1) * ANIME_PAGE_SIZE, page * ANIME_PAGE_SIZE) };
});
function setPage(status, page) {
	/* clamp 到 [1, totalPages]；groupPage[status] = … */
}
```

**分页器与主页文章分页（PagePagination）同款**：桌面 `< › 页码窗口（当前±2 + 省略 + 当前页 primary 填充）› `、移动端 `< › 当前/总页 › `（滚动同组件的双态样式复制）。

> 踩坑：Svelte 5 中 `$derived(() => {...})()` 是非法写法——必须 `$derived.by(() => {...})`（by 变体不接受调用）。

### 大封面 + hover 简介

- 网格列：手机 2 列、≥32rem 3 列（大封面）；
- 常态：封面 + 底部标题（不覆盖在封面上，保证可读）；
- hover：**简介层底部渐变淡入**（简介 4 行 + 在看进度/★评分/年份·制作），顶部 50% 保持封面画面透亮：

```stylus
.anime-card__overlay
	position: absolute
	inset: 0
	justify-content: flex-end
	padding: 0.75rem
	background: linear-gradient(180deg, transparent 0%, transparent 50%, rgba(0,0,0,.55) 78%, rgba(0,0,0,.88) 100%)
	opacity: 0
	transition: opacity 0.45s var(--m3e-easing-standard)
	.anime-card:hover & { opacity: 1 }
@media (hover: none) and (pointer: coarse)
	.anime-card__overlay { opacity: 1 } /* 触屏常显 */
```

> 踩坑：播放层的**全屏黑罩**（`background: #000 40%`）是「hover 全封面阴影」的真凶——改为透明（只留居中播放钮 + 图标投影）。

---

## 二、站点罗盘（浏览器书签导航）

### 数据源

主人浏览器导出的书签 HTML（`bookmarks_2026_8_29.html`）→ 解析归并写入 `src/data/compass.ts`（`CompassShelf[]`：分组 + entries）。

### 结构

```ts
interface CompassShelf { key: string; name: string; icon?: string; blurb?: string; entries: CompassEntry[]; }
interface CompassEntry { label: string; href: string; note?: string; icon?: string; image?: string; }
```

经过「导入 → 精简（剔除私密后台/破解/成人）→ 合并分组 → 扩充推荐」后现状：**8 组 61 条**（工具/学习/娱乐/AI/资源/设计/社区/影音）。

### favicon 自动兜底

条目无 `icon`/`image` 时，图标位自动加载站点 favicon 服务，失败回退首字母块：

```svelte
{#if iconKind === "image" && !imgFailed}
	<img src={imageSrc} onerror={() => (imgFailed = true)} />
{:else if iconKind === "iconify"}
	<Icon icon={entry.icon!} />
{:else if faviconSrc && !faviconFailed}
	<img src={faviconSrc} loading="lazy" referrerpolicy="no-referrer"
		onerror={() => (faviconFailed = true)} />
{:else}
	<span class="compass-tile__letter">{letter}</span>
{/if}
```

```js
const faviconSrc = $derived(host ? `https://icon.horse/icon/${encodeURIComponent(host)}` : "");
```

### 4 列等宽网格

```stylus
.compass-shelf__grid
	display: grid
	grid-template-columns: repeat(2, minmax(0, 1fr))
	@media (min-width: 48rem)
		grid-template-columns: repeat(4, minmax(0, 1fr))
```

> 一定要用 `minmax(0, 1fr)`：`1fr` 单独用会被卡片内容最小宽撑破导致“卡片不等宽”。

### 可访问性三轮检查

1. **重复**（按 hostname 归一）：哔哩哔哩/网易云 娱乐↔影音重复 → 归并影音组；
2. **失效 URL**（HTTP 404）：书栈网 → 官网主域、Layui → `layui.dev`；
3. **国内可直连**（HEAD+GET 超时）：移除 GitHub 文件加速/Hugging Face/Perplexity/V2EX/Docker Hub/编程导航(567)/Bangumi(超时)/内网 Portainer；403/401（反爬/HEAD 限制，网页可开）保留。

---

## 三、友链页

### 数据

`src/data/friends.ts`：3 条示例 + 20 条博客（`tags:["博客"]`，头像用 `icon.horse` favicon 外链 + onerror 回退站内头像）。

### 三要素卡片

FriendCard 重写为「头像 + 站名 + 描述」：52→56px 圆角方头像（hover 微缩放 1.07 + 上浮）、标题 hover 变主题色、描述两行截断；拟态玻璃 + 淡边（同篇 4 的独立感做法）。

```svelte
<a class="friend-card" href={friend.siteurl} target="_blank" rel="noopener noreferrer">
	<div class="friend-card__main">
		<img class="friend-card__avatar" src={friend.imgurl} alt={friend.title}
			loading="lazy" decoding="async"
			onerror={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/images/site/avatar.jpg"; }} />
		<div class="friend-card__info">
			<span class="friend-card__title">{friend.title}</span>
			{#if friend.desc}<p class="friend-card__desc">{friend.desc}</p>{/if}
		</div>
	</div>
</a>
```

### 申请区接线

`spec/friends.mdx`（本站信息卡 + 三步申请 + 注意事项）原本是**孤儿模板**（页面未渲染）——`friends.astro` 仿 about 页接线：

```astro
const friendsPost = await getEntry("spec", "friends");
const { Content } = await render(friendsPost);
...
<FriendSection friends={getFriendsList()} client:visible />
<div class="flex w-full relative min-h-32 mt-6 px-4 sm:px-8">
	<div class="w-full"><Markdown class="mt-2"><Content /></Markdown></div>
</div>
```

外层 Card 也按「去卡套卡」改为容器；`px-4 sm:px-8` 对齐上方友链表区左右边距。

---

## 四、评论区（Twikoo 造型）

评论系统用 Twikoo 自部署（`smile32-twikoo.netlify.app`），容器样式在 `Twikoo.astro`。

### 改造清单

| 项 | 做法 |
|---|---|
| 单条评论卡 | 去描边；内卡透明（外层 Card 保留，见篇 4）；hover 极淡反馈 |
| 嵌套回复 | 透明 + 缩进分层 |
| 昵称/邮箱/网址输入 | 细灰线（`border: 1px solid color-mix(on-surface 12%)`）+ surface 底 + 聚焦主题 ring |
| textarea / 表情浮层 | 无描边/无边框（保留 surface 底或 elevation） |
| 代码块 | 保留描边（内容边界语义，非控件） |

```stylus
.tk-meta-input > .el-input
	border: 1px solid unquote("color-mix(in oklab, var(--on-surface) 12%, transparent)")
	border-radius: var(--shape-corner-m)
	background: var(--surface-container-low)
	&:focus-within
		border: none
		box-shadow: 0 0 0 2px var(--primary)
```

---

## 小结

数据驱动页面的共性：**数据源与渲染解耦**（快照/配置/书签）、**列表页三件套**（Tab/分页/状态）、**交互反馈本地优先**（hover 层、favicon 兜底）、**清理三原则**（去重/修失效/可直连）。下一篇：《功能启用与历史继承》（留言板、站内搜索、字体切换、默认值、Firefly 时代沉淀）。