// src/components/home/ElectricSound.ts
// Web Audio API 电击音效生成器

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

// 电弧音效：白噪声 → 滤波 → 快速衰减
export function playElectricZap(volume = 0.08) {
  try {
    const ctx = getCtx();
    const duration = 0.15;
    const sampleRate = ctx.sampleRate;
    const length = Math.floor(duration * sampleRate);
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 30); // 快速衰减
      // 高频噪声 + 低频爆裂
      const noise = (Math.random() * 2 - 1) * 0.5;
      const crackle = (Math.random() * 2 - 1) * Math.sin(t * 8000) * 0.5;
      data[i] = (noise * 0.6 + crackle * 0.4) * envelope * volume;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // 带通滤波器 —— 让声音更"电"
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3000 + Math.random() * 2000;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.value = 1;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch {
    // 静默失败（某些环境不支持 Web Audio）
  }
}

// 电流持续流动声
export function playElectricHum(durationSec = 0.5, volume = 0.03) {
  try {
    const ctx = getCtx();
    const sampleRate = ctx.sampleRate;
    const length = Math.floor(durationSec * sampleRate);
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.min(1, t * 20) * Math.exp(-t * 2); // 渐入渐出
      const hum = Math.sin(t * 60 * Math.PI * 2) * 0.3
        + (Math.random() * 2 - 1) * 0.7;
      data[i] = hum * envelope * volume;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    const gain = ctx.createGain();
    gain.gain.value = 1;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch {
    // 静默失败
  }
}
