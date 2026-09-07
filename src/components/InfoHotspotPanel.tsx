import type { Hotspot } from '../types/property';

interface InfoHotspotPanelProps {
  hotspot: Hotspot;
  onClose: () => void;
}

export default function InfoHotspotPanel({ hotspot, onClose }: InfoHotspotPanelProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-hotspot-title"
    >
      <div className="relative w-full max-w-md mx-6 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/5 backdrop-blur rounded-full border border-white/10 hover:bg-white/10 transition-all"
          aria-label="Cerrar información"
        >
          <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="panel-glass rounded-2xl p-8 md:p-10">
          <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-2 animate-fade-in-up">
            Detalle de ambiente
          </p>
          <h3 id="info-hotspot-title" className="font-display text-2xl md:text-3xl font-medium mb-2 animate-fade-in-up delay-100">
            {hotspot.name}
          </h3>
          <p className="text-white/70 leading-relaxed text-base md:text-lg animate-fade-in-up delay-200">
            {hotspot.content}
          </p>
        </div>
      </div>
    </div>
  );
}