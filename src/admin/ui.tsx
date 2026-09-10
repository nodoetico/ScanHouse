import type { CSSProperties, ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[var(--sh-border)] bg-[var(--sh-surface)] backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: string;
}) {
  return (
    <Card className="p-5 flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-widest text-[var(--sh-muted)] font-mono">{label}</span>
      <span className="text-3xl font-display text-[var(--sh-text)]" style={accent ? { color: accent } : undefined}>
        {value}
      </span>
      {hint && <span className="text-xs text-[var(--sh-muted)]">{hint}</span>}
    </Card>
  );
}

export function Badge({ children, accent, subtle = true }: { children: ReactNode; accent?: string; subtle?: boolean }) {
  const style = accent
    ? { color: accent, borderColor: `${accent}40`, background: subtle ? `${accent}14` : accent }
    : { color: 'var(--sh-text)', borderColor: 'var(--sh-border-strong)', background: 'var(--sh-inset)' };
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-mono border"
      style={style}
    >
      {children}
    </span>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-display text-[var(--sh-text)] tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-[var(--sh-muted)] mt-1 max-w-2xl">{subtitle}</p>}
    </div>
  );
}

export function BarChart({
  data,
  accent,
  height = 120,
}: {
  data: { day: string; count: number }[];
  accent: string;
  height?: number;
}) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end gap-1 h-full">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1 group min-w-0">
            <div
              className="w-full rounded-t-md transition-all group-hover:opacity-80"
              style={{
                height: `${Math.round((d.count / max) * 100)}%`,
                background: `linear-gradient(180deg, ${accent}, ${accent}55)`,
                minHeight: 3,
              }}
              title={`${d.day}: ${d.count.toLocaleString('es-AR')}`}
            />
            {i % 5 === 0 && (
              <span className="text-[9px] text-[var(--sh-faint)] font-mono whitespace-nowrap">{d.day}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProgressBar({ value, accent }: { value: number; accent: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-[var(--sh-inset)] overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.min(value, 100)}%`, background: accent }}
      />
    </div>
  );
}

export function IconButton({
  children,
  onClick,
  title,
}: {
  children: ReactNode;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--sh-border)] bg-[var(--sh-surface-2)] hover:bg-[var(--sh-inset)] text-[var(--sh-text-soft)] hover:text-[var(--sh-text)] transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  const styles: CSSProperties = {};
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="px-3 py-2 rounded-lg bg-[var(--sh-surface-2)] border border-[var(--sh-border)] text-sm text-[var(--sh-text)] font-sans cursor-pointer outline-none focus:border-[var(--sh-border-strong)]"
      style={styles}
    >
      {options.map(o => (
        <option key={o.value} value={o.value} className="bg-[var(--sh-inset)] text-[var(--sh-text)]">
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="py-16 text-center">
      <p className="text-[var(--sh-text-soft)] font-display text-lg">{title}</p>
      {description && <p className="text-sm text-[var(--sh-muted)] mt-1">{description}</p>}
    </div>
  );
}

export function formatMoney(price: number, currency: 'USD' | 'ARS') {
  const symbol = currency === 'USD' ? 'USD ' : '$ ';
  return `${symbol}${price.toLocaleString('es-AR')}`;
}

export function formatNumber(n: number) {
  return n.toLocaleString('es-AR');
}

export function formatDate(date: string) {
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
}

export function statusLabel(status: string) {
  const map: Record<string, string> = {
    activa: 'Activa',
    pausada: 'Pausada',
    'en-preparacion': 'En preparación',
    Proxima: 'Próxima',
    Pendiente: 'Pendiente de confirmación',
    Confirmada: 'Confirmada',
    Historial: 'Historial',
  };
  return map[status] ?? status;
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    activa: '#34d399',
    pausada: '#fbbf24',
    'en-preparacion': '#94a3b8',
    Proxima: '#60a5fa',
    Pendiente: '#fbbf24',
    Confirmada: '#34d399',
    Historial: '#94a3b8',
    Nuevo: '#60a5fa',
    Contactado: '#fbbf24',
    Interesado: '#38bdf8',
    'Visita solicitada': '#a78bfa',
    'Visita confirmada': '#34d399',
    Cerrado: '#94a3b8',
  };
  return map[status] ?? '#ffffff';
}