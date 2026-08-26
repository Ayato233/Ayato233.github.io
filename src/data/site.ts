export const site = {
	url: 'https://myblog.example.com',
	name: '雨线下的信号塔',
	signature: '品尝这个世界',
	avatar: '/avatar.jpg',
	bgLight: '/bg-light.jpg',
	bgDark: '/bg-dark.jpg',
	icp: '萌ICP备 20260000号',
	uptimeStart: '2026-08-26T00:00:00+08:00',
	social: [
		{ name: 'GitHub', url: 'https://github.com/', icon: 'gh' },
		{ name: 'Telegram', url: 'https://t.me/', icon: 'tg' },
		{ name: '邮件', url: 'mailto:hi@example.com', icon: 'mail' },
		{ name: 'RSS', url: '/rss.xml', icon: 'rss' },
	],
} as const;

export const nav = [
	{ label: '首页', href: '/' },
	{ label: '项目', href: '/projects' },
	{ label: '归档', href: '/archive' },
	{ label: '照片墙', href: '/photowall' },
	{ label: '音乐', href: '/music' },
	{ label: '灵境', href: '/collection' },
	{ label: '说说', href: '/footprints' },
	{ label: '杂谈', href: '/chatter' },
	{ label: '友链', href: '/friends' },
	{ label: '关于', href: '/about' },
] as const;