import { useEffect, useRef, useState, useCallback } from 'react';
import type { Branding } from '../types/property';
import ParticleBlobButton from './ParticleBlobButton';

interface LandingProps {
  onEnter: () => void;
  branding: Branding;
}

export default function Landing({ onEnter, branding }: LandingProps) {
  const [phase, setPhase] = useState<'initial' | 'reveal' | 'cta'>('initial');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('reveal'), 1500);
    const timer2 = setTimeout(() => setPhase('cta'), 4000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onEnter();
    }
  }, [onEnter]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden"
      role="region"
      aria-label="Pantalla de bienvenida"
    >
      <div className="fixed inset-0 bg-gradient-radial from-gray-900/50 via-black to-black" aria-hidden="true" />

      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NCAwLTE4IDguMDQ2LTE4IDE4czguMDQ2IDE4IDE4IDE4IDE4LTguMDQ2IDE4LTE4LTguMDQ2LTE4LTE4LTE4em0wIDM0Yy04LjgzIDAtMTYtNy4xNy0xNi0xNnM3LjE3LTE2IDE2LTE2IDE2IDcuMTcgMTYgMTYtNy4xNyAxNi0xNiAxNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wMyIgc3Ryb2tlLXdpZHRoPSIuNSIvPjwvZz48L3N2Zz4=)'] opacity-30 animate-rotate-slow" aria-hidden="true" />

      <div className="relative z-10 text-center px-6">
        <div
          className={`font-display text-5xl md:text-7xl lg:text-9xl font-light tracking-tight leading-[0.95] text-white transition-all duration-1000 ease-out ${
            phase === 'initial' ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
          }`}
          aria-hidden="true"
        >
          UNA PROPIEDAD
        </div>

        <div
          className={`font-display text-5xl md:text-7xl lg:text-9xl font-light tracking-tight leading-[0.95] text-white transition-all duration-1000 ease-out delay-300 ${
            phase === 'initial' || phase === 'reveal' ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
          }`}
          aria-hidden="true"
        >
          NO SE MUESTRA.
        </div>

        <div
          className={`font-display text-5xl md:text-7xl lg:text-9xl font-medium tracking-tight leading-[0.95] text-white transition-all duration-1000 ease-out delay-700 ${
            phase !== 'cta' ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
          }`}
          aria-hidden="true"
        >
          SE EXPERIMENTA.
        </div>

        <div
          className={`mt-12 md:mt-16 transition-all duration-1000 ease-out delay-1000 ${
            phase !== 'cta' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <h2 className="font-mono text-xs md:text-sm uppercase tracking-widest text-white/50 mb-6">
            {branding.name}
          </h2>

          <ParticleBlobButton onClick={onEnter} label="ENTRAR A LA PROPIEDAD" />

          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-white/30">
            Presiona ENTER o haz clic para comenzar
          </p>
        </div>
      </div>
    </div>
  );
}