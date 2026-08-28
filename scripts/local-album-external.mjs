// 为本地相册生成 external 模式 info.json（列表用缩略图、点击用原图）。
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = path.resolve(process.cwd(), "public/images/albums");
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

const albums = {
	fufu: {
		title: "芙芙",
		description: "芙宁娜（Furina）图集——枫丹的水神，歌剧院的主角。",
		date: "2026-08-26",
		location: "原神 · 枫丹",
		tags: ["原神", "芙宁娜"],
	},
	genshin: {
		title: "原神",
		description: "原神游戏截图与风景记录。",
		date: "2026-08-26",
		tags: ["原神"],
	},
};

for (const [id, meta] of Object.entries(albums)) {
	const dir = path.join(ROOT, id);
	const files = fs
		.readdirSync(dir, { withFileTypes: true })
		.filter((e) => e.isFile() && EXTENSIONS.has(path.extname(e.name).toLowerCase()))
		.map((e) => e.name)
		.filter((n) => !/^cover\.(?:webp|jpg)$/i.test(n))
		.filter((n) => n !== "urls.txt")
		.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

	const photos = files.map((name, i) => {
		const base = path.parse(name).name;
		const thumb = `/images/albums/${id}/thumbs/${base}.webp`;
		const src = `/images/albums/${id}/${encodeURIComponent(name)}`;
		return {
			id: `${id}-photo-${i + 1}`,
			src,
			thumbnail: fs.existsSync(path.join(dir, "thumbs", base + ".webp")) ? thumb : undefined,
			alt: base,
			title: base,
		};
	});

	const infoJson = {
		mode: "external",
		hidden: false,
		title: meta.title,
		description: meta.description,
		date: meta.date,
		location: meta.location || "",
		tags: meta.tags,
		layout: "masonry",
		columns: 3,
		cover: `/images/albums/${id}/thumbs/1.webp`,
		photos,
	};

	fs.writeFileSync(path.join(dir, "info.json"), JSON.stringify(infoJson, null, 2), "utf8");
	console.log(`[album-external] ${id}: ${photos.length} 张照片, cover=thumbs/1.webp`);
	console.log(`  → 原 cover.webp 文件保留未动（${(fs.statSync(path.join(dir, "cover.webp")).size / 1024 / 1024).toFixed(1)}MB）`);
}