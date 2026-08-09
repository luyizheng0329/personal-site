// src/components/home/CyberHub.tsx
// 首页赛博朋克中枢 v2 —— 拟物图标 + 电流爆发 + 音效

import { useState, useCallback, useRef, useEffect } from 'react';
import { ACTIVE_MODULES } from '../../lib/colors';
import { MODULE_ICONS } from './ModuleIcons';
import { playElectricZap, playElectricHum } from './ElectricSound';

// ============================================================
// 粒子场（保留，微调）
// ============================================================
const PARTICLE_COUNT = 600;

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
// 闪电式电流 —— 从核心劈向目标
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
  const boltRef = useRef<SVGPathElement>(null);

  // 生成锯齿状闪电路径
  const generateBoltPath = useCallback(() => {
    const segments = 6;
    const points: [number, number][] = [[50, 50]]; // 从中心开始
    const endX = 50 + Math.cos(targetAngle) * targetDist;
    const endY = 50 + Math.sin(targetAngle) * targetDist;

    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const baseX = 50 + (endX - 50) * t;
      const baseY = 50 + (endY - 50) * t;
      // 随机偏移
      const jitter = (1 - Math.abs(t - 0.5) * 2) * 6; // 中间偏移最大
      const perpAngle = targetAngle + Math.PI / 2;
      const offset = (Math.random() - 0.5) * jitter * 2;
      points.push([baseX + Math.cos(perpAngle) * offset, baseY + Math.sin(perpAngle) * offset]);
    }
    points.push([endX, endY]);

    // 平滑连接
    let d = `M ${points[0]![0]} ${points[0]![1]}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]!;
      const curr = points[i]!;
      const cpx = (prev[0] + curr[0]) / 2 + (Math.random() - 0.5) * 1;
      const cpy = (prev[1] + curr[1]) / 2 + (Math.random() - 0.5) * 1;
      d += ` Q ${cpx} ${cpy} ${curr[0]} ${curr[1]}`;
    }
    return d;
  }, [targetAngle, targetDist]);

  const [pathD, setPathD] = useState('');
  const [branches, setBranches] = useState<string[]>([]);

  useEffect(() => {
    if (!isVisible) {
      setPathD('');
      setBranches([]);
      return;
    }

    const main = generateBoltPath();
    setPathD(main);

    // 生成分支闪电
    const branchCount = 3;
    const bs: string[] = [];
    for (let i = 0; i < branchCount; i++) {
      const t = 0.3 + Math.random() * 0.4;
      const bx = 50 + (50 + Math.cos(targetAngle) * targetDist - 50) * t;
      const by = 50 + (50 + Math.sin(targetAngle) * targetDist - 50) * t;
      const branchAngle = targetAngle + (Math.random() - 0.5) * 1.2;
      const branchLen = 5 + Math.random() * 8;
      const ex = bx + Math.cos(branchAngle) * branchLen;
      const ey = by + Math.sin(branchAngle) * branchLen;
      bs.push(`M ${bx} ${by} Q ${(bx + ex) / 2 + (Math.random() - 0.5) * 2} ${(by + ey) / 2 + (Math.random() - 0.5) * 2} ${ex} ${ey}`);
    }
    setBranches(bs);
  }, [isVisible, targetAngle, targetDist, generateBoltPath]);

  if (!isVisible) return null;

  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }} viewBox="0 0 100 100">
      {/* 主轴闪电 —— 三层：粗辉光 + 细白光 + 彩光 */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.8" opacity="0.25"
        filter="url(#boltGlow)" />
      <path d={pathD} fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.9" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1" opacity="0.7" />
      {/* 分支 */}
      {branches.map((b, i) => (
        <g key={i}>
          <path d={b} fill="none" stroke={color} strokeWidth="0.6" opacity="0.2"
            filter="url(#boltGlow)" />
          <path d={b} fill="none" stroke={color} strokeWidth="0.3" opacity="0.5" />
        </g>
      ))}
      <defs>
        <filter id="boltGlow">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>
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

  return (
    <div
      className="absolute transition-all duration-700 ease-out cursor-pointer"
      style={{
        left: `${cx}%`,
        top: `${cy}%`,
        transform: `translate(-50%, -50%) ${isActive ? 'scale(1.15)' : hovered ? 'scale(1.05)' : 'scale(1)'}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        e.preventDefault();
        onActivate();
      }}
    >
      {/* 基座光晕 */}
      <div
        className="absolute rounded-full transition-all duration-500"
        style={{
          width: '100px',
          height: '100px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${hex}22 0%, transparent 65%)`,
          opacity: isActive ? 0.9 : hovered ? 0.5 : 0.15,
        }}
      />

      {/* SVG 图标 */}
      <div className="relative flex items-center justify-center" style={{ width: 100, height: 80 }}>
        <Icon color={hex} isActive={isActive || hovered} size={90} />
      </div>

      {/* 标签 */}
      <span
        className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap
                   transition-all duration-300 font-display tracking-wider"
        style={{
          color: hex,
          textShadow: isActive ? `0 0 12px ${hex}` : hovered ? `0 0 6px ${hex}` : 'none',
          opacity: isActive || hovered ? 1 : 0.5,
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
function EnergyCore({ isFiring }: { isFiring: boolean }) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 2 }}>
      {/* 外层旋转光环 */}
      <div
        className="absolute rounded-full animate-spin"
        style={{
          width: '140px', height: '140px',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          border: '1px solid rgba(255,255,255,0.06)',
          animationDuration: '25s',
        }}
      />
      <div
        className="absolute rounded-full animate-spin"
        style={{
          width: '200px', height: '200px',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          border: '1px solid rgba(255,255,255,0.03)',
          animationDuration: '35s',
          animationDirection: 'reverse',
        }}
      />

      {/* 散逸光晕 */}
      <div
        className="absolute rounded-full"
        style={{
          width: isFiring ? '280px' : '180px',
          height: isFiring ? '280px' : '180px',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 60%)',
          transition: 'all 0.5s ease-out',
        }}
      />

      {/* 核心球 */}
      <div
        className="w-10 h-10 rounded-full relative"
        style={{
          background: `radial-gradient(circle at 35% 35%,
            ${isFiring ? '#ffffff55' : '#ffffff22'},
            #ffffff08 50%, transparent 100%)`,
          boxShadow: isFiring
            ? '0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(255,255,255,0.1)'
            : '0 0 20px rgba(255,255,255,0.1)',
          transition: 'all 0.5s ease-out',
        }}
      >
        <div
          className="absolute inset-2 rounded-full"
          style={{
            background: `radial-gradient(circle at 40% 40%,
              ${isFiring ? '#ffffff88' : '#ffffff33'}, transparent 70%)`,
            transition: 'all 0.3s',
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
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [firingNode, setFiringNode] = useState<number | null>(null);
  const [showBolt, setShowBolt] = useState(false);
  const boltTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleActivate = useCallback((index: number) => {
    if (firingNode !== null) return; // 防止连点

    setFiringNode(index);
    setShowBolt(true);

    // 音效
    playElectricZap(0.1);
    setTimeout(() => playElectricHum(0.4, 0.04), 80);

    // 跳转
    boltTimeoutRef.current = setTimeout(() => {
      const mod = ACTIVE_MODULES[index];
      if (mod) {
        window.location.href = `/personal-site${mod.path}`;
      }
    }, 900);
  }, [firingNode]);

  // 清理
  useEffect(() => {
    return () => {
      if (boltTimeoutRef.current) clearTimeout(boltTimeoutRef.current);
    };
  }, []);

  // 点击任意处触发随机微闪电（氛围）
  const handleBgClick = useCallback((e: React.MouseEvent) => {
    // 只在点击空白区域时
    if ((e.target as HTMLElement).closest('[data-module-node]')) return;
    playElectricZap(0.03);
  }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-[#0a0a0f]"
      onClick={handleBgClick}
    >
      <ParticleField />
      <EnergyCore isFiring={firingNode !== null} />

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
        color={firingNode !== null ? ACTIVE_MODULES[firingNode]!.hex : '#fff'}
        targetAngle={firingNode !== null
          ? (firingNode / ACTIVE_MODULES.length) * Math.PI * 2 - Math.PI / 2
          : 0}
        targetDist={30}
        isVisible={showBolt}
      />

      {/* 底部标题 */}
      <div className="absolute bottom-10 w-full text-center" style={{ zIndex: 2 }}>
        <h2 className="text-xs font-display tracking-[0.4em] uppercase" style={{ color: '#ffffff33' }}>
          Memory Nexus
        </h2>
      </div>
    </div>
  );
}
