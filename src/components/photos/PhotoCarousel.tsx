// src/components/photos/PhotoCarousel.tsx
// 照片组详情页 —— 大图轮播

import { useState, useCallback, useEffect } from 'react';

interface Props {
  images: string[];
  title: string;
}

export default function PhotoCarousel({ images, title }: Props) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isAnimating || index === current) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 400);
  }, [current, isAnimating]);

  const prev = useCallback(() => {
    goTo(current === 0 ? images.length - 1 : current - 1);
  }, [current, images.length, goTo]);

  const next = useCallback(() => {
    goTo(current === images.length - 1 ? 0 : current + 1);
  }, [current, images.length, goTo]);

  // 键盘左右切换
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prev, next]);

  if (images.length === 0) {
    return (
      <div
        className="aspect-[16/10] rounded-xl flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-cyber-card)' }}
      >
        <p style={{ color: 'var(--color-text-muted)' }}>暂无照片</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 主图区域 */}
      <div
        className="relative aspect-[16/10] rounded-xl overflow-hidden"
        style={{ backgroundColor: 'var(--color-cyber-dark)' }}
      >
        {/* 当前图片 */}
        <img
          src={images[current]}
          alt={`${title} - ${current + 1}`}
          className={`w-full h-full object-contain transition-opacity duration-400 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}
        />

        {/* 左右箭头 */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                         flex items-center justify-center transition-all duration-300
                         hover:scale-110"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff' }}
              aria-label="上一张"
            >
              ←
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                         flex items-center justify-center transition-all duration-300
                         hover:scale-110"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff' }}
              aria-label="下一张"
            >
              →
            </button>
          </>
        )}

        {/* 计数器 */}
        <div
          className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff' }}
        >
          {current + 1} / {images.length}
        </div>
      </div>

      {/* 缩略图条 */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-16 h-12 rounded-md overflow-hidden transition-all duration-300
                ${i === current ? 'ring-2 scale-105' : 'opacity-50 hover:opacity-80'}`}
              style={{
                ringColor: 'var(--color-photos)',
              }}
            >
              <img
                src={img}
                alt={`缩略图 ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
