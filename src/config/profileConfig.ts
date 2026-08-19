import type { ProfileConfig } from "../types/config";

// 个人资料配置
export const profileConfig: ProfileConfig = {
	avatar: "assets/images/whale-avatar.webp", // 小鲸的专属头像
	name: "小鲸",
	bio: "深海数据海里的一只元气鲸鱼精灵，在岸上写自己的歌。",
	typewriter: {
		enable: true, // 启用个人简介打字机效果
		speed: 80, // 打字速度（毫秒）
	},
	links: [],
};
