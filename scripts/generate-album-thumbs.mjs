// 为相册生成本地 webp 缩略图（列表展示用）。
// 铁律遵守：原图文件完全不动，缩略图写入 <album>/thumbs/ 子目录。
// 用法: node scripts/generate-album-thumbs.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ALBUM_ROOT = path.resolve(process.cwd(), "public/images/albums");
const THUMB_DIR = "thumbs";
const THUMB_WIDTH = 480; // 列表瀑布流列宽约 240px，2x 分辨率足够
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".bmp", ".tiff", ".tif"]);

const albums = fs
	.readdirSync(ALBUM_ROOT, { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	.map((entry) => entry.name);

let total = 0;
for (const album of albums) {
	const albumDir = path.join(ALBUM_ROOT, album);
	const outDir = path.join(albumDir, THUMB_DIR);
	fs.mkdirSync(outDir, { recursive: true });

	const files = fs
		.readdirSync(albumDir, { withFileTypes: true })
		.filter((entry) => entry.isFile() && EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
		.map((entry) => entry.name)
		.filter((name) => !/^cover\.(?:webp|jpg)$/i.test(name))
		.filter((name) => !name.startsWith("info.") && !name.endsWith(".json"))
		.filter((name) => name !== "urls.txt");

	let done = 0;
	const skipped = [];
	for (const name of files) {
		const srcPath = path.join(albumDir, name);
		const outPath = path.join(outDir, path.parse(name).name + ".webp");
		// 已存在且原图未变则跳过（增量）
		if (fs.existsSync(outPath)) {
			const srcMtime = fs.statSync(srcPath).mtimeMs;
			const outMtime = fs.statSync(outPath).mtimeMs;
			if (outMtime >= srcMtime) {
				skipped.push(name);
				continue;
			}
		}
		try {
			await sharp(srcPath, { failOn: "none" })
				.resize({ width: THUMB_WIDTH, withoutEnlargement: true })
				.webp({ quality: 80 })
				.toFile(outPath);
			done++;
			total++;
		} catch (err) {
			console.warn(`[thumbs] FAIL ${album}/${name}: ${err.message}`);
		}
	}
	console.log(
		`[thumbs] ${album}: ${done} 生成, ${skipped.length} 复用, 共 ${files.length} 张`,
	);
}
console.log(`[thumbs] 完成, 本次新生成 ${total} 个缩略图`);