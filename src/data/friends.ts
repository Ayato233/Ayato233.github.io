/**
 * 友情链接数据配置（结构与 Mizuki 同款，便于互相迁移）。
 * 用于管理友情链接页面的数据：src/pages/friends.astro → organisms/FriendSection。
 *
 * 添加友链：在 friendsData 中追加一项即可，页面 / 筛选标签自动生成。
 * tags 会聚合为页面顶部的筛选 chip（OR 命中：选中多个标签时命中任一即显示）。
 */
export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据（示例占位，等待替换为真实友链）
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "示例博客",
		imgurl: "https://ui-avatars.com/api/?name=%E7%A4%BA%E4%BE%8B%E5%8D%9A%E5%AE%A2&size=128&background=7c4dff&color=fff",
		desc: "示例友链占位：一位爱写长文的博主",
		siteurl: "https://example.com/blog",
		tags: ["示例", "博客"],
	},
	{
		id: 2,
		title: "示例图库",
		imgurl: "https://ui-avatars.com/api/?name=%E7%A4%BA%E4%BE%8B%E5%9B%BE%E5%BA%93&size=128&background=2f9e6e&color=fff",
		desc: "示例友链占位：收集风景与光影",
		siteurl: "https://example.com/gallery",
		tags: ["示例", "图库"],
	},
	{
		id: 3,
		title: "示例工具站",
		imgurl: "https://ui-avatars.com/api/?name=%E7%A4%BA%E4%BE%8B%E5%B7%A5%E5%85%B7%E7%AB%99&size=128&background=d9822b&color=fff",
		desc: "示例友链占位：前端小工具集散地",
		siteurl: "https://example.com/tools",
		tags: ["示例", "工具"],
	},
];

// 获取所有友情链接数据（稳定顺序，测试可复现）
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据（避免固定排序，按需使用）
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
