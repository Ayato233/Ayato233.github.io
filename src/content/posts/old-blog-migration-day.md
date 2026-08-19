---
title: 旧博客搬迁记：内容迁移、评论系统与逐字弹跳的一整天
published: 2026-08-16
description: 把弃用的 Hexo 旧博客内容搬到新站的一天：文章迁移、相册搬运、头像更换、Twikoo 评论系统部署，还有评论框逐字弹跳效果的实现与踩坑记录。
image: ""
tags: [随笔, 博客, 折腾, 部署]
category: 随笔
draft: false
lang: ""
---

# 旧博客搬迁记：内容迁移、评论系统与逐字弹跳的一整天

今天把那个弃用的 Hexo 旧博客（`E:\IT\blog`）翻出来，把有价值的内容全部搬到了新站。从文章到相册、从头像到评论系统，一整天下来收获满满，也踩了不少坑，值得写一篇记录。

## 一、旧站盘点：家底比想象中薄

旧博客是 **Hexo + anzhiyu 主题**，部署在 GitHub Pages（`ayato233.github.io`）。打开目录一看，712MB 的体积吓我一跳——但细看大头全是 `node_modules` 和构建产物，真正的内容其实很薄：

- **文章只有 1 篇**：《错过的星光，未见的黎明》，一篇散文
- **相册 1 本**：公司的小猫猫，19 张猫图（约 43MB）
- **若干页面壳**：about / link / music 等，数据都写在 `_data/*.yml` 里
- **追番数据**：486 条 bangumi，但新站有自动拉取脚本，不需要迁移旧数据

结论：旧站虽然弃用，但还有一篇散文和一整本猫猫照片值得抢救。

## 二、文章迁移：front matter 的格式转换

最核心的迁移是那篇《错过的星光，未见的黎明》。Hexo 的 front matter 和新站（Astro + Mizuki）完全不同：

| 字段 | Hexo 旧格式 | Astro 新格式 |
|------|------------|-------------|
| 日期 | `date: 2025-3-23 17:42:16` | `published: 2025-03-23` |
| 封面 | `top_img: https://...`（随机图 API） | `image: ""` |
| 标签 | 无 | `tags: [随笔, 情感]` |
| 分类 | 无 | `category: 随笔` |

转换时注意了几点：

1. **日期规范化**：`2025-3-23` 补零成 `2025-03-23`，符合 schema 要求
2. **封面留空**：旧站 `top_img` 指向一个随机图 API（每次刷新换一张图），不适合当固定封面，直接留空走站点默认封面
3. **文件名**：`遗憾.md` → `missed-starlight.md`，新站默认用文件名做 slug，英文更利于 URL 和 SEO
4. 迁移后用 `astro check` 验证，0 errors 才放心

## 三、相册迁移：19 张猫图搬家

旧站相册数据在 `album.yml`，图片在 `source/imgs/mao/`。新站 Mizuki 的相册机制是 `public/images/albums/<相册名>/` + `info.json`。

这里有个关键决策：新站相册有两种模式——**本地扫描**（自动读文件名）和 **external 模式**（info.json 里写照片列表）。为了保留旧站记录的每张图信息（日期、地点、备注），我选了 external 模式，把 17 张照片的 `date` / `location` / `description` 都写进了 info.json。

细节：

- 19 个文件里有 1 张是封面（1.jpg）、1 张是相册顶部背景（6.jpg），真正的照片是 17 张
- 主人要求去掉公司信息，相册名从「公司的小猫猫」改成「小猫猫」，描述也改中性
- 原图直拷（43.5MB），主人选择不压缩——如果以后嫌加载慢，可以再压成 webp

## 四、头像更换：一个意外发现

旧站头像在主题配置里是外链图：一个蓝发猫耳、戴墨镜拿茶杯的动漫角色。用新站自带的 sharp 转成 webp 后替换了 `src/assets/images/avatar.webp`。

**意外发现**：旧站 `source/imgs/` 里躺着的 V.png 和 Z.jpg 根本不是头像，是**打赏二维码**（微信收款码 + 支付宝收款码）！幸好查了主题配置才没搬错。

## 五、Twikoo 评论系统：三个大坑

旧站的评论系统是 Valine（LeanCloud 后端），但新站 Mizuki 主题原生只支持 **Twikoo** 和 giscus。Twikoo 是 Valine 的现代继任者，体验最接近，于是决定部署 Twikoo。

部署架构：**Netlify 免费托管后端 + MongoDB Atlas 免费档（M0, 512MB）**。选 Netlify 而不是 Vercel 是因为实测 `*.vercel.app` 在国内基本打不开，而 Netlify 秒开——我的博客本身就在 Netlify 上，账号现成。

部署过程中踩了三个大坑：

### 坑 1：连接字符串复制成了代码

从 MongoDB Atlas 复制连接字符串时，如果不小心会复制成官方的 **Node.js 示例代码**（一整段 `const { MongoClient } = require(...)`），而不是 `mongodb+srv://...` 开头的纯字符串。填进环境变量后，云函数报：

```
{"code":1000,"message":"Invalid scheme, expected connection string to start with \"mongodb://\" or \"mongodb+srv://\""}
```

> [!TIP]
> 复制连接字符串时，要复制 `const uri = "..."` **引号里**的内容，而不是整段代码。

### 坑 2：Netlify 改环境变量后必须手动 Redeploy

在 Netlify 后台改了 `MONGODB_URI` 环境变量后，**不会自动触发重新部署**。必须去 Deploy 页面，对最新部署点 `⋯` → Redeploy，等状态变成 Published。否则改了等于没改。

### 坑 3：MongoDB 白名单导致 502 超时

环境变量都配对了，云函数还是报错：

```
{"errorType":"Sandbox.Timedout","errorMessage":"... Task timed out after 30.00 seconds"}
```

排查后发现：本地用 mongodb 驱动实测连接串**完全有效**，但 Netlify 的出口 IP 不固定，而 MongoDB Atlas 的 Network Access 白名单只加了我的家庭 IP。解决办法：加一条 `0.0.0.0/0`（允许所有 IP），云函数立刻恢复正常，返回「Twikoo 云函数运行正常」。

> [!WARNING]
> Netlify / Vercel / Lambda 这类无服务器平台的出口 IP 不固定，MongoDB 白名单必须加 `0.0.0.0/0`，否则云函数会 30 秒超时。

## 六、评论框逐字弹跳：纯 CSS 做不到的事

评论系统上线后，想给评论输入框加一个「打字逐字弹跳」的效果——每打一个字，这个字会弹跳一下再落下。

问题来了：**`<textarea>` 是纯文本控件，无法对单个文字做动画**。解决方案是 overlay 覆盖层方案：

1. 把 textarea 的文字设为透明（保留光标，用 `caret-color` 单独设置）
2. 在输入框上方叠一层透明的 div
3. 监听 input 事件，把文字拆成**每个字一个 span**，新输入的字触发弹跳动画（上弹 6px + 放大 1.12 倍 + 弹性回弹）

实现过程踩了两个隐蔽的坑：

### 坑 A：Astro 组件样式默认 scoped

Astro 组件的 `<style>` 默认是**局部作用域**的，会给选择器加 `data-astro-cid` 前缀。Twikoo 是运行时动态渲染的 DOM，**没有这个属性，scoped 样式根本不会生效**！症状就是：样式写了但没效果。解决：`<style is:global>`。

### 坑 B：overlay 与输入框的像素级对齐

一开始 overlay 的文字位置偏了，出现重影。原因是硬编码的 padding/font 和 textarea 的实际计算样式有细微差异。最终方案：**运行时用 `getComputedStyle(textarea)` 精确复制** font、padding、line-height 等所有相关样式到 overlay，再用 `transform: translate(borderLeft, borderTop)` 补偿边框偏移，文字就和输入框严丝合缝了。

## 小记

今天最大的感受是：**「验证」贯穿了整个流程**。迁移文章后跑 `astro check`、部署评论后本地实测连接串、改完样式反复确认渲染结果——每一步的「是不是真的成了」都靠验证，而不是靠感觉。

另外，无服务器平台的坑往往不在代码，而在**网络配置**（白名单、出口 IP、环境变量生效时机）。这类问题本地复现不了，只能靠错误信息逐层排查——502 超时、code 1000 格式错误、30 秒 Task timeout，每一个报错都是线索。

旧站终于搬空了，新站也热闹起来了。愿以后的折腾都像今天一样，坑虽多，但都能爬出来。
