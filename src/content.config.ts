import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ============================================================
// 所有内容共有的字段
// ============================================================
const commonFields = {
  title: z.string(),
  date: z.coerce.date(),
  growthPhase: z.string(),       // 年份时间戳，如 "2026"、"2027"
  tags: z.array(z.string()).optional().default([]),
  draft: z.boolean().default(false),
};

// ============================================================
// 照片墙 —— 暖橙光
// ============================================================
const photosCollection = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/photos' }),
  schema: z.object({
    ...commonFields,
    cover: z.string(),
    description: z.string().optional(),
    location: z.string().optional(),
    mood: z.enum(['开心', '感动', '平静', '兴奋', '怀念']).optional(),
  }),
});

// ============================================================
// 学习笔记 —— 蓝光
// ============================================================
const studyCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/study' }),
  schema: z.object({
    ...commonFields,
    category: z.enum(['courseware', 'outline', 'problem']),
    subject: z.string(),
    file: z.string().optional(),
    format: z.enum(['pdf', 'md', 'pptx', 'zip', 'docx', 'py', 'ipynb', 'txt', 'xlsx', 'other']).optional(),
    source: z.string().optional(),
  }),
});

// ============================================================
// 旅行日记 —— 紫色浪漫
// ============================================================
const travelCollection = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/travel' }),
  schema: z.object({
    ...commonFields,
    city: z.string(),
    country: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    cover: z.string(),
    duration: z.string().optional(),
    hasVideo: z.boolean().default(false),
  }),
});

// ============================================================
// 美食日记 —— 金光
// ============================================================
const foodCollection = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/food' }),
  schema: z.object({
    ...commonFields,
    category: z.string(),
    restaurant: z.string().optional(),
    homemade: z.boolean().default(false),
    rating: z.number().min(1).max(5).optional(),
    cover: z.string(),
    city: z.string().optional(),
  }),
});

// ============================================================
// 随笔散记 —— 绿意
// ============================================================
const essaysCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/essays' }),
  schema: z.object({
    ...commonFields,
    recipient: z.string(),
    mood: z.string().optional(),
    cover: z.string().optional(),
  }),
});

// ============================================================
// [预留] 恋爱日记 —— 粉色
// 启用方式：取消注释 + 在 collections 中注册
// ============================================================
// const loveCollection = defineCollection({
//   loader: glob({ pattern: '**/index.md', base: './src/content/love' }),
//   schema: z.object({
//     ...commonFields,
//     cover: z.string(),
//     milestone: z.string(),
//     location: z.string().optional(),
//     mood: z.string().optional(),
//   }),
// });

export const collections = {
  photos: photosCollection,
  study: studyCollection,
  travel: travelCollection,
  food: foodCollection,
  essays: essaysCollection,
  // love: loveCollection,  // [预留] 取消注释即启用恋爱模块
};
