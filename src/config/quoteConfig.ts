/**
 * 每日一言配置。
 *
 * 句子按「本地的 UTC 天数 % 句子数」轮换：同一天无论刷新多少次
 * 都显示同一句，跨天后自动切换到下一句。想改句子/署名只改这里，
 * 或直接在 config 里增删，无需碰组件。
 */
import type { QuoteConfig } from "@/types/quoteConfig";

export const quoteConfig: QuoteConfig = {
	quotes: [
		{ text: "行到水穷处，坐看云起时。", author: "王维" },
		{ text: "此心安处是吾乡。", author: "苏轼" },
		{ text: "人生如逆旅，我亦是行人。", author: "苏轼" },
		{
			text: "知我者谓我心忧，不知我者谓我何求。",
			author: "《诗经》",
		},
		{ text: "桃李春风一杯酒，江湖夜雨十年灯。", author: "黄庭坚" },
		{
			text: "青山一道同云雨，明月何曾是两乡。",
			author: "王昌龄",
		},
		{ text: "海内存知己，天涯若比邻。", author: "王勃" },
		{
			text: "长风破浪会有时，直挂云帆济沧海。",
			author: "李白",
		},
		{
			text: "非淡泊无以明志，非宁静无以致远。",
			author: "诸葛亮",
		},
		{ text: "天行健，君子以自强不息。", author: "《周易》" },
	],
};