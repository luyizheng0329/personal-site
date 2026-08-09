// src/pages/rss.xml.ts
// RSS 订阅源 —— 聚合所有模块最新内容
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site: string }) {
  const [photos, study, travel, food, essays] = await Promise.all([
    getCollection('photos', ({ data }) => !data.draft),
    getCollection('study', ({ data }) => !data.draft),
    getCollection('travel', ({ data }) => !data.draft),
    getCollection('food', ({ data }) => !data.draft),
    getCollection('essays', ({ data }) => !data.draft),
  ]);

  const items = [
    ...photos.map((p) => ({
      title: `📷 ${p.data.title}`,
      description: p.data.description || '',
      link: `/photos/${p.id.replace('/index', '')}`,
      pubDate: p.data.date,
      category: '照片墙',
    })),
    ...study.map((s) => ({
      title: `📘 ${s.data.title}`,
      description: `${s.data.subject} · ${s.data.category}`,
      link: `/study/${s.id.replace('/index', '')}`,
      pubDate: s.data.date,
      category: '学习笔记',
    })),
    ...travel.map((t) => ({
      title: `🗺️ ${t.data.title}`,
      description: `${t.data.city}, ${t.data.country}`,
      link: `/travel/${t.id.replace('/index', '')}`,
      pubDate: t.data.date,
      category: '旅行日记',
    })),
    ...food.map((f) => ({
      title: `🍜 ${f.data.title}`,
      description: `${f.data.category}${f.data.rating ? ' ⭐' + f.data.rating : ''}`,
      link: `/food/${f.id.replace('/index', '')}`,
      pubDate: f.data.date,
      category: '美食日记',
    })),
    ...essays.map((e) => ({
      title: `✉️ ${e.data.title}`,
      description: `寄给 ${e.data.recipient}`,
      link: `/essays/${e.id.replace('/index', '')}`,
      pubDate: e.data.date,
      category: '随笔散记',
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'Luyiz · 记忆中枢',
    description: '个人记忆中枢——用电流连接每一个瞬间',
    site: context.site,
    items: items.map((item) => ({
      ...item,
      link: `/personal-site${item.link}`,
    })),
    customData: `<language>zh-CN</language>`,
  });
}
