import type { ProfileConfig } from "@/types/config";

/**
 * 博主资料：头像 / 名称 / 简介 / 社交链接（侧栏 Profile 卡片、页脚、RSS 作者等消费）。
 * 类型见 src/types/config.ts。
 */
export const profileConfig: ProfileConfig = {
	avatar: "/images/site/avatar.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "Shigure",
	bio: "生活明朗，万物可爱。",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/Ayato233",
		},
		{
			name: "Gitee",
			icon: "material-symbols:code-blocks-rounded",
			url: "https://gitee.com/Aizen233",
		},
		{
			name: "邮箱",
			icon: "material-symbols:mail-rounded",
			url: "mailto:2783885223@qq.com",
		},
	],
};