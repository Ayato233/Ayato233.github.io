<script lang="ts">
/**
 * 动态卡片（分子）：单条动态的展示单元。
 * <article> 语义（非整卡链接）；头像/作者名链到作者页；
 * 正文为构建期渲染的 HTML（复用全局 .custom-md 排版）；
 * 图片交给 MomentGallery（网格 + 内联查看器两段式，灯箱走 Fancybox）。
 */
import Avatar from "@components/atoms/display/Avatar.svelte";
import Icon from "@components/atoms/display/Icon.svelte";
import MomentGallery from "@components/molecules/MomentGallery.svelte";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import type { MomentItem } from "@utils/content-utils";
import { formatDateToYYYYMMDDHHmm } from "@utils/date-utils";
import { reveal } from "@utils/motion";

export type MomentAuthor = {
	name: string;
	avatar: string;
	avatarSrcset?: string;
	avatarWidth?: number;
	avatarHeight?: number;
	url: string;
};

let {
	moment,
	author,
	/** stagger 入场延迟 ms（由列表传入：第 i 项 i × step） */
	delay = 0,
	class: className = "",
}: {
	moment: MomentItem;
	author: MomentAuthor;
	delay?: number;
	class?: string;
} = $props();

const publishedAt = $derived(new Date(moment.published));
const timeText = $derived(formatDateToYYYYMMDDHHmm(publishedAt));

/** 正文 markdown 图折叠：最多展示 MAX_IMG 张，其余隐藏并追加「+N」按钮展开。
 *  只在动态卡片的正文（__content）内生效，不动画廊组件与全局样式。
 *  零依赖、幂等（重复调用检查 data-inited）。
 */
const MAX_IMG = 4;
type FoldableElement = HTMLElement;
let foldImages: (el: FoldableElement) => void | { destroy?: () => void };

foldImages = (el) => {
	foldMutableImages(el);
	return {
		destroy: () => {
			el.querySelectorAll<HTMLElement>(".moment-fold-overlay").forEach((n) => n.remove());
			el.querySelectorAll<HTMLElement>("img[data-folded]").forEach((n) => {
				n.removeAttribute("data-folded");
				n.style.display = "";
			});
			el.removeAttribute("data-fold-inited");
		},
	};
};

function foldMutableImages(el: HTMLElement) {
	if (el.dataset.foldInited === "1") return;
	el.dataset.foldInited = "1";
	const content = el.querySelector<HTMLElement>(".moment-card__content");
	if (!content) return;
	const imgs = Array.from(content.querySelectorAll<HTMLImageElement>("img"));
	if (imgs.length <= MAX_IMG) return;
	const hidden = imgs.slice(MAX_IMG);
	hidden.forEach((img) => {
		img.dataset.folded = "1";
		img.style.display = "none";
	});
	const overlay = document.createElement("button");
	overlay.type = "button";
	overlay.className = "moment-fold-overlay";
	overlay.textContent = `+${hidden.length}`;
	overlay.setAttribute("aria-label", `显示全部 ${imgs.length} 张图片`);
	overlay.addEventListener("click", () => {
		hidden.forEach((img) => {
			delete img.dataset.folded;
			img.style.display = "";
		});
		overlay.remove();
		el.removeAttribute("data-fold-inited");
	});
	// 挂在第 MAX_IMG 张图之后
	const lastVisible = imgs[MAX_IMG - 1];
	lastVisible.nextSibling ? lastVisible.parentNode?.insertBefore(overlay, lastVisible.nextSibling) : lastVisible.parentNode?.appendChild(overlay);
}
</script>

<article class="moment-card {className}" id="moment-{moment.id}" use:reveal={{ delay }} use:foldImages>
	<header class="moment-card__header">
		<a class="moment-card__author" href={author.url}>
			<!-- 作者名紧邻头像可读，头像按装饰图处理（避免与 aria-label 冗余） -->
			<Avatar
				src={author.avatar}
				srcset={author.avatarSrcset}
				sizes="40px"
				width={author.avatarWidth}
				height={author.avatarHeight}
				alt=""
				size={40}
				shape="circle"
			/>
			<span class="moment-card__name">{author.name}</span>
		</a>

		<div class="moment-card__badges">
			{#if moment.mood}
				<span class="moment-card__badge" aria-hidden="true">
					<Icon icon={moment.mood} />
				</span>
			{/if}
			{#if moment.pinned}
				<span class="moment-card__badge moment-card__badge--pinned">
					<Icon icon="material-symbols:keep-rounded" aria-hidden="true" />
					{i18n(I18nKey.pinned)}
				</span>
			{/if}
		</div>

		<time class="moment-card__time" datetime={moment.published}>{timeText}</time>
	</header>

	{#if moment.html.trim()}
		<div class="moment-card__content custom-md">
			<!-- 正文为构建期渲染产物（站点 markdown 插件链），非用户输入 -->
			{@html moment.html}
		</div>
	{/if}

	{#if moment.images.length > 0}
		<MomentGallery images={moment.images} />
	{/if}

	{#if moment.location || moment.tags.length > 0}
		<footer class="moment-card__footer">
			{#if moment.location}
				<span class="moment-card__location">
					<Icon icon="material-symbols:location-on-outline-rounded" aria-hidden="true" />
					{moment.location}
				</span>
			{/if}
			{#if moment.tags.length > 0}
				<div class="moment-card__tags">
					{#each moment.tags as tag (tag)}
						<span class="moment-card__tag">#{tag}</span>
					{/each}
				</div>
			{/if}
		</footer>
	{/if}
</article>

<style lang="stylus">
@import "../../styles/breakpoints.styl"

.moment-card
	display: flex
	flex-direction: column
	box-sizing: border-box
	width: 100%
	padding: 1rem 1.25rem
	border-radius: var(--shape-corner-l)
	background: var(--card-bg)

	-webkit-backdrop-filter: var(--card-blur)

	backdrop-filter: var(--card-blur)
	border: 1px solid var(--outline-variant)
	box-shadow: var(--m3e-elevation-1)
	color: var(--on-surface)
	transition: box-shadow var(--m3e-duration-medium) var(--m3e-easing-emphasized-decelerate), border-color var(--m3e-duration-medium) var(--m3e-easing-standard)

	&:hover
		box-shadow: var(--m3e-elevation-2)
		border-color: var(--outline)

	&__header
		display: flex
		align-items: center
		gap: 0.75rem

	&__author
		display: inline-flex
		align-items: center
		gap: 0.625rem
		min-width: 0
		text-decoration: none
		border-radius: var(--shape-corner-full)
		&:focus-visible
			outline: 2px solid var(--primary)
			outline-offset: 2px

	&__name
		overflow: hidden
		text-overflow: ellipsis
		white-space: nowrap
		color: var(--on-surface)
		font: var(--m3e-type-title-small)
		font-weight: 600

	&__badges
		display: inline-flex
		align-items: center
		gap: 0.375rem
		flex-shrink: 0

	&__badge
		display: inline-flex
		align-items: center
		gap: 0.25rem
		padding: 0.1875rem 0.5rem
		border-radius: var(--shape-corner-full)
		background: var(--surface-container-high)
		color: var(--on-surface-variant)
		font: var(--m3e-type-label-small)
		> :global(svg)
			width: 1rem
			height: 1rem

		&--pinned
			background: var(--primary-container)
			color: var(--on-primary-container)

	&__time
		margin-left: auto
		flex-shrink: 0
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-small)

	&__content
		margin-top: 0.75rem
		color: var(--on-surface)
		font: var(--m3e-type-body-medium)
		line-height: 1.75
		overflow-wrap: break-word
		:global(p:first-child)
			margin-top: 0
		:global(p:last-child)
			margin-bottom: 0
		/* 正文 markdown 图片统一限高：避免多图大图撑爆卡片阅读体验 */
		:global(img)
			display: block
			max-width: 100%
			max-height: 20rem
			width: auto
			height: auto
			margin: 0.75rem auto
			border-radius: var(--shape-corner-m)
			object-fit: contain
		/* 同一 p 内连续图片 → 横向排布：4 张一排、方形缩略图，
		   超出视口宽度自动换行；单图/少量图不受影响 */
		:global(p > img + img)
			display: inline-grid
		:global(p:has(> img + img))
			display: grid
			grid-template-columns: repeat(4, minmax(0, 1fr))
			gap: 0.5rem
			place-items: stretch
		:global(p:has(> img + img) > img)
			display: block
			width: 100%
			max-width: 100%
			max-height: 100%
			height: auto
			aspect-ratio: 1 / 1
			margin: 0
			object-fit: cover

	&__footer
		display: flex
		align-items: center
		justify-content: space-between
		gap: 0.75rem
		flex-wrap: wrap
		margin-top: 0.875rem

	:global(.moment-fold-overlay)
		grid-column: 1 / -1
		display: grid
		place-items: center
		width: 100%
		min-height: 3.5rem
		margin: 0.5rem 0 0
		padding: 0.5rem
		border: 1px dashed var(--outline-variant)
		border-radius: var(--shape-corner-m)
		background: unquote("color-mix(in oklab, var(--surface-container-high) 50%, transparent)")
		color: var(--primary)
		font: var(--m3e-type-title-medium)
		font-weight: 600
		cursor: pointer
		transition: background-color var(--m3e-duration-short) var(--m3e-easing-standard), color var(--m3e-duration-short) var(--m3e-easing-standard)
		&:hover
			background: unquote("color-mix(in oklab, var(--primary-container) 60%, transparent)")
			color: var(--on-primary-container)
		&:focus-visible
			outline: 2px solid var(--primary)
			outline-offset: 2px

	&__location
		display: inline-flex
		align-items: center
		gap: 0.25rem
		color: var(--on-surface-variant)
		font: var(--m3e-type-label-small)
		> :global(svg)
			width: 1rem
			height: 1rem

	&__tags
		display: flex
		flex-wrap: wrap
		gap: 0.375rem

	&__tag
		color: var(--on-surface-variant)
		font: var(--m3e-type-label-small)

	@media (max-width: bp-sm - 1px)
		padding: 0.875rem 1rem
</style>
