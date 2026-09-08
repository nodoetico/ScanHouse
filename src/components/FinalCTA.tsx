import { useState } from 'react';
import type { Property } from '../types/property';
import LeadForm from './LeadForm';

interface FinalCTAProps {
  property: Property;
  onRestart: () => void;
}

export default function FinalCTA({ property, onRestart }: FinalCTAProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="fixed inset-0 bg-black overflow-y-auto" role="region" aria-label="Pantalla final">
      <div className="fixed inset-0 bg-gradient-radial from-gray-900/50 via-black to-black" aria-hidden="true" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NCAwLTE4IDguMDQ2LTE4IDE4czguMDQ2IDE4IDE4IDE4IDE4LTguMDQ2IDE4LTE4LTguMDQ2LTE4LTE4LTE4em0wIDM0Yy04LjgzIDAtMTYtNy4xNy0xNi0xNnM3LjE3LTE2IDE2LTE2IDE2IDcuMTcgMTYgMTYtNy4xNyAxNi0xNiAxNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wMyIgc3Ryb2tlLXdpZHRoPSIuNSIvPjwvZz48L3N2Zz4=)'] opacity-30 animate-rotate-slow" aria-hidden="true" />

      <div className="relative z-10 min-h-full flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center max-w-xl mx-auto animate-fade-in-up">
          <div className="w-24 h-24 mx-auto mb-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 22V12h6v10" />
            </svg>
          </div>

          {!showForm && (
            <>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium leading-[0.95] text-white mb-6 text-balance">
                ¿QUERÉS CONOCERLA
                <br />
                <span className="font-light">EN PERSONA?</span>
              </h1>

              <p className="font-mono text-sm md:text-base uppercase tracking-widest text-white/40 mb-12 max-w-lg mx-auto leading-relaxed">
                Coordiná tu visita y experimentá Casa Laureles en primera persona.
              </p>
            </>
          )}

          {showForm ? (
            <div className="text-left mt-2">
              <LeadForm property={property} onClose={() => setShowForm(false)} />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 mb-8">
              <button
                onClick={() => setShowForm(true)}
                className="group inline-flex items-center justify-center gap-3 w-full sm:w-72 px-8 py-4 bg-white text-black hover:bg-neutral-200 transition-colors focus-visible"
              >
                <span className="font-mono text-sm font-medium uppercase tracking-widest">SOLICITAR VISITA</span>
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

              <a
                href={`https://wa.me/${property.assistantKnowledge.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, quiero coordinar una visita a ${property.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 w-full sm:w-72 px-8 py-4 border border-white/25 text-white bg-white/5 hover:border-[#25D366]/70 hover:bg-[#25D366]/10 hover:text-[#25D366] transition-colors focus-visible"
              >
                <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414zM12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.166.689-.223.689-.495 0-.237-.013-1.024-.013-1.988-2.782.586-3.369-1.165-3.369-1.165-.454-1.152-1.11-1.456-1.11-1.456-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.647.35-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.98 1.029-2.68-.103-.253-.446-1.27.098-2.64 0 0 .84-.269 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.37.203 2.388.1 2.64.64.7 1.028 1.59 1.028 2.68 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .272.18.662.688.493C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span className="font-mono text-sm font-medium uppercase tracking-widest">WHATSAPP</span>
              </a>
            </div>
          )}

          <button
            onClick={onRestart}
            className="font-mono text-xs uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors px-4 py-2"
          >
            VOLVER A RECORRER
          </button>

          <div className="mt-14 pt-10 border-t border-white/10 w-full max-w-md mx-auto space-y-1.5">
            <p className="font-mono text-xs uppercase tracking-widest text-white/40">
              {property.branding.name} — {property.branding.tagline}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-white/25">
              Nodo Ético - Systemas Inteligentes · Todos los derechos reservados
            </p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-white/20">
              {property.assistantKnowledge.contact.agency} · {property.assistantKnowledge.contact.whatsapp}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}