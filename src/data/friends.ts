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
	/** 可选：站点首页截图（预览图），省略则不显示预览区 */
	preview?: string;
}

// 友情链接数据（示例占位，等待替换为真实友链）
export const friendsData: FriendItem[] = [
	{ id: 1, title: "朝朝听雨 - 物物而不物于物，念念而不念于念", imgurl: "https://icon.horse/icon/rainzt.cn", desc: "rainzt.cn", siteurl: "https://rainzt.cn/", tags: ["博客"] },
	{ id: 12, title: "「花语栈」 - CaCa de Blog", imgurl: "https://icon.horse/icon/cacablog.top", desc: "cacablog.top", siteurl: "https://www.cacablog.top/", tags: ["博客"] },
	{ id: 9, title: "About-晓空blog", imgurl: "https://icon.horse/icon/about.moeworld.top", desc: "about.moeworld.top", siteurl: "https://blog.moeworld.tech/", tags: ["博客"] },
	{ id: 5, title: "Vinking - 一个安静的地方", imgurl: "https://icon.horse/icon/vinking.top", desc: "vinking.top", siteurl: "https://vinking.top/", tags: ["博客"] },
	{ id: 8, title: "律回彼境", imgurl: "https://icon.horse/icon/glowmem.com", desc: "glowmem.com", siteurl: "https://www.glowmem.com/", tags: ["博客"] },
	{ id: 11, title: "雨线下的信号塔", imgurl: "https://icon.horse/icon/7thrainfall.top", desc: "7thrainfall.top", siteurl: "https://7thrainfall.top/", tags: ["博客"] },
	{ id: 7, title: "迷途之旅", imgurl: "https://icon.horse/icon/blog.jitsu.top", desc: "blog.jitsu.top", siteurl: "https://blog.jitsu.top/", tags: ["博客"] },
	{ id: 3, title: "保罗的小宇宙", imgurl: "https://icon.horse/icon/paugram.com", desc: "paugram.com", siteurl: "https://paugram.com/", tags: ["博客"] },
	
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
