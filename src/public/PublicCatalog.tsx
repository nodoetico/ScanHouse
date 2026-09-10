import { useMemo, useState } from 'react';
import type { Agency, AgencyId } from '../types/agency';
import type { ListingProperty, PropertyType } from '../types/listing';
import { agencies } from '../data/agencies';
import PropertyCard from '../components/PropertyCard';

type Mode = 'todas' | 'venta' | 'alquiler';
type Sort = 'recomendadas' | 'precio-asc' | 'precio-desc' | 'vistas';
type Priority = 'precio' | 'superficie' | 'servicios' | 'tranquilidad' | 'accesibilidad';

interface PublicCatalogProps {
  agency: Agency;
  listings: ListingProperty[];
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  onSelect: (id: string) => void;
  onChangeAgency: (id: AgencyId) => void;
  onExitDemo: () => void;
}

const types: ('todos' | PropertyType)[] = ['todos', 'casa', 'departamento', 'ph', 'loft', 'terreno', 'duplex'];
const typeLabel: Record<string, string> = {
  todos: 'Todos',
  casa: 'Casa',
  departamento: 'Departamento',
  ph: 'PH',
  loft: 'Loft',
  terreno: 'Terreno',
  duplex: 'Dúplex',
};
const roomOptions = ['todas', '1', '2', '3', '4'];

function scoreByPriority(l: ListingProperty, priority: Priority, budget: [number, number] | null): number {
  const rangeSize = Math.max(budget ? budget[1] - budget[0] : 1, 1);
  switch (priority) {
    case 'precio':
      return budget
        ? 100 - Math.abs(l.price - (budget[0] + budget[1]) / 2) / rangeSize
        : 100 - Math.min(l.price, 300000) / 3000;
    case 'superficie':
      return Math.min((l.coveredArea || l.landArea) / 300, 1) * 100;
    case 'servicios':
      return (l.zoneQuality.commerce + l.zoneQuality.services + l.zoneQuality.accessibility) / 15 * 100;
    case 'tranquilidad':
      return (l.zoneQuality.green + l.zoneQuality.connectivity + 5 - l.zoneQuality.commerce) / 15 * 100;
    case 'accesibilidad':
      return (l.zoneQuality.accessibility + l.zoneQuality.transport) / 10 * 100;
  }
}

export default function PublicCatalog({
  agency,
  listings,
  compareIds,
  onToggleCompare,
  onSelect,
  onChangeAgency,
  onExitDemo,
}: PublicCatalogProps) {
  const [mode, setMode] = useState<Mode>('todas');
  const [type, setType] = useState<string>('todos');
  const [rooms, setRooms] = useState<string>('todas');
  const [sort, setSort] = useState<Sort>('recomendadas');
  const [query, setQuery] = useState('');

  const [showReco, setShowReco] = useState(false);
  const [budget, setBudget] = useState('any');
  const [priority, setPriority] = useState<Priority>('superficie');
  const [recoRooms, setRecoRooms] = useState('2');
  const [recoResults, setRecoResults] = useState<ListingProperty[] | null>(null);

  const budgets: Record<string, [number, number] | null> = {
    any: null,
    b1: [50000, 90000],
    b2: [90000, 140000],
    b3: [140000, 200000],
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = listings.filter(l => {
      if (mode !== 'todas' && l.operation !== mode) return false;
      if (type !== 'todos' && l.propertyType !== type) return false;
      if (rooms !== 'todas' && l.bedrooms < Number(rooms)) return false;
      if (q && !`${l.name} ${l.location}`.toLowerCase().includes(q)) return false;
      return true;
    });
    const sorted = [...list];
    if (sort === 'precio-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'precio-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sort === 'vistas') sorted.sort((a, b) => b.visitors - a.visitors);
    else sorted.sort((a, b) => (a.operation === b.operation ? b.visitors - a.visitors : a.operation === 'venta' ? -1 : 1));
    return sorted;
  }, [listings, mode, type, rooms, sort, query]);

  const runRecommendation = () => {
    const range = budgets[budget];
    const min = Number(recoRooms);
    const results = listings
      .filter(l => l.bedrooms >= min && (!range || (l.price >= range[0] && l.price <= range[1])))
      .map(l => ({ l, score: scoreByPriority(l, priority, range) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(r => r.l);
    setRecoResults(results);
  };

  return (
    <div className="min-h-screen bg-[var(--sh-bg)] text-[var(--sh-text)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
        <header className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-[var(--sh-border)] bg-[var(--sh-surface-2)] flex items-center justify-center overflow-hidden">
              {agency.logo ? (
                <img src={agency.logo} alt={agency.name} className="max-h-full max-w-full object-contain p-1" />
              ) : (
                <span className="font-display text-[var(--sh-text)]">{agency.shortName[0]}</span>
              )}
            </div>
            <div>
              <p className="font-display text-[var(--sh-text)] leading-tight">{agency.name}</p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--sh-faint)]">
                Powered by ScanHouse
              </p>
            </div>
          </div>
          <button
            onClick={onExitDemo}
            className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)] hover:text-[var(--sh-text)] transition-colors cursor-pointer"
          >
            ↺ Seleccionar demo
          </button>
        </header>

        <section className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-widest mb-2" style={{ color: 'var(--sh-primary)' }}>
            {agency.name} · Catálogo público
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-light text-[var(--sh-text)] leading-tight text-balance">
            ENCONTRÁ TU PRÓXIMO <span className="font-medium">LUGAR</span>
          </h1>
          <p className="text-sm text-[var(--sh-muted)] mt-3 max-w-2xl">
            Recorré cada propiedad en 360°, conocé el barrio, compará opciones y contactanos cuando quieras.
          </p>
        </section>

        <div className="mb-6 flex flex-wrap gap-2 items-center">
          {agencies.map(a => (
            <button
              key={a.id}
              onClick={() => onChangeAgency(a.id)}
              className={`px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest border transition-colors cursor-pointer ${
                a.id === agency.id
                  ? 'text-[var(--sh-on-primary)] border-transparent'
                  : 'border-[var(--sh-border)] text-[var(--sh-muted)] hover:text-[var(--sh-text)] hover:border-[var(--sh-border-strong)]'
              }`}
              style={a.id === agency.id ? { background: 'var(--sh-primary)' } : undefined}
            >
              {a.shortName}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-[var(--sh-border)] bg-[var(--sh-surface-2)] p-3 sm:p-4 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 lg:pb-0">
              {(['todas', 'venta', 'alquiler'] as Mode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3.5 py-2 rounded-xl font-mono text-[11px] uppercase tracking-widest border transition-colors cursor-pointer whitespace-nowrap ${
                    mode === m ? 'text-[var(--sh-text)] bg-[var(--sh-inset)] border-[var(--sh-border-strong)]' : 'text-[var(--sh-muted)] border-[var(--sh-border)]'
                  }`}
                >
                  {m === 'todas' ? 'Todas' : m}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 lg:pb-0">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest border transition-colors cursor-pointer whitespace-nowrap ${
                    type === t ? 'text-[var(--sh-text)] bg-[var(--sh-inset)] border-[var(--sh-border-strong)]' : 'text-[var(--sh-muted)] border-[var(--sh-border)]'
                  }`}
                >
                  {typeLabel[t]}
                </button>
              ))}
            </div>
            <div className="lg:ml-auto flex flex-wrap items-center gap-3">
              <label className="hidden lg:block font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)]">Hab.</label>
              <select
                value={rooms}
                onChange={e => setRooms(e.target.value)}
                className="flex-1 min-w-0 lg:flex-none bg-[var(--sh-inset)] border border-[var(--sh-border-strong)] text-[var(--sh-text)] rounded-xl px-3 py-2 text-base lg:text-sm cursor-pointer"
                aria-label="Habitaciones mínimas"
              >
                {roomOptions.map(r => (
                  <option key={r} value={r}>{r === 'todas' ? 'Todas las habs.' : `${r}+ habs.`}</option>
                ))}
              </select>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as Sort)}
                className="flex-1 min-w-0 lg:flex-none bg-[var(--sh-inset)] border border-[var(--sh-border-strong)] text-[var(--sh-text)] rounded-xl px-3 py-2 text-base lg:text-sm cursor-pointer"
                aria-label="Ordenar"
              >
                <option value="recomendadas">Recomendadas</option>
                <option value="precio-asc">Precio ↑</option>
                <option value="precio-desc">Precio ↓</option>
                <option value="vistas">Más vistas</option>
              </select>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full lg:w-40 bg-[var(--sh-inset)] border border-[var(--sh-border-strong)] text-[var(--sh-text)] rounded-xl px-3 py-2 text-base lg:text-sm placeholder:text-[var(--sh-faint)]"
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowReco(!showReco)}
          className="mb-8 w-full flex items-center justify-between gap-3 rounded-2xl border border-[var(--sh-border)] bg-[var(--sh-surface-2)] px-5 py-4 text-left transition-colors hover:border-[var(--sh-border-strong)] cursor-pointer"
        >
          <span>
            <span className="block font-display text-[var(--sh-text)]">ENCONTRÁ LA PROPIEDAD QUE MEJOR SE ADAPTA A VOS</span>
            <span className="block text-xs text-[var(--sh-muted)] mt-1">Respondé tres preguntas y te mostramos candidatas.</span>
          </span>
          <span className="font-mono text-xs text-[var(--sh-primary)]">{showReco ? '− Ocultar' : '+ Usar'}</span>
        </button>

        {showReco && (
          <div className="rounded-2xl border border-[var(--sh-border)] bg-[var(--sh-surface-2)] p-5 mb-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)] mb-3">Presupuesto</p>
                <div className="flex flex-col gap-2">
                  {Object.entries({
                    any: 'Sin límite',
                    b1: 'US$50.000 - 90.000',
                    b2: 'US$90.000 - 140.000',
                    b3: 'US$140.000 - 200.000',
                  }).map(([k, label]) => (
                    <label key={k} className="flex items-center gap-2 text-sm text-[var(--sh-text-soft)] cursor-pointer">
                      <input type="radio" name="budget" checked={budget === k} onChange={() => setBudget(k)} className="accent-[var(--sh-primary)]" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)] mb-3">Habitaciones</p>
                <div className="flex flex-wrap gap-2">
                  {['1', '2', '3', '4'].map(r => (
                    <button
                      key={r}
                      onClick={() => setRecoRooms(r)}
                      className={`px-3 py-1.5 rounded-full font-mono text-[11px] border transition-colors cursor-pointer ${
                        recoRooms === r ? 'text-[var(--sh-on-primary)] border-transparent' : 'border-[var(--sh-border)] text-[var(--sh-muted)]'
                      }`}
                      style={recoRooms === r ? { background: 'var(--sh-primary)' } : undefined}
                    >
                      {r}+
                    </button>
                  ))}
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)] mt-5 mb-3">Prioridad</p>
                <div className="flex flex-wrap gap-2">
                  {([
                    ['precio', 'Precio'],
                    ['superficie', 'Superficie'],
                    ['servicios', 'Servicios cerca'],
                    ['tranquilidad', 'Tranquilidad'],
                    ['accesibilidad', 'Accesibilidad'],
                  ] as [Priority, string][]).map(([p, label]) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`px-3 py-1.5 rounded-full font-mono text-[11px] border transition-colors cursor-pointer ${
                        priority === p ? 'text-[var(--sh-on-primary)] border-transparent' : 'border-[var(--sh-border)] text-[var(--sh-muted)]'
                      }`}
                      style={priority === p ? { background: 'var(--sh-primary)' } : undefined}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-end justify-start md:justify-end">
                <button
                  onClick={runRecommendation}
                  className="px-6 py-3 rounded-xl text-sm font-medium text-[var(--sh-on-primary)] transition-opacity cursor-pointer hover:opacity-90"
                  style={{ background: 'var(--sh-primary)' }}
                >
                  ENCONTRAR PROPIEDADES
                </button>
              </div>
            </div>

            {recoResults && (
              <div className="mt-6 pt-6 border-t border-[var(--sh-border-soft)]">
                <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--sh-primary)] mb-4">
                  Estas propiedades podrían interesarte
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recoResults.length > 0 ? (
                    recoResults.map(l => (
                      <PropertyCard
                        key={l.id}
                        listing={l}
                        compact
                        compareActive={compareIds.includes(l.id)}
                        onSelect={onSelect}
                        onCompare={onToggleCompare}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-[var(--sh-muted)]">No encontramos propiedades con esos criterios. Probá ampliar el presupuesto o las habitaciones.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(l => (
            <PropertyCard
              key={l.id}
              listing={l}
              compareActive={compareIds.includes(l.id)}
              compareDisabled={compareIds.length >= 3 && !compareIds.includes(l.id)}
              onSelect={onSelect}
              onCompare={onToggleCompare}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="font-display text-[var(--sh-text)] text-xl">Sin resultados</p>
            <p className="text-sm text-[var(--sh-muted)] mt-2">Probá ajustar los filtros.</p>
          </div>
        )}

        <footer className="mt-16 pt-8 border-t border-[var(--sh-border-soft)] text-center space-y-1">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--sh-muted)]">
            {agency.name} · Experiencia digital desarrollada con ScanHouse
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)]">
            ScanHouse — Desarrollado por Nodo Ético — Sistemas Inteligentes
          </p>
        </footer>
      </div>
    </div>
  );
}