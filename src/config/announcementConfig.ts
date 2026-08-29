import type { AnnouncementConfig } from "@/types/announcementConfig";

/**
 * 公告栏配置
 * 组件显示由 sidebarConfig 统一控制
 */
export const announcementConfig: AnnouncementConfig = {
	title: "欢迎来访者", // 公告标题，填空使用 i18n 字符串 Key.announcement
	content:
		"欢迎来到 Shigure 的小站～\n\n这里记录技术笔记、生活随想与追番日常——一场疏雨，如约而至。\n\n你可以慢逛文章、动态与相册，也欢迎通过友链互链，或去留言板留下你的脚印。\n\n愿这里的每一分钟，都给你一点点小确幸。", // 公告内容
	closable: false, // 不显示关闭按钮
	link: {
		enable: false, // 不显示「了解更多」
		text: "了解更多", // 链接文本
		url: "/about/", // 链接 URL
		external: false, // 内部链接
	},
};
