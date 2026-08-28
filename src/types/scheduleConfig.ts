/**
 * 时间进度组件配置类型。
 *
 * 年/月/周三条进度 + 下一个节日倒计时。节日支持：
 * - fixed：公历固定日期（如 10-01 国庆节）；
 * - nthWeekday：某月第 n 个星期几（如 5 月第 2 个周日 = 母亲节）。
 * 农历节日（春节/中秋等）依赖农历推算，暂留待扩展，勿在此误用公历近似日期。
 * 值与默认配置见 src/config/scheduleConfig.ts。
 */
export interface HolidayEntry {
	id: string;
	/** 节日名（数据文案，非界面 copy） */
	name: string;
	/** 公历固定日期 */
	fixed?: { month: number; day: number };
	/** 按星期规则：第 nth 个 weekday（0=周日）落在 month 月 */
	nthWeekday?: { month: number; nth: number; weekday: number };
}

export interface ScheduleConfig {
	holidays: HolidayEntry[];
}