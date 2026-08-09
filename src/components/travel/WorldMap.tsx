// src/components/travel/WorldMap.tsx
// 旅行世界地图 —— Leaflet 深色主题 + 紫色发光标记

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CityData {
  slug: string;
  title: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  date: string;
  cover: string;
}

// 紫色发光圆点 marker（Canvas 绘制）
function createGlowIcon() {
  const size = 16;
  const canvas = document.createElement('canvas');
  canvas.width = size * 3;
  canvas.height = size * 3;
  const ctx = canvas.getContext('2d')!;

  const cx = size * 1.5;
  const cy = size * 1.5;

  // 外层弥散光晕
  const outerGlow = ctx.createRadialGradient(cx, cy, size * 0.4, cx, cy, size * 1.5);
  outerGlow.addColorStop(0, 'rgba(204, 93, 232, 0.7)');
  outerGlow.addColorStop(0.4, 'rgba(204, 93, 232, 0.2)');
  outerGlow.addColorStop(1, 'rgba(204, 93, 232, 0)');

  ctx.beginPath();
  ctx.arc(cx, cy, size * 1.5, 0, Math.PI * 2);
  ctx.fillStyle = outerGlow;
  ctx.fill();

  // 内层亮核
  const innerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.4);
  innerGlow.addColorStop(0, '#fff');
  innerGlow.addColorStop(0.3, 'rgba(220, 180, 255, 1)');
  innerGlow.addColorStop(1, 'rgba(204, 93, 232, 0)');

  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = innerGlow;
  ctx.fill();

  return L.divIcon({
    className: 'travel-marker',
    html: `<img src="${canvas.toDataURL()}" style="width:${size * 3}px;height:${size * 3}px;transform:translate(-50%,-50%);" alt="">`,
    iconSize: [size * 3, size * 3],
    iconAnchor: [size * 1.5, size * 1.5],
  });
}

export default function WorldMap({ cities }: { cities: CityData[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapContainer.current || mapInstance.current) return;

    // 初始化地图（深色主题）
    const map = L.map(mapContainer.current, {
      center: [25, 20],
      zoom: 2.3,
      minZoom: 2,
      maxZoom: 12,
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: true,
    });

    // 深色瓦片底图
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
    }).addTo(map);

    // 灰色标记（未去过城市的淡化效果）
    // ... 留空，让已点亮城市突出显示

    mapInstance.current = map;

    // resize 处理
    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapInstance.current = null;
    };
  }, [mounted]);

  // 放置城市标记
  useEffect(() => {
    if (!mapInstance.current || !mounted) return;

    const glowIcon = createGlowIcon();

    cities.forEach((city) => {
      const marker = L.marker([city.lat, city.lng], { icon: glowIcon })
        .addTo(mapInstance.current!);

      // Popup 内容
      const popupHtml = `
        <div style="
          background: #1a1a2e;
          border: 1px solid rgba(204,93,232,0.3);
          border-radius: 12px;
          padding: 12px;
          color: #e0e0e0;
          font-family: system-ui, sans-serif;
          min-width: 180px;
        ">
          <img src="${city.cover}" alt="${city.title}"
            style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:8px;"
            onerror="this.style.display='none'"
          />
          <h3 style="margin:0 0 4px;font-size:14px;color:#cc5de8;">${city.city}, ${city.country}</h3>
          <p style="margin:0 0 6px;font-size:12px;color:#888;">${city.title}</p>
          <p style="margin:0 0 10px;font-size:11px;color:#555;">${city.date}</p>
          <a href="/personal-site/travel/${city.slug}"
            style="display:block;text-align:center;padding:6px;background:rgba(204,93,232,0.15);
                   color:#cc5de8;border-radius:6px;text-decoration:none;font-size:12px;
                   transition:all 0.2s;"
            onmouseover="this.style.background='rgba(204,93,232,0.3)'"
            onmouseout="this.style.background='rgba(204,93,232,0.15)'"
          >
            查看游记 →
          </a>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 240,
        className: 'travel-popup',
      });

      // Hover 脉动效果
      marker.on('mouseover', () => {
        const el = marker.getElement();
        if (el) el.style.filter = 'drop-shadow(0 0 8px #cc5de8) brightness(1.3)';
      });
      marker.on('mouseout', () => {
        const el = marker.getElement();
        if (el) el.style.filter = '';
      });
    });
  }, [cities, mounted]);

  if (!mounted) {
    return (
      <div
        ref={mapContainer}
        className="w-full rounded-xl flex items-center justify-center"
        style={{ height: '70vh', backgroundColor: 'var(--color-cyber-card)' }}
      >
        <p style={{ color: 'var(--color-text-muted)' }}>加载地图中...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .travel-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .travel-popup .leaflet-popup-tip {
          background: #1a1a2e !important;
        }
        .leaflet-container {
          background: #0a0a0f !important;
          border-radius: 16px;
        }
        .leaflet-control-zoom a {
          background: #1a1a2e !important;
          color: #cc5de8 !important;
          border-color: rgba(204,93,232,0.2) !important;
        }
      `}</style>
      <div
        ref={mapContainer}
        className="w-full rounded-2xl overflow-hidden border"
        style={{
          height: '70vh',
          borderColor: 'rgba(204,93,232,0.1)',
        }}
      />
    </>
  );
}
