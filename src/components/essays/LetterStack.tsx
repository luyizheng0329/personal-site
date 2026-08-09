// src/components/essays/LetterStack.tsx
// 随笔散记 —— 时光信笺，信封堆叠 + 展开动效

import { useState, useCallback } from 'react';

interface EssayEntry {
  id: string;
  title: string;
  date: string;
  recipient: string;
  tags: string[];
  growthPhase: string;
  slug: string;
  mood?: string;
}

const moodColors: Record<string, string> = {
  '期待': '#69db7c',
  '感恩': '#69db7c',
  '怀念': '#69db7c',
  '平静': '#69db7c',
};

export default function LetterStack({ entries }: { entries: EssayEntry[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [exitingId, setExitingId] = useState<string | null>(null);

  const handleClick = useCallback((id: string, slug: string) => {
    if (expandedId === id) {
      // 如果要关闭已展开的，直接跳转
      window.location.href = `/personal-site/essays/${slug}`;
      return;
    }
    // 先关闭之前的，再展开新的
    if (expandedId) {
      setExitingId(expandedId);
      setExpandedId(null);
      setTimeout(() => {
        setExitingId(null);
        setExpandedId(id);
      }, 400);
    } else {
      setExpandedId(id);
    }
  }, [expandedId]);

  const handleReadMore = useCallback((slug: string) => {
    window.location.href = `/personal-site/essays/${slug}`;
  }, []);

  if (entries.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-6xl mb-6">✉️</p>
        <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
          还没有写过的信，给自己或某人写一封吧。
        </p>
      </div>
    );
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* 信纸背景 */}
      <div
        className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg,
              rgba(105,219,124,0.03) 0%,
              rgba(105,219,124,0.06) 50%,
              rgba(105,219,124,0.03) 100%
            )
          `,
        }}
      />

      {/* 信封列表 */}
      <div className="relative space-y-4">
        {entries.map((entry, i) => {
          const isExpanded = expandedId === entry.id;
          const isExiting = exitingId === entry.id;

          return (
            <div
              key={entry.id}
              className={`relative transition-all duration-500 ease-out
                ${isExiting ? 'opacity-0 scale-95 -translate-y-4' : ''}
              `}
              style={{
                zIndex: isExpanded ? 10 : entries.length - i,
                transform: `rotate(${(i - Math.floor(entries.length / 2)) * 0.8}deg)`,
              }}
            >
              {/* 信封 */}
              <div
                onClick={() => handleClick(entry.id, entry.slug)}
                className={`relative cursor-pointer transition-all duration-500 ease-out
                  ${isExpanded
                    ? 'scale-105 -translate-y-2'
                    : 'hover:scale-[1.02] hover:-translate-y-1'
                  }`}
                style={{
                  backgroundColor: isExpanded
                    ? 'rgba(105,219,124,0.06)'
                    : 'var(--color-cyber-card)',
                  border: isExpanded
                    ? '1px solid rgba(105,219,124,0.2)'
                    : '1px solid rgba(105,219,124,0.06)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                {/* 信封封口三角形（装饰） */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-500"
                  style={{
                    width: '0',
                    height: '0',
                    borderLeft: '20px solid transparent',
                    borderRight: '20px solid transparent',
                    borderTop: isExpanded
                      ? '16px solid rgba(105,219,124,0.1)'
                      : '16px solid rgba(105,219,124,0.04)',
                    opacity: isExpanded ? 0 : 1,
                  }}
                />

                {/* 信封主体内容（折叠状态） */}
                <div
                  className={`p-5 flex items-center gap-4 transition-all duration-500
                    ${isExpanded ? 'opacity-0 h-0 p-0 overflow-hidden' : ''}`}
                >
                  {/* 邮票风格日期 */}
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center
                               text-center leading-tight"
                    style={{
                      backgroundColor: 'rgba(105,219,124,0.06)',
                      border: '1px dashed rgba(105,219,124,0.15)',
                    }}
                  >
                    <span className="text-xs font-bold" style={{ color: 'var(--color-essays)' }}>
                      {entry.date.split('年')[0]}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                      {entry.date.split('年')[1]?.replace('月', '.').replace('日', '')}
                    </span>
                  </div>

                  {/* 信封文字 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          color: 'var(--color-essays)',
                          backgroundColor: 'rgba(105,219,124,0.08)',
                        }}
                      >
                        寄给 {entry.recipient}
                      </span>
                      {entry.mood && (
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          {entry.mood}
                        </span>
                      )}
                    </div>
                    <h3
                      className="font-medium text-sm truncate"
                      style={{ fontFamily: 'var(--font-letter)' }}
                    >
                      {entry.title}
                    </h3>
                  </div>

                  {/* 邮票装饰 */}
                  <div
                    className="flex-shrink-0 w-8 h-10 rounded-sm flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: 'rgba(105,219,124,0.04)',
                      border: '1px solid rgba(105,219,124,0.1)',
                    }}
                  >
                    ✉️
                  </div>
                </div>

                {/* 展开预览（点击后） */}
                <div
                  className={`transition-all duration-500 ease-out overflow-hidden
                    ${isExpanded ? 'max-h-48 p-5 opacity-100' : 'max-h-0 p-0 opacity-0'}`}
                >
                  <p
                    className="text-sm leading-relaxed line-clamp-4 mb-4"
                    style={{
                      fontFamily: 'var(--font-letter)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    点击下方按钮阅读全文。
                  </p>

                  {/* 操作按钮 */}
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReadMore(entry.slug);
                      }}
                      className="px-5 py-2 rounded-full text-xs font-medium
                                 transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: 'rgba(105,219,124,0.12)',
                        color: 'var(--color-essays)',
                        border: '1px solid rgba(105,219,124,0.2)',
                      }}
                    >
                      展开阅读 →
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(null);
                      }}
                      className="px-4 py-2 rounded-full text-xs transition-all duration-300"
                      style={{
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      收起
                    </button>
                  </div>
                </div>
              </div>

              {/* 信纸飞出效果（展开时） */}
              {isExpanded && (
                <div
                  className="absolute -bottom-2 left-4 right-4 h-2 rounded-b-lg opacity-20"
                  style={{
                    backgroundColor: 'var(--color-essays)',
                    filter: 'blur(4px)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 底部提示 */}
      <p className="text-center text-xs mt-12" style={{ color: 'var(--color-text-muted)' }}>
        每一封信，都是一段时光的切片。
      </p>
    </div>
  );
}
