<script lang="ts">
/**
 * 友链卡片（分子）：拟态玻璃三要素——头像 + 站点名称 + 一段描述。
 * - 整卡可点（外链）；hover 浮起 + 标题变主题色 + 头像微缩放；
 * - 玻璃质感与全站卡片一致（无描边 / 半透明底色 / 柔和阴影 / 顶部微反光，触屏降级 blur）。
 */
import type { FriendItem } from "../../data/friends";

let { friend }: { friend: FriendItem } = $props();
</script>

<a
	class="friend-card"
	href={friend.siteurl}
	target="_blank"
	rel="noopener noreferrer"
	aria-label={friend.title}
>
	<div class="friend-card__main">
		<img
			class="friend-card__avatar"
			src={friend.imgurl}
			alt={friend.title}
			loading="lazy"
			decoding="async"
			onerror={(e) => {
				e.currentTarget.onerror = null;
				e.currentTarget.src = "/images/site/avatar.jpg";
			}}
		/>
		<div class="friend-card__info">
			<span class="friend-card__title">{friend.title}</span>
			{#if friend.desc}
				<p class="friend-card__desc">{friend.desc}</p>
			{/if}
		</div>
	</div>
</a>

<style lang="stylus">
.friend-card
	position: relative
	display: block
	overflow: hidden
	border-radius: var(--shape-corner-l)
	background: var(--card-bg)

	-webkit-backdrop-filter: blur(16px)

	backdrop-filter: blur(16px)
	/* 拟态玻璃：无深色描边，顶部微反光 + 柔和悬浮阴影（hover 浮起） */
	border: none
	text-decoration: none
	color: var(--on-surface)
	box-shadow: unquote("inset 0 1px 0 rgb(255 255 255 / 0.08)"), var(--card-shadow)
	transition:
		box-shadow var(--m3e-duration-medium) var(--m3e-easing-emphasized-decelerate),
		transform var(--m3e-duration-medium) var(--m3e-easing-emphasized-decelerate),
		background-color var(--m3e-duration-medium) var(--m3e-easing-standard)

	&:hover
		box-shadow: unquote("inset 0 1px 0 rgb(255 255 255 / 0.12)"), var(--m3e-elevation-2)
		transform: translateY(-2px)
		background: unquote("color-mix(in oklab, var(--on-surface) 3%, var(--card-bg))")

	&__main
		display: flex
		align-items: flex-start
		gap: 0.875rem
		padding: 1.125rem 1.25rem

	&__avatar
		flex: none
		width: 3.5rem /* 56px */
		height: 3.5rem
		border-radius: 1.1rem
		object-fit: cover
		box-shadow:
			0 0 0 2px unquote("color-mix(in oklab, var(--primary) 16%, transparent)"),
			0 0 0 5px unquote("color-mix(in oklab, var(--surface-container-high) 45%, transparent)")
		transition:
			transform var(--m3e-duration-medium) var(--m3e-easing-emphasized-decelerate),
			box-shadow var(--m3e-duration-medium) var(--m3e-easing-emphasized-decelerate)

		.friend-card:hover &
			transform: scale(1.05) translateY(-1px)
			box-shadow:
				0 0 0 2px unquote("color-mix(in oklab, var(--primary) 26%, transparent)"),
				0 0 0 5px unquote("color-mix(in oklab, var(--primary) 8%, transparent)")

	&__info
		min-width: 0
		flex: 1
		display: flex
		flex-direction: column
		gap: 0.375rem
		padding-top: 0.125rem

	&__title
		font: var(--m3e-type-title-small)
		font-weight: 700
		color: var(--on-surface)
		transition: color var(--m3e-duration-short) var(--m3e-easing-standard)

		.friend-card:hover &
			color: var(--primary)

	&__desc
		margin: 0
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-small)
		line-height: 1.6
		display: -webkit-box
		-webkit-line-clamp: 2
		-webkit-box-orient: vertical
		overflow: hidden

/* 触屏设备降低玻璃模糊（对齐 variables 的 --card-blur 降级策略） */
@media (hover: none) and (pointer: coarse)
	.friend-card
		-webkit-backdrop-filter: blur(6px)
		backdrop-filter: blur(6px)
</style>