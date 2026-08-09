// ============================================================
// 全局色彩常量 —— 六大模块色 + 赛博朋克背景色
// ============================================================

export const MODULE_COLORS = {
  photos:  { hex: '#ff6b6b', name: '暖橙红', label: '照片墙' },
  study:   { hex: '#4dabf7', name: '冷静蓝', label: '学习笔记' },
  travel:  { hex: '#cc5de8', name: '浪漫紫', label: '旅行日记' },
  food:    { hex: '#ffd43b', name: '温暖金', label: '美食日记' },
  essays:  { hex: '#69db7c', name: '清新绿', label: '随笔散记' },
  love:    { hex: '#f783ac', name: '浪漫粉', label: '恋爱日记' },
} as const;

export type ModuleKey = keyof typeof MODULE_COLORS;

export const MODULES: Array<{ key: ModuleKey; hex: string; label: string; path: string; cssVar: string }> = [
  { key: 'photos',  ...MODULE_COLORS.photos,  path: '/photos',  cssVar: '--color-photos' },
  { key: 'study',   ...MODULE_COLORS.study,   path: '/study',   cssVar: '--color-study' },
  { key: 'travel',  ...MODULE_COLORS.travel,  path: '/travel',  cssVar: '--color-travel' },
  { key: 'food',    ...MODULE_COLORS.food,    path: '/food',    cssVar: '--color-food' },
  { key: 'essays',  ...MODULE_COLORS.essays,  path: '/essays',  cssVar: '--color-essays' },
  // { key: 'love', ...MODULE_COLORS.love, path: '/love', cssVar: '--color-love' }, // [预留]
];

// 活跃模块（当前启用的 5 个 + 1 预留）
export const ACTIVE_MODULES = MODULES.filter(m => m.key !== 'love');
// [预留] 恋爱模块上线后，替换为:
// export const ACTIVE_MODULES = MODULES;

export const COLOR_PALETTE = {
  bgDark:    '#0a0a0f',
  bgCard:    '#1a1a2e',
  bgDarker:  '#050508',
  glow:      'rgba(255, 255, 255, 0.08)',
  textPrimary:   '#e0e0e0',
  textSecondary: '#888',
  textMuted:     '#555',
} as const;
