# E:\MyBlog 换用 Mizuki 主题实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将 `E:\MyBlog` 的博客主题从 Fuwari 更换为 Mizuki（Astro 7.1.3，MD3 卡片风格），保留 git 历史、docs/、.superpowers/，迁移站点配置（标题/作者/中文/GitHub），使用 Mizuki 自带示例文章。

**架构：** clone Mizuki 源码后用 robocopy /MIR 镜像替换 E:\MyBlog（排除 .git、node_modules、docs、.superpowers），安装依赖，修改 `src/config/siteConfig.ts` 与 `src/config/profileConfig.ts` 完成配置迁移，最后运行测试/dev/build 验证并更新 README。

**技术栈：** Astro 7.1.3、Mizuki 主题（LyraVoid/Mizuki master）、pnpm 11.5.3、Tailwind 4、Pagefind、Svelte、MD3 卡片风格

**环境事实：**
- 当前目录 `E:\MyBlog` 是 git 仓库（main 分支），已有 Fuwari 源码 + 设计文档 commit（HEAD = 261de4e）
- 必须保留：`.git/`、`docs/`（设计文档）、`.superpowers/`（进度账本）
- Fuwari 特有文件（Mizuki 没有的）会被 robocopy /MIR 自动清除：`tailwind.config.cjs`、`svelte.config.js`、`postcss.config.mjs`、`pagefind.yml`、`frontmatter.json`、`CONTRIBUTING.md` 等
- Mizuki 的 package.json 声明 `packageManager: pnpm@11.5.3`，`preinstall` 强制 only-allow pnpm
- Mizuki 的 build 脚本为 `node scripts/update-anime.mjs && astro build && pagefind --site dist`
- Mizuki 自带测试：`pnpm test`（node --test tests/...）

---

### 任务 1：获取 Mizuki 源码并替换 Fuwari

**文件：**
- 修改：`E:\MyBlog\` 下全部源码（Fuwari → Mizuki）
- 保留：`E:\MyBlog\.git`、`E:\MyBlog\docs`、`E:\MyBlog\.superpowers`

- [ ] **步骤 1：clone Mizuki 到临时目录**

运行：
```powershell
git clone --depth 1 https://github.com/LyraVoid/Mizuki.git C:\Users\ADMINI~1\AppData\Local\Temp\opencode\mizuki-clone
```
预期：clone 成功，`C:\Users\ADMINI~1\AppData\Local\Temp\opencode\mizuki-clone\src\config\siteConfig.ts` 存在。

- [ ] **步骤 2：robocopy /MIR 镜像替换（排除保留目录）**

运行：
```powershell
robocopy "C:\Users\ADMINI~1\AppData\Local\Temp\opencode\mizuki-clone" "E:\MyBlog" /MIR /XD .git node_modules docs .superpowers /NFL /NDL /NJH /NJS /NP
```
预期：返回码 <= 7（robocopy 成功标志），Mizuki 文件已拷贝，Fuwari 特有文件已被 /MIR 删除。

- [ ] **步骤 3：确认关键文件就位与残留清理**

运行：
```powershell
Test-Path "E:\MyBlog\package.json"; Test-Path "E:\MyBlog\src\config\siteConfig.ts"; Test-Path "E:\MyBlog\src\content\posts"; Test-Path "E:\MyBlog\src\config.ts"
```
预期：前三个输出 `True`，最后一个 `False`（旧 Fuwari 单文件 config.ts 已被删除）。

- [ ] **步骤 4：确认 package.json 指向 Mizuki**

运行：
```powershell
(Get-Content "E:\MyBlog\package.json" -Raw) -match '"name": "mizuki"'
```
预期：`True`。

- [ ] **步骤 5：Commit**

```powershell
git add -A
git -c user.email="dev@local" -c user.name="dev" commit -m "build: 引入 Mizuki 主题替换 Fuwari"
```
预期：commit 成功。

---

### 任务 2：安装依赖

**文件：**
- 创建：`E:\MyBlog\node_modules\`（被 gitignore）、更新 `E:\MyBlog\pnpm-lock.yaml`

- [ ] **步骤 1：安装依赖**

运行（在 `E:\MyBlog`，超时 300000ms）：
```powershell
pnpm install
```
预期：无报错退出。若提示 pnpm 版本不匹配（packageManager 声明 11.5.3），运行 `corepack use pnpm@11.5.3` 后重试 `pnpm install`。

- [ ] **步骤 2：确认 astro 可执行**

运行：
```powershell
pnpm astro --version
```
预期：输出 `astro 7.1.3` 或相近版本号。

- [ ] **步骤 3：Commit 锁文件**

```powershell
git add -A
git -c user.email="dev@local" -c user.name="dev" commit -m "build: 提交 Mizuki 依赖锁文件"
```
预期：commit 成功（node_modules 已在 .gitignore 中）。

---

### 任务 3：迁移站点配置（中文 + 站点信息）

**文件：**
- 修改：`E:\MyBlog\src\config\siteConfig.ts`
- 修改：`E:\MyBlog\src\config\profileConfig.ts`

- [ ] **步骤 1：读取当前 siteConfig.ts 与 profileConfig.ts**

运行：
```powershell
Get-Content "E:\MyBlog\src\config\siteConfig.ts" -TotalCount 20
Get-Content "E:\MyBlog\src\config\profileConfig.ts"
```
预期：看到 Mizuki 默认配置（title: "Mizuki"、SITE_LANG = "en"、name: "まつざか ゆき" 等）。

- [ ] **步骤 2：修改 siteConfig.ts 的语言、标题、副标题**

将以下内容：
```ts
const SITE_LANG = "en"; // 语言代码，例如：'en', 'zh_CN', 'ja' 等。
```
替换为：
```ts
const SITE_LANG = "zh_CN"; // 语言代码，例如：'en', 'zh_CN', 'ja' 等。
```

将以下内容：
```ts
	title: "Mizuki",
	subtitle: "One demo website",
```
替换为：
```ts
	title: "My Blog",
	subtitle: "我的个人博客",
```

- [ ] **步骤 3：修改 siteConfig.ts 的顶栏标题**

将以下内容：
```ts
		// 顶栏标题文本
		text: "MizukiUI",
```
替换为：
```ts
		// 顶栏标题文本
		text: "My Blog",
```

- [ ] **步骤 4：修改 profileConfig.ts 的作者信息**

将以下内容：
```ts
	name: "まつざか ゆき",
	bio: "世界は大きい、君は行かなければならない",
```
替换为：
```ts
	name: "博主",
	bio: "记录技术学习与生活思考。",
```

- [ ] **步骤 5：修改 profileConfig.ts 的社交链接**

将整个 `links` 数组（默认含 Bilibili/Gitee/GitHub/Codeberg/Discord 5 项）替换为：
```ts
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/your-username",
		},
	],
```

- [ ] **步骤 6：验证 TypeScript 类型检查**

运行（在 `E:\MyBlog`，超时 180000ms）：
```powershell
pnpm type-check
```
预期：退出码 0，无 error。

- [ ] **步骤 7：Commit**

```powershell
git add src/config/siteConfig.ts src/config/profileConfig.ts
git -c user.email="dev@local" -c user.name="dev" commit -m "config: 站点改为中文并更新作者信息"
```
预期：commit 成功。

---

### 任务 4：运行 Mizuki 自带测试

- [ ] **步骤 1：运行测试套件**

运行（在 `E:\MyBlog`，超时 180000ms）：
```powershell
pnpm test
```
预期：退出码 0，所有测试通过（tests/markdown-enhancements.test.mjs、tests/layout-regressions.test.mjs、tests/crypto.test.mjs）。

- [ ] **步骤 2：记录测试输出**

将测试通过情况记录到任务报告（哪个测试文件、几个用例、退出码）。

---

### 任务 5：开发服务器验证

- [ ] **步骤 1：启动 dev server 并验证首页**

运行（在 `E:\MyBlog`）：
```powershell
$p = Start-Process cmd -ArgumentList "/c pnpm dev" -WorkingDirectory "E:\MyBlog" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 30
try { $r = Invoke-WebRequest -Uri "http://localhost:4321" -UseBasicParsing -TimeoutSec 20; $r.StatusCode; ($r.Content | Select-String -Pattern "My Blog" -SimpleMatch | Measure-Object).Count } catch { "FAILED: $_" }
Stop-Process -Id $p.Id -Force
```
预期：输出 `200` 且 "My Blog" 命中数 >= 1（首页渲染标题）。若端口被占用，Astro 会换端口，需观察输出调整 URL。

- [ ] **步骤 2：记录验证结果**

将 HTTP 状态码与标题命中情况记入任务报告。若 dev server 因 predev 脚本（sync-content）失败无法启动，记录错误并上报（这可能是内容仓库未初始化导致的，见任务 6 说明）。

---

### 任务 6：生产构建验证

**文件：**
- 创建：`E:\MyBlog\dist\`（构建产物，被 gitignore）

- [ ] **步骤 1：执行生产构建**

运行（在 `E:\MyBlog`，超时 300000ms）：
```powershell
pnpm build
```
预期：退出码 0。注意：build 脚本为 `node scripts/update-anime.mjs && astro build && pagefind --site dist`，`update-anime.mjs` 可能需要网络拉取番剧数据。

**若 `update-anime.mjs` 因网络失败：** 先单独运行 `pnpm astro build` 验证构建本体，再 `pnpx pagefind --site dist` 验证搜索索引，将网络问题与构建结果分开记录，并在报告中说明如何处理（如后续用 `--skip-anime` 或配置网络代理）。

- [ ] **步骤 2：验证构建产物**

运行：
```powershell
Test-Path "E:\MyBlog\dist\index.html"; Test-Path "E:\MyBlog\dist\pagefind\pagefind.js"
```
预期：两个 `True`。

- [ ] **步骤 3：确认 dist 未被 git 跟踪**

运行：
```powershell
git check-ignore dist; git status --short
```
预期：`git check-ignore dist` 输出 `dist`，`git status --short` 干净（无待提交变更）。

---

### 任务 7：更新 README

**文件：**
- 修改：`E:\MyBlog\README.md`（当前为 Fuwari 版内容，需重写为 Mizuki 版）

- [ ] **步骤 1：重写 README**

将 `E:\MyBlog\README.md` 完整替换为以下内容：

```markdown
# My Blog

基于 [Astro](https://astro.build) 与 [Mizuki](https://github.com/LyraVoid/Mizuki) 主题的个人静态博客，Material Design 3 卡片风格，中文界面。

## 快速开始

需要 Node.js >= 20 与 pnpm >= 9。

```powershell
pnpm install    # 安装依赖
pnpm dev        # 本地预览 http://localhost:4321
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
```

- [ ] **步骤 2：Commit**

```powershell
git add README.md
git -c user.email="dev@local" -c user.name="dev" commit -m "docs: README 更新为 Mizuki 版"
```
预期：commit 成功。

---

### 任务 8：最终验收

- [ ] **步骤 1：确认验收标准全部满足**

逐项核对：
- `pnpm install` 成功（任务 2）
- `pnpm test` 通过（任务 4）
- `pnpm dev` 启动成功，首页正常渲染，中文界面（任务 5）
- `pnpm build` 成功（任务 6，若 update-anime 网络失败则已验证 astro build 本体）
- 标题 "My Blog"、副标题 "我的个人博客"、语言 zh_CN、作者 "博主"、GitHub 链接 `your-username` 均生效（任务 3）
- README 已更新（任务 7）

- [ ] **步骤 2：确认 git 历史与 docs 保留**

运行：
```powershell
git log --oneline -8
Test-Path "E:\MyBlog\docs\superpowers\specs\2026-08-06-mizuki-theme-swap-design.md"
Test-Path "E:\MyBlog\.superpowers\sdd\progress.md"
```
预期：git 历史包含设计文档 commit（261de4e）及后续所有实现 commit，两个文件均存在。

- [ ] **步骤 3：向用户汇报**

总结：主题已更换为 Mizuki、配置迁移结果、dev/build/test 命令、README 已更新、保留的内容（git 历史/docs）、未配置内容（评论/SEO/部署/数据源）。

---

## 自检

**1. 规格覆盖度：**
- Mizuki 源码替换 Fuwari ✔（任务 1）
- 保留 git 历史 / docs / .superpowers ✔（任务 1 步骤 2 /XD 排除、任务 8 步骤 2 验证）
- 配置迁移（title/subtitle/lang/navbarTitle/name/bio/links）✔（任务 3）
- 使用 Mizuki 示例文章 ✔（任务 1 拷贝全部源码，未删 posts）
- 依赖安装 ✔（任务 2）
- 自带测试 ✔（任务 4）
- dev 验证 ✔（任务 5）
- build 验证 ✔（任务 6）
- README 更新 ✔（任务 7）
- 评论/SEO/部署/数据源不配置 ✔（未纳入任何任务，README 已知说明中标注）

**2. 占位符扫描：** 无 TODO/待定；`your-username` 为明确占位值（沿用此前规格约定）；siteURL 保持 Mizuki 占位（规格明确）。

**3. 类型一致性：** 配置字段名（title/subtitle/SITE_LANG/navbarTitle.text/name/bio/links）均来自已核实的 Mizuki 源文件（siteConfig.ts、profileConfig.ts 实际内容）；SITE_LANG 为 const 且被 export，直接改值安全；frontmatter 字段（content.config.ts 的 z.object schema）与 README 描述一致。
