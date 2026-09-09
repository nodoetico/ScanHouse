interface DemoPickerProps {
  onClient: () => void;
  onAgency: () => void;
}

export default function DemoPicker({ onClient, onAgency }: DemoPickerProps) {
  const clientFlow = ['Explora', 'Entiende', 'Compara', 'Pregunta', 'Contacta', 'Solicita visita'];
  const agencyFlow = ['Publica', 'Observa', 'Analiza', 'Capta leads', 'Sigue', 'Convierte'];

  return (
    <div className="fixed inset-0 bg-black overflow-y-auto" role="region" aria-label="Selector de demo">
      <div className="fixed inset-0 bg-gradient-radial from-gray-900/50 via-black to-black" aria-hidden="true" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzM3Lm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTM2IDE4Yy05Ljk0IDAtMTggOC4wNDYtMTggMThzOC4wNDYgMTggMTggMTggMTgtOC4wNDYgMTgtMTgtOC4wNDYtMTgtMTgtMTh6bTAgMzRjLTguODMgMC0xNi03LjE3LTE2LTE2czcuMTctMTYgMTYtMTYgMTYgNy4xNyAxNiAxNi03LjE3IDE2LTE2IDE2eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjAzIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==)'] opacity-30 animate-rotate-slow" aria-hidden="true" />

      <div className="relative z-10 min-h-full flex flex-col items-center justify-center px-6 py-14">
        <div className="text-center animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.5 8.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm0 0L6.5 12H3a9 9 0 0018 0h-3.5l-4-3.5" />
              </svg>
            </div>
            <h1 className="font-display text-2xl tracking-tight text-white font-medium">SCANHOUSE</h1>
          </div>
          <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.3em] text-white/40 mb-2">
            Una propiedad no se muestra. Se experimenta.
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-light text-white text-balance mb-2">
            ¿Qué querés explorar?
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest text-white/30 mb-12">
            Dos experiencias · Un solo producto
          </p>
        </div>

        <div className="grid w-full max-w-4xl grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in-up [animation-delay:150ms]">
          <div className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-6 sm:p-8 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.05]">
            <div className="w-12 h-12 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-xl mb-5" aria-hidden="true">
              👤
            </div>
            <h3 className="font-display text-xl text-white mb-2">EXPERIENCIA DEL CLIENTE</h3>
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              Descubrí cómo vive la experiencia una persona que busca una propiedad: la encuentra, la recorre en 360°, conoce el barrio, la compara y solicita una visita.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-8">
              {clientFlow.map(step => (
                <span key={step} className="px-2.5 py-1 rounded-full border border-white/10 font-mono text-[10px] uppercase tracking-widest text-white/40">
                  {step}
                </span>
              ))}
            </div>
            <button
              onClick={onClient}
              className="mt-auto w-full px-6 py-3.5 rounded-xl bg-white text-black font-mono text-xs font-medium uppercase tracking-widest hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              EXPLORAR
            </button>
          </div>

          <div className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-6 sm:p-8 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.05]">
            <div className="w-12 h-12 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-xl mb-5" aria-hidden="true">
              🏢
            </div>
            <h3 className="font-display text-xl text-white mb-2">PANEL DE LA INMOBILIARIA</h3>
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              Descubrí cómo la inmobiliaria administra propiedades, analiza el comportamiento de los clientes, captura leads y convierte oportunidades.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-8">
              {agencyFlow.map(step => (
                <span key={step} className="px-2.5 py-1 rounded-full border border-white/10 font-mono text-[10px] uppercase tracking-widest text-white/40">
                  {step}
                </span>
              ))}
            </div>
            <button
              onClick={onAgency}
              className="mt-auto w-full px-6 py-3.5 rounded-xl border border-white/25 text-white font-mono text-xs font-medium uppercase tracking-widest hover:bg-white/10 transition-colors cursor-pointer"
            >
              INGRESAR
            </button>
          </div>
        </div>

        <div className="mt-12 text-center space-y-1.5 animate-fade-in-up [animation-delay:300ms]">
          <p className="font-mono text-xs uppercase tracking-widest text-white/40">
            ScanHouse transforma una publicación inmobiliaria en una experiencia digital interactiva
          </p>
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/25">
            ScanHouse — Desarrollado por Nodo Ético — Sistemas Inteligentes
          </p>
        </div>
      </div>
    </div>
  );
}