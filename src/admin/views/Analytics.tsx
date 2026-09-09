import { useState } from 'react';
import { useSession } from '../../context/SessionContext';
import { Card, SectionTitle, StatCard, BarChart, formatNumber } from '../ui';

type Period = '7' | '30' | '90';

export default function Analytics() {
  const { agency } = useSession();
  const [period, setPeriod] = useState<Period>('30');

  if (!agency) return null;

  const take = period === '7' ? 7 : period === '30' ? 30 : 30;
  const visitors = agency.analytics.visitorsByDay.slice(-take);
  const interactions = agency.analytics.interactionsByDay.slice(-take);

  return (
    <div className="animate-fade-in">
      <SectionTitle title="Analíticas" subtitle="Rendimiento integral de tus experiencias inmobiliarias: audiencia, interacción, inteligencia y conversión." />

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {(['7', '30', '90'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-widest border transition-colors cursor-pointer ${
              period === p ? 'text-[var(--sh-text)] bg-[var(--sh-inset)] border-[var(--sh-border-strong)]' : 'text-[var(--sh-muted)] border-[var(--sh-border)] hover:text-[var(--sh-text-soft)]'
            }`}
          >
            {p} días
          </button>
        ))}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)]">Período seleccionado · todos los orígenes</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Visitantes" value={formatNumber(agency.analytics.visitors)} hint={`${formatNumber(agency.analytics.uniqueVisitors)} únicos`} />
        <StatCard label="Interacciones" value={formatNumber(agency.analytics.interactions)} accent={agency.branding.primaryColor} />
        <StatCard label="Conversaciones IA" value={formatNumber(agency.analytics.aiConversations)} />
        <StatCard label="Conversión" value={agency.analytics.conversions[0]?.value ?? '—'} hint="Visitante → Lead" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <h3 className="font-display text-[var(--sh-text)] text-sm mb-4">Visitantes por día</h3>
          <BarChart data={visitors} accent={agency.branding.primaryColor} height={140} />
        </Card>
        <Card className="p-5">
          <h3 className="font-display text-[var(--sh-text)] text-sm mb-4">Interacciones por día</h3>
          <BarChart data={interactions} accent={agency.branding.accentColor} height={140} />
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-display text-[var(--sh-text)] text-lg mb-4">Rendimiento integral</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)]">
                <th className="text-left pb-3 font-normal">Área</th>
                <th className="text-right pb-3 font-normal">Métricas principales</th>
                <th className="text-right pb-3 font-normal">Propiedad destacada</th>
              </tr>
            </thead>
            <tbody>
              {[
                { area: 'Propiedades', value: `${agency.properties.filter(p => p.status === 'activa').length} activas`, top: agency.properties.sort((a, b) => b.visitors - a.visitors)[0]?.name ?? '—' },
                { area: 'Visitantes', value: formatNumber(agency.analytics.uniqueVisitors), top: `${agency.analytics.avgTime} promedio` },
                { area: 'Interacciones', value: formatNumber(agency.analytics.interactions), top: `${formatNumber(Math.round(agency.analytics.interactions * 0.18))} en plano` },
                { area: 'IA', value: `${agency.analytics.aiConversations} conversaciones`, top: `${agency.aiQuestions[0]?.question ?? '—'}` },
                { area: 'Leads', value: String(agency.analytics.leads), top: agency.leads[0]?.name ?? '—' },
                { area: 'Visitas', value: `${agency.analytics.visitRequests} solicitadas`, top: `${agency.analytics.funnel.find(f => f.label === 'Visitas confirmadas')?.value ?? 0} confirmadas` },
                { area: 'WhatsApp', value: String(agency.analytics.whatsappContacts), top: `${Math.round(agency.analytics.whatsappContacts / (agency.analytics.visitors / 10))} por cada 100 visitas` },
                { area: 'Conversiones', value: agency.analytics.conversions[1]?.value ?? '—', top: `${agency.analytics.conversions[3]?.value ?? '—'} a oportunidad` },
              ].map((row) => (
                <tr key={row.area} className="border-t border-[var(--sh-border-soft)]">
                  <td className="py-3 pr-3 text-[var(--sh-text)] whitespace-nowrap">{row.area}</td>
                  <td className="py-3 pr-3 text-right text-[var(--sh-text-soft)] whitespace-nowrap">{row.value}</td>
                  <td className="py-3 text-right text-[var(--sh-muted)] whitespace-nowrap">{row.top}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}