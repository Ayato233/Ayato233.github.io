# My Blog

基于 [Astro](https://astro.build) 与 [Mizuki](https://github.com/LyraVoid/Mizuki) 主题的个人静态博客，Material Design 3 卡片风格，中文界面。

## 快速开始

需要 Node.js >= 20 与 pnpm >= 9。

```powershell
pnpm install    # 安装依赖
pnpm dev        # 本地预览 http://localhost:3000
pnpm test       # 运行自带测试
pnpm build      # 构建到 dist/（含 Pagefind 搜索索引）
pnpm preview    # 预览构建产物
```

## 写文章

推荐用脚本创建（自动生成 frontmatter）：

```powershell
pnpm new-post -- my-first-post
```

也可以在 `src/content/posts/` 下手写 Markdown 文件，frontmatter 支持：`title`、`published`、`updated`、`draft`、`description`、`image`、`tags`、`category`、`lang`、`pinned`、`comment` 等（详见 `src/content.config.ts`）。

## 自定义

配置分散在 `src/config/` 目录下：

| 文件 | 说明 |
|------|------|
| `siteConfig.ts` | 站点标题、副标题、语言、主题色、横幅、目录等 |
| `profileConfig.ts` | 头像、作者名、bio、社交链接 |
| `navBarConfig.ts` | 顶部导航链接 |
| `footerConfig.ts` | 页脚 |
| `commentConfig.ts` | 评论系统（当前未启用） |

其他自定义入口：
- **头像**：`src/assets/images/`，替换后更新 `profileConfig.ts` 的 `avatar` 路径
- **favicon**：`siteConfig.ts` 的 `favicon` 数组
- **壁纸/横幅**：`siteConfig.ts` 的 `banner` / `wallpaperMode`

## 已知说明

- 评论系统、SEO 增强、部署均暂未配置
- Bangumi / B站 / 番剧 / 日记 等 Mizuki 特色页面保留默认占位配置，未接入数据源
- `pnpm build` 会执行番剧数据更新脚本，离线时可能失败（可单独运行 `pnpm astro build`）
- `pnpm type-check` 存在上游模板自带的 TypeScript 告警（不影响 dev/build/测试）
