/**
 * 时间进度配置：年/月/周进度 + 下一个节日倒计时。
 * 全部为本地计算，零网络；想改节日/文案只在此配置。
 * 农历节日暂未包含（依赖农历推算），后续可扩展 nthWeekday/fixed 之外的规则。
 */
import type { ScheduleConfig } from "@/types/scheduleConfig";

export const scheduleConfig: ScheduleConfig = {
	holidays: [
		{ id: "newyear", name: "元旦", fixed: { month: 1, day: 1 } },
		{ id: "valentine", name: "情人节", fixed: { month: 2, day: 14 } },
		{ id: "labor", name: "劳动节", fixed: { month: 5, day: 1 } },
		{ id: "national", name: "国庆节", fixed: { month: 10, day: 1 } },
		{ id: "christmas", name: "圣诞节", fixed: { month: 12, day: 25 } },
		{ id: "mothers", name: "母亲节", nthWeekday: { month: 5, nth: 2, weekday: 0 } },
		{ id: "fathers", name: "父亲节", nthWeekday: { month: 6, nth: 3, weekday: 0 } },
	],
};