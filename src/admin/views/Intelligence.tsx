import { useEffect, useState } from 'react';
import { useSession } from '../../context/SessionContext';
import { Card, StatCard, SectionTitle, Badge } from '../ui';
import { formatNumber } from '../ui';
import { comparisonsFor, searchInterests } from '../../data/comparisons';
import { liveEventsFor, subscribeLive, liveEventLabel, liveEventIcon, type LiveEventKind } from '../../data/liveActivity';

type Tab = 'analiticas' | 'preguntas' | 'comportamiento' | 'interaccion' | 'comparacion';

const tabs: { id: Tab; label: string }[] = [
  { id: 'analiticas', label: 'Analíticas' },
  { id: 'preguntas', label: 'Preguntas frecuentes' },
  { id: 'comportamiento', label: 'Comportamiento' },
  { id: 'interaccion', label: 'Interacción con propiedades' },
  { id: 'comparacion', label: 'Comparación' },
];

function ago(ts: number): string {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return `hace ${s} s`;
  const m = Math.round(s / 60);
  if (m < 60) return `hace ${m} min`;
  return `hace ${Math.round(m / 60)} h`;
}

export default function Intelligence() {
  const { agency } = useSession();
  const [tab, setTab] = useState<Tab>('analiticas');

  if (!agency) return null;

  const propName = (id: string) => agency.properties.find(p => p.id === id)?.name ?? id;
  const maxFaq = Math.max(...agency.aiQuestions.map(q => q.count), 1);
  const comparisons = comparisonsFor(agency);
  const maxComp = Math.max(...comparisons.map(c => c.count), 1);
  const [live, setLive] = useState(() => liveEventsFor(agency.id));

  useEffect(() => {
    setLive(liveEventsFor(agency.id));
    return subscribeLive(() => setLive(liveEventsFor(agency.id)));
  }, [agency.id]);

  const liveFeed = live.length > 0
    ? live
    : agency.activity.slice(0, 4).map(a => {
        const kind: LiveEventKind =
          a.type === 'plano-interactivo' ? 'plano'
          : a.type === 'consulta-ia' ? 'ia'
          : a.type === 'whatsapp' ? 'whatsapp'
          : a.type === 'nuevo-lead' ? 'vista-propiedad'
          : a.type === 'tour-completado' ? 'tour-360'
          : 'visita';
        return { id: 0, agencyId: agency.id, propertyName: a.description, kind, time: Date.now() };
      });
  const isLiveFeed = live.length > 0;

  return (
    <div className="animate-fade-in">
      <SectionTitle
        title="Inteligencia"
        subtitle="Entendé qué hacen y qué buscan tus visitantes. No solamente responde preguntas: la IA genera inteligencia comercial."
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-widest border transition-colors cursor-pointer ${
              tab === t.id ? 'text-[var(--sh-text)] bg-[var(--sh-inset)] border-[var(--sh-border-strong)]' : 'text-[var(--sh-muted)] border-[var(--sh-border)] hover:text-[var(--sh-text-soft)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'analiticas' && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          <StatCard label="Visitantes" value={formatNumber(agency.analytics.visitors)} />
          <StatCard label="Únicos" value={formatNumber(agency.analytics.uniqueVisitors)} />
          <StatCard label="Tiempo promedio" value={agency.analytics.avgTime} />
          <StatCard label="Tours completos" value={formatNumber(agency.analytics.toursCompleted)} />
          <StatCard label="Interacciones" value={formatNumber(agency.analytics.interactions)} accent={agency.branding.primaryColor} />
          <StatCard label="Leads" value={String(agency.analytics.leads)} />
          <StatCard label="Visitas solicitadas" value={String(agency.analytics.visitRequests)} />
          <StatCard label="WhatsApp" value={String(agency.analytics.whatsappContacts)} />
          <StatCard label="Conversaciones IA" value={formatNumber(agency.analytics.aiConversations)} />
          <Card className="p-5 flex flex-col justify-center">
            <span className="text-[11px] uppercase tracking-widest text-[var(--sh-muted)] font-mono">Fuente</span>
            <span className="text-[var(--sh-text)] font-display">Experiencia 360° + WhatsApp</span>
          </Card>
        </div>
      )}

      {tab === 'preguntas' && (
        <Card className="p-5">
          <h3 className="font-display text-[var(--sh-text)] text-lg mb-4">Preguntas más frecuentes a la IA</h3>
          <ul className="flex flex-col gap-3">
            {agency.aiQuestions.map(q => (
              <li key={q.question}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[var(--sh-text)] text-sm truncate">"{q.question}"</p>
                    <p className="text-xs text-[var(--sh-faint)] font-mono mt-0.5">
                      {propName(q.propertyId)} · {q.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-sm text-[var(--sh-text)]">{q.count} consultas</span>
                    <Badge accent={q.trend === 'up' ? '#34d399' : q.trend === 'down' ? '#f87171' : '#fbbf24'}>
                      {q.trend === 'up' ? '↑' : q.trend === 'down' ? '↓' : '→'}
                    </Badge>
                  </div>
                </div>
                <div className="mt-1.5 h-1 rounded-full bg-[var(--sh-inset)] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(q.count / maxFaq) * 100}%`, background: agency.branding.primaryColor }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {tab === 'comportamiento' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="font-display text-[var(--sh-text)] text-lg mb-4">Ambientes más visitados</h3>
            <ul className="flex flex-col gap-2">
              {agency.analytics.environmentVisits.slice(0, 5).map((env, i) => (
                <li key={i} className="flex items-center justify-between py-2 border-b border-[var(--sh-border-soft)] last:border-0">
                  <span className="text-sm text-[var(--sh-text)]">{env.scene}</span>
                  <span className="font-mono text-xs text-[var(--sh-text-soft)]">⏱ {env.time}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <h3 className="font-display text-[var(--sh-text)] text-lg mb-4">Señales de comportamiento</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between"><span className="text-[var(--sh-text-soft)]">Tours completos</span><span className="text-[var(--sh-text)]" style={{ color: agency.branding.primaryColor }}>{formatNumber(agency.analytics.toursCompleted)}</span></div>
              <div className="flex items-center justify-between"><span className="text-[var(--sh-text-soft)]">Uso del plano interactivo</span><span className="text-[var(--sh-text)]">{formatNumber(Math.round(agency.analytics.interactions * 0.18))} veces</span></div>
              <div className="flex items-center justify-between"><span className="text-[var(--sh-text-soft)]">Navegación entre burbujas</span><span className="text-[var(--sh-text)]">{formatNumber(Math.round(agency.analytics.interactions * 0.62))} veces</span></div>
              <div className="flex items-center justify-between"><span className="text-[var(--sh-text-soft)]">Conversaciones con IA</span><span className="text-[var(--sh-text)]">{formatNumber(agency.analytics.aiConversations)}</span></div>
            </div>
            <p className="mt-5 text-xs text-[var(--sh-faint)]">
              "No solamente sabemos cuántas personas entraron. Sabemos qué les interesó."
            </p>
          </Card>
        </div>
      )}

      {tab === 'interaccion' && (
        <Card className="p-5">
          <h3 className="font-display text-[var(--sh-text)] text-lg mb-4">Interacción con propiedades</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)]">
                  <th className="text-left pb-3 font-normal">Propiedad</th>
                  <th className="text-right pb-3 font-normal">Visitantes</th>
                  <th className="text-right pb-3 font-normal">Tiempo prom.</th>
                  <th className="text-right pb-3 font-normal">Interacciones</th>
                  <th className="text-right pb-3 font-normal">Consultas IA</th>
                  <th className="text-right pb-3 font-normal">Leads</th>
                  <th className="text-right pb-3 font-normal">Visitas</th>
                </tr>
              </thead>
              <tbody>
                {[...agency.properties]
                  .sort((a, b) => b.visitors - a.visitors)
                  .map(p => (
                    <tr key={p.id} className="border-t border-[var(--sh-border-soft)]">
                      <td className="py-3 pr-3 text-[var(--sh-text)] whitespace-nowrap">{p.name}</td>
                      <td className="py-3 text-right"><span style={{ color: agency.branding.primaryColor }}>{formatNumber(p.visitors)}</span></td>
                      <td className="py-3 text-right font-mono text-xs text-[var(--sh-muted)]">{p.avgTime}</td>
                      <td className="py-3 text-right text-[var(--sh-text-soft)]">{formatNumber(p.interactions)}</td>
                      <td className="py-3 text-right text-[var(--sh-text-soft)]">{p.aiQuestions}</td>
                      <td className="py-3 text-right text-[var(--sh-text-soft)]">{p.leads}</td>
                      <td className="py-3 text-right text-[var(--sh-text-soft)]">{p.visits}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    {tab === 'comparacion' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="font-display text-[var(--sh-text)] text-lg">Actividad reciente de clientes</h3>
              {isLiveFeed && (
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#34d399]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                  En vivo
                </span>
              )}
            </div>
            <ul className="flex flex-col gap-2.5">
              {liveFeed.map((e, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="w-7 h-7 shrink-0 rounded-lg bg-[var(--sh-inset)] flex items-center justify-center text-xs" style={{ color: 'var(--sh-primary)' }}>
                    {liveEventIcon[e.kind] ?? '•'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[var(--sh-text)]">{liveEventLabel[e.kind] ?? 'Actividad del cliente'}<span className="text-[var(--sh-faint)]"> — </span>{e.propertyName}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)] mt-0.5">
                      {ago(e.time)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-[var(--sh-faint)]">
              Cada interacción del cliente en la experiencia pública se convierte en información comercial.
            </p>
          </Card>

          <Card className="p-5">
            <h3 className="font-display text-[var(--sh-text)] text-lg mb-4">Comportamiento de comparación</h3>
            <p className="text-xs text-[var(--sh-faint)] mb-4">
              Propiedades comparadas entre sí durante la experiencia del cliente.
            </p>
            {comparisons.length === 0 && (
              <p className="text-sm text-[var(--sh-muted)]">Aún no hay comparaciones registradas para esta agencia.</p>
            )}
            <ul className="flex flex-col gap-3">
              {comparisons.map(c => (
                <li key={`${c.fromPropertyId}-${c.toPropertyId}`}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[var(--sh-text)]">
                      {propName(c.fromPropertyId)} <span className="text-[var(--sh-faint)]">↔</span> {propName(c.toPropertyId)}
                    </span>
                    <span className="font-mono text-xs text-[var(--sh-text)]">{c.count} veces</span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-[var(--sh-inset)] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(c.count / maxComp) * 100}%`, background: agency.branding.primaryColor }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 lg:col-span-2">
            <h3 className="font-display text-[var(--sh-text)] text-lg mb-3">¿Qué están buscando los clientes?</h3>
            <p className="text-xs text-[var(--sh-faint)] mb-5">
              Distribución de temas consultados por los visitantes de tus publicaciones.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {searchInterests.map(s => (
                <div key={s.topic} className="rounded-xl border border-[var(--sh-border-soft)] bg-[var(--sh-surface)] p-4">
                  <p className="font-mono text-2xl text-[var(--sh-text)]" style={{ color: agency.branding.primaryColor }}>
                    {s.pct}%
                  </p>
                  <p className="text-xs text-[var(--sh-text-soft)] mt-1">{s.topic}</p>
                  <div className="mt-3 h-1 rounded-full bg-[var(--sh-inset)] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: agency.branding.primaryColor }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}