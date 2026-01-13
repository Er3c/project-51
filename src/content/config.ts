import { defineCollection, z } from 'astro:content';

const intelCollection = defineCollection({
    type: 'content', // v2.5.0+ content collections
    schema: z.object({
        title: z.string(),
        description: z.string(),
        publishDate: z.date(),
        author: z.string().default('The 51st State Committee'),
        tags: z.array(z.string()).optional(),
        image: z.string().optional(),
    }),
});

export const collections = {
    'intel': intelCollection,
};
