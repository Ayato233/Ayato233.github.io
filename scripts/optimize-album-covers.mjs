// 将相册 cover.webp/cover.jpg 优化为小尺寸封面（覆盖写，避免 rm+rename 的文件锁问题）。
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ALBUM_ROOT = path.resolve(process.cwd(), "public/images/albums");
const COVER_WIDTH = 640;

const albums = fs
	.readdirSync(ALBUM_ROOT, { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	.map((entry) => entry.name);

let total = 0;
for (const album of albums) {
	const albumDir = path.join(ALBUM_ROOT, album);
	for (const name of ["cover.webp", "cover.jpg"]) {
		const coverPath = path.join(albumDir, name);
		if (!fs.existsSync(coverPath)) continue;
		const stat = fs.statSync(coverPath);
		if (stat.size < 300 * 1024) {
			console.log(`[cover] ${album}/${name}: 已小 (${(stat.size / 1024).toFixed(0)}KB), 跳过`);
			continue;
		}
		const beforeKB = (stat.size / 1024).toFixed(0);
		const out = path.join(albumDir, name + ".optimized");
		if (name.endsWith(".jpg")) {
			await sharp(coverPath, { failOn: "none" })
				.resize({ width: COVER_WIDTH, withoutEnlargement: true })
				.jpeg({ quality: 80 })
				.toFile(out);
		} else {
			await sharp(coverPath, { failOn: "none" })
				.resize({ width: COVER_WIDTH, withoutEnlargement: true })
				.webp({ quality: 82 })
				.toFile(out);
		}
		// 覆盖写原路径
		const data = fs.readFileSync(out);
		fs.writeFileSync(coverPath, data);
		fs.rmSync(out, { force: true });
		const afterKB = (fs.statSync(coverPath).size / 1024).toFixed(0);
		console.log(`[cover] ${album}/${name}: ${beforeKB}KB → ${afterKB}KB`);
		total++;
	}
}
console.log(`[cover] 完成, 优化 ${total} 个封面`);