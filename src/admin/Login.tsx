import { useState } from 'react';
import { agencies } from '../data/agencies';
import type { AgencyId } from '../types/agency';
import { useSession } from '../context/SessionContext';

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

  return (
    <div className="fixed inset-0 bg-black text-white overflow-y-auto">
      <div className="fixed inset-0 bg-gradient-radial from-zinc-900/60 via-black to-black" aria-hidden="true" />
      <div className="relative min-h-full flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-display text-xl text-white">
              SH
            </div>
            <div>
              <div className="font-display text-xl tracking-wide text-white">SCANHOUSE</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                Experiencias inmobiliarias inteligentes
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 sm:p-8">
            <div className="flex flex-col items-center mb-6">
              {selected ? (
                <img
                  src={selected.logo}
                  alt={selected.name}
                  className="h-12 w-auto max-w-[220px] object-contain mb-3"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 mb-3" />
              )}
              <h1 className="font-display text-xl tracking-tight text-white">
                {selected ? selected.name : 'Panel de gestión'}
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mt-1">
                {selected ? 'Panel de gestión' : 'Ingresá tus credenciales'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-1.5">
                  Usuario
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="usuario@inmobiliaria.com"
                  autoComplete="username"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30 transition-colors placeholder:text-white/25"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-1.5">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30 transition-colors placeholder:text-white/25"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white text-black font-mono text-sm uppercase tracking-widest hover:bg-white/85 focus-visible outline-none transition-colors cursor-pointer"
              >
                Ingresar
              </button>
            </form>

            <div className="mt-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/35 mb-3 text-center">
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
                        ? 'border-white/40 bg-white/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
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

          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-white/25">
            Desarrollado por Nodo Ético — Sistemas Inteligentes
          </p>
        </div>
      </div>
    </div>
  );
}