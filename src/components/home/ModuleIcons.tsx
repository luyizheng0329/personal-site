// src/components/home/ModuleIcons.tsx
// 五大模块的拟物 SVG 图标 —— 相机/台灯/炉灶/钢笔/吉普车

import React from 'react';

interface Props {
  color: string;
  isActive: boolean;
  size?: number;
}

// ============================================================
// 📷 相机 —— 照片墙
// ============================================================
export function CameraIcon({ color, isActive, size = 80 }: Props) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 80 60" fill="none">
      {/* 机身 */}
      <rect x="15" y="18" width="50" height="34" rx="6" stroke={color} strokeWidth="1.8" fill="none" />
      {/* 镜头外环 */}
      <circle cx="40" cy="35" r="11" stroke={color} strokeWidth="1.5" fill="none" />
      {/* 镜头内圈 */}
      <circle cx="40" cy="35" r="7" stroke={color} strokeWidth="1" fill="none"
        style={{ opacity: isActive ? 1 : 0.5, transition: 'opacity 0.5s' }} />
      {/* 镜片反光 */}
      <circle cx="37" cy="32" r="2.5" fill={color}
        style={{ opacity: isActive ? 0.6 : 0.2, transition: 'opacity 0.5s' }} />
      {/* 闪光灯 */}
      <rect x="29" y="8" width="22" height="10" rx="3" stroke={color} strokeWidth="1.5" fill="none" />
      {/* 闪光灯光效 */}
      {isActive && (
        <>
          <circle cx="40" cy="13" r="18" fill={color} opacity="0.15">
            <animate attributeName="r" from="14" to="20" dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.3" to="0" dur="1s" repeatCount="indefinite" />
          </circle>
          <rect x="25" y="4" width="30" height="18" rx="5" fill={color} opacity="0.08" />
        </>
      )}
      {/* 取景器 */}
      <rect x="56" y="23" width="6" height="5" rx="1" stroke={color} strokeWidth="0.8" fill="none" />
    </svg>
  );
}

// ============================================================
// 💡 台灯 —— 学习笔记
// ============================================================
export function LampIcon({ color, isActive, size = 80 }: Props) {
  return (
    <svg width={size * 0.55} height={size} viewBox="0 0 44 80" fill="none">
      {/* 底座 */}
      <ellipse cx="22" cy="72" rx="14" ry="3" stroke={color} strokeWidth="1.5" fill="none" />
      {/* 支架 */}
      <line x1="22" y1="70" x2="22" y2="45" stroke={color} strokeWidth="2" />
      <line x1="22" y1="45" x2="22" y2="30" stroke={color} strokeWidth="1.5"
        transform="rotate(-15, 22, 45)" />
      {/* 灯罩 */}
      <path d="M8 30 L22 12 L36 30 Z" stroke={color} strokeWidth="1.8" fill="none" />
      <path d="M10 30 L34 30" stroke={color} strokeWidth="1.5" fill="none" />
      {/* 灯泡 */}
      <circle cx="22" cy="34" r="5" stroke={color} strokeWidth="1.5" fill="none" />
      {/* 灯泡发光 */}
      <circle cx="22" cy="34" r="6" fill={color}
        style={{ opacity: isActive ? 0.4 : 0.08, transition: 'opacity 0.5s' }} />
      {isActive && (
        <circle cx="22" cy="34" r="20" fill={color} opacity="0.06">
          <animate attributeName="r" from="16" to="24" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.1" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}

// ============================================================
// 🔥 炉灶 —— 美食日记
// ============================================================
export function StoveIcon({ color, isActive, size = 80 }: Props) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 80 56" fill="none">
      {/* 灶台 */}
      <rect x="5" y="18" width="70" height="30" rx="5" stroke={color} strokeWidth="1.8" fill="none" />
      {/* 左灶眼 */}
      <circle cx="25" cy="33" r="8" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="25" cy="33" r="4" stroke={color} strokeWidth="1" fill="none" />
      {/* 右灶眼 */}
      <circle cx="55" cy="33" r="8" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="55" cy="33" r="4" stroke={color} strokeWidth="1" fill="none" />
      {/* 炉火 */}
      {isActive ? (
        <>
          <path d="M21 41 Q25 28 25 33 Q25 28 29 41" fill={color} opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.4;0.7" dur="0.3s" repeatCount="indefinite" />
          </path>
          <path d="M51 41 Q55 30 55 33 Q55 28 59 41" fill={color} opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.3;0.6" dur="0.4s" repeatCount="indefinite" />
          </path>
          <path d="M22 41 Q24 32 25 33 Q26 30 28 41" fill="#ff8c00" opacity="0.5">
            <animate attributeName="opacity" values="0.5;0.2;0.5" dur="0.25s" repeatCount="indefinite" />
          </path>
          <circle cx="25" cy="30" r="14" fill={color} opacity="0.08">
            <animate attributeName="r" from="12" to="18" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </>
      ) : (
        <>
          <path d="M21 41 Q25 35 25 33 Q25 35 29 41" fill={color} opacity="0.12" />
          <path d="M51 41 Q55 36 55 33 Q55 36 59 41" fill={color} opacity="0.1" />
        </>
      )}
      {/* 开关 */}
      <circle cx="12" cy="26" r="2" fill={isActive ? color : 'none'} stroke={color} strokeWidth="0.8" />
      <circle cx="68" cy="26" r="2" fill={isActive ? color : 'none'} stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

// ============================================================
// ✒️ 钢笔 —— 随笔散记
// ============================================================
export function PenIcon({ color, isActive, size = 80 }: Props) {
  return (
    <svg width={size * 0.3} height={size} viewBox="0 0 24 80" fill="none">
      {/* 笔身 */}
      <rect x="8" y="18" width="8" height="42" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
      {/* 笔尖 */}
      <path d="M8 60 L12 76 L16 60" stroke={color} strokeWidth="1.5" fill="none" />
      {/* 笔尖发光点 */}
      <circle cx="12" cy="72" r="2.5" fill={color}
        style={{ opacity: isActive ? 1 : 0.2, transition: 'opacity 0.5s' }} />
      {isActive && (
        <circle cx="12" cy="72" r="10" fill={color} opacity="0.15">
          <animate attributeName="r" from="8" to="14" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.2" to="0" dur="1.2s" repeatCount="indefinite" />
        </circle>
      )}
      {/* 笔夹 */}
      <line x1="12" y1="18" x2="12" y2="10" stroke={color} strokeWidth="1.5" />
      <rect x="7" y="7" width="10" height="5" rx="2" stroke={color} strokeWidth="1.2" fill="none" />
      {/* 墨水滴 */}
      <circle cx="12" cy="78" r="1.5" fill={color} opacity="0.3" />
    </svg>
  );
}

// ============================================================
// 🚙 吉普车 —— 旅行日记
// ============================================================
export function JeepIcon({ color, isActive, size = 80 }: Props) {
  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 80 44" fill="none">
      {/* 车身 */}
      <path d="M8 20 L15 8 L50 8 L55 12 L68 12 L72 20 L72 30 L8 30 Z" stroke={color} strokeWidth="1.8" fill="none" />
      {/* 车窗 */}
      <path d="M18 14 L30 14 L28 22 L18 22 Z" stroke={color} strokeWidth="1.2" fill="none" />
      <path d="M34 14 L46 14 L48 22 L32 22 L34 14 Z" stroke={color} strokeWidth="1.2" fill="none" />
      {/* 前轮 */}
      <circle cx="22" cy="33" r="7" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="22" cy="33" r="3" stroke={color} strokeWidth="0.8" fill="none" />
      {/* 后轮 */}
      <circle cx="60" cy="33" r="7" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="60" cy="33" r="3" stroke={color} strokeWidth="0.8" fill="none" />
      {/* 车灯 */}
      <rect x="68" y="16" width="5" height="5" rx="1.5" stroke={color} strokeWidth="1.2"
        fill={isActive ? color : 'none'}
        style={{ opacity: isActive ? 0.8 : 0.2, transition: 'all 0.5s' }} />
      {isActive && (
        <>
          <circle cx="70.5" cy="18.5" r="12" fill={color} opacity="0.12">
            <animate attributeName="r" from="10" to="16" dur="1s" repeatCount="indefinite" />
          </circle>
          {/* 车灯光束 */}
          <polygon points="73,16 95,10 95,27 73,21" fill={color} opacity="0.06">
            <animate attributeName="opacity" values="0.06;0.12;0.06" dur="2s" repeatCount="indefinite" />
          </polygon>
        </>
      )}
      {/* 备胎 */}
      <circle cx="45" cy="12" r="3.5" stroke={color} strokeWidth="0.8" fill="none" />
      {/* 保险杠 */}
      <line x1="5" y1="24" x2="5" y2="32" stroke={color} strokeWidth="2" />
      <line x1="73" y1="24" x2="73" y2="30" stroke={color} strokeWidth="2" />
    </svg>
  );
}

// ============================================================
// 图标映射
// ============================================================
export const MODULE_ICONS: Record<string, React.FC<{ color: string; isActive: boolean; size?: number }>> = {
  photos: CameraIcon,
  study: LampIcon,
  travel: JeepIcon,
  food: StoveIcon,
  essays: PenIcon,
  love: PenIcon, // 预留
};
