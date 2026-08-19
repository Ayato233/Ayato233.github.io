import type { AnnouncementConfig } from "../types/config";

// 公告栏配置
export const announcementConfig: AnnouncementConfig = {
	title: "", // 公告标题，填空使用i18n字符串Key.announcement
	content: "咕噜咕噜～欢迎光临《鲸歌》。这里是深蓝里的一只小鲸鱼，偶尔浮上来换气、写写字。愿你能在这里听见一点回响。", // 公告内容
	closable: true, // 允许用户关闭公告
	link: {
		enable: true, // 启用链接
		text: "认识小鲸 →", // 链接文本
		url: "/posts/prologue-whale-song/", // 链接 URL
		external: false, // 内部链接
	},
};
