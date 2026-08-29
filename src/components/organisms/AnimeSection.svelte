<script lang="ts">
/**
 * 番剧页主体（有机体）：页头 + 实时搜索 + 双布局（grid/list）。
 * 数据由页面层经 utils/anime-data.getAnimeList() 构建期取得后以 props 传入；
 * 搜索词同步 URL（?q=）。
 *
 * 状态分区：按状态对全量数据分组（看状态分类陈列，每区独立分页「加载更多」），
 * 因此首屏即可露出全部状态分区标题与计数，不会被全局分页截断。
 *
 * 布局形态：番剧页独立偏好（localStorage `shirone:anime-layout-mode`，默认 grid 海报网格），
 * 不与博客文章列表偏好耦合；工具栏提供快速切换按钮，切类后逐卡 FLIP 平移。
 */
import Button from "@components/atoms/action/Button.svelte";
import Card from "@components/atoms/display/Card.svelte";
import TextField from "@components/atoms/input/TextField.svelte";
import AnimeCard from "@components/molecules/AnimeCard.svelte";
import PageHeader from "@components/molecules/PageHeader.svelte";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { ANIME_STATUS_META } from "@utils/anime/status";
import { flipFromRect } from "@utils/motion";
import { onMount } from "svelte";
import type { AnimeItem, AnimeStatus } from "../../data/anime";

export type AnimeLayoutMode = "grid" | "list";

let { animes = [] as AnimeItem[] }: { animes?: AnimeItem[] } = $props();

const ANIME_PAGE_SIZE = 12;
const ANIME_LAYOUT_KEY = "shirone:anime-layout-mode";

let query = $state("");
let initialized = false;
/** 每个状态分区已展示条数（分区独立"加载更多"，避免首屏只剩单一分区） */
let groupShown = $state<Partial<Record<AnimeStatus, number>>>({});
/** 当前激活的状态 Tab（默认第一个有内容的；URL ?tab= 可直达） */
let selectedTab = $state<AnimeStatus>("");

/** 布局形态：番剧页专属独立偏好，默认海报网格 (grid) */
let listMode = $state<AnimeLayoutMode>("grid");
let listEl = $state<HTMLElement | null>(null);

const LIST_MODE_CLASS: Record<AnimeLayoutMode, string> = {
	grid: "anime-list--grid",
	list: "anime-list--list",
};

/** 状态分区顺序：正在看 → 已看完 → 想看 → 搁置 → 弃番（有内容的区才渲染） */
const STATUS_ORDER: AnimeItem["status"][] = [
	"watching",
	"completed",
	"planned",
	"onHold",
	"dropped",
];

const filtered = $derived.by(() => {
	const normalizedQuery = query.trim().toLowerCase();
	return animes.filter((anime) => {
		if (!normalizedQuery) return true;
		return [
			anime.title,
			anime.description ?? "",
			anime.studio ?? "",
			anime.year,
			...anime.genres,
		].some((val) => val.toLowerCase().includes(normalizedQuery));
	});
});

/** 状态分区：对全量过滤后数据按 STATUS_ORDER 分红，每区独立分页展示首段 */
const statusGroups = $derived(
	STATUS_ORDER.flatMap((status) => {
		const all = filtered.filter((anime) => anime.status === status);
		if (all.length === 0) return [];
		const shown = Math.min(groupShown[status] ?? ANIME_PAGE_SIZE, all.length);
		return [
			{
				status,
				total: all.length,
				hasMore: shown < all.length,
				items: all.slice(0, shown),
			},
		];
	}),
);

/** Tab 列表：有内容的状态 + 总数（STATUS_ORDER 序，前端分页用的计数来自全量过滤结果） */
const tabs = $derived(
	STATUS_ORDER.flatMap((status) => {
		const total = filtered.filter((anime) => anime.status === status).length;
		return total > 0 ? [{ status, total }] : [];
	}),
);

/** 当前 Tab：URL/点击指定（且在 tabs 内），否则默认第一个有内容的 */
const activeTab = $derived(
	tabs.some((tab) => tab.status === selectedTab)
		? selectedTab
		: (tabs[0]?.status ?? ""),
);

/** 当前 Tab 的组（复用分区数据结构，单组渲染 + 独立加载更多） */
const activeGroup = $derived(
	statusGroups.find((group) => group.status === activeTab) ?? null,
);

/** 加载某状态分区的下一段 */
function loadMore(status: AnimeStatus) {
	groupShown[status] =
		(groupShown[status] ?? ANIME_PAGE_SIZE) + ANIME_PAGE_SIZE;
}

function readStoredLayoutMode(): AnimeLayoutMode {
	try {
		const stored = localStorage.getItem(ANIME_LAYOUT_KEY);
		if (stored === "list" || stored === "grid") return stored;
	} catch {
		/* Ignore local storage access failure */
	}
	return "grid";
}

/** 切布局：切类前记录卡片位置，下一帧逐卡 FLIP 平移（reduced-motion 跳变） */
function switchLayoutMode(mode: AnimeLayoutMode) {
	if (mode === listMode) return;
	const cards = Array.from(
		listEl?.querySelectorAll<HTMLElement>(".anime-card") ?? [],
	);
	const before = cards.map((card) => card.getBoundingClientRect());
	listMode = mode;
	try {
		localStorage.setItem(ANIME_LAYOUT_KEY, mode);
	} catch {
		/* Ignore local storage access failure */
	}
	requestAnimationFrame(() => {
		cards.forEach((card, index) => {
			void flipFromRect(card, before[index], 400);
		});
	});
}

/** 搜索变化时重置已加载数 */
$effect(() => {
	const q = query;
	if (!initialized) return;
	groupShown = {};
});

// 搜索词与状态 Tab 同步到 URL（?q= / ?tab=），刷新/分享/回退保留
$effect(() => {
	const q = query;
	const tab = activeTab;
	if (!initialized) return;
	const params = new URLSearchParams(window.location.search);
	params.delete("q");
	params.delete("tab");
	if (q.trim()) params.set("q", q.trim());
	if (tab) params.set("tab", tab);
	const qs = params.toString();
	history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
});

onMount(() => {
	const params = new URLSearchParams(window.location.search);
	query = params.get("q") || "";
	selectedTab = (params.get("tab") as AnimeStatus) || "";
	listMode = readStoredLayoutMode();
	initialized = true;
});
</script>

<Card color="var(--card-bg)" radius="l" class="anime-section px-8 py-6">
	<PageHeader
		icon="material-symbols:live-tv-outline-rounded"
		title={i18n(I18nKey.anime)}
		subtitle={i18n(I18nKey.animeBanner)}
	/>

	{#if animes.length > 0}
		<div class="anime-section__tools">
			<div class="anime-section__search-row">
				<div class="anime-section__search">
					<TextField
						type="search"
						bind:value={query}
						placeholder={i18n(I18nKey.search)}
						label={i18n(I18nKey.search)}
						hideLabel
						variant="filled"
						class="!rounded-(--shape-corner-l)"
					>
						<Icon slot="leading" icon="material-symbols:search-rounded" aria-hidden="true" />
					</TextField>
					{#if query}
						<button
							type="button"
							class="anime-section__search-clear"
							aria-label={i18n(I18nKey.clear)}
							onclick={() => (query = "")}
						>
							<Icon icon="material-symbols:close-rounded" aria-hidden="true" />
						</button>
					{/if}
				</div>

				<div class="anime-section__layout-switch" role="group" aria-label={i18n(I18nKey.layoutMode)}>
					<button
						type="button"
						class="anime-section__layout-btn"
						class:anime-section__layout-btn--active={listMode === "grid"}
						aria-label={i18n(I18nKey.layoutGrid)}
						title={i18n(I18nKey.layoutGrid)}
						aria-pressed={listMode === "grid"}
						onclick={() => switchLayoutMode("grid")}
					>
						<Icon icon="material-symbols:grid-view-rounded" aria-hidden="true" />
					</button>
					<button
						type="button"
						class="anime-section__layout-btn"
						class:anime-section__layout-btn--active={listMode === "list"}
						aria-label={i18n(I18nKey.layoutList)}
						title={i18n(I18nKey.layoutList)}
						aria-pressed={listMode === "list"}
						onclick={() => switchLayoutMode("list")}
					>
						<Icon icon="material-symbols:view-list-rounded" aria-hidden="true" />
					</button>
				</div>
			</div>
		</div>
	{/if}

	{#if tabs.length > 0}
		<div class="anime-section__tabs" role="tablist" aria-label={i18n(I18nKey.anime)}>
			{#each tabs as tab (tab.status)}
				<button
					type="button"
					role="tab"
					class="anime-section__tab"
					class:anime-section__tab--active={tab.status === activeTab}
					aria-selected={tab.status === activeTab}
					onclick={() => (selectedTab = tab.status)}
				>
					<span class="anime-section__tab-label">{i18n(ANIME_STATUS_META[tab.status].key)}</span>
					<span class="anime-section__tab-count">{tab.total}</span>
				</button>
			{/each}
		</div>
	{/if}

	{#if activeGroup}
		{#key `${activeTab}|${query}`}
			<div class="anime-section__groups" bind:this={listEl}>
				<section class="anime-section__group">
					<div class="anime-list {LIST_MODE_CLASS[listMode]}">
						{#each activeGroup.items as anime, i (anime.title)}
							<AnimeCard {anime} delay={Math.min(i, 7) * 45} />
						{/each}
					</div>
					{#if activeGroup.hasMore}
						<div class="anime-section__more">
							<Button
								variant="outlined"
								icon="material-symbols:expand-more-rounded"
								label={i18n(I18nKey.loadMore)}
								onclick={() => loadMore(activeTab)}
							/>
						</div>
					{/if}
				</section>
			</div>
		{/key}
	{:else}
		<div class="anime-section__empty">
			{#if animes.length === 0}
				<Icon icon="material-symbols:tv-off-outline-rounded" aria-hidden="true" />
				<span>{i18n(I18nKey.animeSyncEmpty)}</span>
			{:else}
				<Icon icon="material-symbols:search-off-outline-rounded" aria-hidden="true" />
				<span>{i18n(I18nKey.animeNoResults)}</span>
			{/if}
		</div>
	{/if}
</Card>

<style lang="stylus">
@import "../../styles/breakpoints.styl"

.anime-section
	display: block

	@media (max-width: bp-sm - 1px)
		/* 卡片容器（Card 原子根）移动端收窄内边距 */
		padding: 1rem 0.75rem

		.anime-list--grid, .anime-list--list
			padding-top: 1rem
			gap: 0.625rem

	/* 状态 Tab（M3 tabs：文字 + 底部指示条 + 计数徽标） */
	&__tabs
		display: flex
		gap: 0.25rem
		overflow-x: auto
		scrollbar-width: none
		border-bottom: 1px solid unquote("color-mix(in oklab, var(--on-surface) 10%, transparent)")
		margin: 0.25rem 0 1.25rem

		::-webkit-scrollbar
			display: none

	&__tab
		flex: none
		position: relative
		display: inline-flex
		align-items: center
		gap: 0.375rem
		padding: 0.625rem 0.875rem 0.5rem
		border: none
		background: transparent
		color: var(--on-surface-variant)
		font: var(--m3e-type-label-large)
		font-weight: 600
		cursor: pointer
		transition: color var(--m3e-duration-short) var(--m3e-easing-standard)

		&::after
			content: ""
			position: absolute
			left: 0.5rem
			right: 0.5rem
			bottom: 0
			height: 3px
			border-radius: var(--shape-corner-full)
			background: var(--primary)
			transform: scaleX(0)
			transform-origin: center
			transition: transform var(--m3e-duration-medium) var(--m3e-easing-emphasized-decelerate)

		&--active
			color: var(--primary)

			&::after
				transform: scaleX(1)

		&:hover:not(&--active)
			color: var(--on-surface)
			background: unquote("color-mix(in oklab, var(--on-surface) 5%, transparent)")
			border-radius: var(--shape-corner-s)

		&:focus-visible
			outline: 2px solid var(--primary)
			outline-offset: 2px
			border-radius: var(--shape-corner-s)

	&__tab-count
		display: inline-flex
		align-items: center
		justify-content: center
		min-width: 1.25rem
		padding: 0.0625rem 0.375rem
		border-radius: var(--shape-corner-full)
		background: unquote("color-mix(in oklab, var(--on-surface) 8%, transparent)")
		color: var(--on-surface-variant)
		font: var(--m3e-type-label-small)
		line-height: 1.4

		.anime-section__tab--active &
			background: unquote("color-mix(in oklab, var(--primary) 14%, transparent)")
			color: var(--primary)

	&__tools
		display: flex
		flex-direction: column
		gap: 0.875rem
		padding-bottom: 1.25rem
		border-bottom: 1px solid var(--outline-variant)

	&__search-row
		display: flex
		align-items: center
		gap: 0.625rem
		width: 100%

	&__search
		position: relative
		flex: 1
		min-width: 0
		max-width: 32rem

		:global(.m3-text-field)
			width: 100%

	&__search-clear
		position: absolute
		right: 0.5rem
		top: 50%
		transform: translateY(-50%)
		display: inline-flex
		flex-shrink: 0
		align-items: center
		justify-content: center
		width: 1.75rem
		height: 1.75rem
		padding: 0.25rem
		border: none
		background: none
		color: var(--on-surface-variant)
		cursor: pointer
		border-radius: var(--shape-corner-full)
		> :global(svg)
			width: 1.25rem
			height: 1.25rem
		&:hover
			background: unquote("color-mix(in oklab, var(--on-surface-variant) 8%, transparent)")

	&__filter-row
		display: flex
		flex-wrap: wrap
		align-items: center
		justify-content: space-between
		gap: 0.75rem
		width: 100%

	&__chips
		flex: 1
		min-width: 0
		overflow-x: auto
		scrollbar-width: none
		&::-webkit-scrollbar
			display: none

	&__count
		margin: 0
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-small)
		white-space: nowrap

	&__layout-switch
		display: inline-flex
		flex-shrink: 0
		align-items: center
		padding: 0.125rem
		border-radius: var(--shape-corner-m)
		background: var(--surface-container-high)

	&__layout-btn
		display: inline-flex
		align-items: center
		justify-content: center
		width: 2.125rem
		height: 2.125rem
		border: none
		border-radius: var(--shape-corner-s)
		background: transparent
		color: var(--on-surface-variant)
		cursor: pointer
		transition:
			background-color var(--m3e-duration-short) var(--m3e-easing-standard),
			color var(--m3e-duration-short) var(--m3e-easing-standard)
		> :global(svg)
			width: 1.25rem
			height: 1.25rem

		&:hover
			color: var(--on-surface)
			background: unquote("color-mix(in oklab, var(--on-surface) 8%, transparent)")

		&--active
			background: var(--primary-container)
			color: var(--on-primary-container)
			&:hover
				background: var(--primary-container)
				color: var(--on-primary-container)

	/* ===== 状态分区陈列 ===== */
	&__groups
		display: flex
		flex-direction: column
		gap: 1.75rem

	&__group
		display: flex
		flex-direction: column
		gap: 0.75rem

	&__group-head
		display: inline-flex
		align-items: center
		gap: 0.5rem
		min-width: 0

	&__group-dot
		flex-shrink: 0
		width: 0.5rem
		height: 0.5rem
		border-radius: var(--shape-corner-full)
		background: var(--anime-status-color)
		box-shadow: 0 0 0 4px unquote("color-mix(in oklab, var(--anime-status-color) 18%, transparent)")

	&__group-name
		margin: 0
		color: var(--on-surface)
		font: var(--m3e-type-title-medium)
		font-weight: 600
		line-height: 1.3

	&__group-count
		color: var(--on-surface-variant)
		font: var(--m3e-type-label-medium)
		background: unquote("color-mix(in oklab, var(--on-surface) 7%, transparent)")
		border-radius: var(--shape-corner-full)
		padding: 0.125rem 0.5rem

	/* 状态筛选过渡：区块位置的大号 contained LoadingIndicator（out = 淡出退场） */
	&__loading
		display: flex
		align-items: center
		justify-content: center
		min-height: 11rem
		padding-top: 1.5rem

		&--out
			animation: anime-loading-out var(--m3e-duration-short) var(--m3e-easing-emphasized-accelerate) both

	&__more
		display: flex
		justify-content: center
		margin-top: 1.5rem

	&__empty
		display: flex
		flex-direction: column
		align-items: center
		justify-content: center
		gap: 0.875rem
		min-height: 12rem
		padding-top: 1.5rem
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-large)
		> :global(svg)
			width: 2.75rem
			height: 2.75rem
			color: var(--outline)

/* 海报网格（grid）：手机 2 列、平板 3 列、电脑端精准 4 列，紧凑美观 */
.anime-list--grid
	display: grid
	grid-template-columns: repeat(2, 1fr)
	gap: 0.875rem
	padding-top: 1.25rem

	@media (min-width: 32rem)
		grid-template-columns: repeat(3, 1fr)
		gap: 0.875rem

	@media (min-width: bp-md)
		grid-template-columns: repeat(4, 1fr)
		gap: 1rem

/* 横向列表（list）：单列，超宽视口双列；卡片横排（封面固定宽 + 正文铺开）。
   跨组件边界覆盖卡片内部类，统一走 :global（容器级驱动，规则集中在布局拥有方）。 */
.anime-list--list
	display: grid
	grid-template-columns: 1fr
	gap: 1rem
	padding-top: 1.25rem

	@media (min-width: 88rem)
		grid-template-columns: repeat(2, 1fr)

	:global(.anime-card)
		flex-direction: row

	:global(.anime-card__cover)
		width: 8.5rem
		flex-shrink: 0

		@media (min-width: 48rem)
			width: 11rem

	:global(.anime-card__body)
		flex: 1
		min-width: 0
		padding: 1.125rem 1.25rem
		justify-content: space-between

	:global(.anime-card__desc)
		-webkit-line-clamp: 3

/* 指示器退场：淡出 + 轻微收拢（reduced-motion 由全局规则压至终态） */
@keyframes anime-loading-out
	from
		opacity: 1
		transform: none
	to
		opacity: 0
		transform: scale(0.96)
</style>
