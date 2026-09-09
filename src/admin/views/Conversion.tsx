import { useState } from 'react';
import { useSession } from '../../context/SessionContext';
import { Card, SectionTitle, Badge, formatNumber } from '../ui';

type Tab = 'seguimiento' | 'automatizaciones' | 'metricas';

const tabs: { id: Tab; label: string }[] = [
  { id: 'seguimiento', label: 'Seguimiento' },
  { id: 'automatizaciones', label: 'Automatizaciones' },
  { id: 'metricas', label: 'Métricas comerciales' },
];

const journey = [
  ['VISITANTE', 'Visitó la propiedad en 360°'],
  ['INTERÉS', 'Consultó a la IA sobre la propiedad'],
  ['NECESIDAD', 'Preguntó por cochera / financiación / expensas'],
  ['CONTACTO', 'Solicitó información o escribió por WhatsApp'],
  ['VISITA', 'Solicitó una visita guiada'],
  ['OPORTUNIDAD', 'Visita confirmada y seguimiento en curso'],
];

export default function Conversion() {
  const { agency } = useSession();
  const [tab, setTab] = useState<Tab>('seguimiento');

  if (!agency) return null;

  const maxFunnel = Math.max(...agency.analytics.funnel.map(f => f.value), 1);

  return (
    <div className="animate-fade-in">
      <SectionTitle
        title="Conversión"
        subtitle="Convertí ese interés en oportunidades comerciales. Cada visita 360° puede transformarse en un lead, una visita y un negocio."
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

      {tab === 'seguimiento' && (
        <div>
          <Card className="p-5 mb-5">
            <h3 className="font-display text-[var(--sh-text)] text-lg mb-1">Recorrido comercial del visitante</h3>
            <p className="text-sm text-[var(--sh-muted)]">De visitante anónimo a oportunidad comercial calificada.</p>
            <div className="mt-5 flex flex-col md:flex-row items-stretch justify-between gap-2">
              {journey.map(([stage, desc], i) => (
                <div key={stage} className="flex-1 flex items-center gap-2">
                  <div className="flex-1 rounded-xl border border-[var(--sh-border)] bg-[var(--sh-surface)] p-3 text-center">
                    <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: agency.branding.primaryColor }}>
                      {stage}
                    </div>
                    <div className="text-xs text-[var(--sh-text-soft)] mt-1">{desc}</div>
                  </div>
                  {i < journey.length - 1 && <span className="text-[var(--sh-faint)] hidden md:block">→</span>}
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-5">
              <h3 className="font-display text-[var(--sh-text)] text-lg mb-4">Ejemplo de seguimiento real</h3>
              <div className="flex flex-col gap-2 font-mono text-xs">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: agency.branding.primaryColor }} /><span className="text-[var(--sh-text-soft)]">10:32 — María Fernanda visitó Casa Laureles</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: agency.branding.primaryColor }} /><span className="text-[var(--sh-text-soft)]">10:34 — Consultó a la IA por cochera</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: agency.branding.primaryColor }} /><span className="text-[var(--sh-text-soft)]">10:40 — Solicitó información</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: agency.branding.primaryColor }} /><span className="text-[var(--sh-text-soft)]">10:42 — Solicitó visita</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: agency.branding.primaryColor }} /><span className="text-[var(--sh-text)] font-semibold">Visita confirmada → Oportunidad</span></div>
              </div>
              <p className="mt-4 text-sm text-[var(--sh-muted)]">
                La IA registra cada paso. El asesor sabe exactamente qué le interesó al cliente antes de la primera llamada.
              </p>
            </Card>

            <Card className="p-5">
              <h3 className="font-display text-[var(--sh-text)] text-lg mb-4">Estado de oportunidades</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Nuevos leads', value: agency.analytics.leads, color: '#60a5fa' },
                  { label: 'Visitas solicitadas', value: agency.analytics.visitRequests, color: '#a78bfa' },
                  { label: 'Visitas confirmadas', value: agency.analytics.funnel.find(f => f.label === 'Visitas confirmadas')?.value ?? 0, color: '#34d399' },
                  { label: 'Oportunidades calificadas', value: agency.analytics.funnel.find(f => f.label === 'Oportunidades')?.value ?? 0, color: agency.branding.primaryColor },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between py-2 border-b border-[var(--sh-border-soft)] last:border-0">
                    <span className="text-sm text-[var(--sh-text-soft)]">{s.label}</span>
                    <span className="font-display text-lg text-[var(--sh-text)]">{s.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === 'automatizaciones' && (
        <Card className="p-5">
          <h3 className="font-display text-[var(--sh-text)] text-lg mb-1">Automatizaciones</h3>
          <p className="text-sm text-[var(--sh-muted)] mb-4">Reglas que mantienen el seguimiento activo y a los asesores notificados.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {agency.automations.map(a => (
              <div key={a.trigger} className="rounded-xl border border-[var(--sh-border)] bg-[var(--sh-surface)] p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm text-[var(--sh-text)] font-medium">{a.trigger}</h4>
                  <Badge accent={a.status === 'activo' ? '#34d399' : '#fbbf24'}>
                    {a.status === 'activo' ? 'Activo' : 'Próximamente'}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--sh-muted)]">→ {a.action}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[var(--sh-faint)]">
            Automatizaciones avanzadas, follow-up automático y CRM integral llegarán en próximas versiones.
          </p>
        </Card>
      )}

      {tab === 'metricas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="font-display text-[var(--sh-text)] text-lg mb-4">Embudo de conversión</h3>
            <div className="flex flex-col gap-3">
              {agency.analytics.funnel.map(f => (
                <div key={f.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[var(--sh-text-soft)]">{f.label}</span>
                    <span className="font-mono text-sm text-[var(--sh-text)]">{formatNumber(f.value)}</span>
                  </div>
                  <div className="h-6 rounded-lg overflow-hidden border border-[var(--sh-border)] bg-[var(--sh-surface-2)]">
                    <div
                      className="h-full rounded-md flex items-center justify-end pr-2"
                      style={{ width: `${(f.value / maxFunnel) * 100}%`, background: `linear-gradient(90deg, ${agency.branding.primaryColor}99, ${agency.branding.primaryColor})` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-display text-[var(--sh-text)] text-lg mb-4">Conversiones</h3>
            <div className="grid grid-cols-2 gap-3">
              {agency.analytics.conversions.map(c => (
                <div key={c.label} className="rounded-xl border border-[var(--sh-border)] bg-[var(--sh-surface)] p-4 text-center">
                  <div className="font-display text-3xl text-[var(--sh-text)]" style={{ color: agency.branding.primaryColor }}>{c.value}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-muted)] mt-1">{c.label}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-[var(--sh-faint)]">
              Los porcentajes se calculan automáticamente sobre los datos reales del embudo.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}