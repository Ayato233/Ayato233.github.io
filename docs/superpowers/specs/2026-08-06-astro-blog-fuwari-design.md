# Fuwari 卡片风 Astro 博客搭建 — 设计文档

日期：2026-08-06
状态：待实现

## 目标

在 `E:\MyBlog`（当前为空目录）搭建一个基于 Fuwari 主题的 Astro 静态博客，卡片式活泼视觉风格，面向中文内容。

## 范围

### 包含
- Astro 5.x + Fuwari 主题（v2.x）
- 卡片式布局、暗色模式切换（主题内置）
- Pagefind 站内搜索（主题内置）
- 站点信息配置：标题、作者名、社交链接（GitHub/邮箱等）
- 语言配置为 zh（中文）
- 保留 Fuwari 自带示例文章，作为内容格式参考

### 不包含（本次搁置）
- 评论系统配置（Giscus / Waline）
- SEO 增强配置（额外 meta、结构化数据等；主题自带基础 meta 保留）
- 示例文章清理
- 部署平台接入

## 技术方案

- **框架**：Astro 5.x（Fuwari 依赖）
- **主题**：Fuwari（https://github.com/saicaca/fuwari），通过 git clone 获取
- **内容管理**：Astro Content Collections，文章为 Markdown（`src/content/posts/`）
- **构建输出**：`dist/` 静态目录

## 配置项

| 配置 | 值 |
|------|-----|
| 站点标题 | My Blog（占位，可在 config.ts 修改） |
| 作者名 | 待定（占位） |
| 语言 | zh |
| 评论 | 不启用 |
| 暗色模式 | 启用（主题内置） |

配置主要在主题的 `src/config.ts` 中完成。

## 实施步骤

1. 初始化 git 仓库（E:\MyBlog 当前无 git）
2. clone Fuwari 主题仓库到 E:\MyBlog
3. 删除 .git 使项目独立（避免作为主题子模块）
4. `npm install` 安装依赖
5. 修改 `src/config.ts`：站点标题、作者、语言 zh、社交链接
6. 本地验证 `npm run dev`（astro dev）可正常启动
7. 构建验证 `npm run build`（astro build）无错误
8. 记录构建产物路径与后续部署说明

## 验收标准

- `npm run dev` 启动成功，浏览器访问正常渲染首页（含示例文章卡片）
- `npm run build` 构建成功，无报错
- 站点标题/作者名/中文语言配置生效
- 暗色模式切换可用
- 搜索功能可用（Pagefind）

## 后续可扩展（不在本次范围）

- 评论系统接入（Giscus/Waline）
- SEO 优化
- 自定义主题视觉细节
- 部署到 GitHub Pages / Vercel / Cloudflare Pages
