import type { Scene } from '../types/property';

interface NavigationIndicatorProps {
  currentScene: Scene;
  currentIndex: number;
}

export default function NavigationIndicator({ currentScene, currentIndex }: NavigationIndicatorProps) {
  return (
    <div
      className="fixed top-20 left-6 z-20 pointer-events-none animate-fade-in-up"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="glass px-5 py-3 rounded-xl border-l-4 border-white/20">
        <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-1">
          ESTÁS EN
        </p>
        <p className="font-display text-lg font-medium text-white">
          {String(currentIndex + 1).padStart(2, '0')} / {currentScene.name}
        </p>
      </div>
    </div>
  );
}