# E:\MyBlog 换用 Mizuki 主题 — 设计文档

日期：2026-08-06
状态：待实现

## 目标

将 `E:\MyBlog` 博客主题从 Fuwari 更换为 **Mizuki**（LyraVoid/Mizuki，Astro 7.1.3，Material Design 3 卡片风格），保留现有站点配置信息（标题/作者/中文/GitHub），使用 Mizuki 自带示例文章。

## 范围

### 包含
- 以 Mizuki 源码替换现有 Fuwari 源码
- 保留 git 历史、`docs/` 设计文档、`.superpowers/`
- 迁移站点配置：标题、副标题、语言（zh_CN）、作者名、bio、GitHub 社交链接
- 使用 Mizuki 自带示例文章
- 安装依赖（Mizuki 使用 pnpm 11.5.3）
- 验证：Mizuki 自带测试、dev、build
- 更新 README

### 不包含（本次搁置）
- 评论系统配置（`commentConfig.ts` 保持默认）
- SEO 增强
- 部署平台接入
- 迁移 Fuwari 旧文章（两种主题 frontmatter 格式不同）
- Bangumi / B站 / 番剧 / 日记 等 Mizuki 特色数据源配置（保持默认占位）

## 技术方案

- **框架**：Astro 7.1.3（Mizuki 依赖）
- **主题**：Mizuki（https://github.com/LyraVoid/Mizuki，master 分支）
- **包管理器**：pnpm 11.5.3
- **配置结构**：`src/config/` 目录下模块化配置文件（siteConfig.ts、profileConfig.ts 等约 20 个）

## 配置迁移映射

| 原 Fuwari 配置 | Mizuki 文件 | 字段 | 迁移值 |
|----------------|-------------|------|--------|
| title "My Blog" | `src/config/siteConfig.ts` | `title` | "My Blog" |
| subtitle "我的个人博客" | `src/config/siteConfig.ts` | `subtitle` | "我的个人博客" |
| lang zh_CN | `src/config/siteConfig.ts` | `SITE_LANG` | "zh_CN" |
| name "博主" | `src/config/profileConfig.ts` | `name` | "博主" |
| bio "记录技术学习与生活思考。" | `src/config/profileConfig.ts` | `bio` | "记录技术学习与生活思考。" |
| GitHub 链接（your-username） | `src/config/profileConfig.ts` | `links` | 仅保留 GitHub 一项，url `https://github.com/your-username` |
| navbarTitle | `src/config/siteConfig.ts` | `navbarTitle.text` | "My Blog"（与标题一致） |
| siteURL | `src/config/siteConfig.ts` | `siteURL` | 保持 Mizuki 占位（不部署） |

### 保持默认（不修改）
- 导航栏其他链接（navBarConfig.ts 默认）
- 语言文件（Mizuki 自带 zh_CN 语言包）
- banner / 壁纸 / 音乐 / 特效 等装饰配置

## 实施步骤

1. clone Mizuki 到临时目录，拷贝到 E:\MyBlog（排除 .git、node_modules）
2. 清理残留 Fuwari 文件（旧 src/ 内容被替换、README 待重写）
3. `pnpm install` 安装依赖
4. 迁移配置：siteConfig.ts（title/subtitle/lang/navbarTitle）、profileConfig.ts（name/bio/links）
5. 运行 `pnpm test` 验证 Mizuki 自带测试通过
6. `pnpm dev` 本地验证首页正常渲染
7. `pnpm build` 构建验证（注意 build 会执行 update-anime.mjs，若网络问题导致失败需处理）
8. 更新 README 为 Mizuki 版说明

## 验收标准

- `pnpm install` 成功
- `pnpm test` 通过（Mizuki 自带测试）
- `pnpm dev` 启动成功，首页正常渲染（Mizuki MD3 卡片风格，中文界面）
- `pnpm build` 成功（若 update-anime 网络问题则调整后通过）
- 站点标题 "My Blog"、语言 zh_CN、作者 "博主"、GitHub 链接生效
- README 已更新

## 后续可扩展（不在本次范围）

- 评论系统接入
- 部署
- Mizuki 特色数据源（Bangumi/番剧/相册等）
- 自定义主题视觉细节
