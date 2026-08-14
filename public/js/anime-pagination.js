// Anime page: data-driven rendering, filtering, sorting, pagination, URL state.
// Expects window.ANIME_DATA = { list, statusMap, labels, hasRightSidebars }.
// Works with Swup page transitions (astro:page-load).

(function () {
	"use strict";

	var PAGE_SIZE = 8;
	var container, paginationEl, filterTags, sortSelect;

	function data() {
		return window.ANIME_DATA || {
			list: [],
			statusMap: {},
			labels: {},
			hasRightSidebars: false,
		};
	}

	function readState() {
		var params = new URLSearchParams(window.location.search);
		return {
			filter: params.get("status") || "all",
			sort: params.get("sort") || "default",
			page: parseInt(params.get("page"), 10) || 1,
		};
	}

	var state = readState();

	function init() {
		container = document.getElementById("anime-list-container");
		if (!container) {
			return;
		}
		paginationEl = document.getElementById("anime-pagination");
		if (data().list.length === 0) {
			if (paginationEl) {
				paginationEl.style.display = "none";
			}
			return;
		}
		filterTags = Array.prototype.slice.call(
			document.querySelectorAll(".anime-filter-tag"),
		);
		sortSelect = document.querySelector("[data-anime-sort]");

		if (!container.dataset.animeBound) {
			bindEvents();
			container.dataset.animeBound = "true";
		}
		syncControls();
		render();
	}

	function bindEvents() {
		filterTags.forEach(function (tag) {
			tag.addEventListener("click", function () {
				if (tag.classList.contains("anime-active")) {
					return;
				}
				filterTags.forEach(function (t) {
					t.classList.remove("anime-active");
				});
				tag.classList.add("anime-active");
				state.filter = tag.getAttribute("data-status");
				state.page = 1;
				render();
			});
		});
		if (sortSelect) {
			sortSelect.addEventListener("change", function () {
				state.sort = sortSelect.value;
				state.page = 1;
				render();
			});
		}
	}

	function syncControls() {
		filterTags.forEach(function (tag) {
			tag.classList.toggle(
				"anime-active",
				tag.getAttribute("data-status") === state.filter,
			);
		});
		if (sortSelect) {
			sortSelect.value = state.sort;
		}
	}

	function getFiltered() {
		var list = data().list;
		if (state.filter === "all") {
			return list.slice();
		}
		return list.filter(function (item) {
			return item.status === state.filter;
		});
	}

	function getSorted(list) {
		var s = state.sort;
		if (s === "rating") {
			return list.slice().sort(function (a, b) {
				return (b.rating || 0) - (a.rating || 0);
			});
		}
		if (s === "progress") {
			return list.slice().sort(function (a, b) {
				var pa = a.totalEpisodes > 0 ? a.progress / a.totalEpisodes : 0;
				var pb = b.totalEpisodes > 0 ? b.progress / b.totalEpisodes : 0;
				return pb - pa;
			});
		}
		if (s === "year") {
			return list.slice().sort(function (a, b) {
				return String(b.year || "").localeCompare(String(a.year || ""));
			});
		}
		if (s === "title") {
			return list.slice().sort(function (a, b) {
				return String(a.title).localeCompare(String(b.title), "zh");
			});
		}
		return list;
	}

	function getTotalPages(list) {
		return Math.max(1, Math.ceil(list.length / PAGE_SIZE));
	}

	function render() {
		var list = getSorted(getFiltered());
		var tp = getTotalPages(list);
		if (state.page > tp) {
			state.page = tp;
		}
		if (state.page < 1) {
			state.page = 1;
		}
		var start = (state.page - 1) * PAGE_SIZE;
		container.innerHTML = list
			.slice(start, start + PAGE_SIZE)
			.map(cardHTML)
			.join("");
		renderPagination(tp);
		updateURL();
		applyLayout();
	}

	function cardHTML(item) {
		var info = data().statusMap[item.status] || {
			text: item.status,
			class: "btn-regular",
			icon: "?",
		};
		var labels = data().labels || {};
		var pct =
			item.totalEpisodes > 0
				? Math.round((item.progress / item.totalEpisodes) * 100)
				: 0;
		var progressHTML =
			item.status === "watching"
				? '<div class="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-2"><div class="w-full bg-white/20 rounded-full h-1.5 mb-1"><div class="bg-linear-to-r from-emerald-400 to-teal-400 h-1.5 rounded-full transition-all duration-300" style="width:' +
				  pct +
				  '%"></div></div><div class="text-white text-xs font-medium">' +
				  item.progress +
				  "/" +
				  item.totalEpisodes +
				  " (" +
				  pct +
				  "%)</div></div>"
				: "";
		var genres = (item.genre || [])
			.map(function (g) {
				return (
					'<span class="px-1.5 py-0.5 bg-(--btn-regular-bg) text-black/70 dark:text-white/70 rounded text-xs">' +
					g +
					"</span>"
				);
			})
			.join("");

		return (
			'<div class="group relative bg-(--card-bg) border border-(--line-divider) rounded-(--radius-large) overflow-hidden hover:shadow-lg" data-anime-status="' +
			item.status +
			'">' +
			'<div class="relative anime-cover-container aspect-2/3 overflow-hidden">' +
			'<a href="' +
			item.link +
			'" target="_blank" rel="noopener noreferrer" class="block w-full h-full">' +
			'<img src="' +
			item.cover +
			'" alt="' +
			item.title +
			'" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src=\'https://images.weserv.nl/?url=\'+encodeURIComponent(this.src);" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110" />' +
			'<div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"><div class="absolute inset-0 flex items-center justify-center"><div class="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center"><svg class="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg></div></div></div>' +
			"</a>" +
			'<div class="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium ' +
			info.class +
			'"><span class="mr-1">' +
			info.icon +
			"</span><span>" +
			info.text +
			"</span></div>" +
			'<div class="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"><svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><span>' +
			(item.rating || "") +
			"</span></div>" +
			progressHTML +
			"</div>" +
			'<div class="p-3">' +
			'<h3 class="text-sm font-bold text-black/90 dark:text-white/90 mb-1 leading-tight">' +
			item.title +
			"</h3>" +
			'<p class="text-black/60 dark:text-white/60 text-xs mb-2 line-clamp-2" title="' +
			(item.description || "") +
			'">' +
			(item.description || "") +
			"</p>" +
			'<div class="space-y-1 text-xs">' +
			'<div class="flex justify-between items-center"><span class="text-black/50 dark:text-white/50 shrink-0">' +
			(labels.year || "") +
			'</span><span class="text-black/70 dark:text-white/70 truncate ml-2 text-right">' +
			(item.year || "") +
			"</span></div>" +
			'<div class="flex justify-between items-start"><span class="text-black/50 dark:text-white/50 shrink-0 mt-0.5">' +
			(labels.studio || "") +
			'</span><span class="text-black/70 dark:text-white/70 text-right ml-2 line-clamp-2 wrap-break-word" title="' +
			(item.studio || "") +
			'">' +
			(item.studio || "") +
			"</span></div>" +
			'<div class="flex flex-wrap gap-1 mt-2">' +
			genres +
			"</div>" +
			"</div>" +
			"</div>" +
			"</div>"
		);
	}

	function buildPageList(cur, last) {
		var ADJ_DIST = 2;
		var VISIBLE = ADJ_DIST * 2 + 1;
		var HIDDEN = -1;
		var count = 1;
		var l = cur;
		var r = cur;
		while (0 < l - 1 && r + 1 <= last && count + 2 <= VISIBLE) {
			count += 2;
			l--;
			r++;
		}
		while (0 < l - 1 && count < VISIBLE) {
			count++;
			l--;
		}
		while (r + 1 <= last && count < VISIBLE) {
			count++;
			r++;
		}
		var pages = [];
		if (l > 1) {
			pages.push(1);
		}
		if (l === 3) {
			pages.push(2);
		}
		if (l > 3) {
			pages.push(HIDDEN);
		}
		for (var i = l; i <= r; i++) {
			pages.push(i);
		}
		if (r < last - 2) {
			pages.push(HIDDEN);
		}
		if (r === last - 2) {
			pages.push(last - 1);
		}
		if (r < last) {
			pages.push(last);
		}
		return pages;
	}

	function renderPagination(tp) {
		if (!paginationEl) {
			return;
		}
		var cur = state.page;
		var pages = buildPageList(cur, tp);
		var chevronLeft =
			'<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M14.71 6.71a.996.996 0 0 0-1.41 0L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59a.996.996 0 1 0 1.41-1.41L10.83 12l4.58-4.59c.39-.39.38-1.03-.01-1.41z"/></svg>';
		var chevronRight =
			'<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M9.29 6.71a.996.996 0 0 0 0 1.41L13.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z"/></svg>';
		var html = "";
		html +=
			'<button class="btn-card overflow-hidden rounded-lg text-(--primary) w-11 h-11 anime-page-btn" data-page="' +
			(cur - 1) +
			'" aria-label="上一页"' +
			(cur <= 1 ? " disabled" : "") +
			">" +
			chevronLeft +
			"</button>";
		html +=
			'<div class="bg-(--card-bg) flex flex-row rounded-lg items-center text-neutral-700 dark:text-neutral-300 font-bold">';
		pages.forEach(function (p) {
			if (p === -1) {
				html +=
					'<span class="mx-1"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg></span>';
			} else if (p === cur) {
				html +=
					'<span class="h-11 w-11 rounded-lg bg-(--primary) flex items-center justify-center font-bold text-white dark:text-black/70">' +
					p +
					"</span>";
			} else {
				html +=
					'<button class="btn-card w-11 h-11 rounded-lg overflow-hidden active:scale-[0.85] anime-page-btn" data-page="' +
					p +
					'" aria-label="第 ' +
					p +
					' 页">' +
					p +
					"</button>";
			}
		});
		html += "</div>";
		html +=
			'<button class="btn-card overflow-hidden rounded-lg text-(--primary) w-11 h-11 anime-page-btn" data-page="' +
			(cur + 1) +
			'" aria-label="下一页"' +
			(cur >= tp ? " disabled" : "") +
			">" +
			chevronRight +
			"</button>";
		paginationEl.innerHTML = html;
		paginationEl.querySelectorAll(".anime-page-btn").forEach(function (btn) {
			if (btn.hasAttribute("disabled")) {
				return;
			}
			btn.addEventListener("click", function () {
				var p = parseInt(btn.getAttribute("data-page"), 10);
				if (p >= 1 && p <= tp) {
					state.page = p;
					render();
					if (container) {
						container.scrollIntoView({ block: "start" });
					}
				}
			});
		});
	}

	function updateURL() {
		var params = new URLSearchParams(window.location.search);
		if (state.filter !== "all") {
			params.set("status", state.filter);
		} else {
			params.delete("status");
		}
		if (state.sort !== "default") {
			params.set("sort", state.sort);
		} else {
			params.delete("sort");
		}
		if (state.page > 1) {
			params.set("page", String(state.page));
		} else {
			params.delete("page");
		}
		var qs = params.toString();
		history.replaceState(
			null,
			"",
			window.location.pathname + (qs ? "?" + qs : ""),
		);
	}

	// --- grid / list layout switching ---

	function isPostListLayoutEnabled() {
		return (
			document.documentElement.getAttribute(
				"data-post-list-layout-enabled",
			) !== "false"
		);
	}

	function getLayout() {
		return (
			(isPostListLayoutEnabled()
				? localStorage.getItem("postListLayout")
				: null) || "list"
		);
	}

	function applyLayout() {
		var layout = getLayout();
		if (container) {
			container.dataset.currentLayout = layout;
			container.classList.toggle("anime-grid-mode", layout === "grid");
			container.classList.toggle("anime-list-mode", layout !== "grid");
			container.classList.toggle("grid-cols-1", layout !== "grid");
			container.classList.toggle("lg:grid-cols-2", layout !== "grid");
		}
		if (data().hasRightSidebars) {
			var rightSidebar = document.querySelector(
				".right-sidebar-container",
			);
			if (rightSidebar) {
				rightSidebar.style.display = layout === "grid" ? "none" : "";
				rightSidebar.classList.toggle(
					"hidden-in-grid-mode",
					layout === "grid",
				);
			}
		}
		var mainGrid = document.getElementById("main-grid");
		if (mainGrid) {
			mainGrid.style.gridTemplateColumns =
				layout === "grid" ? "17.5rem 1fr" : "";
			mainGrid.classList.toggle("two-column-layout", layout === "grid");
		}
	}

	window.addEventListener("layoutChange", function (event) {
		if (event.detail && event.detail.layout) {
			applyLayout();
		}
	});

	// --- init ---

	function onInit() {
		if (document.getElementById("anime-list-container")) {
			state = readState();
			init();
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", onInit);
	} else {
		onInit();
	}
	document.addEventListener("astro:page-load", onInit);
})();
