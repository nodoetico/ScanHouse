import { useState } from 'react';
import { useSession } from '../../context/SessionContext';
import { Card, SectionTitle, Badge, Select, formatDate, statusColor } from '../ui';
import type { LeadStatus } from '../../types/agency';

const statuses: LeadStatus[] = ['Nuevo', 'Contactado', 'Interesado', 'Visita solicitada', 'Visita confirmada', 'Cerrado'];

const leadStatusOrder: LeadStatus[] = ['Nuevo', 'Contactado', 'Interesado', 'Visita solicitada', 'Visita confirmada', 'Cerrado'];

export default function Leads() {
  const { agency } = useSession();
  const [status, setStatus] = useState('todos');
  const [property, setProperty] = useState('todos');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [leads, setLeads] = useState(agency?.leads ?? []);

  if (!agency) return null;

  const filtered = leads.filter(l => {
    if (status !== 'todos' && l.status !== status) return false;
    if (property !== 'todos' && l.propertyId !== property) return false;
    return true;
  });

  const propName = (id: string) => agency.properties.find(p => p.id === id)?.name ?? id;
  const setLeadStatus = (id: string, s: LeadStatus) => {
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, status: s } : l)));
  };

  const selected = leads.find(l => l.id === selectedId) ?? null;

  return (
    <div className="animate-fade-in">
      <SectionTitle title="Leads" subtitle="Todas las oportunidades generadas desde las experiencias 360°, WhatsApp, portales y redes." />

      <div className="flex flex-wrap gap-2 mb-5">
        <Select
          value={status}
          onChange={setStatus}
          options={[{ label: 'Todos los estados', value: 'todos' }, ...statuses.map(s => ({ label: s, value: s }))]}
        />
        <Select
          value={property}
          onChange={setProperty}
          options={[{ label: 'Todas las propiedades', value: 'todos' }, ...agency.properties.map(p => ({ label: p.name, value: p.id }))]}
        />
        <span className="ml-auto self-center font-mono text-[11px] uppercase tracking-widest text-[var(--sh-faint)]">{filtered.length} leads</span>
      </div>

      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)]">
                <th className="text-left pb-3 font-normal">Nombre</th>
                <th className="text-left pb-3 font-normal">Propiedad</th>
                <th className="text-left pb-3 font-normal">Estado</th>
                <th className="text-left pb-3 font-normal">Fecha</th>
                <th className="text-left pb-3 font-normal">Origen</th>
                <th className="text-left pb-3 font-normal">Asesor</th>
                <th className="text-right pb-3 font-normal">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr
                  key={l.id}
                  className="border-t border-[var(--sh-border-soft)] hover:bg-[var(--sh-surface)] transition-colors cursor-pointer"
                  onClick={() => setSelectedId(l.id)}
                >
                  <td className="py-3 pr-3 text-[var(--sh-text)] whitespace-nowrap">{l.name}</td>
                  <td className="py-3 pr-3 text-[var(--sh-muted)] whitespace-nowrap">{propName(l.propertyId)}</td>
                  <td className="py-3 pr-3"><Badge accent={statusColor(l.status)}>{l.status}</Badge></td>
                  <td className="py-3 pr-3 text-[var(--sh-muted)] font-mono text-xs whitespace-nowrap">{formatDate(l.date)}</td>
                  <td className="py-3 pr-3 text-[var(--sh-muted)] whitespace-nowrap">{l.origin}</td>
                  <td className="py-3 pr-3 text-[var(--sh-muted)] whitespace-nowrap">{l.advisor}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedId(l.id); }}
                      className="px-3 py-1 rounded-lg border border-[var(--sh-border)] text-xs text-[var(--sh-text)] hover:bg-[var(--sh-inset)] transition-colors cursor-pointer"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <div className="mt-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="font-display text-[var(--sh-text)] text-xl">{selected.name}</h3>
                <p className="text-sm text-[var(--sh-muted)] mt-1">{selected.email} · {selected.phone}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 rounded-lg border border-[var(--sh-border)] text-xs text-[var(--sh-text)] hover:bg-[var(--sh-inset)] transition-colors cursor-pointer">Contactar</button>
                <button className="px-3 py-1.5 rounded-lg text-xs text-[var(--sh-on-primary)] transition-colors cursor-pointer font-medium" style={{ background: agency.branding.primaryColor }}>WhatsApp</button>
                <button
                  onClick={() => setSelectedId(null)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--sh-border)] text-xs text-[var(--sh-text)] hover:bg-[var(--sh-inset)] transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-muted)] mb-3">Información</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-[var(--sh-faint)] block font-mono text-[10px] uppercase tracking-widest">Propiedad</span><span className="text-[var(--sh-text)]">{propName(selected.propertyId)}</span></div>
                  <div><span className="text-[var(--sh-faint)] block font-mono text-[10px] uppercase tracking-widest">Estado</span>
                    <span className="inline-block mt-1"><Badge accent={statusColor(selected.status)}>{selected.status}</Badge></span>
                  </div>
                  <div><span className="text-[var(--sh-faint)] block font-mono text-[10px] uppercase tracking-widest">Fecha</span><span className="text-[var(--sh-text)]">{formatDate(selected.date)}</span></div>
                  <div><span className="text-[var(--sh-faint)] block font-mono text-[10px] uppercase tracking-widest">Origen</span><span className="text-[var(--sh-text)]">{selected.origin}</span></div>
                  <div><span className="text-[var(--sh-faint)] block font-mono text-[10px] uppercase tracking-widest">Asesor</span><span className="text-[var(--sh-text)]">{selected.advisor}</span></div>
                </div>

                <h4 className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-muted)] mb-2 mt-6">Cambiar estado</h4>
                <div className="flex flex-wrap gap-1.5">
                  {leadStatusOrder.map(s => (
                    <button
                      key={s}
                      onClick={() => setLeadStatus(selected.id, s)}
                      className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-mono border transition-colors cursor-pointer ${
                        selected.status === s ? 'text-[var(--sh-on-primary)]' : 'text-[var(--sh-text-soft)] border-[var(--sh-border)] hover:border-[var(--sh-border-strong)]'
                      }`}
                      style={selected.status === s ? { background: agency.branding.primaryColor, borderColor: agency.branding.primaryColor } : undefined}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-muted)] mb-3">Interacciones</h4>
                <div className="flex flex-col gap-2">
                  {selected.interactions.map((it, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-[var(--sh-border-soft)] last:border-0">
                      <span className="font-mono text-xs text-[var(--sh-faint)] shrink-0">{it.time}</span>
                      <span className="text-sm text-[var(--sh-text)]">{it.description}</span>
                    </div>
                  ))}
                  {selected.interactions.length === 0 && (
                    <p className="text-sm text-[var(--sh-faint)]">Sin interacciones registradas.</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}