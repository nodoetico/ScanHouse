import { useSession } from '../../context/SessionContext';
import { Card, SectionTitle, Badge } from '../ui';

export default function Settings() {
  const { agency } = useSession();
  if (!agency) return null;

  const fields = [
    { label: 'Email', value: agency.contact.email },
    { label: 'Teléfono', value: agency.contact.phone },
    { label: 'WhatsApp', value: agency.contact.whatsapp },
    { label: 'Dirección', value: agency.contact.address },
  ];

  const colors = [
    { label: 'Color primario', value: agency.branding.primaryColor },
    { label: 'Color secundario', value: agency.branding.secondaryColor },
    { label: 'Color terciario', value: agency.branding.tertiaryColor },
    { label: 'Color de acento', value: agency.branding.accentColor },
  ];

  return (
    <div className="animate-fade-in">
      <SectionTitle title="Configuración" subtitle="Identidad, contacto y marca de tu inmobiliaria sobre la plataforma ScanHouse." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-display text-[var(--sh-text)] text-lg mb-4">Identidad</h3>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-20 h-16 rounded-xl bg-[var(--sh-inset)] border border-[var(--sh-border)] flex items-center justify-center overflow-hidden">
              <img src={agency.logo} alt={agency.name} className="max-h-full max-w-full object-contain" />
            </div>
            <div>
              <p className="font-display text-[var(--sh-text)]">{agency.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)]">Logo · nombre · favicon</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between py-2 border-b border-[var(--sh-border-soft)] text-sm">
              <span className="text-[var(--sh-text-soft)]">Favicon</span>
              <span className="text-[var(--sh-text)] font-mono text-xs">windcheck · asignado automáticamente</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[var(--sh-border-soft)] text-sm">
              <span className="text-[var(--sh-text-soft)]">Nombre público</span>
              <span className="text-[var(--sh-text)]">{agency.name}</span>
            </div>
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-[var(--sh-text-soft)]">Estado</span>
              <Badge accent="#34d399">Cuenta activa</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-[var(--sh-text)] text-lg mb-4">Contacto</h3>
          <div className="flex flex-col gap-2">
            {fields.map(f => (
              <div key={f.label} className="flex items-center justify-between py-2.5 border-b border-[var(--sh-border-soft)] last:border-0 text-sm">
                <span className="text-[var(--sh-text-soft)]">{f.label}</span>
                <span className="text-[var(--sh-text)]">{f.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-[var(--sh-text)] text-lg mb-4">Marca</h3>
          <div className="flex flex-col gap-3">
            {colors.map(c => (
              <div key={c.label} className="flex items-center justify-between py-2 border-b border-[var(--sh-border-soft)] last:border-0">
                <span className="text-[var(--sh-text-soft)] text-sm">{c.label}</span>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md border border-[var(--sh-border)]" style={{ background: c.value }} />
                  <span className="font-mono text-xs text-[var(--sh-text)]">{c.value}</span>
                </div>
              </div>
            ))}
            <p className="text-xs text-[var(--sh-faint)] mt-2">
              Estos colores se aplican automáticamente a botones, estados activos, gráficos, badges e indicadores de toda la plataforma.
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-[var(--sh-text)] text-lg mb-4">Plataforma</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between py-2.5 border-b border-[var(--sh-border-soft)] text-sm">
              <span className="text-[var(--sh-text-soft)]">Dominio / subdominio</span>
              <span className="font-mono text-xs text-[var(--sh-text)]">{agency.contact.domain ?? 'configurado'}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-[var(--sh-border-soft)] text-sm">
              <span className="text-[var(--sh-text-soft)]">Suscripción</span>
              <Badge accent={agency.branding.primaryColor}>Demo comercial</Badge>
            </div>
            <div className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-[var(--sh-text-soft)]">Plan</span>
              <span className="text-[var(--sh-text)]">ScanHouse Studio</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8 text-center font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)]">
        ScanHouse · Desarrollado por Nodo Ético — Sistemas Inteligentes
      </div>
    </div>
  );
}