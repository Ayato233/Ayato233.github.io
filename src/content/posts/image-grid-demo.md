---
title: "图片画廊网格：语法与完整示例"
published: 2026-07-13
description: "图片画廊网格语法、参数、裁剪、响应式行为、说明文字和灯箱导航的完整指南。"
tags: [Markdown, Gallery, Image Grid, Demo]
category: "Examples"
draft: false
---

`:::grid` 是博客的图片画廊容器指令。它将普通的 Markdown 图片排列成响应式网格，并保持一致的宽高比，自动启用灯箱查看。可用于文章配图、截图、作品集或小型相册。

同一画廊中的图片使用相同的卡片比例。默认情况下，居中裁剪会填满每张卡片并保持每一行整齐；点击图片可在灯箱中打开完整的原始图片。每个画廊都有独立的灯箱分组，不会与文章中的其他图片混合。

> 本文既是功能文档，也是可视化测试页面。请在桌面、平板和移动宽度下查看示例，然后点击任意图片以验证灯箱分组。

## 最简语法

直接在 `:::grid` 和结束的 `:::` 之间编写 Markdown 图片：

````markdown
:::grid
![Image description](./image-1.webp)

![Image description](./image-2.webp)
:::
````

每张图片必须独占一个段落，图片之间用空行分隔。画廊中只放图片；段落、列表和代码块请写在容器外面。

以下是最简语法的结果。未指定参数时，网格默认使用三列、`16/10` 比例和 `cover` 模式。

:::grid
![Minimal syntax result: first image](/images/demos/image-grid-demo/landscape-1.webp)

![Minimal syntax result: second image](/images/demos/image-grid-demo/landscape-2.webp)
:::

## 参数速览

在起始指令后用花括号编写所有参数：`:::grid{parameter="value"}`。

| 参数 | 允许值 | 默认值 | 用途 |
| --- | --- | --- | --- |
| `columns` | `1` 到 `6` 的整数 | `3` | 桌面上每行的列数。无效值回退到 `3`。 |
| `aspect` | 正比例，如 `16/9`、`3/4` 或 `1/1` | `16/10` | 显示的卡片比例，而非原始图片比例。 |
| `fit` | `cover`、`contain` | `cover` | 图片适配模式。`cover` 裁剪以填满；`contain` 保留完整图片，可能留出空白。 |

完整示例：

````markdown
:::grid{columns="3" aspect="16/9" fit="cover"}
![First image](./image-1.webp "Optional caption")

![Second image](./image-2.webp "Optional caption")

![Third image](./image-3.webp "Optional caption")
:::
````

以下结果使用了上述三列横版语法。对比卡片比例、列数，以及标题优先于替代文本作为说明文字的方式：

:::grid{columns="3" aspect="16/9" fit="cover"}
![Parameter example: first landscape image](/images/demos/image-grid-demo/landscape-1.webp "Landscape caption 1")

![Parameter example: second landscape image](/images/demos/image-grid-demo/landscape-2.webp "Landscape caption 2")

![Parameter example: third landscape image](/images/demos/image-grid-demo/landscape-3.webp "Landscape caption 3")
:::

## 说明文字与替代文本

图片的替代文本既作为无障碍替代文字，也作为默认说明文字。当图片有可选标题时，标题会作为说明文字显示：

```markdown
![Text used for accessibility](./image.webp "Caption shown below the image")
```

同一行中，说明文字与每张卡片的底部对齐。换行的说明文字不会导致其他说明文字停留在不同的高度。`3:4` 和 `16:9` 这样的比例文本可以直接写在正文、标题和替代文本中，无需转义。

此示例演示了默认的替代文本说明、显式标题说明，以及较长说明的底部对齐：

:::grid{columns="3" aspect="1/1"}
![This image has no title, so its alt text is the caption](/images/demos/image-grid-demo/square-1.webp)

![Second square image with accessible alt text](/images/demos/image-grid-demo/square-2.webp "This title is displayed as the caption")

![Accessible description of a 3:4 poster](/images/demos/image-grid-demo/square-3.webp "This is a longer caption for checking that every caption remains aligned to the bottom of its card when it wraps")
:::

## 布局与裁剪

桌面布局使用 `columns` 指定的列数。低于 `768px` 时，网格最多使用两列；低于 `480px` 时切换为单列。卡片容器固定 `aspect` 比例并裁剪圆角，而图片填满卡片，不带有主题默认的图片边距。

- 选择 `cover`：推荐的默认模式。图片从中心裁剪以填满卡片，使画廊看起来更一致。
- 选择 `contain`：显示完整原始图片，不裁剪。当其比例与卡片不同时，主题背景仍可见；用于不能裁剪的图片。
- 要在不留空白的情况下保留完整图片，可将 `aspect` 设为接近原始图片比例，或将图片放入独立网格。

以下示例将相同的竖向图片放入 `16/9` 卡片中，分别使用 `cover` 和 `contain`。第一种会裁剪；第二种保留完整图片并留下背景空白。

````markdown
:::grid{columns="3" aspect="16/9" fit="cover"}
![Image description](./image-1.webp "Optional caption")

![Image description](./image-2.webp "Optional caption")
:::

:::grid{columns="3" aspect="16/9" fit="contain"}
![Image description](./image-1.webp "Optional caption")

![Image description](./image-2.webp "Optional caption")
:::
````

:::grid{columns="3" aspect="16/9" fit="cover"}
![First cover result](/images/demos/image-grid-demo/default-portrait-1.webp "Cover: center crop")

![Second cover result](/images/demos/image-grid-demo/default-portrait-2.webp "Cover: fill the card")

![Third cover result](/images/demos/image-grid-demo/default-portrait-3.webp "Cover: a more consistent layout")
:::

:::grid{columns="3" aspect="16/9" fit="contain"}
![First contain result](/images/demos/image-grid-demo/default-portrait-1.webp "Contain: preserve the complete original")

![Second contain result](/images/demos/image-grid-demo/default-portrait-2.webp "Contain: empty space may appear")

![Third contain result](/images/demos/image-grid-demo/default-portrait-3.webp "Contain: suitable for edge details")
:::

## 默认配置

不指定属性时，默认是三列、`16/10` 比例和 `cover` 裁剪。这三张竖向图片用于验证默认裁剪和说明文字。

````markdown
:::grid
![Image description](./image-1.webp)

![Image description](./image-2.webp)

![Image description](./image-3.webp)
:::
````

:::grid
![Default configuration: portrait image one](/images/demos/image-grid-demo/default-portrait-1.webp)

![Default configuration: portrait image two](/images/demos/image-grid-demo/default-portrait-2.webp)

![Default configuration: portrait image three](/images/demos/image-grid-demo/default-portrait-3.webp)
:::

## 三列竖向：3:4

使用 `aspect="3/4"` 时，三张竖向图片会填满比例一致的竖向卡片。如果原始图片比例不同，`cover` 会从中心裁剪其边缘。

````markdown
:::grid{columns="3" aspect="3/4"}
![Portrait image description](./portrait-1.webp)

![Portrait image description](./portrait-2.webp)

![Portrait image description](./portrait-3.webp)
:::
````

:::grid{columns="3" aspect="3/4"}
![3:4 test image one](/images/demos/image-grid-demo/default-portrait-1.webp "Portrait 1")

![3:4 test image two](/images/demos/image-grid-demo/default-portrait-2.webp "Portrait 2")

![3:4 test image three](/images/demos/image-grid-demo/default-portrait-3.webp "Portrait 3")
:::

## 三列横版：16:9

这组示例展示了三列布局中常见的视频封面比例。当横版图片接近卡片比例时，裁剪很少。

````markdown
:::grid{columns="3" aspect="16/9"}
![Landscape image description](./landscape-1.webp)

![Landscape image description](./landscape-2.webp)

![Landscape image description](./landscape-3.webp)
:::
````

:::grid{columns="3" aspect="16/9"}
![16:9 test image one](/images/demos/image-grid-demo/feature-landscape-1.webp)

![16:9 test image two](/images/demos/image-grid-demo/feature-landscape-2.webp)

![16:9 test image three](/images/demos/image-grid-demo/feature-landscape-3.webp)
:::

## 两列正方形：1:1

当需要更大的预览卡片时，两列效果很好。第三张图片会移到下一行。最后一行保持其网格轨道宽度，而不是拉伸图片填满整行。

````markdown
:::grid{columns="2" aspect="1/1"}
![Square image description](./square-1.webp)

![Square image description](./square-2.webp)

![Square image description](./square-3.webp)
:::
````

:::grid{columns="2" aspect="1/1"}
![1:1 test image one](/images/demos/image-grid-demo/mixed-square-1.webp)

![1:1 test image two](/images/demos/image-grid-demo/mixed-square-2.webp)

![1:1 test image three](/images/demos/image-grid-demo/mixed-square-3.webp)
:::

## 四列 `contain`

`fit="contain"` 不会裁剪原始图片。当图片比例与卡片比例不同时，主题背景仍可见。这是有意为之，并非布局问题。它同时验证了四列网格和独立灯箱分组互不干扰。

````markdown
:::grid{columns="4" aspect="16/9" fit="contain"}
![Image description](./image-1.webp)

![Image description](./image-2.webp)

![Image description](./image-3.webp)
:::
````

:::grid{columns="4" aspect="16/9" fit="contain"}
![Contain: portrait image one](/images/demos/image-grid-demo/default-portrait-1.webp)

![Contain: portrait image two](/images/demos/image-grid-demo/default-portrait-2.webp)

![Contain: portrait image three](/images/demos/image-grid-demo/default-portrait-3.webp)
:::

## 单列细节图

当图片需要更大的阅读尺寸时，单列很合适。它在桌面、平板和移动端都保持单列，原始图片仍可在灯箱中查看。

````markdown
:::grid{columns="1" aspect="16/9"}
![Image description](./detail.webp)
:::
````

:::grid{columns="1" aspect="16/9"}
![Single-column test image](/images/demos/image-grid-demo/feature-landscape-1.webp)
:::

## 稀疏五列行

五列用于验证更高的支持列数。只有三张图片时，最后一行保持左对齐，而不是拉伸图片。

````markdown
:::grid{columns="5" aspect="1/1"}
![Thumbnail description](./thumb-1.webp)

![Thumbnail description](./thumb-2.webp)

![Thumbnail description](./thumb-3.webp)
:::
````

:::grid{columns="5" aspect="1/1"}
![Five-column test image one](/images/demos/image-grid-demo/mixed-square-1.webp)

![Five-column test image two](/images/demos/image-grid-demo/mixed-square-2.webp)

![Five-column test image three](/images/demos/image-grid-demo/mixed-square-3.webp)
:::

## 六列混合图片

六列是当前的最大值。混合横版和竖向图片可验证 `cover` 裁剪、窄卡片上的说明文字，以及密集的桌面布局。对于可读的文章内容，通常两到四列更合适。

````markdown
:::grid{columns="6" aspect="1/1"}
![Image description](./image-1.webp)

![Image description](./image-2.webp)

![Image description](./image-3.webp)

![Image description](./image-4.webp)

![Image description](./image-5.webp)

![Image description](./image-6.webp)
:::
````

:::grid{columns="6" aspect="1/1"}
![Six-column test image one](/images/demos/image-grid-demo/default-portrait-1.webp)

![Six-column test image two](/images/demos/image-grid-demo/default-portrait-2.webp)

![Six-column test image three](/images/demos/image-grid-demo/default-portrait-3.webp)

![Six-column test image four](/images/demos/image-grid-demo/feature-landscape-1.webp)

![Six-column test image five](/images/demos/image-grid-demo/feature-landscape-2.webp)

![Six-column test image six](/images/demos/image-grid-demo/feature-landscape-3.webp)
:::

## 四列正方形：1:1

四张比例相同的方形图片是典型的四列布局。桌面端四张图片排成一行；平板端折叠为两列，移动端为单列。

````markdown
:::grid{columns="4" aspect="1/1"}
![Square image description](./square-1.webp)

![Square image description](./square-2.webp)

![Square image description](./square-3.webp)

![Square image description](./square-4.webp)
:::
````

:::grid{columns="4" aspect="1/1"}
![Square image one](/images/demos/image-grid-demo/square-1.webp)

![Square image two](/images/demos/image-grid-demo/square-2.webp)

![Square image three](/images/demos/image-grid-demo/square-3.webp)

![Square image four](/images/demos/image-grid-demo/square-4.webp)
:::

## 六列横版：16:9

六列横版适合缩略图预览、作品集和截图索引。即使原始比例略有差异，`cover` 也会一致地填满每张 `16/9` 卡片。

````markdown
:::grid{columns="6" aspect="16/9"}
![Landscape image description](./landscape-1.webp)

![Landscape image description](./landscape-2.webp)

![Landscape image description](./landscape-3.webp)

![Landscape image description](./landscape-4.webp)

![Landscape image description](./landscape-5.webp)

![Landscape image description](./landscape-6.webp)
:::
````

:::grid{columns="6" aspect="16/9"}
![Landscape image one](/images/demos/image-grid-demo/landscape-1.webp)

![Landscape image two](/images/demos/image-grid-demo/landscape-2.webp)

![Landscape image three](/images/demos/image-grid-demo/landscape-3.webp)

![Landscape image four](/images/demos/image-grid-demo/landscape-4.webp)

![Landscape image five](/images/demos/image-grid-demo/landscape-5.webp)

![Landscape image six](/images/demos/image-grid-demo/landscape-6.webp)
:::

## 三列竖向：3:4

这组六张竖向图片展示了人物、海报或手机截图的常见布局。图片排列为两行三列，说明文字底部对齐。

````markdown
:::grid{columns="3" aspect="3/4"}
![Portrait image description](./portrait-1.webp)

![Portrait image description](./portrait-2.webp)

![Portrait image description](./portrait-3.webp)

![Portrait image description](./portrait-4.webp)

![Portrait image description](./portrait-5.webp)

![Portrait image description](./portrait-6.webp)
:::
````

:::grid{columns="3" aspect="3/4"}
![Portrait image one](/images/demos/image-grid-demo/portrait-1.webp)

![Portrait image two](/images/demos/image-grid-demo/portrait-2.webp)

![Portrait image three](/images/demos/image-grid-demo/portrait-3.webp)

![Portrait image four](/images/demos/image-grid-demo/portrait-4.webp)

![Portrait image five](/images/demos/image-grid-demo/portrait-5.webp)

![Portrait image six](/images/demos/image-grid-demo/portrait-6.webp)
:::

## 边缘关键内容：`cover` 与灯箱

这些图片在边缘附近包含重要文字或细节。`cover` 保持网格整齐，但可能会裁剪这些边缘；点击图片可在灯箱中查看未裁剪的原始图。对边缘敏感的图片请使用清晰的说明文字，或使用下方的 `contain`。

````markdown
:::grid{columns="3" aspect="16/9" fit="cover"}
![Edge-critical content](./critical-1.webp "Open the lightbox to view the complete edge content")

![Edge-critical content](./critical-2.webp "Open the lightbox to view the complete edge content")

![Edge-critical content](./critical-3.webp "Open the lightbox to view the complete edge content")
:::
````

:::grid{columns="3" aspect="16/9" fit="cover"}
![First edge-critical image](/images/demos/image-grid-demo/critical-1.webp "Open the lightbox to view the complete edge content")

![Second edge-critical image](/images/demos/image-grid-demo/critical-2.webp "Open the lightbox to view the complete edge content")

![Third edge-critical image](/images/demos/image-grid-demo/critical-3.webp "Open the lightbox to view the complete edge content")
:::

## 极端比例 `contain`

对于横幅、长截图和其他极端图片比例，`contain` 会显示完整原始图片。与 `cover` 不同，它可能会留下主题背景空白，但绝不会裁剪内容。

````markdown
:::grid{columns="3" aspect="16/9" fit="contain"}
![Complete screenshot description](./wide-1.webp)

![Complete screenshot description](./wide-2.webp)

![Complete screenshot description](./wide-3.webp)
:::
````

:::grid{columns="3" aspect="16/9" fit="contain"}
![Extreme-ratio image one](/images/demos/image-grid-demo/extreme-1.webp)

![Extreme-ratio image two](/images/demos/image-grid-demo/extreme-2.webp)

![Extreme-ratio image three](/images/demos/image-grid-demo/extreme-3.webp)
:::

## 透明图片

透明图片会露出卡片的主题背景。这个单列 `contain` 示例便于检查透明区域、原始边缘和灯箱行为。

````markdown
:::grid{columns="1" aspect="16/9" fit="contain"}
![Transparent image description](./transparent.webp)
:::
````

:::grid{columns="1" aspect="16/9" fit="contain"}
![Transparent-background test image](/images/demos/image-grid-demo/transparent-1.webp)
:::

## 灯箱导航

点击网格中的任意图片即可打开 Fancybox 灯箱。在那里你可以缩放、旋转、进入全屏、查看缩略图，并使用方向键导航。导航仅限于当前的 `:::grid` 容器：例如，点击"16:9 test image one"只会打开该部分的另外两张横版图片。

同一篇文章中的普通 Markdown 图片会继续单独处理，不会加入任何网格画廊。

## 检查清单

1. 每个网格中的图片尺寸一致，说明文字位于卡片下方。
2. 图片悬停时轻微缩放；点击后可缩放、旋转，并可用键盘导航。
3. 点击"16:9 test image one"时，灯箱只会浏览该部分的另外两张横版图片。
4. 低于 `768px` 时，网格最多使用两列；低于 `480px` 时使用单列。
5. "四列 `contain`"中的竖向图片完整可见，带空白且不裁剪。
6. 五列和六列网格在宽屏上保持指定的列数，然后根据响应式规则折叠为两列或单列。
