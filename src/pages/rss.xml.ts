import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../data/site';

export async function GET(context) {
	const posts = (await getCollection('posts')).sort(
		(a, b) => b.data.date.getTime() - a.data.date.getTime(),
	);
	return rss({
		title: site.name,
		description: site.signature,
		site: context.site,
		items: posts.map((p) => ({
			title: p.data.title,
			pubDate: p.data.date,
			description: p.data.summary,
			link: `/posts/${p.id}/`,
		})),
	});
}