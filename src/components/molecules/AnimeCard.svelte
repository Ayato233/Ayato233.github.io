<script lang="ts">
/**
 * 番剧卡片（分子）：2:3 封面 + 状态 tonal pill + 评分 + 追番进度。
 * - cover 省略时显示主题色渐变占位（tv 水印），补图前不破版；
 * - link 存在时整张封面可点（外链），悬停显示播放层；否则封面为纯展示块；
 * - watching 状态渲染 ProgressIndicator（linear determinate）+ watched/total 文本；
 * - 状态语义色经 inline --anime-status-color 注入（ANIME_STATUS_META 的 M3E 角色映射），
 *   避免动态 class 触发 Svelte unused-CSS 剥离（见 rules/pitfalls.md 1.6）。
 */

import ProgressIndicator from "@components/atoms/feedback/ProgressIndicator.svelte";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { ANIME_STATUS_META } from "@utils/anime/status";
import { reveal } from "@utils/motion";
import type { AnimeItem } from "../../data/anime";

let {
	anime,
	/** stagger 入场延迟 ms（由列表传入：第 i 项 i × step） */
	delay = 0,
}: { anime: AnimeItem; delay?: number } = $props();

const statusMeta = $derived(ANIME_STATUS_META[anime.status]);
const isWatching = $derived(anime.status === "watching");
const progressRatio = $derived(
	anime.progress.total > 0
		? Math.min(anime.progress.watched / anime.progress.total, 1)
		: 0,
);
const metaLine = $derived(
	[anime.year, anime.studio].filter(Boolean).join(" · "),
);
</script>

<article
	class="anime-card"
	data-status={anime.status}
	style={`--anime-status-color: ${statusMeta.color};`}
	use:reveal={{ delay }}
>
	<!-- 封面内部内容（img/占位 + 播放层 + 评分）：link/非 link 两分支共享，避免重复维护 -->
	{#snippet coverContent()}
		{#if anime.cover}
			<img class="anime-card__cover-img" src={anime.cover} alt={anime.title} loading="lazy" />
		{:else}
			<span class="anime-card__placeholder" aria-hidden="true">
				<Icon icon="material-symbols:live-tv-outline-rounded" />
			</span>
		{/if}
		<span class="anime-card__scrim" aria-hidden="true"></span>
		{#if anime.link}
			<!-- 可点封面：悬停深色 scrim + 播放钮 -->
			<span class="anime-card__play" aria-hidden="true">
				<Icon icon="material-symbols:play-arrow-rounded" />
			</span>
		{/if}
		{#if anime.description || metaLine || isWatching}
			<!-- 悬浮简介层：常态隐藏，hover（触屏恒显）淡入展示简介与元信息 -->
			<div class="anime-card__overlay" aria-hidden="true">
				{#if anime.description}
					<p class="anime-card__overlay-desc">{anime.description}</p>
				{/if}
				<div class="anime-card__overlay-meta">
					{#if isWatching}
						<span class="anime-card__overlay-progress">
							<Icon icon="material-symbols:play-arrow-rounded" />
							{anime.progress.watched}/{anime.progress.total}
						</span>
					{/if}
					<span class="anime-card__overlay-rating">
						<Icon icon="material-symbols:star-rounded" />
						{anime.rating}
					</span>
					{#if metaLine}<span>{metaLine}</span>{/if}
				</div>
			</div>
		{/if}
	{/snippet}

	{#if anime.link}
		<a
			class="anime-card__cover"
			href={anime.link}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={anime.title}
		>
			{@render coverContent()}
		</a>
	{:else}
		<div class="anime-card__cover">
			{@render coverContent()}
		</div>
	{/if}

	<div class="anime-card__body">
		<span class="anime-card__title" title={anime.title}>{anime.title}</span>
	</div>
</article>

<style lang="stylus">
.anime-card
	position: relative
	display: flex
	flex-direction: column
	box-sizing: border-box
	overflow: hidden
	border-radius: var(--shape-corner-l)
	background: var(--card-bg)

	/* 毛玻璃：Chromium 对 backdrop-filter 的 var() 引用不生效（实测），
	 * 此处按 variables 的 --card-blur 默认值固化；触屏降级见文件尾部 */
	-webkit-backdrop-filter: blur(16px)

	backdrop-filter: blur(16px)
	/* 拟态玻璃：极淡浅边（非黑，保边界独立）+ 顶部微反光 + 柔和悬浮阴影（hover 浮起）；
	 * 现代 rgb() 空格语法需整体 unquote，避免 Stylus 旧除法解析 */
	border: 1px solid unquote("color-mix(in oklab, var(--on-surface) 8%, transparent)")
	box-shadow: unquote("inset 0 1px 0 rgb(255 255 255 / 0.08)"), var(--card-shadow), unquote("0 4px 16px rgb(0 0 0 / 0.1)")
	transition:
		box-shadow 0.45s var(--m3e-easing-emphasized-decelerate),
		transform 0.45s var(--m3e-easing-emphasized-decelerate),
		border-color 0.45s var(--m3e-easing-standard)
	&:hover
		border-color: unquote("color-mix(in oklab, var(--on-surface) 15%, transparent)")
		box-shadow: unquote("inset 0 1px 0 rgb(255 255 255 / 0.12), var(--m3e-elevation-2)")
		transform: translateY(-3px)

	/* 2:3 海报封面：渐变占位同时充当图片加载背景 */
	&__cover
		position: relative
		display: block
		aspect-ratio: 2 / 3
		overflow: hidden
		background: linear-gradient(160deg,
			unquote("color-mix(in oklab, var(--primary) 16%, var(--surface-container-low))"),
			var(--surface-container-high))
		text-decoration: none

	&__cover-img
		display: block
		width: 100%
		height: 100%
		object-fit: cover
		transition: transform 0.8s var(--m3e-easing-emphasized-decelerate)
		.anime-card:hover &
			transform: scale(1.05)

	/* 封面顶部/底部渐变暗影（确保评分徽标可读性） */
	&__scrim
		position: absolute
		inset: 0
		pointer-events: none
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.45) 0%, transparent 40%, rgba(0, 0, 0, 0.25) 100%)
		opacity: 0.6
		transition: opacity 0.5s var(--m3e-easing-standard)
		.anime-card:hover &
			opacity: 0.62

	/* 悬停播放钮：保留居中圆形播放钮，但不盖全屏黑罩（封面画面保持透亮） */
	&__play
		position: absolute
		inset: 0
		display: flex
		align-items: center
		justify-content: center
		background: transparent
		opacity: 0
		transition:
			opacity 0.45s var(--m3e-easing-emphasized-decelerate),
			transform 0.45s var(--m3e-easing-emphasized-decelerate)
		transform: scale(0.9)
		> :global(svg)
			width: 2.75rem
			height: 2.75rem
			color: #fff
			filter: drop-shadow(0 0.125rem 0.375rem rgba(0, 0, 0, 0.5))
		.anime-card:hover &
			opacity: 1
			transform: scale(1)

	/* 占位水印：主题色淡渐变 + tv 图标（无封面时） */
	&__placeholder
		position: absolute
		inset: 0
		display: flex
		align-items: center
		justify-content: center
		color: unquote("color-mix(in oklab, var(--on-surface-variant) 40%, transparent)")
		> :global(svg)
			width: 2.5rem
			height: 2.5rem

	/* 悬浮简介层：hover（触屏恒显）在封面底部淡入简介 + 评分/进度/年份 */
	&__overlay
		position: absolute
		inset: 0
		z-index: 2
		display: flex
		flex-direction: column
		justify-content: flex-end
		gap: 0.5rem
		padding: 0.75rem
		background: linear-gradient(
			180deg,
			transparent 0%,
			transparent 50%,
			rgba(0, 0, 0, 0.55) 78%,
			rgba(0, 0, 0, 0.88) 100%
		)
		opacity: 0
		transition: opacity 0.45s var(--m3e-easing-standard)
		.anime-card:hover &
			opacity: 1

	&__overlay-desc
		margin: 0
		color: #fff
		font: var(--m3e-type-body-small)
		line-height: 1.5
		display: -webkit-box
		-webkit-line-clamp: 4
		-webkit-box-orient: vertical
		overflow: hidden

	&__overlay-meta
		display: flex
		flex-wrap: wrap
		align-items: center
		gap: 0.375rem 0.625rem
		color: rgba(255, 255, 255, 0.9)
		font: var(--m3e-type-label-small)
		font-weight: 500
		font-variant-numeric: tabular-nums
		> span
			display: inline-flex
			align-items: center
			gap: 0.1875rem
			> :global(svg)
				width: 0.8125rem
				height: 0.8125rem
				color: #facc15

	/* 触屏（无 hover）：简介层常显，保证可读 */
	@media (hover: none) and (pointer: coarse)
		.anime-card__overlay
			opacity: 1

	&__body
		display: flex
		flex-direction: column
		flex: 1
		min-width: 0
		gap: 0.375rem
		padding: 0.75rem 0.875rem 0.875rem

	&__header-row
		display: flex
		align-items: center
		justify-content: space-between
		gap: 0.5rem

	/* 状态 tonal pill：语义色来自 inline --anime-status-color */
	&__status
		display: inline-flex
		align-items: center
		align-self: flex-start
		gap: 0.3125rem
		padding: 0.125rem 0.5rem
		border-radius: var(--shape-corner-full)
		background: unquote("color-mix(in oklab, var(--anime-status-color) 12%, transparent)")
		color: var(--anime-status-color)
		font: var(--m3e-type-label-small)
		font-weight: 600

	&__status-dot
		width: 0.375rem
		height: 0.375rem
		border-radius: var(--shape-corner-full)
		background: currentColor

	&__title
		margin: 0
		color: var(--on-surface)
		font: var(--m3e-type-title-small)
		font-weight: 600
		line-height: 1.3
		display: -webkit-box
		-webkit-line-clamp: 2
		-webkit-box-orient: vertical
		overflow: hidden
		transition: color var(--m3e-duration-short) var(--m3e-easing-standard)
		.anime-card:hover &
			color: var(--primary)

	&__desc
		margin: 0
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-small)
		line-height: 1.4
		display: -webkit-box
		-webkit-line-clamp: 2
		-webkit-box-orient: vertical
		overflow: hidden

	&__progress
		display: flex
		align-items: center
		gap: 0.5rem
		padding: 0.125rem 0

	&__progress-track
		flex: 1
		min-width: 0

	&__progress-text
		flex-shrink: 0
		color: var(--on-surface-variant)
		font: var(--m3e-type-label-small)
		font-weight: 600
		font-variant-numeric: tabular-nums

	/* 年份 · 制作：沉底，让无进度/无感想的卡片对齐 */
	&__meta
		margin: auto 0 0
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-small)
		white-space: nowrap
		overflow: hidden
		text-overflow: ellipsis

	&__genres
		display: flex
		flex-wrap: wrap
		gap: 0.25rem 0.375rem

	&__genre
		color: var(--on-surface-variant)
		font: var(--m3e-type-label-small)
		transition: color var(--m3e-duration-short) var(--m3e-easing-standard)
		&:hover
			color: var(--primary)

:global(html.motion-reduced) .anime-card,
:global(html.motion-reduced) .anime-card__cover-img,
:global(html.motion-reduced) .anime-card__play
	transition: none
	transform: none

@media (prefers-reduced-motion: reduce)
	.anime-card,
	.anime-card__cover-img,
	.anime-card__play
		transition: none
		transform: none

/* 触屏设备降低玻璃模糊（对齐 variables 的 --card-blur 降级策略） */
@media (hover: none) and (pointer: coarse)
	.anime-card
		-webkit-backdrop-filter: blur(6px)
		backdrop-filter: blur(6px)
</style>
