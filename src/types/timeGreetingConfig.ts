/**
 * 分时问候时钟配置类型。
 *
 * 侧栏widget：上半为「问候语 + 大号时钟 + 日期星期」，下半可选图片区。
 * 图片池只读站内资源（零网络请求）；时段文案可自由增改。
 * 值与默认配置见 src/config/timeGreetingConfig.ts。
 */
export interface TimeGreetingEntry {
	/** 该时段的起始小时（0-23，升序排列；前一时段结束即本时段开始） */
	hour: number;
	/** 问候语，如「早上好，新的一天！」 */
	message: string;
}

export interface TimeGreetingConfig {
	/** 六时段问候文案（按起始小时升序） */
	greetings: TimeGreetingEntry[];
	/** 底部图片池（站内路径）。为空数组时不渲染图片区 */
	images: string[];
	/**
	 * 可选：每日随机图片 JSON 源（外链 API）。
	 * 组件**每天最多请求一次**（localStorage 按天缓存图 URL，当天重复访问不请求），
	 * 响应格式：`{ pics: string[] }`，取 pics[0] 作背景图；
	 * 请求失败自动回退 `images` 池随机图（不破图）。
	 */
	remote?: string;
}