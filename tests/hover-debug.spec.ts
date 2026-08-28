import { test } from "@playwright/test";

test.use({ channel: "msedge" });

test("排查 hover 失效原因", async ({ page }) => {
	test.setTimeout(60000);
	await page.goto("http://localhost:4321/albums/", {
		waitUntil: "networkidle",
	});
	await page.waitForTimeout(1500);

	// 1. 收集所有包含 sheet-back 的 CSS 规则
	const cssRules = await page.evaluate(() => {
		const out = [];
		for (const sheet of document.styleSheets) {
			try {
				for (const rule of sheet.cssRules) {
					const text = rule.cssText || "";
					if (text.includes("sheet-back") || text.includes("album-hover")) {
						out.push(text.slice(0, 160));
					}
				}
			} catch {}
		}
		return out;
	});
	console.log("=== 相纸相关 CSS 规则 ===");
	cssRules.forEach((r) => console.log(r));
});