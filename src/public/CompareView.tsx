import type { ListingProperty } from '../types/listing';
import { formatPrice } from '../data/listings';
import { destacados, stars, zoneLabel } from '../data/comparisons';
import { pushLiveEvent } from '../data/liveActivity';

interface CompareViewProps {
  items: ListingProperty[];
  onSelect: (id: string) => void;
  onBack: () => void;
}

function nearby(listing: ListingProperty, kind: ListingProperty['surrounding'][number]['kind']) {
  return listing.surrounding.find(s => s.kind === kind);
}

export default function CompareView({ items, onSelect, onBack }: CompareViewProps) {
  const out = destacados(items);
  const rows: { label: string; cell: (l: ListingProperty) => string }[] = [
    { label: 'Precio', cell: l => formatPrice(l) },
    { label: 'Operación', cell: l => l.operation.toUpperCase() },
    { label: 'Superficie cubierta', cell: l => (l.coveredArea > 0 ? `${l.coveredArea} m²` : '—') },
    { label: 'Terreno', cell: l => (l.landArea > 0 ? `${l.landArea} m²` : '—') },
    { label: 'Habitaciones', cell: l => (l.bedrooms > 0 ? String(l.bedrooms) : '—') },
    { label: 'Baños', cell: l => (l.bathrooms > 0 ? String(l.bathrooms) : '—') },
    { label: 'Cochera', cell: l => (l.garages > 0 ? String(l.garages) : '—') },
    { label: 'Antigüedad', cell: l => l.age },
    { label: 'Ubicación', cell: l => l.location },
    { label: 'Calle asfaltada', cell: l => (l.access.some(a => a.ok && a.label.toLowerCase().includes('asfaltada')) ? 'Sí' : 'No') },
    { label: 'Transporte público', cell: l => (l.access.some(a => a.ok && a.label.toLowerCase().includes('transporte')) ? 'Cerca' : 'No') },
  ];

  const superRow = nearby(items[0], 'comercio');
  const farmRow = nearby(items[0], 'salud');
  const escolaRow = nearby(items[0], 'educacion');

  if (superRow) rows.push({ label: 'Supermercado', cell: l => nearby(l, 'comercio')?.distance ?? '—' });
  if (farmRow) rows.push({ label: 'Farmacia', cell: l => nearby(l, 'salud')?.distance ?? '—' });
  if (escolaRow) rows.push({ label: 'Escuela', cell: l => nearby(l, 'educacion')?.distance ?? '—' });

  (['green', 'commerce', 'services', 'accessibility'] as const).forEach(key => {
    rows.push({ label: zoneLabel[key], cell: l => stars(l.zoneQuality[key]) });
  });

  const compareAgency = items[0]?.agencyId;
  const handleSelect = (id: string) => {
    if (compareAgency) pushLiveEvent(compareAgency, items.find(i => i.id === id)?.name ?? '', 'vista-propiedad');
    onSelect(id);
  };

  return (
    <div className="min-h-screen bg-[var(--sh-bg)] text-[var(--sh-text)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
        <button
          onClick={onBack}
          className="mb-6 font-mono text-[11px] uppercase tracking-widest text-[var(--sh-faint)] hover:text-[var(--sh-text)] transition-colors cursor-pointer"
        >
          ← Volver
        </button>

        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--sh-primary)] mb-2">Comparación inteligente</p>
            <h1 className="font-display text-3xl sm:text-4xl font-medium">COMPARÁ PROPIEDADES</h1>
            <p className="text-sm text-[var(--sh-muted)] mt-2 max-w-xl">
              Entendé las diferencias clave entre las propiedades seleccionadas antes de decidir tu próxima visita.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--sh-border)] bg-[var(--sh-surface-2)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] table-fixed text-sm">
              <thead>
                <tr className="border-b border-[var(--sh-border-soft)]">
                  <th className="sticky left-0 w-44 text-left p-4 align-bottom font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)] bg-[var(--sh-surface-2)] z-10">
                    Criterio
                  </th>
                  {items.map(l => (
                    <th key={l.id} className="p-4 text-left align-bottom">
                      <div className="relative w-full rounded-xl overflow-hidden aspect-[4/3] mb-3">
                        <img src={l.image} alt={l.name} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      <p className="font-display text-[var(--sh-text)] leading-tight">{l.name}</p>
                      <p className="text-[11px] text-[var(--sh-muted)] mt-1">{l.agencyName}</p>
                      <button
                        onClick={() => handleSelect(l.id)}
                        className="mt-2 w-full px-3 py-1.5 rounded-lg text-[11px] font-medium text-[var(--sh-on-primary)] cursor-pointer"
                        style={{ background: 'var(--sh-primary)' }}
                      >
                        VER PROPIEDAD
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.label} className="border-b border-[var(--sh-border-soft)] last:border-0">
                    <td className="sticky left-0 p-4 font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)] bg-[var(--sh-surface-2)] z-10">{row.label}</td>
                    {items.map(l => (
                      <td key={l.id} className="p-4 text-[var(--sh-text)]">
                        {row.cell(l)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <h2 className="font-display text-xl sm:text-2xl mt-12 mb-5">ASPECTOS DESTACADOS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map(l => (
            <div key={l.id} className="rounded-2xl border border-[var(--sh-border)] bg-[var(--sh-surface-2)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <img src={l.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <p className="font-display text-[var(--sh-text)]">{l.name}</p>
              </div>
              <ul className="flex flex-col gap-2 text-sm text-[var(--sh-text-soft)]">
                {(out[l.id]?.length ? out[l.id] : ['Propuesta equilibrada en precio, superficie y ubicación']).map(
                  (f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[var(--sh-primary)] mt-0.5">✓</span>
                      <span>{f}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)]">
          Datos simulados para la demostración · Powered by ScanHouse
        </p>
      </div>
    </div>
  );
}