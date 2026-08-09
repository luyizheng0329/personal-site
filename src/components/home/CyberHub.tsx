// src/components/home/CyberHub.tsx
// 首页赛博朋克中枢 —— 粒子场 + 能量核心 + 五色模块节点 + 电流弧线

import { useState, useCallback, useRef, useEffect } from 'react';
import { ACTIVE_MODULES } from '../../lib/colors';

// ============================================================
// 常量
// ============================================================
const PARTICLE_COUNT = 800;          // 移动端减半

// ============================================================
// 工具：生成粒子初始数据
// ============================================================
function generateParticles(count: number) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    vx: (Math.random() - 0.5) * 0.0005,
    vy: (Math.random() - 0.5) * 0.0005,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.6 + 0.2,
  }));
}

// ============================================================
// 粒子场 Canvas
// ============================================================
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

        // 边界回弹
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

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// ============================================================
// 单个模块节点
// ============================================================
function ModuleNode({
  hex,
  label,
  path,
  angle,
  distance,
  onClick,
  isActive,
}: {
  hex: string;
  label: string;
  path: string;
  angle: number;
  distance: number;
  onClick: () => void;
  isActive: boolean;
}) {
  const cx = 50 + Math.cos(angle) * distance;
  const cy = 50 + Math.sin(angle) * distance;

  return (
    <a
      href={path}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="absolute transition-all duration-700 ease-out cursor-pointer"
      style={{
        left: `${cx}%`,
        top: `${cy}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* 外层光晕 */}
      <div
        className="absolute rounded-full transition-all duration-500"
        style={{
          width: isActive ? '120px' : '80px',
          height: isActive ? '120px' : '80px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${hex}33 0%, transparent 70%)`,
          opacity: isActive ? 0.8 : 0.3,
        }}
      />

      {/* 主体球体 */}
      <div
        className="relative w-16 h-16 rounded-full flex items-center justify-center
                   transition-all duration-500 hover:scale-110"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${hex}88, ${hex}22 60%, ${hex}08 100%)`,
          boxShadow: isActive
            ? `0 0 30px ${hex}, 0 0 60px ${hex}66, 0 0 100px ${hex}33`
            : `0 0 15px ${hex}44, 0 0 30px ${hex}22`,
        }}
      >
        {/* 内环 */}
        <div
          className="w-8 h-8 rounded-full border"
          style={{
            borderColor: `${hex}66`,
            animation: 'glow-pulse 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* 标签 */}
      <span
        className="absolute top-full mt-3 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap
                   transition-all duration-300"
        style={{
          color: hex,
          textShadow: isActive ? `0 0 10px ${hex}` : 'none',
          opacity: isActive ? 1 : 0.6,
        }}
      >
        {label}
      </span>
    </a>
  );
}

// ============================================================
// 电流弧线 SVG
// ============================================================
function ElectricArc({
  fromAngle,
  toAngle,
  distance,
  color,
  isVisible,
}: {
  fromAngle: number;
  toAngle: number;
  distance: number;
  color: string;
  isVisible: boolean;
}) {
  if (!isVisible) return null;

  const centerX = 50;
  const centerY = 50;

  const x1 = centerX + Math.cos(fromAngle) * distance;
  const y1 = centerY + Math.sin(fromAngle) * distance;
  const x2 = centerX + Math.cos(toAngle) * distance;
  const y2 = centerY + Math.sin(toAngle) * distance;

  // 贝塞尔曲线控制点（向外弯曲）
  const midAngle = (fromAngle + toAngle) / 2;
  const ctrlDist = distance * 0.3;
  const cx = centerX + Math.cos(midAngle) * ctrlDist;
  const cy = centerY + Math.sin(midAngle) * ctrlDist;

  const pathDef = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      viewBox="0 0 100 100"
    >
      <path
        d={pathDef}
        fill="none"
        stroke={color}
        strokeWidth="0.15"
        strokeDasharray="0.5 1"
        style={{
          filter: `drop-shadow(0 0 4px ${color})`,
          animation: 'electric-flicker 0.3s ease-in-out infinite',
        }}
      />
    </svg>
  );
}

// ============================================================
// 主组件
// ============================================================
export default function CyberHub() {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [clickedNode, setClickedNode] = useState<number | null>(null);

  const handleClick = useCallback((index: number) => {
    setClickedNode(index);
    // 电流动画后跳转
    setTimeout(() => {
      const mod = ACTIVE_MODULES[index];
      if (mod) {
        window.location.href = `/personal-site${mod.path}`;
      }
    }, 800);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0f]">
      {/* 粒子背景 */}
      <ParticleField />

      {/* 中央能量核心 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 2 }}>
        {/* 多层辉光 */}
        <div
          className="absolute rounded-full"
          style={{
            width: '200px',
            height: '200px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full animate-spin"
          style={{
            width: '100px',
            height: '100px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '50%',
            animationDuration: '20s',
          }}
        />
        {/* 核心球体 */}
        <div
          className="w-12 h-12 rounded-full relative"
          style={{
            background: 'radial-gradient(circle at 40% 40%, #ffffff22, #ffffff08 50%, transparent 100%)',
            boxShadow: '0 0 30px rgba(255,255,255,0.15), 0 0 60px rgba(255,255,255,0.05)',
          }}
        >
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background: 'radial-gradient(circle at 40% 40%, #ffffff44, transparent 70%)',
              animation: 'glow-pulse 3s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* 模块节点（围绕核心排列） */}
      <div className="absolute inset-0" style={{ zIndex: 3 }}>
        {ACTIVE_MODULES.map((mod, index) => {
          const angle = (index / ACTIVE_MODULES.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <ModuleNode
              key={mod.key}
              hex={mod.hex}
              label={mod.label}
              path={mod.path}
              angle={angle}
              distance={28}
              onClick={() => handleClick(index)}
              isActive={activeNode === index || clickedNode === index}
            />
          );
        })}

        {/* [预留] 第六个节点（恋爱模块） */}
        {/* <ModuleNode hex="#f783ac" label="恋爱日记" path="/love" angle={...} distance={28} ... /> */}
      </div>

      {/* 电流弧线（从核心到激活节点） */}
      <ElectricArc
        fromAngle={0}
        toAngle={clickedNode !== null ? (clickedNode / ACTIVE_MODULES.length) * Math.PI * 2 - Math.PI / 2 : 0}
        distance={28}
        color={clickedNode !== null ? ACTIVE_MODULES[clickedNode].hex : '#fff'}
        isVisible={clickedNode !== null}
      />

      {/* 标题 */}
      <div className="absolute bottom-12 w-full text-center" style={{ zIndex: 2 }}>
        <h2
          className="text-sm font-display tracking-[0.3em] uppercase"
          style={{ color: '#ffffff44' }}
        >
          Memory Nexus · 记忆中枢
        </h2>
        <p className="mt-2 text-xs" style={{ color: '#ffffff22' }}>
          点击光点，开启记忆
        </p>
      </div>

      {/* hover 监听（设置激活节点） */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        {ACTIVE_MODULES.map((mod, index) => {
          const angle = (index / ACTIVE_MODULES.length) * Math.PI * 2 - Math.PI / 2;
          const cx = 50 + Math.cos(angle) * 28;
          const cy = 50 + Math.sin(angle) * 28;
          return (
            <div
              key={mod.key}
              className="absolute w-20 h-20"
              style={{
                left: `${cx}%`,
                top: `${cy}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 4,
              }}
              onMouseEnter={() => setActiveNode(index)}
              onMouseLeave={() => setActiveNode(null)}
            />
          );
        })}
      </div>
    </div>
  );
}
