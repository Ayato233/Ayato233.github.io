---
title: 博客改造 · 02 · 侧栏焕新：每日一言/时间问候/进度条/欢迎Toast/光标
published: 2026-08-29
description: 侧栏 Widget 全家桶移植与实现：每日一言、时间问候时钟、三条进度条、欢迎 Toast、自定义光标、公告改版——全部零外网、配置驱动，附完整代码与侧栏注册机制。
image: ""
tags: [博客改造, 前端, 组件]
category: 博客改造
draft: true
lang: ""
pinned: false
---

# 侧栏焕新：每日一言 / 时间问候 / 进度条 / 欢迎 Toast / 光标

本系列按功能分类记录博客相对 Shirone 原版的全部改造。本篇：**侧栏 Widget 与全局小部件**——每日一言、时间问候时钟、三条进度条、欢迎 Toast、自定义光标、公告改版。

> 全部实现满足：零外部接口（句子/文案/图片全部站内）、零 bundle 膨胀、配置驱动、移动端优先；`astro check` + `build` 双验证。

---

## 〇、侧栏 Widget 注册机制（新组件通用三步）

Shirone 侧栏是**数据驱动编排**（`sidebarConfig.components` 数组顺序 = 渲染顺序）。新增一个 widget 固定三步：

```ts
// 1. 类型：types/sidebarConfig.ts 判别联合加分支
interface QuoteWidget { type: "quoteOfTheDay"; } // 可带配置字段

// 2. 注册：organisms/SideBar.astro 的 componentMap
{ quoteOfTheDay: QuoteOfTheDay, ... }

// 3. 编排：config/sidebarConfig.ts components 数组加项
//    pages 省略 = 全页面展示；column:"secondary" 进副栏
{ type: "quoteOfTheDay" },
```

---

## 一、每日一言（QuoteOfTheDay）

**目标**：侧栏一句古诗，按天固定、跨天自动换，禁 JS 也可见。

### 实现思路

句子库放配置数组；「按天轮换」用**本地 UTC 天数取余**（`floor(Date.UTC(y,m,d)/86400000) % n`）——同一天全站一致、刷新不换、跨天自动 +1；SSR 服务端直接算出当天句子，客户端只补「午夜轮换」。

### 实现细节

```ts
// quoteConfig.ts
export const quotes = [
	{ text: "行到水穷处，坐看云起时。", author: "王维" },
	// ... 十条
];
```

```astro
<!-- QuoteOfTheDay.astro（核心逻辑） -->
---
const dayIndex = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000) % quotes.length;
const today = quotes[dayIndex];
---
<WidgetLayout name={i18n(I18nKey.quoteOfTheDay)} id="quote-of-the-day">
	<blockquote class="qotd__text">{today.text}</blockquote>
	<figcaption class="qotd__author">—— {today.author}</figcaption>
</WidgetLayout>
```

```html
<!-- 客户端（is:inline + define:vars 内联数据）：午夜定时器轮换 -->
<script is:inline define:vars={{ quotes }}>
	const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
	setTimeout(() => { /* 重新取句并写入 DOM */ scheduleMidnight(); }, next - now + 100);
</script>
```

### 踩坑

- `is:inline` 脚本**不能写 TypeScript 注解**（泛型/`as`），纯 JS；
- `is:inline` 里**顶层不能 `return`**——包 IIFE；
- “午夜”用「下一本地零点 +1s」计算，避免毫秒竞态。

---

## 二、时间问候时钟（TimeGreeting）

**目标**：问候语 + 大号时钟 + 星期日期 + 底部随机图（支持每日随机外链图）。

### 实现思路

- 六时段文案配置驱动，`filter(hour <= now) .at(-1)` 取当前时段；
- 日期/星期/时钟全部走 `Intl.DateTimeFormat`（locale 由 `siteConfig.lang` 映射），不维护星期名 i18n；
- 客户端**对齐下一分钟**更新（`(60 - s)*1000 - ms`），避免秒偏移累积；跨时段换问候、跨日换图。

### 每日随机图（外链低频）

配置加可选 `remote` 字段，**每天最多请求一次**（localStorage 按天缓存 URL），失败回退站内图池：

```ts
// timeGreetingConfig.ts
images: ["/assets/banner/desktop/1.webp"], // 站内兜底池
remote: "https://moe.jitsu.top/img/?sort=pc&type=json&num=1", // 每日随机图源
```

```js
const key = "tg-remote-img-" + new Date().toDateString();
let cached = localStorage.getItem(key);
if (cached) return setBg(cached);
fetch(remoteUrl, { credentials: "omit" })
	.then((r) => (r.ok ? r.json() : Promise.reject()))
	.then((d) => {
		const url = d?.pics?.[0];
		if (!url) throw new Error("no pic");
		localStorage.setItem(key, url);
		setBg(url);
	})
	.catch(() => setBg(pickPoolUrl())); // 失败回退站内图，不破图
```

> 设计取舍：远程 JSON 源（作者反感高频爬取）→ **按天缓存**控制请求频率，仅跨日才拉新图。

---

## 三、三条进度条（ScheduleProgress）

**目标**：年/月/周三条进度 + 下一个节日倒计时。

### 实现细节（关键算法）

```ts
// 闰年
const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
// 月中日
const daysInMonth = (y, m) => new Date(y, m, 0).getDate();
// 年中日（1 起）
const dayOfYear = (d) => Math.floor((d - new Date(y, 0, 1)) / 86400000) + 1;
// 周进度：JS 周日=0 映射为周一=1
const dow = (d.getDay() === 0 ? 7 : d.getDay());

// 节日两类规则：公历固定 与 按周次
holidays = [
	{ month: 5, day: 8, name: "母亲节", rule: "nth-weekday", week: 2, weekday: 0 }, // 5 月第 2 个周日
	{ month: 1, day: 1, name: "元旦" }, // 固定
];
```

下一节日 = 「今年未过的最早节日」，跨年自动指明年。客户端午夜刷新（定时模式同「每日一言」）。

---

## 四、欢迎 Toast（WelcomeToast）

**目标**：首次访问右下角弹一次，礼貌不打扰。

### 实现细节

```js
// 会话标记
if (sessionStorage.getItem("shirone_welcome_seen_v1")) return;
sessionStorage.setItem("shirone_welcome_seen_v1", "1");

// 分时问候复用 timeGreetingConfig（本地时间，零接口）
const greeting = greetings.filter((g) => g.hour <= now.getHours()).at(-1)?.message;
```

- 延迟 900ms 出现、6.5s 自动消失、可手动关闭、`aria-live="polite"`；
- SSR 骨架默认 `data-state="idle"`（CSS 隐藏），禁 JS 零观感；
- 移动端避让底部悬浮导航（`safe-area-inset-bottom`）。

---

## 五、自定义光标

**目标**：站内星形光标，只替换可点击控件，明暗双版随主题。

```css
/* cursor.css */
@media (hover: hover) and (pointer: fine) {
	:root { --cursor-pointer: url("/cursor/pointer-light.svg") 12 12, pointer; }
	html.dark { --cursor-pointer: url("/cursor/pointer-dark.svg") 12 12, pointer; }
	a, button, select, summary, [role="button"], input[type="submit"], .cursor-pointer { cursor: var(--cursor-pointer); }
	input, textarea, [contenteditable="true"] { cursor: text; }
}
```

要点：默认箭头与文本光标保持系统原样；SVG `viewBox 0 0 24 24`（≤32px 兼容）；`hover:fine` 门控触屏零影响；每条规则保留系统回退值（加载失败自动回落）。

---

## 六、公告改版（Announcement）

**目标**：欢迎卡形态（标题「欢迎来访者」、纯文案段落、无关闭按钮、无「了解更多」链接）；并修复「localStorage 关闭标记压过配置」的老问题。

### 实现细节

```ts
// announcementConfig.ts
title: "欢迎来访者",
content: "欢迎来到 Shigure 的小站～\n\n这里记录技术笔记、生活随想与追番日常——一场疏雨，如约而至。\n\n你可以慢逛文章、动态与相册，也欢迎通过友链互链，或去留言板留下你的脚印。",
closable: false, // 不显示关闭按钮
link: { enable: false, text: "了解更多", url: "/about/", external: false },
```

修复逻辑（**closable=false 时无视并存标记并清理**）：

```js
function checkAnnouncementClosed() {
	const wrapper = document.querySelector(".announcement-wrapper");
	if (!wrapper) return;
	if (wrapper.getAttribute("data-closable") !== "true") {
		// 无关闭按钮：公告恒显示，且清理历史关闭标记，避免配置改动前点过「关闭」导致永久隐藏
		localStorage.removeItem("announcementClosed");
		localStorage.removeItem("announcementClosedTime");
		widgetLayouts.forEach((w) => { w.style.display = ""; });
		return;
	}
	/* 原逻辑：读标记、按 closeDuration 过期恢复 */
}
```

组件模板给 wrapper 加 `data-closable={String(config.closable)}` 供脚本判断。

---

## 小结

侧栏 Widget 的共同点：**配置驱动 + SSR 初值 + 客户端只补时间感 + 零外部接口**；新增 widget 走「类型 → componentMap → sidebarConfig」三步。下一篇：《导航与滚动体验》（Swup 接管、非首页直入正文、顶栏渐变、滚动进度条、滚动条）。