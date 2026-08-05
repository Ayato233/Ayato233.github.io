# My Blog

基于 [Astro](https://astro.build) 与 [Fuwari](https://github.com/saicaca/fuwari) 主题的个人静态博客，卡片式活泼视觉，中文界面。

## 快速开始

需要 Node.js >= 20 与 pnpm >= 9。

```powershell
pnpm install    # 安装依赖
pnpm dev        # 本地预览 http://localhost:4321
pnpm build      # 构建到 dist/（含 Pagefind 搜索索引）
pnpm preview    # 预览构建产物
```

## 写文章

推荐用脚本创建（自动生成 frontmatter）：

```powershell
pnpm new-post -- my-first-post
```

也可以直接在 `src/content/posts/` 下手写 Markdown 文件，frontmatter 示例：

```yaml
---
title: 文章标题
published: 2026-08-06
description: 文章摘要（列表页与搜索使用）
image: /cover.png        # 可选，封面图（放 public/ 或相对路径）
tags: [标签1, 标签2]
category: 分类
draft: false             # true 则不发布
lang: zh_CN              # 可选，文章语言
---
```

标题、日期、标签、分类会用于列表页 / 归档页 / 搜索；`draft: true` 的文章不会出现在站点中。示例文章保留在 `src/content/posts/` 供参考格式。

## 自定义

主要配置都在 `src/config.ts`：

| 配置项 | 说明 |
|--------|------|
| `siteConfig.title` | 站点标题 |
| `siteConfig.subtitle` | 副标题 |
| `siteConfig.lang` | 语言（当前 `zh_CN`） |
| `siteConfig.themeColor` | 主题色相（0-360）与访客取色开关 |
| `profileConfig` | 头像、作者名、bio、社交链接 |
| `navBarConfig.links` | 顶部导航链接 |

其他自定义入口：
- **头像/封面图**：默认文件在 `src/assets/images/`，替换为 `src/config.ts` 里引用的路径
- **favicon**：`src/config.ts` 的 `favicon` 数组，文件放 `public/`
- **全站外观**：`src/styles/` 下的 CSS 变量

### 常用操作

- 站点标题、作者名、GitHub 链接：改 `src/config.ts`
- 导航栏 GitHub 链接当前指向主题仓库占位，记得换成自己的地址
- 部署前建议把 `astro.config.mjs` 的 `site` 改为你的线上域名（影响 sitemap / RSS）

## 目录结构

```
src/
├── config.ts          # 站点配置（标题/作者/导航/社交）
├── content/posts/     # 文章（Markdown）
├── pages/             # 页面（首页/归档/关于等）
├── components/        # 组件（卡片、导航、搜索框等）
├── i18n/languages/    # 语言文件
├── assets/images/     # 头像等静态素材
├── styles/            # 全局样式
└── layouts/           # 布局模板
```

## 部署

`pnpm build` 产出的 `dist/` 是纯静态文件，可部署到任意静态托管：

- **GitHub Pages**：推送到 GitHub 后启用 Pages，或用 `.github/workflows/` 中自带的 Actions 工作流（注意其包含 `astro check` 步骤，见下方已知问题）
- **Vercel / Cloudflare Pages / Netlify**：构建命令 `pnpm build`，输出目录 `dist/`

## 已知问题

- `pnpm astro check` 有 2 个来自 Fuwari 上游模板的类型告警（`src/components/Navbar.astro`、`src/pages/archive.astro`），不影响 `pnpm dev` 与 `pnpm build`，随上游更新即可消除
- Pagefind 对中文暂不支持词干化（不影响搜索，仅跨词根匹配受限）
- 评论系统与 SEO 增强暂未配置，后续需要可接入（Giscus / Waline 等）
