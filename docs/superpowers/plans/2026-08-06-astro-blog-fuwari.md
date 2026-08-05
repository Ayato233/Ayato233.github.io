# Fuwari 卡片风 Astro 博客搭建实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 在 `E:\MyBlog`（空目录，已含 git 与设计文档）搭建基于 Fuwari 主题的 Astro 静态博客，卡片式活泼视觉，配置为中文（zh_CN），保留示例文章，暗色模式与搜索可用。

**架构：** clone 官方 Fuwari 主题仓库到工作目录，安装 pnpm 依赖，修改 `src/config.ts` 完成站点信息与中文语言配置，最后本地验证 dev 与 build。

**技术栈：** Astro 5.13.10、Fuwari 主题、pnpm 9.14.4、Node 22、Tailwind、Pagefind（搜索）、Svelte

**环境事实：**
- 当前目录：`E:\MyBlog`，已有 git 仓库（main 分支），已有 `docs/superpowers/specs/2026-08-06-astro-blog-fuwari-design.md`
- pnpm 10.30.1 已安装（Fuwari 的 `preinstall` 脚本强制使用 pnpm）
- Windows / PowerShell 环境
- 因为目录非空，不能直接 `git clone` 到目标目录，需先 clone 到临时目录再拷贝

---

### 任务 1：获取 Fuwari 源码到工作目录

**文件：**
- 创建：`E:\MyBlog\` 下的全部 Fuwari 源文件（通过拷贝）

- [ ] **步骤 1：clone Fuwari 到临时目录**

运行：
```powershell
git clone --depth 1 https://github.com/saicaca/fuwari.git C:\Users\ADMINI~1\AppData\Local\Temp\opencode\fuwari-clone
```
预期：clone 成功，`C:\Users\ADMINI~1\AppData\Local\Temp\opencode\fuwari-clone\src\config.ts` 存在。

- [ ] **步骤 2：拷贝源码到 E:\MyBlog（排除 .git）**

运行：
```powershell
robocopy "C:\Users\ADMINI~1\AppData\Local\Temp\opencode\fuwari-clone" "E:\MyBlog" /E /XD .git /NFL /NDL /NJH /NJS /NP
```
预期：返回码 <= 7（robocopy 成功标志），`E:\MyBlog\package.json` 与 `E:\MyBlog\src\config.ts` 存在。

- [ ] **步骤 3：确认关键文件就位**

运行：
```powershell
Test-Path "E:\MyBlog\package.json"; Test-Path "E:\MyBlog\src\config.ts"; Test-Path "E:\MyBlog\src\content\posts"
```
预期：三行全部输出 `True`。

- [ ] **步骤 4：Commit**

```powershell
git add -A
git commit -m "build: 引入 Fuwari 主题源码"
```
预期：commit 成功。

---

### 任务 2：安装依赖

**文件：**
- 创建：`E:\MyBlog\node_modules\`、`E:\MyBlog\pnpm-lock.yaml`

- [ ] **步骤 1：安装依赖**

运行（在 `E:\MyBlog`）：
```powershell
pnpm install
```
预期：无报错退出，输出包含 `Done in` 或类似成功信息。

- [ ] **步骤 2：确认 node_modules 与 astro 可执行**

运行：
```powershell
pnpm astro --version
```
预期：输出 `astro 5.13.10` 或相近版本号。

- [ ] **步骤 3：Commit 锁文件**

```powershell
git add pnpm-lock.yaml
git commit -m "build: 提交 pnpm 锁文件"
```
预期：commit 成功（node_modules 应已在 .gitignore 中）。

---

### 任务 3：修改站点配置（中文 + 站点信息）

**文件：**
- 修改：`E:\MyBlog\src\config.ts`

- [ ] **步骤 1：读取当前 config.ts**

运行：
```powershell
Get-Content "E:\MyBlog\src\config.ts"
```
预期：看到默认配置（title: "Fuwari", lang: "en", name: "Lorem Ipsum" 等）。

- [ ] **步骤 2：修改 siteConfig 的标题、副标题与语言**

将以下字段：
```ts
	title: "Fuwari",
	subtitle: "Demo Site",
	lang: "en", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
```
替换为：
```ts
	title: "My Blog",
	subtitle: "我的个人博客",
	lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
```

- [ ] **步骤 3：修改 profileConfig 的作者信息**

将以下字段：
```ts
	name: "Lorem Ipsum",
	bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
```
替换为：
```ts
	name: "博主",
	bio: "记录技术学习与生活思考。",
```

- [ ] **步骤 4：将 profile 的社交链接改为用户可用的 GitHub 占位**

将 links 数组改为：
```ts
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/your-username",
		},
	],
```
（保留注释 `// Visit https://icones.js.org/ for icon codes`）

- [ ] **步骤 5：验证 TypeScript 类型检查**

运行（在 `E:\MyBlog`）：
```powershell
pnpm astro check
```
预期：无 error（warn 可接受）。

- [ ] **步骤 6：Commit**

```powershell
git add src/config.ts
git commit -m "config: 站点改为中文并更新作者信息"
```
预期：commit 成功。

---

### 任务 4：本地开发验证

- [ ] **步骤 1：启动 dev server 并验证首页**

运行（在 `E:\MyBlog`，带超时）：
```powershell
$p = Start-Process pnpm -ArgumentList "dev" -PassThru -NoNewWindow
Start-Sleep -Seconds 20
try { (Invoke-WebRequest -Uri "http://localhost:4321" -UseBasicParsing -TimeoutSec 10).StatusCode } catch { "FAILED" }
Stop-Process -Id $p.Id -Force
```
预期：输出 `200`（或 3xx）。

- [ ] **步骤 2：检查首页包含站点标题与文章卡片**

运行：
```powershell
(Invoke-WebRequest -Uri "http://localhost:4321" -UseBasicParsing).Content | Select-String -Pattern "My Blog" -SimpleMatch
```
预期：命中至少一行（首页渲染了标题）。如已关闭 server 可跳过，由下一步构建验证代替。

---

### 任务 5：构建验证

**文件：**
- 创建：`E:\MyBlog\dist\`（构建产物）

- [ ] **步骤 1：执行生产构建**

运行（在 `E:\MyBlog`）：
```powershell
pnpm build
```
预期：退出码 0；输出包含 `astro build` 完成信息及 `pagefind` 索引完成信息（构建脚本为 `astro build && pagefind --site dist`）。

- [ ] **步骤 2：验证构建产物**

运行：
```powershell
Test-Path "E:\MyBlog\dist\index.html"; Get-ChildItem "E:\MyBlog\dist" | Select-Object -First 5 Name
```
预期：`True`，且 dist 下包含 `index.html` 等文件。

- [ ] **步骤 3：检查 dist 内已生成 pagefind 索引**

运行：
```powershell
Test-Path "E:\MyBlog\dist\pagefind\pagefind.js"
```
预期：`True`（搜索功能索引已生成）。

- [ ] **步骤 4：Commit 构建产物（如未在 .gitignore）**

```powershell
git add -A
git commit -m "build: 首次生产构建"
```
预期：commit 成功（若 dist 已被 .gitignore 忽略则跳过此步并说明）。

---

### 任务 6：最终验收

- [ ] **步骤 1：确认验收标准全部满足**

逐项核对：
- `pnpm dev` 启动成功，首页正常渲染（任务 4 已验证）
- `pnpm build` 无报错（任务 5 已验证）
- 站点标题 "My Blog"、语言 zh_CN 生效（任务 3 已配置，dev/build 均通过）
- 暗色模式：Fuwari 内置，无需额外配置，可通过页面右上角切换（主题自带功能）
- 搜索：pagefind 索引已生成（任务 5 步骤 3）

- [ ] **步骤 2：Commit 最终状态**

```powershell
git add -A
git commit -m "chore: 搭建完成"
```
预期：commit 成功（若无变更则提示已是最新）。

- [ ] **步骤 3：向用户汇报**

总结：项目位置、`pnpm dev` 启动命令、`pnpm build` 构建命令、构建产物 `dist/` 位置、如何修改标题/作者（`src/config.ts`）、示例文章保留位置（`src/content/posts/`）。

---

## 自检

**1. 规格覆盖度：**
- 目标目录 E:\MyBlog ✔（任务 1）
- Fuwari 主题 + Astro ✔（任务 1、2）
- 中文 zh_CN ✔（任务 3）
- 站点标题/作者 ✔（任务 3）
- 保留示例文章 ✔（任务 1 拷贝全部源码，未删除 posts）
- 暗色模式（内置）✔（任务 6 验收）
- 搜索（pagefind）✔（任务 5 步骤 3）
- 评论/SEO 搁置 ✔（未纳入任何任务）

**2. 占位符扫描：** 无 TODO/待定；社交链接 `your-username` 为明确的占位值并已在计划中说明。

**3. 类型一致性：** 无自定义类型/函数跨任务引用，均为主题自带配置文件修改；lang 值 `zh_CN` 已在 `src/types/config.ts` 的联合类型中确认存在（`"en" | "zh_CN" | "zh_TW" | "ja" | ...`）。
