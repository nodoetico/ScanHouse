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
              section === s.id ? 'text-white bg-white/10 border-white/30' : 'text-white/50 border-white/10 hover:text-white/80'
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
              <tr className="font-mono text-[10px] uppercase tracking-widest text-white/40">
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
                <tr key={v.id} className="border-t border-white/5">
                  <td className="py-3 pr-3 text-white/90 whitespace-nowrap">{v.client}</td>
                  <td className="py-3 pr-3 text-white/55 whitespace-nowrap">{propName(v.propertyId)}</td>
                  <td className="py-3 pr-3 text-white/55 font-mono text-xs whitespace-nowrap">{formatDate(v.date)}</td>
                  <td className="py-3 pr-3 text-white/55 font-mono text-xs whitespace-nowrap">{v.time}</td>
                  <td className="py-3 pr-3"><Badge accent={statusColor(v.status)}>{statusLabel(v.status)}</Badge></td>
                  <td className="py-3 pr-3 text-white/55 whitespace-nowrap">{v.advisor}</td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-1.5">
                      {v.status !== 'Confirmada' && v.status !== 'Historial' && (
                        <button
                          onClick={() => confirm(v.id)}
                          className="px-2.5 py-1 rounded-lg text-xs text-black transition-colors cursor-pointer font-medium"
                          style={{ background: agency.branding.primaryColor }}
                        >
                          Confirmar
                        </button>
                      )}
                      <button className="px-2.5 py-1 rounded-lg border border-white/15 text-xs text-white/80 hover:bg-white/5 transition-colors cursor-pointer">
                        Contactar
                      </button>
                      {v.status !== 'Historial' && (
                        <button className="px-2.5 py-1 rounded-lg border border-white/15 text-xs text-white/60 hover:bg-white/5 transition-colors cursor-pointer">
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
          <p className="py-8 text-center text-sm text-white/40">No hay visitas en esta sección.</p>
        )}
      </Card>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 col-span-full lg:col-span-1">
          <h3 className="font-display text-white text-sm mb-3">Resumen</h3>
          {order.map(o => (
            <div key={o} className="flex items-center justify-between py-1.5 text-sm">
              <span className="text-white/60">{statusLabel(o)}</span>
              <span className="text-white font-display">{visits.filter(v => v.status === o).length}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}