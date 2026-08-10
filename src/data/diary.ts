// 日记数据配置
// 用于管理日记页面的数据

export interface DiaryItem {
	id: number;
	content: string;
	date: string;
	images?: string[];
	location?: string;
	mood?: string;
	tags?: string[];
}

// 示例日记数据
const diaryData: DiaryItem[] = [
	{
		id: 1,
		content:
			"The falling speed of cherry blossoms is five centimeters per second!",
		date: "2025-01-15T10:30:00Z",
		images: ["/images/diary/sakura.jpg", "/images/diary/1.webp"],
	},
	{
		id: 2,
		content:
			"今天把博客换上了 Mizuki 主题，忙活了一整天。从 Fuwari 迁移过来，改了导航栏、接了 B 站追番数据、还把歌单换成了自己的网易云歌单。虽然过程有点折腾，但看到卡片式的界面一点点成型，还挺有成就感的。",
		date: "2026-08-06T21:30:00+08:00",
		location: "家中",
		mood: "充实",
		tags: ["博客", "折腾"],
	},
	{
		id: 3,
		content:
			"今天剃了个寸头，凉快利落。晚上重温了《颠倒的帕特玛》——两个重力相反的世界里，帕特玛在井底仰望天空，爱子在穹顶俯视深渊，对彼此而言，对方的世界永远是颠倒的。可当他们十指相扣的那一刻，所谓上下，不过是参照不同。多年后再看，比起当年的视觉震撼，更打动我的是这份“换个参照系，世界就不一样”的温柔。",
		date: "2026-08-08T06:00:00+08:00",
		mood: "清爽",
		tags: ["日常", "电影"],
	},
	{
		id: 4,
		content:
			"最近几个月，算是我有史以来最低谷的日子。各平台的网贷压得我喘不过气，被抽贷，钱只出不进，能借钱的地方我都问遍了。这个月还有六千块要还，我每天拼命跑外卖，哪怕一天跑满两百块也还是不够。后半夜基本没有单子，往往跑个一百块我就只能收工回家。每天睁开眼都在焦虑怎么还钱，甚至开始想是不是只能跟家里开口了——可不到万不得已，我实在没法向家里人开口。唉，日子总归要过下去，走一步看一步吧。",
		date: "2026-08-11T04:00:00+08:00",
		mood: "焦虑",
		tags: ["日常", "生活"],
	},
];

// 获取日记列表（按时间倒序）
export const getDiaryList = (limit?: number) => {
	const sortedData = [...diaryData].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	if (limit && limit > 0) {
		return sortedData.slice(0, limit);
	}

	return sortedData;
};

// 获取所有标签
export const getAllTags = () => {
	const tags = new Set<string>();
	for (const item of diaryData) {
		if (item.tags) {
			for (const tag of item.tags) {
				tags.add(tag);
			}
		}
	}
	return Array.from(tags).sort();
};
