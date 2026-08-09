// src/components/photos/PhotoFeed.tsx
// 照片墙主列表 —— Instagram 风格卡片流

import { useState, useCallback } from 'react';

interface PhotoEntry {
  id: string;
  title: string;
  date: string;
  cover: string;
  description?: string;
  location?: string;
  mood?: string;
  growthPhase: string;
  slug: string;
}

const moodEmoji: Record<string, string> = {
  '开心': '😊',
  '感动': '🥹',
  '平静': '😌',
  '兴奋': '🤩',
  '怀念': '🥲',
};

function PhotoCard({ entry, index }: { entry: PhotoEntry; index: number }) {
  const [isExiting, setIsExiting] = useState(false);
  const [exitOrigin, setExitOrigin] = useState({ x: 0, y: 0 });

  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setExitOrigin({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsExiting(true);

    // 动画结束后跳转
    setTimeout(() => {
      window.location.href = `/personal-site/photos/${entry.slug}`;
    }, 500);
  }, [entry.slug]);

  return (
    <article
      onClick={handleClick}
      className="relative rounded-xl overflow-hidden cursor-pointer group
                 transition-all duration-700 ease-out"
      style={{
        backgroundColor: 'var(--color-cyber-card)',
        border: '1px solid rgba(255, 107, 107, 0.08)',
        animationDelay: `${index * 80}ms`,
        // 吸入特效
        ...(isExiting && {
          clipPath: `circle(0% at ${exitOrigin.x}px ${exitOrigin.y}px)`,
          transform: 'scale(0.7) rotate(8deg)',
          opacity: 0.3,
        }),
      }}
    >
      {/* 封面图 */}
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={entry.cover}
          alt={entry.title}
          className="w-full h-full object-cover transition-transform duration-700
                     group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* 信息区 */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <time className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {entry.date}
          </time>
          {entry.mood && (
            <span className="text-sm" title={entry.mood}>
              {moodEmoji[entry.mood] || '📷'}
            </span>
          )}
        </div>
        <h3 className="font-medium text-sm mb-1 line-clamp-1">
          {entry.title}
        </h3>
        {entry.description && (
          <p className="text-xs line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
            {entry.description}
          </p>
        )}
        {entry.location && (
          <p className="text-xs mt-2" style={{ color: 'var(--color-photos)' }}>
            📍 {entry.location}
          </p>
        )}
      </div>

      {/* Hover 光晕 */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 40px rgba(255, 107, 107, 0.08)',
        }}
      />
    </article>
  );
}

export default function PhotoFeed({ entries }: { entries: PhotoEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-6xl mb-6">📷</p>
        <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
          还没有照片记录，去拍些照片吧。
        </p>
        <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
          在 <code className="px-1 rounded" style={{ background: '#ffffff10' }}>src/content/photos/</code> 下创建你的第一个照片组。
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid gap-5"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      }}
    >
      {entries.map((entry, i) => (
        <PhotoCard key={entry.id} entry={entry} index={i} />
      ))}
    </div>
  );
}
