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
import { onMount } from "svelte";
import type { AnimeItem, AnimeStatus } from "../../data/anime";

let {
	animes = [] as AnimeItem[],
	syncAt = "",
}: { animes?: AnimeItem[]; syncAt?: string } = $props();

const ANIME_PAGE_SIZE = 9;

type AnimeTab = "all" | AnimeStatus;

let query = $state("");
let initialized = false;
/** 每个 Tab 的当前页码（独立记忆；切 Tab 保留） */
let groupPage = $state<Partial<Record<AnimeTab, number>>>({});
/** 当前激活的 Tab（默认「全部」；URL ?tab= 可直达） */
let selectedTab = $state<AnimeTab>("");

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

/** 状态分区：按 STATUS_ORDER 统计各状态总数（有内容的区，供翻页与 Tab 计数） */
const statusGroups = $derived(
	STATUS_ORDER.flatMap((status) => {
		const total = filtered.filter((anime) => anime.status === status).length;
		return total > 0 ? [{ status, total }] : [];
	}),
);

/** 页头统计行文案（i18n 不代参数，手动替换占位符） */
const metaText = $derived.by(
	() =>
		i18n(I18nKey.animeMeta)
			.replace("{count}", String(animes.length))
			.replace("{date}", syncAt || "—"),
);

/** Tab 列表：「全部」置首 + 有内容的状态（各带总数，计数来自全量过滤结果） */
const tabs = $derived([
	{ status: "all" as AnimeTab, total: filtered.length },
	...STATUS_ORDER.flatMap((status) => {
		const total = filtered.filter((anime) => anime.status === status).length;
		return total > 0 ? [{ status: status as AnimeTab, total }] : [];
	}),
]);

/** 当前 Tab：URL/点击指定（且在 tabs 内），否则默认第一个（全部） */
const activeTab = $derived(
	tabs.some((tab) => tab.status === selectedTab)
		? selectedTab
		: (tabs[0]?.status ?? ""),
);

/** 当前 Tab 的分页内容：每页 9 条，前后翻页（各 Tab 独立记忆页码） */
const activeGroup = $derived.by(() => {
	const total =
		activeTab === "all"
			? filtered.length
			: (statusGroups.find((g) => g.status === activeTab)?.total ?? 0);
	const totalPages = Math.max(1, Math.ceil(total / ANIME_PAGE_SIZE));
	const page = Math.min(Math.max(groupPage[activeTab] ?? 1, 1), totalPages);
	const base =
		activeTab === "all"
			? filtered
			: filtered.filter((a) => a.status === activeTab);
	return {
		status: activeTab,
		total,
		page,
		totalPages,
		hasPrev: page > 1,
		hasNext: page < totalPages,
		items: base.slice((page - 1) * ANIME_PAGE_SIZE, page * ANIME_PAGE_SIZE),
	};
});

/** 分页页码集合：< 1 … p-2 p-1 p p+1 p+2 … N >（首尾固定 + 当前 ±2，断档补省略号） */
const pageItems = $derived.by(() => {
	const p = activeGroup.page;
	const n = activeGroup.totalPages;
	const set = new Set<number>([1, n]);
	for (let i = p - 2; i <= p + 2; i++) {
		if (i >= 1 && i <= n) set.add(i);
	}
	const sorted = [...set].sort((a, b) => a - b);
	const items: { type: "page" | "gap"; value?: number; key: string }[] = [];
	let prev = 0;
	for (const v of sorted) {
		if (prev > 0 && v - prev > 1) items.push({ type: "gap", key: `g${v}` });
		items.push({ type: "page", value: v, key: `p${v}` });
		prev = v;
	}
	return items;
});

/** 跳页（clamp 到 [1, 总页数]） */
function setPage(status: AnimeTab, page: number) {
	const total =
		status === "all"
			? filtered.length
			: (statusGroups.find((g) => g.status === status)?.total ?? 0);
	const totalPages = Math.max(1, Math.ceil(total / ANIME_PAGE_SIZE));
	groupPage[status] = Math.min(Math.max(page, 1), totalPages);
}

/** 搜索变化时重置页码 */
$effect(() => {
	const q = query;
	if (!initialized) return;
	groupPage = {};
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
	initialized = true;
});
</script>

<div class="anime-section px-8 py-6">
	<PageHeader
		icon="material-symbols:live-tv-outline-rounded"
		title={i18n(I18nKey.anime)}
		subtitle={i18n(I18nKey.animeBanner)}
	/>

	{#if animes.length > 0}
		<p class="anime-section__meta" aria-live="polite">
			{metaText}
		</p>
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
					<span class="anime-section__tab-label">{i18n(tab.status === "all" ? I18nKey.animeAll : ANIME_STATUS_META[tab.status as AnimeStatus].key)}</span>
					<span class="anime-section__tab-count">{tab.total}</span>
				</button>
			{/each}
		</div>
	{/if}

	{#if activeGroup}
		{#key `${activeTab}|${query}`}
			<div class="anime-section__groups">
				<section class="anime-section__group">
					<div class="anime-list anime-list--grid">
						{#each activeGroup.items as anime, i (anime.title)}
							<AnimeCard {anime} delay={Math.min(i, 7) * 45} />
						{/each}
					</div>
					{#if activeGroup.totalPages > 1}
					<div class="anime-section__pagination">
						<!-- 移动端简化：箭头 + 当前/总页 -->
						<div class="anime-section__pagination-mobile">
							<button
								type="button"
								class="anime-section__page-arrow"
								aria-label="上一页"
								disabled={!activeGroup.hasPrev}
								onclick={() => setPage(activeTab, activeGroup.page - 1)}
							>
								<Icon icon="material-symbols:chevron-left-rounded" />
							</button>
							<span class="anime-section__page-jump">
								<span class="anime-section__page-jump-current">{activeGroup.page}</span>
								<span class="anime-section__page-jump-sep" aria-hidden="true">/</span>
								<span class="anime-section__page-jump-total">{activeGroup.totalPages}</span>
							</span>
							<button
								type="button"
								class="anime-section__page-arrow"
								aria-label="下一页"
								disabled={!activeGroup.hasNext}
								onclick={() => setPage(activeTab, activeGroup.page + 1)}
							>
								<Icon icon="material-symbols:chevron-right-rounded" />
							</button>
						</div>
						<!-- 桌面端完整：箭头 + 页码窗口（省略折叠） -->
						<div class="anime-section__pagination-desktop">
							<button
								type="button"
								class="anime-section__page-arrow"
								aria-label="上一页"
								disabled={!activeGroup.hasPrev}
								onclick={() => setPage(activeTab, activeGroup.page - 1)}
							>
								<Icon icon="material-symbols:chevron-left-rounded" />
							</button>
							<div class="anime-section__page-nums">
								{#each pageItems as item (item.key)}
									{#if item.type === "gap"}
										<span class="anime-section__page-ellipsis" aria-hidden="true">
											<Icon icon="material-symbols:more-horiz" />
										</span>
									{:else}
										<button
											type="button"
											class="anime-section__page-num"
											class:anime-section__page-num--active={item.value === activeGroup.page}
											aria-current={item.value === activeGroup.page ? "page" : undefined}
											aria-label={`第 ${item.value} 页`}
											onclick={() => setPage(activeTab, item.value!)}
										>
											{item.value}
										</button>
									{/if}
								{/each}
							</div>
							<button
								type="button"
								class="anime-section__page-arrow"
								aria-label="下一页"
								disabled={!activeGroup.hasNext}
								onclick={() => setPage(activeTab, activeGroup.page + 1)}
							>
								<Icon icon="material-symbols:chevron-right-rounded" />
							</button>
						</div>
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
</div>

<style lang="stylus">
@import "../../styles/breakpoints.styl"

.anime-section
	display: block

	@media (max-width: bp-sm - 1px)
		/* 卡片容器（Card 原子根）移动端收窄内边距 */
		padding: 1rem 0.75rem

		.anime-list--grid
			padding-top: 1rem
			gap: 1rem

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

	/* 页头统计行（动画 N 部 · 数据更新于 …） */
	&__meta
		margin: 0.375rem 0 0.75rem
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-small)
		line-height: 1.5

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

	/* 分页条（与主页文章分页 PagePagination 同款：移动简化 / 桌面页码窗口） */
	&__pagination
		display: flex
		align-items: center
		justify-content: center
		gap: 0.75rem
		padding-top: 1.5rem

	&__pagination-mobile
		display: flex
		align-items: center
		gap: 0.75rem

	&__pagination-desktop
		display: none

	@media (min-width: 1024px)
		&__pagination-mobile
			display: none

		&__pagination-desktop
			display: flex
			align-items: center
			gap: 0.75rem

	&__page-arrow
		display: inline-flex
		align-items: center
		justify-content: center
		width: 2.75rem
		height: 2.75rem
		border: none
		border-radius: var(--shape-corner-l)
		background: var(--surface-container-low)
		color: var(--primary)
		cursor: pointer
		transition:
			background-color var(--m3e-duration-short) var(--m3e-easing-standard),
			transform var(--m3e-duration-short) var(--m3e-easing-standard)

		> :global(svg)
			width: 1.75rem
			height: 1.75rem

		&:hover:not(:disabled)
			background: var(--surface-container-high)

		&:active:not(:disabled)
			transform: scale(0.96)

		&:disabled
			opacity: 0.38
			pointer-events: none

	/* 移动端「当前 / 总页」徽标 */
	&__page-jump
		display: inline-flex
		align-items: center
		justify-content: center
		gap: 0.375rem
		min-width: 5.5rem
		height: 2.75rem
		padding: 0 1rem
		border-radius: var(--shape-corner-l)
		background: var(--surface-container-low)
		color: var(--on-surface)
		font: var(--m3e-type-label-large)

		&-current
			font-weight: 700
			color: var(--primary)

		&-sep
			color: var(--on-surface-variant)

		&-total
			color: var(--on-surface-variant)
			font-variant-numeric: tabular-nums

	/* 桌面端页码窗口 */
	&__page-nums
		display: flex
		align-items: center
		gap: 0.5rem

	&__page-num
		display: inline-flex
		align-items: center
		justify-content: center
		width: 2.75rem
		height: 2.75rem
		border: none
		border-radius: var(--shape-corner-l)
		background: var(--surface-container-low)
		color: var(--on-surface-variant)
		font: var(--m3e-type-label-large)
		font-weight: 700
		font-variant-numeric: tabular-nums
		cursor: pointer
		transition:
			background-color var(--m3e-duration-short) var(--m3e-easing-standard),
			color var(--m3e-duration-short) var(--m3e-easing-standard),
			transform var(--m3e-duration-short) var(--m3e-easing-standard)

		&:hover:not(.anime-section__page-num--active)
			background: var(--surface-container-high)

		&:active
			transform: scale(0.96)

		&--active
			background: var(--primary)
			color: var(--on-primary)

			&:hover
				background: var(--primary)

	&__page-ellipsis
		display: inline-flex
		align-items: center
		justify-content: center
		width: 1.75rem
		height: 2.75rem
		color: var(--on-surface-variant)

		> :global(svg)
			width: 1.25rem
			height: 1.25rem

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

/* 海报网格（grid，唯一布局）：手机 2 列、平板及以上 3 列大封面；卡间距留白充足 */
.anime-list--grid
	display: grid
	grid-template-columns: repeat(2, 1fr)
	gap: 1.125rem
	padding-top: 1.25rem

	@media (min-width: 32rem)
		grid-template-columns: repeat(3, 1fr)
		gap: 1.5rem

/* 指示器退场：淡出 + 轻微收拢（reduced-motion 由全局规则压至终态） */
@keyframes anime-loading-out
	from
		opacity: 1
		transform: none
	to
		opacity: 0
		transform: scale(0.96)
</style>
