import type { Agency } from '../types/agency';
import type { ListingProperty } from '../types/listing';
import { similarToListing, formatPrice, propertyTypeLabel } from '../data/listings';
import { zoneLabel, stars } from '../data/comparisons';
import PropertyCard from '../components/PropertyCard';

interface PublicPropertyProps {
  agency: Agency;
  listing: ListingProperty;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  onOpen360: () => void;
  onOpenFloorPlan: () => void;
  onOpenAssistant: () => void;
  onRequestVisit: () => void;
  onSelect: (id: string) => void;
  onBackToList: () => void;
  onExitDemo: () => void;
}

export default function PublicProperty({
  agency,
  listing,
  compareIds,
  onToggleCompare,
  onOpen360,
  onOpenFloorPlan,
  onOpenAssistant,
  onRequestVisit,
  onSelect,
  onBackToList,
  onExitDemo,
}: PublicPropertyProps) {
  const similar = similarToListing(listing, 3).filter(l => l.agencyId === agency.id).slice(0, 3);

  const specs: { label: string; value: string }[] = [];
  if (listing.bedrooms > 0) specs.push({ label: 'Dormitorios', value: String(listing.bedrooms) });
  if (listing.bathrooms > 0) specs.push({ label: 'Baños', value: String(listing.bathrooms) });
  if (listing.coveredArea > 0) specs.push({ label: 'Superficie cubierta', value: `${listing.coveredArea} m²` });
  if (listing.landArea > 0) specs.push({ label: 'Terreno', value: `${listing.landArea} m²` });
  if (listing.garages > 0) specs.push({ label: 'Cochera', value: String(listing.garages) });
  specs.push({ label: 'Antigüedad', value: listing.age });

  const whatsapp = agency.contact.whatsapp.replace(/\D/g, '');

  return (
    <div className="min-h-screen bg-[var(--sh-bg)] text-[var(--sh-text)] pb-24 sm:pb-0">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[var(--sh-header)] border-b border-[var(--sh-border)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBackToList}
            className="font-mono text-[11px] uppercase tracking-widest text-[var(--sh-faint)] hover:text-[var(--sh-text)] transition-colors cursor-pointer shrink-0"
          >
            ← Listado
          </button>
          <div className="hidden sm:block h-6 w-px bg-[var(--sh-border-strong)]/60" aria-hidden="true" />
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg border border-[var(--sh-border)] bg-[var(--sh-surface-2)] flex items-center justify-center overflow-hidden shrink-0">
              {agency.logo ? (
                <img src={agency.logo} alt="" className="max-h-full max-w-full object-contain p-0.5" />
              ) : (
                <span className="font-display text-[var(--sh-text)] text-xs">{agency.shortName[0]}</span>
              )}
            </div>
            <span className="font-display text-sm text-[var(--sh-text)] truncate">{agency.shortName}</span>
          </div>
          <div className="ml-auto flex items-center gap-3 sm:gap-4 shrink-0">
            <span className="hidden lg:inline font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)]">
              Powered by ScanHouse
            </span>
            <button
              onClick={onExitDemo}
              className="px-3.5 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest border border-[var(--sh-border-strong)] text-[var(--sh-faint)] hover:text-[var(--sh-text)] hover:border-[var(--sh-primary)] transition-colors cursor-pointer"
            >
              ↺ Seleccionar demo
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
        <section className="relative overflow-hidden rounded-3xl border border-[var(--sh-border)] mb-8">
          <div className="relative aspect-[4/3] sm:aspect-[16/8]">
            <img src={listing.image} alt={listing.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/20" />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest text-white bg-black/60 border border-white/20 backdrop-blur">
                {listing.operation}
              </span>
              <span className="px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest text-white bg-black/60 border border-white/20 backdrop-blur">
                {propertyTypeLabel[listing.propertyType]}
              </span>
              {listing.hasExperience360 && (
                <span className="px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest text-white bg-black/60 border border-white/20 backdrop-blur">
                  Experiencia 360°
                </span>
              )}
            </div>
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-widest text-white/60 mb-1">
                {listing.agencyName}
              </p>
              <h1 className="font-display text-3xl sm:text-5xl font-medium text-white leading-tight">
                {listing.name.toUpperCase()}
              </h1>
              <p className="text-white/70 text-sm mt-2">{listing.location}</p>
              <p className="font-mono text-2xl text-white mt-3">{formatPrice(listing)}</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
          {specs.length === 0 && (
            <div className="col-span-2 text-sm text-[var(--sh-muted)]">Datos de la operación disponibles con la inmobiliaria.</div>
          )}
          {specs.map(s => (
            <div key={s.label} className="rounded-xl border border-[var(--sh-border)] bg-[var(--sh-surface-2)] p-3">
              <p className="text-[var(--sh-text)] font-display text-lg leading-tight">{s.value}</p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--sh-faint)] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <section className="mb-8">
          <p className="font-display text-xl text-[var(--sh-text)] mb-3">Descripción</p>
          <p className="text-sm leading-relaxed text-[var(--sh-muted)] max-w-3xl">{listing.description}</p>
        </section>

        <section className="rounded-2xl border border-[var(--sh-border)] bg-[var(--sh-surface-2)] p-4 sm:p-5 mb-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)] mb-3">Acciones</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            <button
              onClick={onOpen360}
              className="col-span-2 md:col-span-1 px-4 py-3.5 rounded-xl font-mono text-xs font-medium uppercase tracking-widest text-[var(--sh-on-primary)] transition-opacity cursor-pointer hover:opacity-90"
              style={{ background: 'var(--sh-primary)' }}
            >
              ◉ EXPLORAR EN 360°
            </button>
            <button
              onClick={onOpenFloorPlan}
              className="px-4 py-3.5 rounded-xl border border-[var(--sh-border-strong)] font-mono text-xs uppercase tracking-widest text-[var(--sh-text-soft)] hover:border-[var(--sh-primary)] hover:text-[var(--sh-primary)] transition-colors cursor-pointer"
            >
              ▦ VER PLANO
            </button>
            <button
              onClick={onOpenAssistant}
              className="px-4 py-3.5 rounded-xl border border-[var(--sh-border-strong)] font-mono text-xs uppercase tracking-widest text-[var(--sh-text-soft)] hover:border-[var(--sh-primary)] hover:text-[var(--sh-primary)] transition-colors cursor-pointer"
            >
              ◈ PREGUNTAR A LA IA
            </button>
            <button
              onClick={() => onToggleCompare(listing.id)}
              className={`px-4 py-3.5 rounded-xl border font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer ${
                compareIds.includes(listing.id)
                  ? 'border-[var(--sh-primary)] text-[var(--sh-primary)]'
                  : 'border-[var(--sh-border-strong)] text-[var(--sh-text-soft)] hover:border-[var(--sh-primary)] hover:text-[var(--sh-primary)]'
              }`}
            >
              {compareIds.includes(listing.id) ? '✓ EN LA COMPARACIÓN' : '+ COMPARAR'}
            </button>
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hola, quiero consultar por la propiedad ${listing.name}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3.5 rounded-xl border border-[var(--sh-border-strong)] font-mono text-xs uppercase tracking-widest text-[var(--sh-text-soft)] hover:border-[#25D366] hover:text-[#25D366] transition-colors text-center"
            >
              ✆ WHATSAPP
            </a>
            <button
              onClick={onRequestVisit}
              className="px-4 py-3.5 rounded-xl border border-[var(--sh-border-strong)] font-mono text-xs uppercase tracking-widest text-[var(--sh-text-soft)] hover:border-[var(--sh-primary)] hover:text-[var(--sh-primary)] transition-colors cursor-pointer"
            >
              ✚ SOLICITAR VISITA
            </button>
          </div>
        </section>

        {listing.features.length > 0 && (
          <section className="mb-10">
            <p className="font-display text-xl text-[var(--sh-text)] mb-4">Características destacadas</p>
            <div className="flex flex-wrap gap-2">
              {listing.features.map(f => (
                <span
                  key={f}
                  className="px-3 py-2 rounded-xl border border-[var(--sh-border)] bg-[var(--sh-surface-2)] text-xs text-[var(--sh-text-soft)]"
                >
                  {f}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <div className="flex items-center justify-between gap-3 mb-2">
            <p className="font-display text-2xl text-[var(--sh-text)]">CONOCÉ EL ENTORNO</p>
          </div>
          <p className="text-sm text-[var(--sh-muted)] mb-5">Todo lo que necesitás, cerca de tu nuevo hogar.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {listing.surrounding.map((s, i) => (
              <div key={i} className="rounded-xl border border-[var(--sh-border)] bg-[var(--sh-surface-2)] p-3">
                <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--sh-faint)] truncate">{s.type}</p>
                <p className="text-[var(--sh-text)] text-sm mt-1">{s.distance}</p>
                <p className="text-[11px] text-[var(--sh-muted)]">{s.time}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)] mb-3">Calidad de la zona</p>
              <div className="rounded-xl border border-[var(--sh-border)] bg-[var(--sh-surface-2)] p-4 flex flex-col gap-2.5">
                {(Object.keys(zoneLabel) as (keyof typeof zoneLabel)[]).map(k => (
                  <div key={k} className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-[var(--sh-muted)]">{zoneLabel[k]}</span>
                    <span className="text-[var(--sh-text)] tracking-wide" style={{ color: 'var(--sh-primary)' }}>
                      {stars(listing.zoneQuality[k])}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)] mb-3">¿Por qué elegir esta zona?</p>
              <ul className="rounded-xl border border-[var(--sh-border)] bg-[var(--sh-surface-2)] p-4 flex flex-col gap-2 text-sm">
                {listing.whyChooseZone.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-[var(--sh-text-soft)]">
                    <span className="text-[var(--sh-primary)] mt-0.5">✓</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)] mb-3">Características del acceso</p>
              <ul className="rounded-xl border border-[var(--sh-border)] bg-[var(--sh-surface-2)] p-4 flex flex-col gap-2 text-sm">
                {listing.access.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-[var(--sh-text-soft)]">
                    <span className={a.ok ? 'text-[var(--sh-primary)]' : 'text-[var(--sh-faint)]'}>✓</span>
                    <span>{a.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-[var(--sh-border)] bg-[var(--sh-surface-2)] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)] mb-2">Conocé el barrio</p>
            <p className="text-sm text-[var(--sh-text-soft)]">{listing.zoneDescription}</p>
          </div>

          <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)]">
            Datos de entorno y calidad de zona ilustrativos para la demostración.
          </p>
        </section>

        <section className="mb-10">
          <p className="font-display text-2xl text-[var(--sh-text)] mb-1">TAMBIÉN PODRÍA INTERESARTE</p>
          <p className="text-sm text-[var(--sh-muted)] mb-5">Propiedades similares por precio, superficie y ubicación.</p>
          {similar.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similar.map(l => (
                <PropertyCard
                  key={l.id}
                  listing={l}
                  compact
                  compareActive={compareIds.includes(l.id)}
                  compareDisabled={compareIds.length >= 3 && !compareIds.includes(l.id)}
                  onSelect={onSelect}
                  onCompare={onToggleCompare}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--sh-muted)]">Consultá con la inmobiliaria por propiedades similares.</p>
          )}
        </section>
      </main>

      <div className="sticky bottom-0 z-30 border-t border-[var(--sh-border)] bg-[var(--sh-header)]/95 backdrop-blur-xl sm:hidden">
        <div className="grid grid-cols-5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          <button onClick={onOpen360} className="flex flex-col items-center gap-0.5 py-2.5 text-[var(--sh-text-soft)] cursor-pointer">
            <span className="text-base">◉</span>
            <span className="font-mono text-[9px] uppercase tracking-widest">360°</span>
          </button>
          <button onClick={onOpenFloorPlan} className="flex flex-col items-center gap-0.5 py-2.5 text-[var(--sh-text-soft)] cursor-pointer">
            <span className="text-base">▦</span>
            <span className="font-mono text-[9px] uppercase tracking-widest">Plano</span>
          </button>
          <button onClick={onOpenAssistant} className="flex flex-col items-center gap-0.5 py-2.5 text-[var(--sh-text-soft)] cursor-pointer">
            <span className="text-base">◈</span>
            <span className="font-mono text-[9px] uppercase tracking-widest">IA</span>
          </button>
          <button
            onClick={() => onToggleCompare(listing.id)}
            className={`flex flex-col items-center gap-0.5 py-2.5 cursor-pointer ${compareIds.includes(listing.id) ? 'text-[var(--sh-primary)]' : 'text-[var(--sh-text-soft)]'}`}
          >
            <span className="text-base">⇄</span>
            <span className="font-mono text-[9px] uppercase tracking-widest">Comparar</span>
          </button>
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hola, quiero consultar por la propiedad ${listing.name}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-0.5 py-2.5 text-[var(--sh-text-soft)]"
          >
            <span className="text-base">✆</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#25D366]">WhatsApp</span>
          </a>
        </div>
      </div>

      <footer className="border-t border-[var(--sh-border-soft)] py-6 text-center mt-10">
        <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--sh-faint)]">
          {agency.name} · Experiencia digital desarrollada con ScanHouse
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)] opacity-70 mt-1">
          ScanHouse — Desarrollado por Nodo Ético — Sistemas Inteligentes
        </p>
      </footer>
    </div>
  );
}