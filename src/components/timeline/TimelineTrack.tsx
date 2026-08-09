// src/components/timeline/TimelineTrack.tsx
// 成长轨迹 v2 —— 多色电流交织，从左向右持续流动

import { useState, useRef, useEffect } from 'react';
import { MODULE_COLORS } from '../../lib/colors';

interface YearData {
  year: string;
  count: number;
  modules: { key: string; count: number; hex: string }[];
}

const CURRENTS = [
  { hex: MODULE_COLORS.photos.hex, amplitude: 0.8, frequency: 1.2, phase: 0 },
  { hex: MODULE_COLORS.study.hex, amplitude: 0.6, frequency: 1.5, phase: 1.2 },
  { hex: MODULE_COLORS.travel.hex, amplitude: 0.7, frequency: 1.0, phase: 2.5 },
  { hex: MODULE_COLORS.food.hex, amplitude: 0.5, frequency: 1.8, phase: 3.8 },
  { hex: MODULE_COLORS.essays.hex, amplitude: 0.75, frequency: 1.3, phase: 5.0 },
];

// ============================================================
// SVG 交织电流动画
// ============================================================
function IntertwinedCurrents() {
  return (
    <svg
      className="w-full h-32 overflow-visible"
      viewBox="0 0 1000 120"
      preserveAspectRatio="none"
    >
      <defs>
        {CURRENTS.map((c, i) => (
          <linearGradient key={i} id={`flowGrad${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={c.hex} stopOpacity="0" />
            <stop offset="15%" stopColor={c.hex} stopOpacity="0.6" />
            <stop offset="50%" stopColor={c.hex} stopOpacity="1" />
            <stop offset="85%" stopColor={c.hex} stopOpacity="0.6" />
            <stop offset="100%" stopColor={c.hex} stopOpacity="0" />
            <animate
              attributeName="x1" values="-100%;0%" dur={`${4 + i * 1.5}s`} repeatCount="indefinite"
            />
            <animate
              attributeName="x2" values="0%;100%" dur={`${4 + i * 1.5}s`} repeatCount="indefinite"
            />
          </linearGradient>
        ))}
        <filter id="currentGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景噪点线 */}
      {CURRENTS.map((c, i) => (
        <path
          key={`bg-${i}`}
          d={`M 0 ${60 + Math.sin(i * 1.5) * 25}
              C 200 ${60 - Math.cos(i) * 30}, 300 ${60 + Math.sin(i * 2) * 35},
                500 ${60 - Math.cos(i * 1.5) * 25}
              C 700 ${60 + Math.sin(i * 2.5) * 30}, 800 ${60 - Math.cos(i) * 20},
                1000 ${60 + Math.sin(i * 2) * 28}`}
          fill="none" stroke={c.hex} strokeWidth="1" opacity="0.08"
        />
      ))}

      {/* 交织电流主线 */}
      {CURRENTS.map((c, i) => {
        const pathDef = `
          M -20 ${60 + Math.sin(c.phase) * c.amplitude * 25}
          C 100 ${60 - Math.cos(c.phase) * c.amplitude * 30},
            250 ${60 + Math.sin(c.phase + 1.5) * c.amplitude * 35},
            350 ${60 - Math.cos(c.phase + 2) * c.amplitude * 28}
          C 450 ${60 + Math.sin(c.phase + 3) * c.amplitude * 32},
            600 ${60 - Math.cos(c.phase + 1) * c.amplitude * 25},
            750 ${60 + Math.sin(c.phase + 2.5) * c.amplitude * 30}
          C 850 ${60 - Math.cos(c.phase + 1.8) * c.amplitude * 28},
            950 ${60 + Math.sin(c.phase + 3.2) * c.amplitude * 22},
            1020 ${60 - Math.cos(c.phase + 4) * c.amplitude * 26}
        `;

        return (
          <g key={`current-${i}`}>
            {/* 辉光层 */}
            <path d={pathDef} fill="none" stroke={c.hex} strokeWidth="4" opacity="0.12"
              filter="url(#currentGlow)">
              <animate attributeName="stroke-dashoffset" from="2000" to="-2000"
                dur={`${6 + i * 2}s`} repeatCount="indefinite" />
            </path>
            {/* 主电流线 */}
            <path d={pathDef} fill="none" stroke={c.hex} strokeWidth="1.8" opacity="0.7"
              filter="url(#currentGlow)" />
            {/* 亮白芯线 */}
            <path d={pathDef} fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.5" />

            {/* 流动脉冲点 */}
            <circle r="3" fill="#fff" opacity="0.8" filter="url(#currentGlow)">
              <animateMotion dur={`${5 + i * 1.5}s`} repeatCount="indefinite"
                path={pathDef} />
            </circle>
            <circle r="2" fill={c.hex} opacity="0.9">
              <animateMotion dur={`${5 + i * 1.5}s`} repeatCount="indefinite"
                begin="0.5s" path={pathDef} />
            </circle>
            <circle r="2.5" fill={c.hex} opacity="0.7">
              <animateMotion dur={`${5 + i * 1.5}s`} repeatCount="indefinite"
                begin="1.5s" path={pathDef} />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================
// 主组件
// ============================================================
export default function TimelineTrack({ years }: { years: YearData[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && years.length > 1) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [years.length]);

  if (years.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-6xl mb-6">⚡</p>
        <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
          时间之河还在等待第一滴记忆。
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* 交织电流轨道 */}
      <div className="mb-6">
        <IntertwinedCurrents />
      </div>

      {/* 年份节点（横向滚动） */}
      <div
        ref={scrollRef}
        className="flex gap-10 px-[8%] overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4"
      >
        {years.map((year, i) => {
          const hex = CURRENTS[i % CURRENTS.length]!.hex;
          const isHovered = hoveredIdx === i;

          return (
            <a
              key={year.year}
              href={`/personal-site/timeline/${year.year}`}
              className="flex-shrink-0 snap-center group"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="relative flex flex-col items-center transition-all duration-500"
                   style={{ transform: isHovered ? 'translateY(-4px)' : 'none' }}>
                {/* 外层辉光环 */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500"
                  style={{
                    background: isHovered
                      ? `radial-gradient(circle, ${hex}33, transparent 65%)`
                      : 'transparent',
                    boxShadow: isHovered
                      ? `0 0 50px ${hex}33, 0 0 80px ${hex}15`
                      : 'none',
                  }}
                >
                  {/* 内环 */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center border-2
                               transition-all duration-500"
                    style={{
                      borderColor: isHovered ? hex : 'rgba(255,255,255,0.1)',
                      backgroundColor: isHovered ? `${hex}15` : 'transparent',
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    <span
                      className="font-display text-xs font-bold transition-all duration-500"
                      style={{
                        color: isHovered ? hex : 'rgba(255,255,255,0.25)',
                        textShadow: isHovered ? `0 0 10px ${hex}` : 'none',
                      }}
                    >
                      {year.year}
                    </span>
                  </div>
                </div>

                {/* 模块色点 */}
                <div className="flex gap-1 mt-2">
                  {year.modules.map((m) => (
                    <div
                      key={m.key}
                      className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: m.hex,
                        boxShadow: isHovered ? `0 0 5px ${m.hex}` : 'none',
                        opacity: isHovered ? 1 : 0.4,
                        transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>

                {/* 计数 */}
                <span
                  className="text-xs mt-1.5 transition-all duration-500"
                  style={{
                    color: isHovered ? 'var(--color-text-secondary)' : 'var(--color-text-muted)',
                    opacity: isHovered ? 1 : 0.4,
                  }}
                >
                  {year.count}
                </span>
              </div>
            </a>
          );
        })}
      </div>

      {/* 图例 */}
      <div className="flex justify-center gap-5 mt-6 flex-wrap">
        {CURRENTS.map((c, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.hex, boxShadow: `0 0 4px ${c.hex}` }} />
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {['照片','学习','旅行','美食','随笔'][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
