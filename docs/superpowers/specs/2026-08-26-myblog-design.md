# MyBlog 个性化定制设计

日期：2026-08-26

## 目标

在 Astro 空模板基础上，仿照参考博客 [7thrainfall.top](https://7thrainfall.top/)（雨线下的信号塔）构建高度个性化博客：结构（文章/杂谈/照片墙混合信息流）、视觉（深色+思源宋体+金色点缀）、内容能力（科研 KaTeX/代码高亮）。无主题人设，纯功能导向，好看即可。

## 技术栈

- Astro 7 + TypeScript + Tailwind CSS v4（dark class 策略）
- Markdown 内容集合 + MDX
- 原生 JS 交互（不引入 React）
- KaTeX 公式 + Astro 内置 Shiki 代码高亮
- RSS / Sitemap

## 视觉系统

| 项 | 设计 |
|---|---|
| 中文 | Noto Serif SC 思源宋体（400/700/900，fontsource 自托管） |
| 西文 | Geist（正文）+ Geist Mono（代码） |
| 深色 | 底 `#17181c`、色块 `#2a2a2a`/`#333`、暖白文字 `#e8e6e3` |
| 点缀 | 金 `#d4af37`（hover/强调）、天蓝 `#0ea5e9` 辅助 |
| 亮色 | 对应浅色系（白底、深灰文字） |
| 日/夜 | class dark，localStorage 记忆，默认深色 |

Tailwind v4 用 `@theme` 定义 token：`--color-bg`、`--color-surface`、`--color-gold`、`--color-sky-accent`、`--color-ink` 等；`@custom-variant dark` 启用 class 策略。

## 页面结构

1. **首页 /**：头像 + 博客名 + 签名 + 统计（文章/杂谈/照片数）→ Latest Insight 置顶文章卡（封面/分类/日期/标题/摘要）→ 照片墙入口卡 → Records 杂谈流（时间线短篇，展示最新 N 条）→ 底部（时钟 + 运行时长 + 备案）
2. **文章列表 /posts** + **文章页 /posts/[slug]**：标题/封面/日期/标签/摘要、KaTeX、代码高亮、上一篇/下一篇
3. **照片墙 /photowall**：响应式照片网格
4. **杂谈 /chatter**：全部短篇时间线

## 内容能力

- 文章 frontmatter：title / date / cover / category / tags / summary
- 杂谈 frontmatter：title / date / cover（可选）
- 照片 frontmatter：src / alt / date /（可选）caption
- Markdown 增强：表格、引用、图片、代码块、KaTeX 公式

## 交互（原生 JS）

- ThemeSwitch：日/夜切换，`<html class="dark">` + localStorage
- Clock：`00:00:00` 实时时钟
- Uptime：首次访问时间记 localStorage，显示"系统已稳定运行 X 天 X 时"

## 内容组织

```
src/content/posts/*.md        文章
src/content/records/*.md      杂谈
src/content/photos/*.md       照片
src/data/site.ts              站点配置（博客名/签名/头像/备案/统计基数）
```

## 数据模型

- 博客名、签名、头像、备案号 → `site.ts`
- 统计数 = posts/records/photos 集合计数
- 首页 Latest Insight = posts 按 date 最新一篇
- Records 流 = records 按 date 倒序，首页取前 3 条

## 完成标准

- `pnpm build` 通过，输出静态站
- 首页 / 文章页 / 照片墙 / 杂谈页均可访问
- 日/夜切换、时钟、运行时长可用
- KaTeX 公式、代码高亮正常渲染