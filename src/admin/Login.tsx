import { useState } from 'react';
import { agencies } from '../data/agencies';
import { useSession } from '../context/SessionContext';

export default function Login({ onLogin }: { onLogin?: () => void }) {
  const { login } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const agency = login(email.trim(), password);
    if (!agency) {
      setError('Credenciales incorrectas. Probá con una cuenta de demo de abajo.');
      return;
    }
    setError('');
    onLogin?.();
  };

  const fillAccount = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black text-white overflow-y-auto">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(900px 500px at 50% 0%, rgba(255,255,255,0.06), transparent 65%)' }}
        aria-hidden="true"
      />
      <div className="relative min-h-full flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-display text-xl text-white">
              SH
            </div>
            <div>
              <div className="font-display text-xl tracking-wide text-white">SCANHOUSE</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/50">
                Experiencias inmobiliarias inteligentes
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 sm:p-8">
            <div className="flex flex-col items-center mb-6">
              <h1 className="font-display text-xl tracking-tight text-white text-center">
                Panel de gestión
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mt-1">
                Ingresá las credenciales de tu inmobiliaria
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
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-base sm:text-sm outline-none focus:border-white/30 transition-colors placeholder:text-white/30"
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
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-base sm:text-sm outline-none focus:border-white/30 transition-colors placeholder:text-white/30"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white text-black font-mono text-sm uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
              >
                Ingresar
              </button>
            </form>

            <div className="mt-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3 text-center">
                Cuentas demo — acá inicia la experiencia privada de cada inmobiliaria
              </p>
              <div className="flex flex-col gap-2">
                {agencies.map(a => (
                  <button
                    key={a.id}
                    onClick={() => fillAccount(a.credentials.email, a.credentials.password)}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05] transition-all cursor-pointer text-left"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white/5">
                      {a.logo ? (
                        <img src={a.logo} alt={a.name} className="max-h-full max-w-full object-contain p-0.5" />
                      ) : (
                        <span className="font-display text-white/70 text-xs">{a.shortName[0]}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm text-white truncate">{a.name}</p>
                      <p className="font-mono text-[10px] text-white/40 truncate">{a.credentials.email}</p>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white/30 shrink-0">Usar</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-white/30">
            Desarrollado por Nodo Ético — Sistemas Inteligentes
          </p>
        </div>
      </div>
    </div>
  );
}