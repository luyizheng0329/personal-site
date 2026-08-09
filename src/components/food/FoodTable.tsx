// src/components/food/FoodTable.tsx
// 美食日记 —— 大餐桌背景 + 浮动分类卡片

import { useState, useCallback } from 'react';

interface FoodEntry {
  id: string;
  title: string;
  date: string;
  category: string;
  restaurant?: string;
  homemade: boolean;
  rating?: number;
  tags: string[];
  growthPhase: string;
  slug: string;
}

interface FoodCategory {
  name: string;
  icon: string;
  count: number;
  entries: FoodEntry[];
}

export default function FoodTable({ categories, entries }: {
  categories: FoodCategory[];
  entries: FoodEntry[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSelect = useCallback((name: string) => {
    setSelectedCategory((prev) => (prev === name ? null : name));
  }, []);

  const filteredEntries = selectedCategory
    ? entries.filter((e) => e.category === selectedCategory)
    : entries;

  return (
    <div>
      {/* 餐桌背景 + 分类卡片 */}
      <div
        className="relative rounded-2xl overflow-hidden mb-10 p-8 md:p-12"
        style={{
          background: `
            radial-gradient(ellipse at 50% 40%, rgba(255,212,59,0.06) 0%, transparent 70%),
            linear-gradient(180deg, #1a1a0a 0%, #0f0f08 100%)
          `,
          border: '1px solid rgba(255,212,59,0.1)',
        }}
      >
        {/* 装饰木纹纹理 */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255,212,59,0.1) 2px,
              rgba(255,212,59,0.1) 4px
            )`,
          }}
        />

        {/* 标题 */}
        <h2 className="text-center text-sm font-medium tracking-widest mb-8 relative z-10"
          style={{ color: 'var(--color-text-muted)' }}>
          🍽️ 选一道菜吧
        </h2>

        {/* 分类卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10">
          {categories.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => handleSelect(cat.name)}
              className={`relative p-5 rounded-xl text-center transition-all duration-500 cursor-pointer
                hover:scale-105 hover:-translate-y-1`}
              style={{
                backgroundColor: selectedCategory === cat.name
                  ? 'rgba(255,212,59,0.12)'
                  : 'rgba(255,255,255,0.03)',
                border: selectedCategory === cat.name
                  ? '1px solid rgba(255,212,59,0.3)'
                  : '1px solid rgba(255,255,255,0.05)',
                boxShadow: selectedCategory === cat.name
                  ? '0 0 30px rgba(255,212,59,0.1)'
                  : 'none',
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div
                className="text-sm font-medium"
                style={{
                  color: selectedCategory === cat.name
                    ? 'var(--color-food)'
                    : 'var(--color-text-secondary)',
                }}
              >
                {cat.name}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                {cat.count} 道
              </div>

              {/* 选中指示光点 */}
              {selectedCategory === cat.name && (
                <div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: 'var(--color-food)',
                    boxShadow: '0 0 10px var(--color-food)',
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 美食列表 */}
      {selectedCategory && (
        <p className="text-center text-xs mb-6" style={{ color: 'var(--color-text-muted)' }}>
          正在查看 <span style={{ color: 'var(--color-food)' }}>{selectedCategory}</span>
          · 共 {filteredEntries.length} 道
          <button
            onClick={() => setSelectedCategory(null)}
            className="ml-2 hover:underline"
            style={{ color: 'var(--color-food)' }}
          >
            显示全部
          </button>
        </p>
      )}

      {filteredEntries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🍽️</p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            还没有美食记录，快去吃点好的吧。
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry, i) => (
            <a
              key={entry.id}
              href={`/personal-site/food/${entry.slug}`}
              className="block group"
            >
              <article
                className="flex items-center gap-5 p-5 rounded-xl transition-all duration-300
                           group-hover:translate-x-2 group-hover:bg-white/[0.03]"
                style={{
                  backgroundColor: 'var(--color-cyber-card)',
                  border: '1px solid rgba(255,212,59,0.06)',
                }}
              >
                {/* 分类图标 */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: 'rgba(255,212,59,0.08)' }}
                >
                  {categories.find((c) => c.name === entry.category)?.icon || '🍴'}
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        color: 'var(--color-food)',
                        backgroundColor: 'rgba(255,212,59,0.1)',
                      }}
                    >
                      {entry.category}
                    </span>
                    {entry.rating && (
                      <span className="text-xs" style={{ color: 'var(--color-food)' }}>
                        {'⭐'.repeat(entry.rating)}
                      </span>
                    )}
                    {entry.homemade && (
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        👨‍🍳 自制
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-sm truncate">{entry.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {entry.date}
                    </span>
                    {entry.restaurant && (
                      <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        📍 {entry.restaurant}
                      </span>
                    )}
                  </div>
                </div>

                {/* 箭头 */}
                <div
                  className="flex-shrink-0 text-lg transition-transform duration-300
                             group-hover:translate-x-1"
                  style={{ color: 'var(--color-food)' }}
                >
                  →
                </div>
              </article>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
