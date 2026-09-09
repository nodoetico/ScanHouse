import type { ListingProperty } from '../types/listing';

interface CompareBarProps {
  items: ListingProperty[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onOpenCompare: () => void;
}

export default function CompareBar({ items, onRemove, onClear, onOpenCompare }: CompareBarProps) {
  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-2xl">
      <div className="flex items-center gap-2 rounded-2xl border border-[var(--sh-border-strong)] bg-[var(--sh-surface-2)]/95 backdrop-blur-xl shadow-xl shadow-black/10 p-2 pl-3">
        <div className="flex items-center gap-2 overflow-x-auto flex-1 min-w-0">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--sh-faint)] shrink-0">
            Comparando
          </span>
          {items.map(l => (
            <div
              key={l.id}
              className="flex items-center gap-2 shrink-0 rounded-xl border border-[var(--sh-border)] bg-[var(--sh-surface)] pr-1.5 pl-2 py-1.5"
            >
              <img src={l.image} alt="" className="w-6 h-6 rounded-md object-cover" />
              <span className="text-xs text-[var(--sh-text)] max-w-[110px] truncate">{l.name}</span>
              <button
                onClick={() => onRemove(l.id)}
                className="w-5 h-5 flex items-center justify-center rounded-full text-[var(--sh-faint)] hover:text-[var(--sh-text)] hover:bg-[var(--sh-inset)] transition-colors cursor-pointer"
                aria-label={`Quitar ${l.name}`}
              >
                ×
              </button>
            </div>
          ))}
          {items.length >= 2 && (
            <button
              onClick={onClear}
              className="text-[10px] font-mono uppercase tracking-widest text-[var(--sh-faint)] hover:text-[var(--sh-text)] transition-colors shrink-0 cursor-pointer"
            >
              Limpiar
            </button>
          )}
        </div>
        <button
          onClick={onOpenCompare}
          disabled={items.length < 2}
          className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--sh-on-primary)] transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'var(--sh-primary)' }}
        >
          COMPARÁ ({items.length})
        </button>
      </div>
    </div>
  );
}