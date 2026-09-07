import { useEffect, useRef, useState, useCallback } from 'react';
import type { Branding } from '../types/property';

interface LandingProps {
  onEnter: () => void;
  branding: Branding;
}

export default function Landing({ onEnter, branding }: LandingProps) {
  const [phase, setPhase] = useState<'initial' | 'reveal' | 'cta'>('initial');
  const [showCursor, setShowCursor] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('reveal'), 1500);
    const timer2 = setTimeout(() => setPhase('cta'), 4000);
    const timer3 = setTimeout(() => setShowCursor(true), 4200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
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

          <button
            onClick={onEnter}
            onKeyDown={(e) => e.key === 'Enter' && onEnter()}
            className="group btn-primary inline-flex items-center gap-4 px-10 py-4 min-w-[280px] justify-center focus-visible"
            aria-label="Entrar a la propiedad - Comenzar recorrido inmersivo"
            tabIndex={0}
          >
            <span className="font-mono text-sm md:text-base uppercase tracking-widest">
              ENTRAR A LA PROPIEDAD
            </span>
            <svg
              className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-white/30">
            Presiona ENTER o haz clic para comenzar
          </p>
        </div>
      </div>

      <div
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-1000 ${
          phase !== 'cta' ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
        }`}
        aria-hidden="true"
      >
        <div className="w-px h-20 bg-gradient-to-b from-white/20 to-transparent" />
        <div
          className={`w-6 h-6 border border-white/30 rounded-full flex items-center justify-center animate-bounce ${
            showCursor ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <svg className="w-3 h-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-white/30">SCROLL</p>
      </div>
    </div>
  );
}