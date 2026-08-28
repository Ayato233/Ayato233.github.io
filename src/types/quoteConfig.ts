/**
 * 每日一言配置类型。
 *
 * quotes 为本地句子数组：日期驱动轮换（同日固定、次日更换），
 * 不请求任何外部接口，数据内联于页面，零网络依赖。
 * 值与默认配置见 src/config/quoteConfig.ts。
 */
export interface QuoteEntry {
	/** 句子正文（建议控制在 1~2 行，过长会撑高侧栏） */
	text: string;
	/** 出处 / 署名，如「王维」「《诗经》」 */
	author: string;
}

export interface QuoteConfig {
	/** 每日一言句子库；为空数组时组件不渲染 */
	quotes: QuoteEntry[];
}