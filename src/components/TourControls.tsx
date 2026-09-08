import type { Property, Scene } from '../types/property';

interface TourControlsProps {
  property: Property;
  currentScene: Scene;
  currentSceneIndex: number;
  totalScenes: number;
  onNextScene: () => void;
  onPrevScene: () => void;
  onSceneSelect: (sceneId: string) => void;
  onRequestVisit: () => void;
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
  showAssistant: boolean;
  setShowAssistant: (show: boolean) => void;
  showFloorPlan: boolean;
  setShowFloorPlan: (show: boolean) => void;
}

export default function TourControls({
  property,
  currentScene,
  currentSceneIndex,
  totalScenes,
  onNextScene,
  onPrevScene,
  onSceneSelect,
  onRequestVisit,
  showInfo,
  setShowInfo,
  showAssistant,
  setShowAssistant,
  showFloorPlan,
  setShowFloorPlan,
}: TourControlsProps) {
  const isFirst = currentSceneIndex === 0;
  const isLast = currentSceneIndex === totalScenes - 1;

  return (
    <div className="fixed inset-0 pointer-events-none z-30" aria-hidden="true">
      <div className="fixed top-6 left-6 right-6 flex items-start justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <span className="font-display text-xl font-medium text-white">
            {property.branding.name}
          </span>
          <span className="hidden md:block w-px h-6 bg-white/10" />
          <span className="font-mono text-xs uppercase tracking-widest text-white/40">
            {currentScene.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ControlButton
            onClick={() => setShowInfo(!showInfo)}
            active={showInfo}
            aria-label={showInfo ? 'Ocultar información de la propiedad' : 'Mostrar información de la propiedad'}
            aria-pressed={showInfo}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </ControlButton>

          <ControlButton
            onClick={() => setShowFloorPlan(!showFloorPlan)}
            active={showFloorPlan}
            aria-label={showFloorPlan ? 'Ocultar plano' : 'Ver plano interactivo'}
            aria-pressed={showFloorPlan}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </ControlButton>

          <ControlButton
            onClick={() => setShowAssistant(!showAssistant)}
            active={showAssistant}
            aria-label={showAssistant ? 'Cerrar asistente' : 'Abrir asistente IA'}
            aria-pressed={showAssistant}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </ControlButton>

          <ControlButton
            onClick={onRequestVisit}
            aria-label="Me interesa esta propiedad - Solicitar visita"
            className="bg-white/10 border-white/20 hover:bg-white/20"
          >
            <span className="font-mono text-xs uppercase tracking-wider hidden sm:inline">ME INTERESA</span>
            <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </ControlButton>
        </div>
      </div>

      <div className="fixed bottom-6 left-6 right-6 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-4">
          <NavButton
            onClick={onPrevScene}
            disabled={isFirst}
            aria-label="Ambiente anterior"
            aria-disabled={isFirst}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </NavButton>

          <div className="flex items-center gap-2">
            {property.scenes.map((scene, index) => (
              <button
                key={scene.id}
                onClick={() => onSceneSelect(scene.id)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSceneIndex
                    ? 'bg-white w-6'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Ir a ${scene.name}`}
                aria-current={index === currentSceneIndex ? 'step' : undefined}
              />
            ))}
          </div>

          <NavButton
            onClick={onNextScene}
            disabled={isLast}
            aria-label="Siguiente ambiente"
            aria-disabled={isLast}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </NavButton>
        </div>

        <div className="font-mono text-xs uppercase tracking-widest text-white/30">
          {String(currentSceneIndex + 1).padStart(2, '0')} / {String(totalScenes).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}

function ControlButton({
  children,
  onClick,
  active = false,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-12 h-12 rounded-xl flex items-center justify-center
        bg-white/5 backdrop-blur border border-white/10
        hover:bg-white/10 hover:border-white/20
        transition-all duration-300
        ${active ? 'bg-white/15 border-white/30' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

function NavButton({
  children,
  onClick,
  disabled = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-14 h-14 rounded-xl flex items-center justify-center
        bg-white/5 backdrop-blur border border-white/10
        hover:bg-white/10 hover:border-white/20
        transition-all duration-300
        ${disabled ? 'opacity-30 pointer-events-none' : ''}
      `}
      {...props}
    >
      {children}
    </button>
  );
}