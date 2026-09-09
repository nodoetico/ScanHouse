import type { ListingProperty } from '../types/listing';
import { formatPrice } from '../data/listings';

interface PropertyCardProps {
  listing: ListingProperty;
  onSelect: (id: string) => void;
  onCompare: (id: string) => void;
  compareActive: boolean;
  compareDisabled?: boolean;
  compact?: boolean;
}

export default function PropertyCard({
  listing,
  onSelect,
  onCompare,
  compareActive,
  compareDisabled,
  compact,
}: PropertyCardProps) {
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--sh-border)] bg-[var(--sh-surface-2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 ${
        compareActive ? 'ring-2 ring-[var(--sh-primary)]' : ''
      }`}
    >
      <button
        onClick={() => onSelect(listing.id)}
        className="relative block w-full text-left cursor-pointer overflow-hidden"
        aria-label={`Ver ${listing.name}`}
      >
        <div className={`relative w-full overflow-hidden bg-[var(--sh-inset)] ${compact ? 'aspect-[4/3]' : 'aspect-[4/3] sm:aspect-[16/10]'}`}>
          <img
            src={listing.image}
            alt={listing.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest text-white bg-black/60 border border-white/15 backdrop-blur">
              {listing.operation}
            </span>
            {listing.hasExperience360 && (
              <span className="px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest text-white bg-black/60 border border-white/15 backdrop-blur">
                360°
              </span>
            )}
          </div>
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display text-white text-lg sm:text-xl leading-tight truncate">{listing.name}</p>
              <p className="text-white/70 text-xs mt-0.5 truncate">{listing.location}</p>
            </div>
            <p className="font-mono text-sm text-white shrink-0">{formatPrice(listing)}</p>
          </div>
        </div>
      </button>

      <div className="flex flex-col gap-3 p-4 flex-1">
        <div className="flex items-center gap-4 text-xs text-[var(--sh-muted)]">
          {listing.bedrooms > 0 && <span>{listing.bedrooms} dorm.</span>}
          {listing.bathrooms > 0 && <span>{listing.bathrooms} baño{listing.bathrooms > 1 ? 's' : ''}</span>}
          {listing.coveredArea > 0 && <span>{listing.coveredArea} m²</span>}
          {listing.landArea > 0 && <span>{listing.landArea} m² terr.</span>}
        </div>

        <div className="flex gap-2 mt-auto pt-2">
          <button
            onClick={() => onSelect(listing.id)}
            className="flex-1 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--sh-on-primary)] transition-opacity cursor-pointer hover:opacity-90"
            style={{ background: 'var(--sh-primary)' }}
          >
            VER PROPIEDAD
          </button>
          <button
            onClick={() => onCompare(listing.id)}
            disabled={compareDisabled || compareActive}
            className={`px-3 py-2.5 rounded-xl text-sm border transition-colors cursor-pointer ${
              compareActive
                ? 'border-[var(--sh-primary)] text-[var(--sh-primary)]'
                : 'border-[var(--sh-border-strong)] text-[var(--sh-text-soft)] hover:border-[var(--sh-primary)] hover:text-[var(--sh-primary)]'
            }`}
          >
            {compareActive ? '✓ EN LA COMPARACIÓN' : '+ COMPARAR'}
          </button>
        </div>
      </div>
    </article>
  );
}