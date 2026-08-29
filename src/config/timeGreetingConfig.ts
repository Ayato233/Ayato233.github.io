/**
 * 分时问候时钟配置。
 *
 * 问候按小时分段（起始小时升序），时间每分钟刷新、问候跨时段自动切换，
 * 图片每次刷新随机一张（仅站内资源）。想换文案/图池只改这里。
 */
import type { TimeGreetingConfig } from "@/types/timeGreetingConfig";

export const timeGreetingConfig: TimeGreetingConfig = {
	greetings: [
		{ hour: 0, message: "夜深了，早点休息～" },
		{ hour: 6, message: "早上好，新的一天！" },
		{ hour: 9, message: "上午好，保持活力！" },
		{ hour: 12, message: "中午好，记得午休～" },
		{ hour: 14, message: "下午好，继续加油！" },
		{ hour: 18, message: "晚上好，放松一下吧" },
	],
	// 底部图片区：只放站内 public 静态资源（原样拷贝零压缩）；
	// 默认复用横幅静态图，后续往数组加图即参与轮换
	images: ["/assets/banner/desktop/1.webp"],
	// 每日随机图片源（JSON API）：组件按天拉取一张（低频、当天缓存），失败回退 images 池
	remote: "https://moe.jitsu.top/img/?sort=pc&type=json&num=1",
};