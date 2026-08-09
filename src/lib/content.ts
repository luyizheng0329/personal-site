import { getCollection } from 'astro:content';
import { MODULE_COLORS, type ModuleKey } from './colors';

// ============================================================
// 按年份聚合所有模块内容（双向链接核心函数）
// ============================================================
export async function getContentByYear(year: string) {
  const [photos, study, travel, food, essays] = await Promise.all([
    getCollection('photos', ({ data }) => data.growthPhase === year && !data.draft),
    getCollection('study', ({ data }) => data.growthPhase === year && !data.draft),
    getCollection('travel', ({ data }) => data.growthPhase === year && !data.draft),
    getCollection('food', ({ data }) => data.growthPhase === year && !data.draft),
    getCollection('essays', ({ data }) => data.growthPhase === year && !data.draft),
    // [预留] getCollection('love', ({ data }) => data.growthPhase === year && !data.draft),
  ]);

  return [
    ...photos.map((p) => ({ ...p, module: 'photos' as ModuleKey, color: MODULE_COLORS.photos.hex })),
    ...study.map((s) => ({ ...s, module: 'study' as ModuleKey, color: MODULE_COLORS.study.hex })),
    ...travel.map((t) => ({ ...t, module: 'travel' as ModuleKey, color: MODULE_COLORS.travel.hex })),
    ...food.map((f) => ({ ...f, module: 'food' as ModuleKey, color: MODULE_COLORS.food.hex })),
    ...essays.map((e) => ({ ...e, module: 'essays' as ModuleKey, color: MODULE_COLORS.essays.hex })),
    // [预留] ...love.map((l) => ({ ...l, module: 'love' as ModuleKey, color: MODULE_COLORS.love.hex })),
  ].sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
}

// ============================================================
// 获取所有年份列表
// ============================================================
export async function getAllYears(): Promise<string[]> {
  const allCollections = await Promise.all([
    getCollection('photos'),
    getCollection('study'),
    getCollection('travel'),
    getCollection('food'),
    getCollection('essays'),
  ]);

  const years = new Set<string>();
  for (const collection of allCollections) {
    for (const entry of collection) {
      if (!entry.data.draft && entry.data.growthPhase) {
        years.add(entry.data.growthPhase);
      }
    }
  }

  return Array.from(years).sort();
}
