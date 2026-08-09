// src/components/home/CyberHub.tsx
// 首页赛博朋克中枢 v3 —— 拟物大图标 + 电流中心爆发 + 强闪光 + 音效

import { useState, useCallback, useRef, useEffect } from 'react';
import { ACTIVE_MODULES } from '../../lib/colors';
import { MODULE_ICONS } from './ModuleIcons';
import { playElectricZap, playElectricHum } from './ElectricSound';

// ============================================================
// 粒子场
// ============================================================
const PARTICLE_COUNT = 500;

function generateParticles(count: number) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    vx: (Math.random() - 0.5) * 0.0004,
    vy: (Math.random() - 0.5) * 0.0004,
    size: Math.random() * 1.2 + 0.3,
    opacity: Math.random() * 0.4 + 0.1,
  }));
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef(generateParticles(PARTICLE_COUNT));
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = particlesRef.current;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (Math.abs(p.x) > 1) p.vx *= -1;
        if (Math.abs(p.y) > 1) p.vy *= -1;
        const sx = (p.x * 0.5 + 0.5) * canvas.width;
        const sy = (p.y * 0.5 + 0.5) * canvas.height;
        ctx.beginPath();
        ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

// ============================================================
// 闪电从中心劈向目标节点
// ============================================================
function LightningBolt({
  color,
  targetAngle,
  targetDist,
  isVisible,
}: {
  color: string;
  targetAngle: number;
  targetDist: number;
  isVisible: boolean;
}) {
  const [boltKey, setBoltKey] = useState(0);
  const pathDRef = useRef('');

  // 每次 isVisible 变成 true 时重新生成路径
  useEffect(() => {
    if (!isVisible) return;

    const segments = 8;
    const points: [number, number][] = [[50, 50]];
    const endX = 50 + Math.cos(targetAngle) * targetDist;
    const endY = 50 + Math.sin(targetAngle) * targetDist;

    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const baseX = 50 + (endX - 50) * t;
      const baseY = 50 + (endY - 50) * t;
      const jitter = (1 - Math.abs(t - 0.5) * 2) * 8;
      const perpAngle = targetAngle + Math.PI / 2;
      const offset = (Math.random() - 0.5) * jitter * 2;
      points.push([baseX + Math.cos(perpAngle) * offset, baseY + Math.sin(perpAngle) * offset]);
    }
    points.push([endX, endY]);

    let d = `M ${points[0]![0]} ${points[0]![1]}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]!;
      const curr = points[i]!;
      const cpx = (prev[0] + curr[0]) / 2 + (Math.random() - 0.5) * 3;
      const cpy = (prev[1] + curr[1]) / 2 + (Math.random() - 0.5) * 3;
      d += ` Q ${cpx} ${cpy} ${curr[0]} ${curr[1]}`;
    }
    pathDRef.current = d;
    setBoltKey((k) => k + 1);
  }, [isVisible, targetAngle, targetDist]);

  if (!isVisible) return null;

  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 6 }} viewBox="0 0 100 100" key={boltKey}>
      <defs>
        <filter id="boltGlow">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id="boltGlowWide">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* 中心爆发闪光 */}
      <circle cx="50" cy="50" r="5" fill="#fff" opacity="0.9">
        <animate attributeName="r" from="3" to="12" dur="0.3s" fill="freeze" />
        <animate attributeName="opacity" from="0.9" to="0" dur="0.3s" fill="freeze" />
      </circle>
      <circle cx="50" cy="50" r="8" fill={color} opacity="0.5" filter="url(#boltGlowWide)">
        <animate attributeName="r" from="5" to="18" dur="0.4s" fill="freeze" />
        <animate attributeName="opacity" from="0.5" to="0" dur="0.4s" fill="freeze" />
      </circle>

      {/* 目标节点闪光 */}
      <circle
        cx={50 + Math.cos(targetAngle) * targetDist}
        cy={50 + Math.sin(targetAngle) * targetDist}
        r="6" fill="#fff" opacity="0">
        <animate attributeName="opacity" values="0;0.9;0" dur="0.5s" begin="0.15s" fill="freeze" />
        <animate attributeName="r" values="3;12;3" dur="0.5s" begin="0.15s" fill="freeze" />
      </circle>

      {/* 主轴闪电：粗辉光 */}
      <path d={pathDRef.current} fill="none" stroke={color} strokeWidth="2.5" opacity="0.3"
        filter="url(#boltGlowWide)" />
      {/* 主轴闪电：中辉光 */}
      <path d={pathDRef.current} fill="none" stroke={color} strokeWidth="1.5" opacity="0.5"
        filter="url(#boltGlow)" />
      {/* 主轴闪电：白芯 */}
      <path d={pathDRef.current} fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.95" />
      {/* 主轴闪电：彩光 */}
      <path d={pathDRef.current} fill="none" stroke={color} strokeWidth="1.2" opacity="0.8" />

      {/* 分支闪电 */}
      {[0.35, 0.55, 0.7].map((t, i) => {
        const bx = 50 + (50 + Math.cos(targetAngle) * targetDist - 50) * t;
        const by = 50 + (50 + Math.sin(targetAngle) * targetDist - 50) * t;
        const branchAngle = targetAngle + (i % 2 === 0 ? 0.6 : -0.5);
        const branchLen = 7 + i * 3;
        const ex = bx + Math.cos(branchAngle) * branchLen;
        const ey = by + Math.sin(branchAngle) * branchLen;
        const d = `M ${bx} ${by} Q ${(bx + ex) / 2} ${(by + ey) / 2} ${ex} ${ey}`;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke={color} strokeWidth="0.7" opacity="0.2"
              filter="url(#boltGlow)" />
            <path d={d} fill="none" stroke="#fff" strokeWidth="0.3" opacity="0.5" />
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================
// 单个拟物模块节点
// ============================================================
function ModuleNode({
  modKey,
  hex,
  label,
  path,
  angle,
  distance,
  onActivate,
  isActive,
}: {
  modKey: string;
  hex: string;
  label: string;
  path: string;
  angle: number;
  distance: number;
  onActivate: () => void;
  isActive: boolean;
}) {
  const Icon = MODULE_ICONS[modKey] || MODULE_ICONS.photos!;
  const cx = 50 + Math.cos(angle) * distance;
  const cy = 50 + Math.sin(angle) * distance;
  const [hovered, setHovered] = useState(false);
  const lit = isActive || hovered;

  return (
    <div
      className="absolute transition-all duration-300 ease-out cursor-pointer"
      style={{
        left: `${cx}%`,
        top: `${cy}%`,
        transform: `translate(-50%, -50%) ${isActive ? 'scale(1.2)' : hovered ? 'scale(1.08)' : 'scale(1)'}`,
        zIndex: isActive ? 10 : hovered ? 5 : 3,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!isActive) onActivate();
      }}
    >
      {/* 基座强闪光（激活时） */}
      {isActive && (
        <div
          className="absolute rounded-full"
          style={{
            width: '160px', height: '160px',
            left: '50%', top: '45%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, ${hex}66 0%, ${hex}22 30%, transparent 60%)`,
            animation: 'flash-burst 0.6s ease-out forwards',
          }}
        />
      )}

      {/* 常驻光晕 */}
      <div
        className="absolute rounded-full transition-all duration-300"
        style={{
          width: lit ? '140px' : '90px',
          height: lit ? '140px' : '90px',
          left: '50%', top: '45%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${hex}${lit ? '44' : '15'} 0%, transparent 65%)`,
          opacity: lit ? 1 : 0.4,
        }}
      />

      {/* 图标容器 */}
      <div
        className="relative flex items-center justify-center transition-transform duration-300"
        style={{
          width: 130,
          height: 110,
          transform: lit ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        <Icon color={hex} isActive={lit} size={lit ? 130 : 110} />
      </div>

      {/* 标签 */}
      <span
        className="absolute top-full mt-1 left-1/2 -translate-x-1/2 text-sm font-bold whitespace-nowrap
                   transition-all duration-300 font-display tracking-widest"
        style={{
          color: lit ? '#fff' : hex,
          textShadow: lit ? `0 0 20px ${hex}, 0 0 40px ${hex}, 0 0 60px ${hex}` : 'none',
          opacity: lit ? 1 : 0.55,
          fontSize: lit ? '1rem' : '0.8rem',
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ============================================================
// 核心：旋转能量环
// ============================================================
function EnergyCore({ isFiring, boltColor }: { isFiring: boolean; boltColor?: string }) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ zIndex: 2 }}>
      {/* 外层旋转光环 */}
      <div
        className="absolute rounded-full animate-spin"
        style={{
          width: '160px', height: '160px',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          border: '1.5px solid rgba(255,255,255,0.05)',
          animationDuration: '25s',
        }}
      />
      <div
        className="absolute rounded-full animate-spin"
        style={{
          width: '220px', height: '220px',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          border: '1px solid rgba(255,255,255,0.03)',
          animationDuration: '35s',
          animationDirection: 'reverse',
        }}
      />

      {/* 发射态外扩光晕 */}
      <div
        className="absolute rounded-full transition-all duration-300"
        style={{
          width: isFiring ? '300px' : '160px',
          height: isFiring ? '300px' : '160px',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          background: isFiring && boltColor
            ? `radial-gradient(circle, ${boltColor}22 0%, ${boltColor}08 30%, transparent 60%)`
            : 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)',
        }}
      />

      {/* 核心球 */}
      <div
        className="w-10 h-10 rounded-full relative transition-all duration-300"
        style={{
          background: `radial-gradient(circle at 35% 35%,
            ${isFiring ? '#ffffff88' : '#ffffff22'},
            #ffffff08 50%, transparent 100%)`,
          boxShadow: isFiring
            ? `0 0 60px ${boltColor || '#fff'}88, 0 0 120px ${boltColor || '#fff'}44`
            : '0 0 20px rgba(255,255,255,0.1)',
        }}
      >
        <div
          className="absolute inset-2 rounded-full transition-all duration-300"
          style={{
            background: `radial-gradient(circle at 40% 40%,
              ${isFiring ? '#ffffffcc' : '#ffffff33'}, transparent 70%)`,
          }}
        />
      </div>
    </div>
  );
}

// ============================================================
// 主组件
// ============================================================
export default function CyberHub() {
  const [firingNode, setFiringNode] = useState<number | null>(null);
  const [showBolt, setShowBolt] = useState(false);
  const firingRef = useRef(false);
  const boltTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // 浏览器 bfcache 回退时强制重置
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        // 从 bfcache 恢复，强制重设状态
        firingRef.current = false;
        setFiringNode(null);
        setShowBolt(false);
        if (boltTimeoutRef.current) clearTimeout(boltTimeoutRef.current);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      if (boltTimeoutRef.current) clearTimeout(boltTimeoutRef.current);
    };
  }, []);

  // 每次挂载时确保状态干净
  useEffect(() => {
    firingRef.current = false;
    setFiringNode(null);
    setShowBolt(false);
  }, []);

  const handleActivate = useCallback((index: number) => {
    if (firingRef.current) return;
    firingRef.current = true;

    setFiringNode(index);
    setShowBolt(true);

    // 音效
    playElectricZap(0.12);
    setTimeout(() => playElectricHum(0.5, 0.05), 60);

    boltTimeoutRef.current = setTimeout(() => {
      const mod = ACTIVE_MODULES[index];
      if (mod) {
        window.location.href = `/personal-site${mod.path}`;
      }
      // 如果跳转失败，恢复可点击状态
      firingRef.current = false;
      setFiringNode(null);
      setShowBolt(false);
    }, 1000);
  }, []);

  // 点击空白处微闪电
  const handleBgClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-module-node]')) return;
    playElectricZap(0.03);
  }, []);

  const activeColor = firingNode !== null ? ACTIVE_MODULES[firingNode]!.hex : undefined;

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-[#0a0a0f] select-none"
      onClick={handleBgClick}
    >
      <ParticleField />
      <EnergyCore isFiring={firingNode !== null} boltColor={activeColor} />

      {/* 模块节点 */}
      <div className="absolute inset-0" style={{ zIndex: 3 }}>
        {ACTIVE_MODULES.map((mod, index) => {
          const angle = (index / ACTIVE_MODULES.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <div key={mod.key} data-module-node>
              <ModuleNode
                modKey={mod.key}
                hex={mod.hex}
                label={mod.label}
                path={mod.path}
                angle={angle}
                distance={30}
                onActivate={() => handleActivate(index)}
                isActive={firingNode === index}
              />
            </div>
          );
        })}
      </div>

      {/* 闪电电弧 */}
      <LightningBolt
        color={activeColor || '#fff'}
        targetAngle={firingNode !== null
          ? (firingNode / ACTIVE_MODULES.length) * Math.PI * 2 - Math.PI / 2
          : 0}
        targetDist={30}
        isVisible={showBolt}
      />

      {/* 底部标题 */}
      <div className="absolute bottom-8 w-full text-center pointer-events-none" style={{ zIndex: 2 }}>
        <h2 className="text-xs font-display tracking-[0.5em] uppercase" style={{ color: '#ffffff22' }}>
          Memory Nexus
        </h2>
      </div>

      {/* 动画定义 */}
      <style>{`
        @keyframes flash-burst {
          0%   { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
          50%  { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
          100% { opacity: 0;   transform: translate(-50%, -50%) scale(1.5); }
        }
      `}</style>
    </div>
  );
}
