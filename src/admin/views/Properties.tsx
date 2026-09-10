import { useState } from 'react';
import { useSession } from '../../context/SessionContext';
import { Card, SectionTitle, Badge, formatMoney, formatNumber, statusLabel, statusColor } from '../ui';

type Filter = 'todas' | 'activa' | 'pausada' | 'en-preparacion';

export default function Properties({ onOpenExperience }: { onOpenExperience: (propertyId: string) => void }) {
  const { agency } = useSession();
  const [filter, setFilter] = useState<Filter>('todas');
  const [selected, setSelected] = useState<string | null>(null);

  if (!agency) return null;

  const filtered = agency.properties.filter(p => filter === 'todas' || p.status === filter);
  const counts = {
    todas: agency.properties.length,
    activa: agency.properties.filter(p => p.status === 'activa').length,
    pausada: agency.properties.filter(p => p.status === 'pausada').length,
    'en-preparacion': agency.properties.filter(p => p.status === 'en-preparacion').length,
  };

  return (
    <div className="animate-fade-in">
      <SectionTitle title="Propiedades" subtitle="Gestioná las publicaciones con experiencia 360° y seguí su rendimiento." />

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {(['todas', 'activa', 'pausada', 'en-preparacion'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-widest border transition-colors cursor-pointer ${
              filter === f ? 'text-[var(--sh-text)] bg-[var(--sh-inset)] border-[var(--sh-border-strong)]' : 'text-[var(--sh-muted)] border-[var(--sh-border)] hover:text-[var(--sh-text-soft)]'
            }`}
          >
            {statusLabel(f)} · {counts[f]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map(p => (
          <Card key={p.id} className="overflow-hidden">
            <div className="relative h-44">
              <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <Badge accent={statusColor(p.status)}>{statusLabel(p.status)}</Badge>
              </div>
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
                <div>
                  <h3 className="font-display text-[var(--sh-text)] text-xl">{p.name}</h3>
                  <p className="text-xs text-[var(--sh-text-soft)] mt-0.5">{p.location}</p>
                </div>
                <span className="font-mono text-sm text-[var(--sh-text)] shrink-0">{formatMoney(p.price, p.currency)}</span>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <div className="text-[var(--sh-text)] font-display text-lg" style={{ color: agency.branding.primaryColor }}>{formatNumber(p.visitors)}</div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--sh-faint)]">Visitantes</div>
                </div>
                <div className="text-center">
                  <div className="text-[var(--sh-text)] font-display text-lg">{p.leads}</div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--sh-faint)]">Leads</div>
                </div>
                <div className="text-center">
                  <div className="text-[var(--sh-text)] font-display text-lg">{p.aiQuestions}</div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--sh-faint)]">Consultas IA</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {p.bedrooms > 0 && <Badge accent="#ffffff">{p.bedrooms} dorm.</Badge>}
                {p.bathrooms > 0 && <Badge accent="#ffffff">{p.bathrooms} baño{p.bathrooms > 1 ? 's' : ''}</Badge>}
                {p.coveredArea > 0 && <Badge accent="#ffffff">{p.coveredArea} m²</Badge>}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[var(--sh-border-soft)]">
                <button
                  onClick={() => setSelected(selected === p.id ? null : p.id)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--sh-border)] text-xs text-[var(--sh-text)] hover:bg-[var(--sh-inset)] transition-colors cursor-pointer flex-1 min-w-[100px]"
                >
                  {selected === p.id ? 'Ocultar detalle' : 'Ver'}
                </button>
                <button
                  onClick={() => onOpenExperience(p.id)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[var(--sh-on-primary)] transition-colors cursor-pointer flex-1 min-w-[100px] font-medium"
                  style={{ background: agency.branding.primaryColor }}
                >
                  Ver experiencia
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-[var(--sh-border)] text-xs text-[var(--sh-text)] hover:bg-[var(--sh-inset)] transition-colors cursor-pointer flex-1 min-w-[100px]">
                  Analizar
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-[var(--sh-border)] text-xs text-[var(--sh-text)] hover:bg-[var(--sh-inset)] transition-colors cursor-pointer flex-1 min-w-[100px]">
                  Editar
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selected && (
        <div className="mt-6">
          {agency.properties.filter(p => p.id === selected).map(p => (
            <Card key={p.id} className="p-5">
              <h4 className="font-display text-[var(--sh-text)] mb-3">Detalle — {p.name}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div><span className="text-[var(--sh-faint)] block font-mono text-[10px] uppercase tracking-widest">Tiempo promedio</span><span className="text-[var(--sh-text)]">{p.avgTime}</span></div>
                <div><span className="text-[var(--sh-faint)] block font-mono text-[10px] uppercase tracking-widest">Interacciones</span><span className="text-[var(--sh-text)]">{formatNumber(p.interactions)}</span></div>
                <div><span className="text-[var(--sh-faint)] block font-mono text-[10px] uppercase tracking-widest">Visitas</span><span className="text-[var(--sh-text)]">{p.visits} ({p.confirmedVisits} confirmadas)</span></div>
                <div><span className="text-[var(--sh-faint)] block font-mono text-[10px] uppercase tracking-widest">WhatsApp</span><span className="text-[var(--sh-text)]">{p.whatsappContacts} contactos</span></div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}