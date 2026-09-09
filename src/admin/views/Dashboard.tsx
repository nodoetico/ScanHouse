import { useSession } from '../../context/SessionContext';
import { Card, StatCard, SectionTitle, Badge, formatNumber } from '../ui';
import { statusColor } from '../ui';

const activityIcon: Record<string, string> = {
  'nuevo-lead': '+',
  'visita-solicitada': '▣',
  'plano-interactivo': '⌗',
  'consulta-ia': '?',
  whatsapp: '✉',
  'visita-confirmada': '✓',
  'tour-completado': '◉',
};

export default function Dashboard() {
  const { agency } = useSession();
  if (!agency) return null;

  const activeProperties = agency.properties.filter(p => p.status === 'activa').length;
  const top = [...agency.properties].sort((a, b) => b.visitors - a.visitors).slice(0, 5);

  return (
    <div className="animate-fade-in">
      <SectionTitle
        title="Inicio"
        subtitle={`Hola, bienvenido al panel de ${agency.name}. Este es el resumen de tu actividad.`}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
        <StatCard label="Prop. activas" value={String(activeProperties)} hint={`${agency.properties.length} publicadas`} />
        <StatCard label="Visitantes" value={formatNumber(agency.analytics.visitors)} hint={`${formatNumber(agency.analytics.uniqueVisitors)} únicos`} accent={agency.branding.primaryColor} />
        <StatCard label="Leads" value={String(agency.analytics.leads)} hint={`${agency.analytics.interactions} interacciones`} />
        <StatCard label="Visitas solicitadas" value={String(agency.analytics.visitRequests)} hint={`${agency.analytics.toursCompleted} tours completos`} />
        <StatCard label="Consultas IA" value={String(agency.analytics.aiConversations)} />
        <StatCard label="WhatsApp" value={String(agency.analytics.whatsappContacts)} hint={`promedio ${agency.analytics.avgTime}`} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-white text-lg">Propiedades con mayor interacción</h3>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/35">Últimos 30 días</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  <th className="text-left pb-3 font-normal">Propiedad</th>
                  <th className="text-right pb-3 font-normal">Visitantes</th>
                  <th className="text-right pb-3 font-normal">Tiempo</th>
                  <th className="text-right pb-3 font-normal">Interacc.</th>
                  <th className="text-right pb-3 font-normal">IA</th>
                  <th className="text-right pb-3 font-normal">Leads</th>
                  <th className="text-right pb-3 font-normal">Visitas</th>
                </tr>
              </thead>
              <tbody>
                {top.map(p => (
                  <tr key={p.id} className="border-t border-white/5">
                    <td className="py-3 pr-3 text-white/90 whitespace-nowrap">{p.name}</td>
                    <td className="py-3 text-right text-white/70" style={{ color: agency.branding.primaryColor }}>{formatNumber(p.visitors)}</td>
                    <td className="py-3 text-right text-white/50 font-mono text-xs">{p.avgTime}</td>
                    <td className="py-3 text-right text-white/70">{formatNumber(p.interactions)}</td>
                    <td className="py-3 text-right text-white/70">{p.aiQuestions}</td>
                    <td className="py-3 text-right text-white/70">{p.leads}</td>
                    <td className="py-3 text-right text-white/70">{p.visits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-white text-lg mb-4">Actividad reciente</h3>
          <ul className="flex flex-col gap-1">
            {agency.activity.slice(0, 8).map(a => (
              <li key={a.id} className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
                <span
                  className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg font-mono text-sm border"
                  style={{ color: agency.branding.primaryColor, borderColor: `${agency.branding.primaryColor}40`, background: `${agency.branding.primaryColor}14` }}
                >
                  {activityIcon[a.type] ?? '•'}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-white/85 leading-snug">{a.description}</p>
                  <span className="text-xs text-white/35 font-mono">{a.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {agency.properties.map(p => (
          <Badge key={p.id} accent={statusColor(p.status)}>{p.name} · {p.status}</Badge>
        ))}
      </div>
    </div>
  );
}