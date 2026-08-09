// src/components/study/StudyList.tsx
// 学习笔记列表 —— 蓝光 · 知识库，三 Tab 丝滑切换

import { useState, useCallback } from 'react';

interface StudyEntry {
  id: string;
  title: string;
  date: string;
  category: 'courseware' | 'outline' | 'problem';
  subject: string;
  tags: string[];
  growthPhase: string;
  slug: string;
  hasFile: boolean;
}

const TABS = [
  { key: 'all' as const, label: '全部', icon: '📚' },
  { key: 'courseware' as const, label: '课件', icon: '📖' },
  { key: 'outline' as const, label: '提纲', icon: '🗂️' },
  { key: 'problem' as const, label: '题目', icon: '✏️' },
];

const categoryStyle: Record<string, { bg: string; label: string }> = {
  courseware: { bg: 'rgba(77,171,247,0.12)', label: '课件' },
  outline: { bg: 'rgba(77,171,247,0.12)', label: '提纲' },
  problem: { bg: 'rgba(77,171,247,0.12)', label: '题目' },
};

export default function StudyList({ entries }: { entries: StudyEntry[] }) {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filtered = activeTab === 'all'
    ? entries
    : entries.filter((e) => e.category === activeTab);

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key);
  }, []);

  return (
    <div>
      {/* Tab 栏 */}
      <nav className="flex justify-center gap-2 mb-10 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
              flex items-center gap-2 hover:scale-105`}
            style={{
              color: activeTab === tab.key ? '#fff' : 'var(--color-text-muted)',
              backgroundColor: activeTab === tab.key
                ? 'rgba(77,171,247,0.2)'
                : 'rgba(255,255,255,0.03)',
              border: activeTab === tab.key
                ? '1px solid rgba(77,171,247,0.3)'
                : '1px solid rgba(255,255,255,0.05)',
              boxShadow: activeTab === tab.key
                ? '0 0 20px rgba(77,171,247,0.15)'
                : 'none',
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.key !== 'all' && (
              <span className="text-xs opacity-50 ml-1">
                ({entries.filter((e) => e.category === tab.key).length})
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* 内容列表 */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            这个分类下还没有内容
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry, i) => (
            <a
              key={entry.id}
              href={`/personal-site/study/${entry.slug}`}
              className="block group"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <article
                className="flex items-center gap-5 p-5 rounded-xl transition-all duration-300
                           group-hover:translate-x-2 group-hover:scale-[1.01]"
                style={{
                  backgroundColor: 'var(--color-cyber-card)',
                  border: '1px solid rgba(77,171,247,0.06)',
                }}
              >
                {/* 左侧图标 */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: 'rgba(77,171,247,0.08)' }}
                >
                  {TABS.find((t) => t.key === entry.category)?.icon || '📄'}
                </div>

                {/* 中间信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        color: 'var(--color-study)',
                        backgroundColor: 'rgba(77,171,247,0.1)',
                      }}
                    >
                      {categoryStyle[entry.category]?.label || entry.category}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {entry.subject}
                    </span>
                    {entry.hasFile && (
                      <span className="text-xs" title="可下载">
                        📎
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-sm truncate">{entry.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {entry.date}
                    </span>
                    {entry.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 右侧箭头 */}
                <div
                  className="flex-shrink-0 text-lg transition-transform duration-300
                             group-hover:translate-x-1"
                  style={{ color: 'var(--color-study)' }}
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
