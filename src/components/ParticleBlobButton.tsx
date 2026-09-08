import { useEffect, useRef } from 'react';

interface ParticleBlobButtonProps {
  onClick: () => void;
  label: string;
}

interface Particle {
  x: number;
  y: number;
  bx: number;
  by: number;
  dist: number;
  phase: number;
}

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function ParticleBlobButton({ onClick, label }: ParticleBlobButtonProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const elsRef = useRef<HTMLDivElement[]>([]);
  const pointerRef = useRef({ x: 0, y: 0, active: false, h: 0 });

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const build = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;

      elsRef.current.forEach(el => el.remove());
      elsRef.current = [];
      particlesRef.current = [];

      const step = w / 24;
      const cols = Math.round(w / step);
      const rows = Math.round(h / step);
      const cx = w / 2;
      const cy = h / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = step * (c + 0.5);
          const y = step * (r + 0.5);
          const nx = (x - cx) / (cx - step * 0.4);
          const ny = (y - cy) / (cy - step * 0.4);
          if (nx * nx + ny * ny > 1) continue;

          const el = document.createElement('div');
          el.className = 'blob-particle';
          wrap.appendChild(el);
          elsRef.current.push(el);
          particlesRef.current.push({
            x,
            y,
            bx: x,
            by: y,
            dist: Math.hypot(nx, ny),
            phase: (r * 12.9898 + c * 78.233) % 6.2832,
          });
        }
      }
    };

    build();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(build);
      ro.observe(wrap);
      return () => ro.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const wrap = wrapRef.current;
    if (!wrap) return;

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointerRef.current.x = e.clientX - rect.left - rect.width / 2;
      pointerRef.current.y = e.clientY - rect.top - rect.height / 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 40) / 16.7;
      last = now;
      const t = now;
      const wrap = wrapRef.current;
      if (!wrap) return;

      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const maxR = Math.max(w, h) * 1.15;
      const hoverR = Math.max(w, h) * 1.5;

      const { x: px, y: py, active } = pointerRef.current;
      const d = Math.hypot(px, py);
      const hTarget = active || d < hoverR ? 1 : 0;
      pointerRef.current.h += (hTarget - pointerRef.current.h) * (0.08 * dt);
      const hp = pointerRef.current.h;

      const ang = Math.atan2(py, px);
      const chaseR = Math.max(d, 40); // avoid degenerating when cursor over the center
      const cxc = (Math.cos(ang) * Math.min(chaseR, maxR));
      const cyc = (Math.sin(ang) * Math.min(chaseR, maxR));

      const particles = particlesRef.current;
      const els = elsRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const e = els[i];
        const pulseX = Math.sin(t * 0.0012 + p.phase) * 2.5;
        const pulseY = Math.cos(t * 0.0011 + p.phase * 1.3) * 2.5;
        const kChase = 0.07 + 0.12 * p.dist;
        const kIdle = 0.05;
        const k = kIdle + (kChase - kIdle) * hp;
        const tx = p.bx + pulseX + (cxc - (p.bx + pulseX)) * hp;
        const ty = p.by + pulseY + (cyc - (p.by + pulseY)) * hp;
        p.x += (tx - p.x) * Math.min(k * dt, 1);
        p.y += (ty - p.y) * Math.min(k * dt, 1);
        e.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const fire = () => {
    if (onClick) onClick();
  };

  if (reduceMotion) {
    return (
      <button
        onClick={fire}
        className="font-mono text-sm md:text-base uppercase tracking-widest px-10 py-4 rounded-2xl bg-white text-black hover:bg-black hover:text-white focus-visible transition-colors duration-300"
      >
        {label}
      </button>
    );
  }

  return (
    <div
      ref={wrapRef}
      role="button"
      tabIndex={0}
      aria-label={`${label} - Comenzar recorrido inmersivo`}
      onClick={fire}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fire();
        }
      }}
      onPointerEnter={() => (pointerRef.current.active = true)}
      onPointerLeave={() => (pointerRef.current.active = false)}
      className="blob-wrap focus-visible"
    >
      <div className="blob-label" aria-hidden="true">
        {label}
      </div>
    </div>
  );
}