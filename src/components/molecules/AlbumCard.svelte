<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import type { AlbumIndexItem } from "@/types/album";

let { album }: { album: AlbumIndexItem } = $props();

// 日期转「2026.01」格式，失败时回退原值
function formatDate(value?: string): string {
	if (!value) return "";
	const m = value.match(/^\d{4}-\d{2}/);
	return m ? m[0].replace("-", ".") : value;
}

const formattedDate = formatDate(album.date);
</script>

<article class="album-card group" data-tags={album.tags?.join(",") || ""}>
	<!-- 堆叠相纸容器 -->
	<div class="album-stack" aria-hidden="false">
		<!-- 后层 1：hover 大幅右移并加旋转 -->
		<div class="sheet-back-sheet1" aria-hidden="true"></div>

		<!-- 后层 2：hover 反向左移（灰度图） -->
		<div class="sheet-back-sheet2" aria-hidden="true">
			{#if album.cover}
				<img
					src={album.cover}
					alt=""
					class="w-full h-full object-cover grayscale-[50%]"
					loading="lazy"
					decoding="async"
					referrerpolicy="no-referrer"
				/>
			{/if}
		</div>

		<!-- 前层主相纸 -->
		<a
			href={`/albums/${album.id}/`}
			class="sheet-main"
			aria-label={album.title}
		>
			{#if album.cover}
				<img
					src={album.cover}
					alt={album.title}
					class="album-cover-image"
					loading="lazy"
					decoding="async"
					referrerpolicy="no-referrer"
				/>
			{:else}
				<div class="album-cover-fallback">
					<Icon icon="material-symbols:image-outline-rounded" aria-hidden="true" />
				</div>
			{/if}

			{#if album.protected}
				<span class="album-protected" title={i18n(I18nKey.albumPasswordTitle)}>
					<Icon icon="material-symbols:lock-rounded" aria-hidden="true" />
					<span class="sr-only">{i18n(I18nKey.albumPasswordTitle)}</span>
				</span>
			{/if}

			<!-- hover 渐变遮罩 + 信息 -->
			<div class="album-hover-overlay">
				<span class="overlay-photo-count">{album.photoCount} {i18n(I18nKey.albumsPhotos)}</span>
				{#if !album.protected}
					<span class="overlay-open-label">{i18n(I18nKey.albumsOpen)}</span>
				{/if}
			</div>
		</a>
	</div>

	<!-- 标题 / 日期 / 描述 -->
	<div class="album-info">
		<div class="album-info__head">
			<h2 class="album-title">{album.title}</h2>
			{#if formattedDate}<span class="album-date">{formattedDate}</span>{/if}
		</div>
		{#if album.description}
			<p class="album-desc" title={album.description}>{album.description}</p>
		{/if}
		{#if album.tags.length > 0}
			<div class="album-card__tags" aria-label={i18n(I18nKey.tags)}>
				{#each album.tags.slice(0, 4) as tag}<span>#{tag}</span>{/each}
			</div>
		{/if}
	</div>
</article>

<style lang="stylus">
.album-card
	display: block
	position: relative
	min-width: 0
	text-align: center
	&:focus-visible
		outline: none
	&:has(.sheet-main:focus-visible)
		outline: 2px solid var(--primary)
		outline-offset: 0.25rem

	/* 堆叠容器：横版 4/3，为后层定位 */
	.album-stack
		position: relative
		width: 85%
		aspect-ratio: 4 / 3
		margin: 0 auto 1.75rem

	/* 三层相纸通用：白色厚边框（拍立得） */
	.sheet-back-sheet1,
	.sheet-back-sheet2,
	.sheet-main
		position: absolute
		inset: 0
		border-radius: 4px
		border: 6px solid #fff
		overflow: hidden

	/* 后层 1：静态轻微右移 + 旋转 */
	.sheet-back-sheet1
		background: #cbd5e1
		transform: rotate(6deg) translate(1rem, 0.5rem)
		opacity: 0.6
		transition: transform 0.5s ease, opacity 0.5s ease

	/* 后层 2：静态轻微左移 + 反向旋转 */
	.sheet-back-sheet2
		background: #e2e8f0
		transform: rotate(-3deg) translate(-0.5rem, -0.25rem)
		opacity: 0.8
		z-index: 10
		transition: transform 0.5s ease, opacity 0.5s ease
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2)
		> img
			display: block
			width: 100%
			height: 100%
			object-fit: cover

	/* 前层主相纸：hover 上移 + 缩放 */
	.sheet-main
		display: block
		background: #fff
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35)
		z-index: 20
		transform: translateY(0)
		transition: transform 0.5s ease, box-shadow 0.5s ease

	.album-cover-image
		display: block
		width: 100%
		height: 100%
		object-fit: cover
		transition: transform 0.7s ease

	.album-cover-fallback
		display: grid
		place-items: center
		width: 100%
		height: 100%
		color: var(--on-surface-variant)
		font-size: 2rem
		> svg
			width: 2rem
			height: 2rem

	.album-protected
		position: absolute
		top: 0.5rem
		right: 0.5rem
		z-index: 30
		display: inline-flex
		align-items: center
		padding: 0.25rem
		border-radius: var(--shape-corner-full)
		background: unquote("color-mix(in oklab, var(--scrim) 78%, transparent)")
		color: white
		backdrop-filter: blur(0.5rem)
		> svg
			width: 1.125rem
			height: 1.125rem

	/* hover 渐变遮罩 */
	.album-hover-overlay
		position: absolute
		inset: 0
		z-index: 25
		display: flex
		flex-direction: column
		justify-content: flex-end
		padding: 1.25rem
		background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2), transparent)
		opacity: 0
		transition: opacity 0.5s ease

	.overlay-photo-count,
	.overlay-open-label
		transform: translateY(0.5rem)
		transition: transform 0.5s ease

	.overlay-photo-count
		font-weight: 700
		font-size: 1.1rem
		color: #fff
		text-shadow: 0 4px 6px rgba(0, 0, 0, 0.5)

	.overlay-open-label
		margin-top: 0.25rem
		font-weight: 500
		font-size: 0.75rem
		color: var(--primary)
		text-shadow: 0 4px 6px rgba(0, 0, 0, 0.5)

	/* 标题 / 日期 / 描述 */
	.album-info
		width: 100%
		padding: 0 1rem

	.album-info__head
		display: flex
		align-items: center
		justify-content: center
		gap: 0.5rem
		flex-wrap: wrap

	.album-title
		margin: 0
		font-size: 1.25rem
		font-weight: 700
		line-height: 1.3
		color: var(--on-surface)
		transition: color 0.5s ease

	.album-date
		font-size: 0.625rem
		font-weight: 900
		letter-spacing: 0.05em
		text-transform: uppercase
		color: var(--on-surface-variant)
		background: unquote("color-mix(in oklab, var(--surface) 60%, transparent)")
		backdrop-filter: blur(4px)
		padding: 0.125rem 0.5rem
		border-radius: 2px

	.album-desc
		margin: 0.25rem 0 0
		font-size: 0.875rem
		line-height: 1.4
		color: var(--on-surface-variant)
		display: -webkit-box
		-webkit-line-clamp: 1
		-webkit-box-orient: vertical
		overflow: hidden

	.album-card__tags
		display: flex
		flex-wrap: wrap
		justify-content: center
		gap: 0.375rem
		margin-top: 0.625rem
		color: var(--primary)
		font: var(--m3e-type-label-medium)

/* ===== hover / focus 交互规则（独立顶层，确保编译输出） ===== */
.album-card:hover .sheet-back-sheet1,
.album-card:focus-within .sheet-back-sheet1
	transform: rotate(12deg) translate(2rem, 0.5rem)

.album-card:hover .sheet-back-sheet2,
.album-card:focus-within .sheet-back-sheet2
	transform: rotate(-6deg) translate(-1.5rem, -0.25rem)

.album-card:hover .sheet-main,
.album-card:focus-within .sheet-main
	transform: translateY(-0.5rem) scale(1.05)

.album-card:hover .album-cover-image,
.album-card:focus-within .album-cover-image
	transform: scale(1.05)

.album-card:hover .album-hover-overlay,
.album-card:focus-within .album-hover-overlay
	opacity: 1

.album-card:hover .overlay-photo-count,
.album-card:hover .overlay-open-label,
.album-card:focus-within .overlay-photo-count,
.album-card:focus-within .overlay-open-label
	transform: translateY(0)

.album-card:hover .album-title,
.album-card:focus-within .album-title
	color: var(--primary)

.album-card:hover .sheet-back-sheet1,
.album-card:hover .sheet-back-sheet2,
.album-card:hover .sheet-main,
.album-card:hover .album-cover-image,
.album-card:hover .album-hover-overlay,
.album-card:hover .overlay-photo-count,
.album-card:hover .overlay-open-label,
.album-card:hover .album-title
	transition: transform 0.5s ease, opacity 0.5s ease, box-shadow 0.5s ease, color 0.5s ease

/* 暗色模式适配相纸配色 */
html.dark .album-card .sheet-back-sheet1
	background: #334155

html.dark .album-card .sheet-back-sheet2
	background: #475569
	border-color: #e2e8f0

html.dark .album-card .sheet-main
	background: #e2e8f0
	border-color: #e2e8f0
	box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7)

@media (prefers-reduced-motion: reduce)
	.album-card .sheet-back-sheet1,
	.album-card .sheet-back-sheet2,
	.album-card .sheet-main,
	.album-card .album-cover-image,
	.album-card .album-hover-overlay,
	.album-card .overlay-photo-count,
	.album-card .overlay-open-label,
	.album-card .album-title
		transition: none
</style>