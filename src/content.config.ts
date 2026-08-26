import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		cover: z.string().optional(),
		category: z.string().default('文章'),
		tags: z.array(z.string()).default([]),
		summary: z.string().default(''),
	}),
});

const records = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/records' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		cover: z.string().optional(),
	}),
});

const albums = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/albums' }),
	schema: z.object({
		title: z.string(),
		date: z.string(),
		cover: z.string(),
		photos: z.array(
			z.object({
				src: z.string(),
				caption: z.string().optional(),
			}),
		),
	}),
});

export const collections = { posts, records, albums };