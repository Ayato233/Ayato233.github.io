---
title: 博客改造 · 03 · 导航与滚动体验
published: 2026-08-29
description: Swup 滚动完全接管、非首页直入正文、顶栏随滚动渐变、纯 CSS 阅读进度条、OverlayScrollbars 全局滚动条——完整实现思路与代码。
image: ""
tags: [博客改造, 前端, 交互]
category: 博客改造
draft: true
lang: ""
pinned: false
---

# 导航与滚动体验

本系列按功能分类记录博客相对 Shirone 原版的全部改造。本篇：**导航与滚动**——Swup 滚动完全接管、非首页直入正文、顶栏随滚动渐变、阅读进度条（纯 CSS）、全局滚动条接管。

---

## 一、Swup 滚动完全接管（核心改造）

### 背景

站内导航是 Swup 无刷新切换（`@swup/astro`）。默认行为切换后**滚到顶**，而博客想要：
- 首页 → 非首页：**平滑下滑到正文起点**（横幅之下、不被顶栏压住）；
- 非首页 → 首页：平滑上滑回 hero；
- 非首页 ↔ 非首页：切页即瞬移到正文起点；
- 直接刷新/直达链接：保持停在横幅顶。

### 实现思路

1. **禁用 SwupScrollPlugin**：`astro.config.mjs` 中 `smoothScrolling: false`——这正是 `@swup/astro` 对 Scroll 插件的开关（源码 `SwupScrollPlugin: smoothScrolling`）。关掉后 Swup 不再自动滚顶。
2. **`swup.hooks.replace("content:scroll")` 整体替换默认滚动 handler**：默认 handler 是核心「滚顶」（`visit.scroll.reset=true`），替换后**滚到哪完全由本脚本决定**。这个 hook 必然触发、且执行时 `window.scrollY` 还是替换前位置——平滑起点真实，彻底避开「与 Swup 滚顶逐帧竞争」的反复踩坑。
3. **来源页用 URL 判定**（不用 dataset）：Swup 导航中 `#swup-container` 的 dataset 同步时序不可靠。

### 实现代码（MainGridLayout.astro 客户端脚本）

```ts
const TOP_BAR_PX = 64;       // 顶栏 4rem（兜底；运行时优先读实际高度）
const CONTENT_GAP_PX = 38;   // 正文起点额外留白，确保标题/头像不被顶栏压住

let fromHome = false;        // URL 判定：来源是否为首页

function readCurrentPage(): string {
	const container = document.getElementById("swup-container");
	return container?.dataset.currentPage || "home";
}

/** 非首页正文起点：横幅底 - 顶栏实际高 - 额外留白 */
function contentTarget(): number {
	const banner = document.getElementById("banner-wrapper");
	if (!banner) return 0;
	const navbar = document.getElementById("navbar");
	const topBarH =
		navbar && navbar.getBoundingClientRect().height > 0
			? Math.round(navbar.getBoundingClientRect().height)
			: TOP_BAR_PX;
	return Math.max(0, banner.offsetTop + banner.offsetHeight - topBarH - CONTENT_GAP_PX);
}

/** 优先浏览器原生 smooth（合成器线程驱动，不占主线程、可被用户滚动打断） */
function animateScrollTo(target: number): void {
	window.scrollTo({ top: target, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

function bindSwup(): void {
	const swup = window.swup;
	if (!swup || window.__shironeBannerSkipBound) return;
	window.__shironeBannerSkipBound = true;

	swup.hooks.on("visit:start", () => {
		fromHome = location.pathname.replace(/\/+$/, "") === "";
	});
	swup.hooks.replace("content:scroll", () => {
		const toPage = readCurrentPage();
		const target = toPage === "home" ? 0 : contentTarget();
		if (fromHome || toPage === "home") {
			animateScrollTo(target);                    // 首页 ↔ 非首页：原生 smooth
		} else {
			window.scrollTo({ top: target, behavior: "auto" }); // 非首页之间：瞬移
		}
	});
}

bindSwup();
document.addEventListener("swup:enable", bindSwup, { once: true });
```

`global.d.ts` 声明：

```ts
declare global {
	interface Window { __shironeBannerSkipBound?: boolean; swup?: typeof Swup; }
}
```

### 踩坑链（按发现顺序，重要）

1. `visit:end` + rAF 抢滚 → 与 Swup 默认滚顶逐帧竞争，行为“有时跳有时不跳”；
2. `scroll:end` 钩子可达性不稳 → 仍偶发不跳；
3. **最终用 `replace("content:scroll")`**——必然触发且此刻 `scrollY` 未变，彻底稳定；
4. 硬编码 `64`（顶栏高）与实际有出入 → 改运行时读 `#navbar` 实际高 + 38px 留白。

---

## 二、顶栏随滚动渐变（TopAppBar）

### 目标

顶栏「透明 ↔ 实色」从**阈值突变**改为**滚动驱动连续渐变**：顶部纯白字 + 全透明（横幅上观感），滚到底稳定为毛玻璃实色 + 主题字，全程无突变点。

### 实现思路

滚动时更新 CSS 变量 `--nav-solid`（0~1，关于滚动距离线性）；TopAppBar 的 `color-mix` 把背景/前景三色（on-surface / variant / primary）从白渐插值到主题色，阴影/毛玻璃同增。

### 实现代码

```js
// Layout scrollFunction（滚动时设变量）
const solid = overBanner
	? Math.min(1, Math.max(0, scrollTop / Math.max(1, bannerBottom - 64)))
	: 1;
document.documentElement.style.setProperty('--nav-solid', String(solid));
```

```stylus
/* TopAppBar.astro scoped 样式 */
.top-app-bar
	--on-surface: color-mix(in srgb, var(--mc-on-surface) calc(var(--nav-solid, 1) * 100%), white)
	background: color-mix(in oklab, var(--surface-container-low) calc(var(--nav-solid, 1) * 94%), transparent)
	box-shadow: 0 2px 8px rgb(0 0 0 / calc(var(--nav-solid, 1) * 0.08))
	backdrop-filter: blur(calc(var(--nav-solid, 1) * 16px))
```

要点：背景不设 transition（直接跟随变量，跟手无拖影）；`--transparent` 类退化为纯行为标记（浮层回主题色用）。

---

## 三、顶部滚动阅读进度条（纯 CSS）

### 目标

顶栏下方 3px 三色渐变细条，滚动时按阅读进度增长；零 JS、零 bundle。

### 实现代码（ScrollProgress.astro）

```css
.scroll-progress { position: fixed; top: 4rem; left: 0; right: 0; height: 3px; z-index: 65; pointer-events: none; opacity: 0; }
@supports (animation-timeline: scroll()) {
	.scroll-progress { opacity: 1; }
	.scroll-progress__bar {
		transform-origin: 0 50%;
		background: linear-gradient(90deg, var(--secondary), var(--primary), var(--tertiary));
		animation: scroll-progress-grow linear both;
		animation-timeline: scroll(root);
	}
}
@keyframes scroll-progress-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
```

- `animation-timeline: scroll(root)` 让动画直接由页面滚动驱动，进度 = 阅读进度；
- `@supports` 门控：不支持的浏览器静默隐藏（不破布局）；
- 三角色渐变随 M3 主题变化。

---

## 四、全局滚动条接管（OverlayScrollbars）

### 目标

页面主滚动条自绘为圆角半透明细条，滚动浮现、停止隐藏——「视觉无滚动条，功能完整」。

### 实现代码（Layout.astro `initGlobalScrollbar`）

```js
OverlayScrollbars(document.body, {
	scrollbars: {
		theme: 'scrollbar-base scrollbar-auto',
		autoHide: 'leave', autoHideDelay: 500, autoHideSuspend: false,
	},
});
```

- 库原本已装（仅公式容器用）——此处接管**全局 body 滚动**，零新增依赖；
- `autoHide: 'leave'`：滚动浮现、停止约 500ms 隐藏；
- Swup 换页由库的 ResizeObserver 自动跟随。

---

## 小结

导航滚动四条线索：**`replace("content:scroll")` 完全接管**（替代与 Swup 抢滚）、**原生 smooth 代替 JS 动画**、**CSS 变量驱动连续渐变**（`--nav-solid`）、**浏览器原生能力优先**（scroll-timeline 进度条、OverlayScrollbars 滚动条）。下一篇：《全站视觉》（拟态玻璃、去卡套卡、卡片透明度设置、控件去描边、筛选 chips 与搜索框）。