import { useState } from 'react';
import { useSession } from '../../context/SessionContext';
import { Card, SectionTitle, Badge, formatDate, statusColor, statusLabel } from '../ui';
import type { VisitStatus } from '../../types/agency';

const sections: { id: VisitStatus; label: string }[] = [
  { id: 'Proxima', label: 'Próximas' },
  { id: 'Pendiente', label: 'Pendientes de confirmación' },
  { id: 'Confirmada', label: 'Confirmadas' },
  { id: 'Historial', label: 'Historial' },
];

const order: VisitStatus[] = ['Proxima', 'Pendiente', 'Confirmada', 'Historial'];

export default function Visits() {
  const { agency } = useSession();
  const [section, setSection] = useState<VisitStatus>('Proxima');
  const [visits, setVisits] = useState(agency?.visits ?? []);

  if (!agency) return null;

  const filtered = visits.filter(v => v.status === section);
  const propName = (id: string) => agency.properties.find(p => p.id === id)?.name ?? id;

  const confirm = (id: string) => setVisits(prev => prev.map(v => (v.id === id ? { ...v, status: 'Confirmada' } : v)));

  return (
    <div className="animate-fade-in">
      <SectionTitle title="Visitas" subtitle="Agenda de visitas guiadas. Coordiná, confirmá y hacé seguimiento de cada encuentro con tus clientes." />

      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-widest border transition-colors cursor-pointer ${
              section === s.id ? 'text-[var(--sh-text)] bg-[var(--sh-inset)] border-[var(--sh-border-strong)]' : 'text-[var(--sh-muted)] border-[var(--sh-border)] hover:text-[var(--sh-text-soft)]'
            }`}
          >
            {s.label} · {visits.filter(v => v.status === s.id).length}
          </button>
        ))}
      </div>

      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)]">
                <th className="text-left pb-3 font-normal">Cliente</th>
                <th className="text-left pb-3 font-normal">Propiedad</th>
                <th className="text-left pb-3 font-normal">Fecha</th>
                <th className="text-left pb-3 font-normal">Hora</th>
                <th className="text-left pb-3 font-normal">Estado</th>
                <th className="text-left pb-3 font-normal">Asesor</th>
                <th className="text-right pb-3 font-normal">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id} className="border-t border-[var(--sh-border-soft)]">
                  <td className="py-3 pr-3 text-[var(--sh-text)] whitespace-nowrap">{v.client}</td>
                  <td className="py-3 pr-3 text-[var(--sh-muted)] whitespace-nowrap">{propName(v.propertyId)}</td>
                  <td className="py-3 pr-3 text-[var(--sh-muted)] font-mono text-xs whitespace-nowrap">{formatDate(v.date)}</td>
                  <td className="py-3 pr-3 text-[var(--sh-muted)] font-mono text-xs whitespace-nowrap">{v.time}</td>
                  <td className="py-3 pr-3"><Badge accent={statusColor(v.status)}>{statusLabel(v.status)}</Badge></td>
                  <td className="py-3 pr-3 text-[var(--sh-muted)] whitespace-nowrap">{v.advisor}</td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-1.5">
                      {v.status !== 'Confirmada' && v.status !== 'Historial' && (
                        <button
                          onClick={() => confirm(v.id)}
                          className="px-2.5 py-1 rounded-lg text-xs text-[var(--sh-on-primary)] transition-colors cursor-pointer font-medium"
                          style={{ background: agency.branding.primaryColor }}
                        >
                          Confirmar
                        </button>
                      )}
                      <button className="px-2.5 py-1 rounded-lg border border-[var(--sh-border)] text-xs text-[var(--sh-text)] hover:bg-[var(--sh-inset)] transition-colors cursor-pointer">
                        Contactar
                      </button>
                      {v.status !== 'Historial' && (
                        <button className="px-2.5 py-1 rounded-lg border border-[var(--sh-border)] text-xs text-[var(--sh-text-soft)] hover:bg-[var(--sh-inset)] transition-colors cursor-pointer">
                          Reprogramar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-[var(--sh-faint)]">No hay visitas en esta sección.</p>
        )}
      </Card>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 col-span-full lg:col-span-1">
          <h3 className="font-display text-[var(--sh-text)] text-sm mb-3">Resumen</h3>
          {order.map(o => (
            <div key={o} className="flex items-center justify-between py-1.5 text-sm">
              <span className="text-[var(--sh-text-soft)]">{statusLabel(o)}</span>
              <span className="text-[var(--sh-text)] font-display">{visits.filter(v => v.status === o).length}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}