import { useState } from 'react';
import { useSession } from '../context/SessionContext';
import Dashboard from './views/Dashboard';
import Properties from './views/Properties';
import Intelligence from './views/Intelligence';
import Conversion from './views/Conversion';
import Leads from './views/Leads';
import Visits from './views/Visits';
import Analytics from './views/Analytics';
import Settings from './views/Settings';

type View =
  | 'dashboard'
  | 'properties'
  | 'intelligence'
  | 'conversion'
  | 'leads'
  | 'visits'
  | 'analytics'
  | 'settings';

const nav: { id: View; label: string; icon: string; badge?: string }[] = [
  { id: 'dashboard', label: 'Inicio', icon: '◫' },
  { id: 'properties', label: 'Propiedades', icon: '⌂' },
  { id: 'intelligence', label: 'Inteligencia', icon: '◈' },
  { id: 'conversion', label: 'Conversión', icon: '➜' },
  { id: 'leads', label: 'Leads', icon: '✦' },
  { id: 'visits', label: 'Visitas', icon: '◷' },
  { id: 'analytics', label: 'Analíticas', icon: '▥' },
  { id: 'settings', label: 'Configuración', icon: '⚙' },
];

export default function Panel({ onOpenExperience }: { onOpenExperience: (propertyId: string) => void }) {
  const { agency, logout } = useSession();
  const [view, setView] = useState<View>('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  if (!agency) return null;

  const primary = agency.branding.primaryColor;

  return (
    <div className="fixed inset-0 bg-[#0a0a0b] text-white flex overflow-hidden">
      <aside
        className={`${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-black/80 backdrop-blur-xl flex flex-col transition-transform duration-300 lg:transition-none`}
      >
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
              {agency.logo ? (
                <img src={agency.logo} alt={agency.name} className="max-h-full max-w-full object-contain p-1" />
              ) : (
                <span className="font-display text-white">{agency.shortName[0]}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-display text-white text-sm truncate">{agency.shortName}</p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 truncate">ScanHouse · Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
          {nav.map(item => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setMenuOpen(false); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer text-left ${
                view === item.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/55 hover:text-white hover:bg-white/[0.05]'
              }`}
              style={view === item.id ? { boxShadow: `inset 3px 0 0 ${primary}` } : undefined}
            >
              <span className="w-5 text-center text-white/70" style={view === item.id ? { color: primary } : undefined}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full border border-white/20 text-white/60">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-1">
            <div className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/30">
              Próximamente
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/35">
              <span className="w-5 text-center">◆</span>
              <span className="flex-1">Producción</span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full border border-white/15 text-white/40">2026</span>
            </div>
          </div>
        </nav>

        <div className="p-3 border-t border-white/10 flex flex-col gap-1">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <span className="w-5 text-center">↩</span>
            <span>Cerrar sesión</span>
          </button>
          <div className="px-3 pt-2 font-mono text-[9px] uppercase tracking-widest text-white/25">
            v0.1 · Nodo Ético
          </div>
        </div>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMenuOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center gap-3 px-4 sm:px-6">
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 cursor-pointer"
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              {agency.name}
            </p>
            <p className="font-display text-white text-sm truncate">
              {nav.find(n => n.id === view)?.label}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white/45 border border-white/10 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: primary }} />
              {agency.contact.domain ?? agency.name}
            </span>
            <button
              onClick={() => onOpenExperience('casa-laureles')}
              className="px-3.5 py-1.5 rounded-lg text-xs text-black font-medium transition-colors cursor-pointer"
              style={{ background: primary }}
            >
              Ver experiencia
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {view === 'dashboard' && <Dashboard />}
          {view === 'properties' && <Properties onOpenExperience={onOpenExperience} />}
          {view === 'intelligence' && <Intelligence />}
          {view === 'conversion' && <Conversion />}
          {view === 'leads' && <Leads />}
          {view === 'visits' && <Visits />}
          {view === 'analytics' && <Analytics />}
          {view === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}