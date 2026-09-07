import { useState } from 'react';
import type { FloorPlan as FloorPlanType } from '../types/property';

interface FloorPlanProps {
  floorPlan: FloorPlanType;
  currentSceneId: string;
  onNavigate: (sceneId: string) => void;
  onClose: () => void;
}

const MONO_ADV = 0.6;

function fitLines(name: string, boxW: number, boxH: number, portrait: boolean) {
  const w = portrait ? boxH : boxW;
  const h = portrait ? boxW : boxH;
  const padX = 1.2;
  for (let fs = 8.5; fs >= 3; fs -= 0.5) {
    const maxChars = Math.max(1, Math.floor((w - padX) / (MONO_ADV * fs)));
    const maxLines = Math.max(1, Math.floor((h - 0.8) / (fs * 1.3)));
    const words = name.split(/\s+/);
    let feasible = words.every(word => word.length <= maxChars);
    if (!feasible) continue;
    const lines: string[] = [];
    let cur = '';
    for (const word of words) {
      if (cur && cur.length + 1 + word.length > maxChars) {
        lines.push(cur);
        cur = word;
      } else {
        cur = cur ? `${cur} ${word}` : word;
      }
    }
    if (cur) lines.push(cur);
    if (lines.length <= maxLines) return { fs, lines };
  }
  return { fs: 3, lines: name.split('') };
}

export default function FloorPlan({ floorPlan, currentSceneId, onNavigate, onClose }: FloorPlanProps) {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const currentRoom = floorPlan.rooms.find(r => r.sceneId === currentSceneId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="floorplan-title">
      <button
        onClick={onClose}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-60 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-white/5 backdrop-blur rounded-full border border-white/10 hover:bg-white/10 transition-all"
        aria-label="Cerrar plano"
      >
        <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative w-full max-w-4xl h-[82vh] sm:h-[80vh] mx-3 sm:mx-6 my-8 sm:my-10 animate-scale-in">
        <div className="panel-glass rounded-2xl overflow-hidden flex flex-col h-full">
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 id="floorplan-title" className="font-display text-lg sm:text-xl font-medium text-white truncate">PLANO INTERACTIVO</h2>
                <p className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-white/40 truncate">Hacé clic en un ambiente para navegar</p>
              </div>
            </div>
            {currentRoom && (
              <div className="hidden sm:block text-right shrink-0">
                <p className="font-display text-base lg:text-lg font-medium text-white">{currentRoom.name}</p>
                <p className="font-mono text-xs uppercase tracking-widest text-white/40">AMBIENTE ACTUAL</p>
              </div>
            )}
          </div>

          <div className="flex-1 relative overflow-hidden p-2 sm:p-4">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full"
              aria-hidden="true"
            >
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="0.5" />
                </pattern>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect width="100" height="100" fill="url(#grid)" />

              <g filter="url(#glow)">
                {floorPlan.rooms.map(room => {
                  const portrait = room.width < room.height * 0.8;
                  const { fs, lines } = fitLines(room.name, room.width, room.height, portrait);
                  const cx = room.x + room.width / 2;
                  const cy = room.y + room.height / 2;
                  const active = room.sceneId === currentSceneId;
                  return (
                    <g key={room.sceneId} className="floorplan-room">
                      <rect
                        x={room.x}
                        y={room.y}
                        width={room.width}
                        height={room.height}
                        rx="3"
                        fill={active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}
                        stroke={active ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)'}
                        strokeWidth={active ? '2' : '1'}
                        style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredRoom(room.sceneId)}
                        onMouseLeave={() => setHoveredRoom(null)}
                        onClick={() => { onNavigate(room.sceneId); onClose(); }}
                      />
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={active ? 'white' : 'rgba(255,255,255,0.5)'}
                        fontFamily="'JetBrains Mono', monospace"
                        fontSize={fs}
                        fontWeight={active ? '600' : '400'}
                        letterSpacing="0.02em"
                        pointerEvents="none"
                        transform={portrait ? `rotate(-90 ${cx} ${cy})` : undefined}
                      >
                        {lines.map((ln, i) => (
                          <tspan
                            key={`${room.sceneId}-${i}`}
                            x={cx}
                            dy={i === 0 ? ((lines.length - 1) * -fs * 1.3) / 2 : fs * 1.3}
                          >
                            {ln}
                          </tspan>
                        ))}
                      </text>
                      {active && (
                        <circle
                          cx={room.x + room.width - 8}
                          cy={room.y + 8}
                          r="5"
                          fill="white"
                          opacity="0.8"
                          pointerEvents="none"
                        />
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>

            {hoveredRoom && (
              <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-2.5 sm:px-6 sm:py-3 text-white text-xs sm:text-sm font-mono uppercase tracking-wider pointer-events-none animate-fade-in whitespace-nowrap">
                Click para ir a {floorPlan.rooms.find(r => r.sceneId === hoveredRoom)?.name}
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6 border-t border-white/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs sm:text-sm w-full sm:w-auto">
              {floorPlan.rooms.map(room => (
                <span
                  key={room.sceneId}
                  className={`flex items-center gap-2 font-mono uppercase tracking-wider whitespace-nowrap ${
                    room.sceneId === currentSceneId ? 'text-white' : 'text-white/40'
                  }`}
                >
                  <span className={`w-2 h-2 rounded shrink-0 ${room.sceneId === currentSceneId ? 'bg-white' : 'bg-white/30'}`} />
                  <span className="truncate">{room.name}</span>
                </span>
              ))}
            </div>
            <button
              onClick={onClose}
              className="btn-primary px-5 py-2 sm:px-6 w-full sm:w-auto"
            >
              <span className="font-mono text-xs uppercase tracking-widest">CERRAR PLANO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}