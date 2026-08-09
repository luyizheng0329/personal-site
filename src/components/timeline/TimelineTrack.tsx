// src/components/timeline/TimelineTrack.tsx
// 成长轨迹主页面 —— 彩色电流时间之河

import { useState, useRef, useEffect, useCallback } from 'react';
import { MODULE_COLORS } from '../../lib/colors';

interface YearData {
  year: string;
  count: number;
  modules: { key: string; count: number; hex: string }[];
}

const COLORS = [
  MODULE_COLORS.photos.hex,
  MODULE_COLORS.study.hex,
  MODULE_COLORS.travel.hex,
  MODULE_COLORS.food.hex,
  MODULE_COLORS.essays.hex,
];

function ElectricCurrentSVG({ activeIndex }: { activeIndex: number }) {
  return (
    <svg
      className="absolute inset-0 pointer-events-none overflow-visible"
      viewBox="0 0 1000 120"
      preserveAspectRatio="none"
      style={{ zIndex: 0 }}
    >
      <defs>
        {/* 五色电流渐变 */}
        <linearGradient id="currentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          {COLORS.map((color, i) => (
            <>
              <stop
                key={`${i}-start`}
                offset={`${(i / COLORS.length) * 100}%`}
                stopColor={color}
                stopOpacity="0.8"
              />
              <stop
                key={`${i}-mid`}
                offset={`${((i + 0.5) / COLORS.length) * 100}%`}
                stopColor={color}
                stopOpacity="1"
              />
              <stop
                key={`${i}-end`}
                offset={`${((i + 1) / COLORS.length) * 100}%`}
                stopColor={COLORS[(i + 1) % COLORS.length]}
                stopOpacity="0.8"
              />
            </>
          ))}
        </linearGradient>

        {/* 辉光滤镜 */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 主电流轨道 */}
      <path
        d="M 0 60 Q 200 30, 400 60 T 800 60 T 1000 60"
        fill="none"
        stroke="url(#currentGradient)"
        strokeWidth="3"
        filter="url(#glow)"
        strokeDasharray="8 4"
        className="animate-pulse"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="24"
          to="0"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>

      {/* 第二层轨道（更宽的辉光） */}
      <path
        d="M 0 60 Q 200 30, 400 60 T 800 60 T 1000 60"
        fill="none"
        stroke="url(#currentGradient)"
        strokeWidth="8"
        opacity="0.2"
        filter="url(#glow)"
      />
    </svg>
  );
}

export default function TimelineTrack({ years }: { years: YearData[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新年份
  useEffect(() => {
    if (scrollRef.current && years.length > 0) {
      const el = scrollRef.current;
      el.scrollLeft = el.scrollWidth;
    }
  }, [years.length]);

  if (years.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-6xl mb-6">⚡</p>
        <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
          时间之河还在等待第一滴记忆。
        </p>
        <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
          去其他模块添加一些内容吧，它们会自动汇聚到这里。
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* SVG 电流轨道 */}
      <div className="relative h-24 mb-8">
        <ElectricCurrentSVG activeIndex={activeIndex ?? -1} />

        {/* 年份节点（定位在 SVG 轨道上） */}
        <div
          ref={scrollRef}
          className="absolute inset-0 flex items-center gap-16 px-[20%] overflow-x-auto
                     scrollbar-hide snap-x snap-mandatory"
          style={{ zIndex: 1 }}
        >
          {years.map((year, i) => (
            <a
              key={year.year}
              href={`/personal-site/timeline/${year.year}`}
              className="flex-shrink-0 snap-center group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setActiveIndex(i)}
            >
              {/* 年份节点圆环 */}
              <div className="relative flex flex-col items-center">
                {/* 外层辉光环 */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center
                             transition-all duration-500"
                  style={{
                    background: hoveredIndex === i || activeIndex === i
                      ? `radial-gradient(circle, ${COLORS[i % COLORS.length]}22, transparent 70%)`
                      : 'transparent',
                    boxShadow: hoveredIndex === i || activeIndex === i
                      ? `0 0 40px ${COLORS[i % COLORS.length]}44, 0 0 80px ${COLORS[i % COLORS.length]}22`
                      : 'none',
                  }}
                >
                  {/* 内环 */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center
                               transition-all duration-500 border-2"
                    style={{
                      borderColor: hoveredIndex === i || activeIndex === i
                        ? COLORS[i % COLORS.length]
                        : 'rgba(255,255,255,0.1)',
                      backgroundColor: hoveredIndex === i || activeIndex === i
                        ? `${COLORS[i % COLORS.length]}18`
                        : 'transparent',
                      transform: hoveredIndex === i ? 'scale(1.15)' : 'scale(1)',
                    }}
                  >
                    <span
                      className="font-display text-sm font-bold transition-all duration-500"
                      style={{
                        color: hoveredIndex === i || activeIndex === i
                          ? COLORS[i % COLORS.length]
                          : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {year.year}
                    </span>
                  </div>
                </div>

                {/* 年份下方模块指示条 */}
                <div className="flex gap-1 mt-3">
                  {year.modules.map((mod) => (
                    <div
                      key={mod.key}
                      className="w-2 h-2 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: mod.hex,
                        boxShadow: hoveredIndex === i
                          ? `0 0 6px ${mod.hex}`
                          : 'none',
                        opacity: hoveredIndex === i ? 1 : 0.5,
                      }}
                      title={`${mod.key}: ${mod.count}`}
                    />
                  ))}
                </div>

                {/* 内容计数 */}
                <span
                  className="text-xs mt-2 transition-all duration-500"
                  style={{
                    color: hoveredIndex === i || activeIndex === i
                      ? 'var(--color-text-secondary)'
                      : 'var(--color-text-muted)',
                    opacity: hoveredIndex === i ? 1 : 0.5,
                  }}
                >
                  {year.count} 条记忆
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 图例 */}
      <div className="flex justify-center gap-4 mt-6 flex-wrap">
        {[
          { key: 'photos', hex: MODULE_COLORS.photos.hex, label: '照片' },
          { key: 'study', hex: MODULE_COLORS.study.hex, label: '学习' },
          { key: 'travel', hex: MODULE_COLORS.travel.hex, label: '旅行' },
          { key: 'food', hex: MODULE_COLORS.food.hex, label: '美食' },
          { key: 'essays', hex: MODULE_COLORS.essays.hex, label: '随笔' },
        ].map((item) => (
          <div key={item.key} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.hex, boxShadow: `0 0 4px ${item.hex}` }}
            />
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
