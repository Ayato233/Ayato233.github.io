---
title: Shirone 之上：博客改造全记录
published: 2026-08-28
description: 相对 Shirone 原版（LyraVoid/Shirone）的完整改造记录，含实现细节、复现路径与踩坑，供接手者照此改造。
image: ""
tags: [博客改造, 工程, 前端]
category: 博客改造
draft: false
lang: ""
pinned: false
---

# Shirone 之上：博客改造全记录

本博客基于开源主题 Shirone（Astro 7 + Svelte 5 + Material 3 Expressive，上游 `LyraVoid/Shirone`，MIT）构建。本文完整记录相对上游的每一次改造：**目标 → 涉及文件 → 实现手法 → 复现路径 → 踩坑**，让后续接手者（含 AI）可以照着逐项复现。

> 改造纪律（每一项都遵守）：零外部网络请求、零 bundle 膨胀（能 CSS 就不加 JS）、零 DOM 污染、零样式污染（组件级 scoped / 全局改动收敛为单一令牌）、配置驱动（参数走 CSS 变量与 config 不硬编码）、移动端有触屏降级；每次改造以 `npx.cmd astro check`（0 errors）+ `pnpm.cmd build` 双验证收尾。本项目在 Windows，包命令统一带 `.cmd`。

---

## 一、参考博客功能移植

参考同源博客的成品效果移植，但实现全部本地化（句子库、文案、图片池均为站内数据），零外部接口。

### 1. 每日一言（QuoteOfTheDay）

侧栏 widget，每天一句中国古典名句，按天固定轮换。

**涉及文件**：`src/types/quoteConfig.ts`（类型）、`src/config/quoteConfig.ts`（句子库）、`src/components/molecules/QuoteOfTheDay.astro`（组件）、`src/i18n/*`（标题 key）、`src/types/sidebarConfig.ts` + `src/components/organisms/SideBar.astro` + `src/config/sidebarConfig.ts`（注册）。

**实现手法**：

- 句子库为 `{ text, author }[]` 配置数组；
- 按天轮换：`dayIndex = floor(Date.UTC(y, m, d) / 86400000) % quotes.length`——同一天全局一致，跨天 +1；
- 组件 SSR 阶段直接用服务端日期算出当日句子渲染（禁 JS 也可见）；
- 客户端用 `is:inline` 脚本（数据经 `define:vars` 内联）按访客本地日期校准，并设**午夜定时器**跨零点轮换：
  ```js
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  setTimeout(() => { applyQuote(); scheduleMidnight(); }, next - now + 100);
  ```
- 侧栏长驻 Swup 容器外，定时器由组件独占，无清理残留问题。

**侧栏注册三步**（所有新 widget 通用）：

1. `types/sidebarConfig.ts` 加判别联合分支（`QuoteWidget { type: "quoteOfTheDay"; ... }`）；
2. `SideBar.astro` 的 `componentMap` 注册组件；
3. `config/sidebarConfig.ts` 的 `components` 数组加条目（`pages` 省略 = 全页面展示）。

**踩坑**：

- `is:inline` 脚本**不支持 TypeScript 语法**（泛型、`as` 断言、`: void` 注解都会编译报错），写成纯 JS；
- `is:inline` 是普通内联 `<script>`，**顶层 `return` 非法**，逻辑要包进 IIFE；
- Astro 组件里不要用 Svelte 的 `{#if ...}` 语法，条件渲染用 `{cond && (<>...</>)}`；
- 定时器计算跨天用"下一个本地零点 +1s"，避免毫秒竞态。

### 2. 时间问候时钟（TimeGreeting）

侧栏 widget：上半"问候语 + 大号时钟 + 星期日期"，下半可选站内图片。

**涉及文件**：`timeGreetingConfig.{ts,rs→typ}`（时段文案 + 图片池）、`TimeGreeting.astro`、注册三件套（同上）。

**实现手法**：

- 时段文案按起始小时升序（0/6/9/12/14/18 六段），取 `filter(h => h <= now.getHours()).at(-1)`；
- 日期/星期/时钟全部走 `Intl.DateTimeFormat`（locale 由 `siteConfig.lang` 映射，如 `zh_CN → zh-CN`），**不另维护星期名 i18n**；
- 客户端"对齐下一分钟"：`msToNext = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()` 后 setTimeout 刷新，避免秒偏移累积；跨时段换问候、跨日重随机图片（图片池为空则不渲染图片区）；
- 图片池只放站内 `public` 静态资源（默认 `/assets/banner/desktop/1.webp`），零压缩、零请求。

**踩坑**：图片路径务必验证存在（曾把 `public/assets/banner/` 写成 `public/assets/images/banner/` 导致 404 无图）。

### 3. 三条进度条（ScheduleProgress）

侧栏 widget：年/月/周进度 + 下一个节日倒计时。

**涉及文件**：`scheduleConfig.{ts,typ}`、`ScheduleProgress.astro`、注册三件套。

**实现手法**：

- 闰年：`(y%4===0 && y%100!==0) || y%400===0`；月天数：`new Date(y, m, 0).getDate()`；年中日：`(date - new Date(y,0,1)) / 86400000 + 1`；
- 周进度把 JS 周日=0 映射为周一=1（`dow === 0 ? 7 : dow`）；
- 节日支持两类规则：**公历固定**（`{month, day}`）与**按星期**（某月第 n 个星期几，如 5 月第 2 个周日 = 母亲节），农历留扩展注释；
- 下一节日取"今年未过的最早节日"，没有则指明年；
- 客户端午夜刷新（同上个组件的定时模式），进度条宽度内联百分比。

### 4. 欢迎 Toast（WelcomeToast）

首次访问右下角提示，同一标签页只出现一次。

**涉及文件**：`src/components/organisms/WelcomeToast.astro`、i18n（`welcomeKicker` / `welcomeTitle`，含 `{site}` 占位）、`Layout.astro` 挂载。

**实现手法**：

- `sessionStorage.setItem("shirone_welcome_seen_v1")` 作会话标记，无标记才延迟显示；
- 分时问候复用 `timeGreetingConfig.greetings`（本地时间，零网络，**未接定位/天气接口**）；
- 延迟 900ms 出现、6.5s 自动消失、可手动关闭、`aria-live="polite"`；
- `pagehide` 时兜底清理定时器；
- SSR 骨架默认 `data-state="idle"`（CSS `opacity:0; pointer-events:none`），禁 JS 时零观感。

### 5. 自定义光标

站内星形 SVG 光标，明暗双版随主题切换。

**涉及文件**：`public/cursor/pointer-{light,dark}.svg`、`src/styles/cursor.css`、`Layout.astro`（import）。

**实现手法**：

```css
@media (hover: hover) and (pointer: fine) {
  :root { --cursor-pointer: url("/cursor/pointer-light.svg") 12 12, pointer; }
  html.dark { --cursor-pointer: url("/cursor/pointer-dark.svg") 12 12, pointer; }
  a, button, select, summary, [role="button"], input[type="submit"], .cursor-pointer {
    cursor: var(--cursor-pointer);
  }
  input, textarea, [contenteditable="true"] { cursor: text; }
}
```

- 只替换可点击控件；默认箭头与文本光标保留系统原样；
- SVG 用 `viewBox 0 0 24 24`（≤32px 兼容），hotspot 在 CSS 里 `x y` 指定；
- 明暗双版：亮色深紫底白描边、暗色亮紫底深描边。

---

## 二、滚动与导航体验

### 1. 顶部滚动阅读进度条（ScrollProgress）

**涉及文件**：`src/components/organisms/ScrollProgress.astro`、`MainGridLayout.astro`（挂载）。

**实现手法**（纯 CSS，零 JS）：

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

- `animation-timeline: scroll(root)` 让动画直接由页面滚动驱动；
- `@supports` 门控：老浏览器静默隐藏；
- 配色用 M3 三角色（secondary → primary → tertiary），随主题变化；定位与 `RouteProgress` 一致（顶栏下沿、banner 未滚动时贴顶）。

### 2. 全局滚动条接管（OverlayScrollbars）

**涉及文件**：`src/layouts/Layout.astro`（`initGlobalScrollbar`）、`src/styles/scrollbar.css`（库原有样式）。

**实现手法**：

```js
OverlayScrollbars(document.body, {
  scrollbars: {
    theme: 'scrollbar-base scrollbar-auto',
    autoHide: 'leave', autoHideDelay: 500, autoHideSuspend: false,
  },
});
```

- 库原本已安装（仅公式容器用），此处接管**全局 body 滚动**，原生滚动条被自绘圆角细条替代；
- `autoHide: 'leave'`：滚动浮现、停止隐藏——"视觉无滚动条，功能完整"；
- 依赖库的 ResizeObserver 自动跟随 Swup 换页，无需额外钩子。

### 3. 非首页直入正文 + 首页平滑过渡（核心改造）

**涉及文件**：`astro.config.mjs`、`src/layouts/MainGridLayout.astro`、`src/global.d.ts`。

**前置**：`astro.config.mjs` 中 `smoothScrolling: false`——在 `@swup/astro` 里这个选项就是 **SwupScrollPlugin 的开关**（源码 `SwupScrollPlugin: smoothScrolling`），关闭后 Swup 不再自动滚顶。

**接管滚动**：用 `replace("content:scroll")` 整体替换 Swup 的默认滚动行为（默认 handler 是核心滚顶 `visit.scroll.reset=true`）：

```js
swup.hooks.on("visit:start", () => {
  fromHome = location.pathname.replace(/\/+$/, "") === "";
});
swup.hooks.replace("content:scroll", () => {
  const toPage = readCurrentPage();           // #swup-container 的 data-current-page
  const target = toPage === "home" ? 0 : contentTarget();
  if (fromHome || toPage === "home") {
    animateScrollTo(target);                  // 原生 smooth
  } else {
    window.scrollTo({ top: target, behavior: "auto" });  // 非首页之间瞬移
  }
});
```

- 正文起点：`横幅底 - 顶栏实际高 - 38px 留白`（`CONTENT_GAP_PX`），顶栏高度运行时读取 `#navbar`，避免硬编码偏差导致封面/标题被顶栏压住；
- 原生 `behavior:'smooth'`（合成器线程、不掉帧、可被用户打断）只用于**涉及首页**的切换（上滑回 hero / 下滑入正文）；非首页之间遮挡期瞬移；
- 是否来自首页用 **URL 判定**（不用 dataset——Swup 导航中 dataset 同步时序不可靠，曾导致"有时跳有时不跳"）；
- 直接刷新/直达链接保持"停在横幅顶部"，不做跳转。

**踩坑链（按发现顺序）**：

1. `visit:end` + rAF 抢跑 → 与 Swup 滚顶逐帧竞争，行为时好时坏；
2. `scroll:end` 钩子可达性不稳 → 仍偶发不跳；
3. 最终用 `replace("content:scroll")`（这个钩子必然触发、且此刻 `scrollY` 还是替换前位置）——彻底稳定；
4. 硬编码 `64`（顶栏高）与实际有出入 → 改动态读取 + 38px 留白。

### 4. 顶栏随滚动渐变（TopAppBar）

**涉及文件**：`src/components/organisms/TopAppBar.astro`、`src/layouts/Layout.astro`（scrollFunction）。

**实现手法**：滚动时把"透明 ↔ 实色"从整类切换改为 CSS 变量驱动：

```css
.top-app-bar {
  --on-surface: color-mix(in srgb, var(--mc-on-surface) calc(var(--nav-solid, 1) * 100%), white);
  background: color-mix(in oklab, var(--surface-container-low) calc(var(--nav-solid, 1) * 94%), transparent);
  box-shadow: 0 2px 8px rgb(0 0 0 / calc(var(--nav-solid, 1) * 0.08));
  backdrop-filter: blur(calc(var(--nav-solid, 1) * 16px));
}
```

```js
const solid = overBanner
  ? Math.min(1, Math.max(0, scrollTop / Math.max(1, bannerBottom - 64)))
  : 1;
document.documentElement.style.setProperty('--nav-solid', String(solid));
```

- 背景/阴影/毛玻璃 / 前景三色（on-surface/variant/primary）从纯白逐帧插值回主题色，全程无突变；
- 背景不设 transition（直接跟随变量，跟手不拖影）；`--transparent` 类退化为纯行为标记（供搜索展开/浮层回主题色）。

---

## 三、视觉统一

### 1. 动态/番剧卡片：拟态玻璃

**涉及文件**：`src/components/molecules/AnimeCard.svelte`、`MomentCard.svelte`。

**实现手法**：去 1px 深色描边，换顶部微反光 + 柔和阴影：

```stylus
border: none
box-shadow: unquote("inset 0 1px 0 rgb(255 255 255 / 0.08)"), var(--card-shadow)
-webkit-backdrop-filter: blur(16px)
backdrop-filter: blur(16px)
```

**踩坑**（重要）：

- `backdrop-filter: var(--card-blur)` 在本环境**解析为 none 不生效**（规则与变量都正确也如此，疑似预处理链问题）——必须用**直接值** `blur(16px)`；
- 现代空格语法（`rgb(... / 0.08)`、`color-mix(...)`）在 Stylus 里必须整体 `unquote("...")` 包裹，否则 `/` 被当除法、逗号被拆、整条声明被吞；
- 触屏降级 `@media (hover: none) and (pointer: coarse)` → `blur(6px)`。

### 2. 全站卡片柔和阴影

**涉及文件**：`src/styles/variables.styl`（新增令牌 `--card-shadow`）、`src/components/atoms/display/Card.svelte`（filled 默认带影）+ 九张分子卡片（Anime/Moment/Friend/Skill/Compass/Timeline/Project/Device/Album）统一常态引用、hover 统一 `elevation-2`。

```stylus
:root
  --card-shadow: 0 2px 12px #00000014, 0 1px 3px #0000000d
:root.dark
  --card-shadow: 0 2px 12px #00000047, 0 1px 3px #0000002e
```

**踩坑**：`variables.styl` 经 Layout 全局 stylus `@import`，**改动不走 Vite 热更，必须重启 dev**；阴影值用 8 位 hex（`#00000014`），彻底避开 Stylus 对 rgba 空格语法的解析坑。

### 3. 配色风格 9 宫格中文化

**涉及文件**：`src/components/organisms/DisplaySettings.svelte`、`src/i18n/languages/{zh_CN,zh_TW}.ts`。

**实现手法**：9 个 Material 动态配色风格名是官方专有名词——界面主显示英文（单一真源取 `en.ts`），悬停/读屏标签显示「英文 · 中文」双语：

```js
const stylePreviews = MC_STYLES.map((s) => ({
  label: `${en[styleKey(s)]} · ${i18n(styleKey(s))}`,  // title/aria
  enLabel: en[styleKey(s)],                             // 格子内主显示
}));
```

段标题、重置提示的英文残留（自定义文案）直接中文化。

### 4. 相册：拍立得堆叠卡片

**涉及文件**：`AlbumCard.svelte`、`AlbumGallery.svelte`、`album-scanner.ts`、相册脚本。

**实现手法**：

- 三层堆叠相纸：次层 `opacity .6/.8` + 灰度、主层白色厚边框拍立得；
- hover 扇形摊开：次层 `rotate 6→12deg ± translate`、主层 `translateY(-0.5rem) scale(1.05)`，0.5s 过渡；
- hover 渐变遮罩浮现（`from-black/80` → 透明，显示"N 张照片 / 点击打开"）；
- 列表双列错落（CSS columns）+ 按序入场（`--album-delay`）；日期 `2026.01` 格式；
- 配套：缩略图生成、封面优化、本地外部相册三个脚本。

### 5. 其他既有定制（迁移保留）

- 正文字体换思源宋体（Noto Serif SC 衬线）+ 字体子集；
- 代码块语言 Logo、显示设置面板开启；
- 站点名经旧名「烟雨行舟」数次更名后，现定名 **Shigure（时雨 / しぐれ）**，资料卡同步 Shigure（签名"生活明朗，万物可爱"）——旧名与旧签名已全量清除，不留残留在代码/文档/资源中。

---

## 四、侧栏与国际化

- **主栏**：资料卡 → 公告 → 每日一言 → 音乐播放器 → 分类 → 标签；
- **副栏**：时间问候 → 站点统计 → 日历 → 时间进度 → 文章目录（仅文章页）；
- 布局纯配置驱动（`sidebarConfig.components` 数组顺序即渲染顺序；`column: "secondary"` 进副栏）；公告与每日一言省略 `pages` = 全页面展示；
- 新增 i18n key（quoteOfTheDay / timeGreeting / scheduleProgress / welcomeKicker / welcomeTitle）同步填满全部十种语言模块（`i18nKey.ts` + `languages/*.ts`），参数化占位 `{site}` 各语言保持一致。

---

## 五、工程与稳定性

- `astro.config.mjs`：`smoothScrolling: false`（禁用 SwupScrollPlugin）；Vite 文件监听 Windows 加固（轮询 + ignore 系统文件，防 `EINVAL` 崩溃）；
- Netlify 部署配置；相册/追番脚本（Bilibili 数据同步 + 本地封面 500+）；`package.json` 脚本扩展；
- 每次改造守则（见文首"改造纪律"），双验证收尾。

---

## 六、踩坑速查（按优先级）

1. **Swup 默认滚动竞争**：任何"导航后自定义滚动"都必须 `replace("content:scroll")` 接管，不要在 `visit:end`/rAF 里抢；
2. **`backdrop-filter` 不能用 CSS 变量**（本环境解析为 none），用直接值；
3. **Stylus**：现代 CSS 空格语法必须 `unquote()` 包裹；阴影用 8 位 hex 最稳；
4. **`variables.styl` 不热更**：改完重启 dev；
5. **`is:inline` 脚本**：纯 JS（无 TS 语法）、顶层避免 `return`（包 IIFE）；
6. **Astro 组件**：不用 Svelte 的 `{#if}`，条件渲染用表达式；
7. **图片零压缩铁律**：`src/assets` 会走 `/_image/` 管线（涉及需知情），`public` 静态图原样拷贝；
8. **构建产物勿提交**（`src/constants/*.json` 等生成文件会被 build 重写）。