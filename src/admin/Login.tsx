import { useState } from 'react';
import { agencies } from '../data/agencies';
import type { Agency, AgencyId } from '../types/agency';
import { useSession } from '../context/SessionContext';
import { panelTokens } from './theme';

const DEFAULT_BRAND: Agency['branding'] = {
  primaryColor: '#ffffff',
  secondaryColor: '#0a0a0a',
  tertiaryColor: '#1f2937',
  backgroundColor: '#050506',
  textColor: '#ffffff',
  accentColor: '#ffffff',
};

export default function Login({ onLogin }: { onLogin?: () => void }) {
  const { login } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<AgencyId | null>(null);

  const selected = agencies.find(a => a.id === selectedAgency);

  const chooseAgency = (id: AgencyId) => {
    const agency = agencies.find(a => a.id === id);
    if (!agency) return;
    setSelectedAgency(id);
    setEmail(agency.credentials.email);
    setPassword(agency.credentials.password);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const agency = login(email.trim(), password);
    if (!agency) {
      setError('Credenciales incorrectas. Probá con una cuenta de demo de abajo.');
      return;
    }
    onLogin?.();
  };

  const tokens = selected ? panelTokens(selected.branding) : panelTokens(DEFAULT_BRAND);
  const tint = selected ? selected.branding.primaryColor : 'rgba(255,255,255,0.08)';

  return (
    <div className="fixed inset-0 bg-[var(--sh-bg)] text-[var(--sh-text)] overflow-y-auto" style={tokens as React.CSSProperties}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: `radial-gradient(900px 500px at 50% 0%, ${tint}26, transparent 65%)` }}
        aria-hidden="true"
      />
      <div className="relative min-h-full flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[var(--sh-surface-2)] border border-[var(--sh-border)] flex items-center justify-center font-display text-xl text-[var(--sh-text)]">
              SH
            </div>
            <div>
              <div className="font-display text-xl tracking-wide text-[var(--sh-text)]">SCANHOUSE</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-muted)]">
                Experiencias inmobiliarias inteligentes
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--sh-border)] bg-[var(--sh-surface)] backdrop-blur-md p-6 sm:p-8">
            <div className="flex flex-col items-center mb-6">
              {selected ? (
                <img
                  src={selected.logo}
                  alt={selected.name}
                  className="h-12 w-auto max-w-[220px] object-contain mb-3"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-[var(--sh-surface-2)] border border-[var(--sh-border)] mb-3" />
              )}
              <h1 className="font-display text-xl tracking-tight text-[var(--sh-text)] text-center">
                {selected ? selected.name : 'Panel de gestión'}
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-muted)] mt-1">
                {selected ? 'Panel de gestión' : 'Ingresá tus credenciales'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--sh-muted)] mb-1.5">
                  Usuario
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="usuario@inmobiliaria.com"
                  autoComplete="username"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--sh-surface-2)] border border-[var(--sh-border)] text-[var(--sh-text)] text-sm outline-none focus:border-[var(--sh-border-strong)] transition-colors placeholder:text-[var(--sh-faint)]"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--sh-muted)] mb-1.5">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--sh-surface-2)] border border-[var(--sh-border)] text-[var(--sh-text)] text-sm outline-none focus:border-[var(--sh-border-strong)] transition-colors placeholder:text-[var(--sh-faint)]"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[var(--sh-primary)] text-[var(--sh-on-primary)] font-mono text-sm uppercase tracking-widest hover:opacity-90 focus-visible outline-none transition-opacity cursor-pointer"
              >
                Ingresar
              </button>
            </form>

            <div className="mt-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)] mb-3 text-center">
                Demo — seleccioná una inmobiliaria
              </p>
              <div className="grid grid-cols-3 gap-2">
                {agencies.map(a => (
                  <button
                    key={a.id}
                    onClick={() => chooseAgency(a.id)}
                    title={a.name}
                    className={`group p-2 rounded-xl border transition-all cursor-pointer ${
                      selectedAgency === a.id
                        ? 'border-[var(--sh-border-strong)] bg-[var(--sh-inset)]'
                        : 'border-[var(--sh-border)] bg-[var(--sh-surface)] hover:border-[var(--sh-border-strong)] hover:bg-[var(--sh-inset)]'
                    }`}
                  >
                    <img
                      src={a.logo}
                      alt={a.name}
                      className="h-6 w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)]">
            Desarrollado por Nodo Ético — Sistemas Inteligentes
          </p>
        </div>
      </div>
    </div>
  );
}