---
title: 博客改造 · 01 · 暗亮主题 Banner（双图层显隐）
published: 2026-08-29
description: 首页横幅按亮/暗主题展示不同图片：CSS 双图层显隐实现「暗色首帧直接图 2、图 3 零加载」，含完整代码、首帧防闪机制与踩坑。
image: ""
tags: [博客改造, 前端, 主题]
category: 博客改造
draft: true
lang: ""
pinned: false
---

# 暗亮主题 Banner（双图层显隐）

本系列记录博客相对 Shirone 原版主题（`LyraVoid/Shirone`）的全部改造，按功能分类成篇。本篇：**Banner 双图层机制**——按亮/暗主题展示不同图片，且「另一张完全不加载、暗色首帧零闪图」。

> 适用前提：Shirone 是 Astro 7 + Svelte 5（runes）+ Stylus 的静态站；改造均遵循「双验证」：`npx.cmd astro check`（0 errors） + `pnpm.cmd build`。

---

## 目标

- 亮色用图 3、暗色用图 2；
- **亮色时不加载图 2、暗色时不加载图 3**（严格按需）；
- 暗色用户刷新**首帧不得闪现亮色图**。

## 实现思路

纯 CSS「双图层显隐」是唯一同时满足「按主题选图 + 另一张零请求 + 首帧无闪图」的方案：

1. **首帧主题必须先行**——主题是 `localStorage` 存储的，服务端无法预知；好在 Layout `<head>` 里有一枚**内联主题脚本**（页面解析**之前**同步设置 `html.dark`）。这是整套机制成立的前提。
2. BannerStage SSR 渲染**两个 `<picture>`（亮层 + 暗层）**，CSS 用 `html:not(.dark) / html.dark` 控制显隐；**`display:none` 的层浏览器不会下载** → 暗色用户首帧 HTML 里图 3 处于不下载状态、直接显示图 2，零闪图、零多余请求。
3. JS 只做「语义对齐」：切主题时同步 `activeLayer`（`MutationObserver` 监听 `html` 的 class）。

## 配置（menu 驱动、向后兼容）

```ts
// types/config.ts
src: {
	desktop: string[];
	mobile: string[];
	/** 可选：按主题固定单图。配置后不再轮播；不配置则走原轮播逻辑 */
	themeImages?: { light?: string; dark?: string };
};

// siteConfig.ts
banner: {
	src: {
		desktop: ["assets/images/banner/desktop/2.png", "assets/images/banner/desktop/3.png"], // 兜底轮播
		themeImages: { light: "assets/images/banner/desktop/3.png", dark: "assets/images/banner/desktop/2.png" },
	},
	carousel: { enable: true, interval: 6000, fadeDuration: 1200, animation: "ken-burns" },
}
```

## 组件实现（BannerStage.astro）

**frontmatter**（SSR 解析两张主题图，默认亮色图作首帧）：

```ts
const themeLightImage = siteConfig.banner.src.themeImages?.light
	? await optimizeBannerImage(siteConfig.banner.src.themeImages.light, "desktop")
	: null;
const themeDarkImage = siteConfig.banner.src.themeImages?.dark
	? await optimizeBannerImage(siteConfig.banner.src.themeImages.dark, "desktop")
	: null;
const hasThemeImages = Boolean(themeLightImage || themeDarkImage);

// SSR 首图：主题模式下默认亮色图（视觉优先；暗色由 head 脚本先设 html.dark → CSS 直显暗层）
const themeInitialImage = themeLightImage ?? themeDarkImage ?? desktopResponsiveImages[0];
```

**模板**：双图层（关键：`data-theme-layer` + 各自响应式 `<source>`）：

```astro
{hasThemeImages ? (
	<>
		<picture class="banner-stage__layer" data-theme-layer="light">
			{/* avif/webp 多档 source，见原模板 */}
			<img class="banner-stage__image banner-stage__image--front banner-stage__image--active"
				src={themeLightImage.fallback} fetchpriority="high" loading="eager" decoding="async" alt="" />
		</picture>
		<picture class="banner-stage__layer" data-theme-layer="dark">
			{/* source 同亮层，图 = themeDarkImage */}
			<img class="banner-stage__image banner-stage__image--back"
				src={themeDarkImage.fallback} fetchpriority="high" loading="eager" decoding="async" alt="" />
		</picture>
	</>
) : (
	/* 原轮播 structure 保留：单 picture + back img 由 JS 接管 */
)}
```

**CSS 显隐**（组件 scoped 样式内）：

```stylus
.banner-stage__layer[data-theme-layer="dark"]
	display: none

:global(html.dark) .banner-stage__layer[data-theme-layer="light"]
	display: none

:global(html.dark) .banner-stage__layer[data-theme-layer="dark"]
	display: block
```

**JS**（主题切换对齐 activeLayer；轮播在主题模式下停用）：

```js
const themeMode = stage?.dataset.themeMode === "true";
const themeLightUrl = stage?.dataset.themeLight || "";
const themeDarkUrl = stage?.dataset.themeDark || "";
const currentThemeUrl = () =>
	document.documentElement.classList.contains("dark") ? themeDarkUrl : themeLightUrl;

function syncThemeLayer() {
	if (!themeMode || !stage) return;
	const isDark = document.documentElement.classList.contains("dark");
	runtime.activeLayer = isDark ? 1 : 0; // 0=亮图层 1=暗图层
	layers.forEach((layer, i) =>
		layer.classList.toggle("banner-stage__image--active", i === runtime.activeLayer),
	);
}
const themeObserver = new MutationObserver(() => syncThemeLayer());
themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
syncThemeLayer();
```

**Layout head 首帧脚本**（防闪关键，勿删）：

```js
// Layout.astro <head> is:inline 脚本（在 DOM 解析前同步执行）
const theme = localStorage.getItem('theme') || DEFAULT_THEME;
// ... 设置 html.dark 的逻辑 ...
```

**暗色首帧时序**：head 脚本先设 `html.dark` → 文档解析到 banner 时暗层显示、亮层 `display:none` 不下载 → **首帧即图 2，图 3 全程零请求**。

## Banner 加载前的占位底色（避免黑屏）

暗色首帧图片加载前会露出「黑屏窗口」（深色 UI 固有）。加了主题化占位渐变：

```stylus
.banner-stage
	background: linear-gradient(160deg, var(--surface-container-high), var(--surface-container-lowest))

:global(html.dark) .banner-stage
	background: linear-gradient(160deg, #241f3d, #0c0b14) /* 带紫调、非纯黑 */
```

图片到位后覆盖占位，首帧观感从「纯黑」变为「有质感的深色底 + 渐显图 2」。

## 踩坑记录

1. **方案 A（JS 换 src）不可取**：暗色用户 SSR 首图是亮图，JS 再换 → 首帧闪亮图 3。双图层 CSS 显隐才是正解。
2. **`backdrop-filter: var(--card-blur)` 解析为 none**：毛玻璃必须写直接值 `blur(16px)`。
3. 早期「双图 preload」无改善且破坏按需——已移除 head 里两个 `<link rel=preload>`。
4. 非主题模式保留「随机首图」：`themeMode ? 0 : Math.floor(Math.random() * images.length)`（轮播回退路径仍可用）。

---

## 小结

Banner 双图层机制的主线：**双图层 CSS 显隐满足「按主题零加载」**、**head 内联脚本先行设主题防闪**、**占位底色避免首帧黑屏**。下一篇：《侧栏焕新》（每日一言/时间问候/进度条/欢迎 Toast/自定义光标/公告）。