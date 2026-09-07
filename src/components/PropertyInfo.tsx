import type { Property, Scene } from '../types/property';

interface PropertyInfoProps {
  property: Property;
  currentScene: Scene;
  onClose: () => void;
}

export default function PropertyInfo({ property, currentScene, onClose }: PropertyInfoProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-info-title"
    >
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-60 w-12 h-12 flex items-center justify-center bg-white/5 backdrop-blur rounded-full border border-white/10 hover:bg-white/10 transition-all"
        aria-label="Cerrar información de la propiedad"
      >
        <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative w-full max-w-4xl mx-6 max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="panel-glass rounded-2xl overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 id="property-info-title" className="font-display text-3xl md:text-4xl font-medium mb-2">
                  {property.name}
                </h2>
                <p className="font-mono text-sm uppercase tracking-widest text-white/50">
                  {property.location}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl md:text-3xl font-medium text-white">
                  {formatPrice(property.price, property.currency)}
                </p>
                <p className="font-mono text-xs uppercase tracking-widest text-white/40">Precio de venta</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 pb-8 border-b border-white/10">
              <StatItem label="Dormitorios" value={property.bedrooms} icon="bed" />
              <StatItem label="Baños" value={property.bathrooms} icon="bath" />
              <StatItem label="Cubiertos" value={`${property.coveredArea} m²`} icon="area" />
              <StatItem label="Terreno" value={`${property.landArea} m²`} icon="land" />
            </div>

            <div className="mb-10">
              <h3 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">
                Descripción
              </h3>
              <p className="text-white/70 leading-relaxed text-base md:text-lg">
                {property.description}
              </p>
            </div>

            <div className="mb-10">
              <h3 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">
                Ambiente actual: {currentScene.name}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {currentScene.description}
              </p>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">
                Características principales
              </h3>
              <div className="flex flex-wrap gap-3">
                {property.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    bed: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    bath: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 6l6 6" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.5 3.5a2.121 2.121 0 113 3L12 15H9a2.121 2.121 0 11-.618-4.379L16.5 3.5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    area: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
    land: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2 text-white/60">
        {icons[icon]}
      </div>
      <p className="font-display text-2xl md:text-3xl font-medium text-white">
        {value}
      </p>
      <p className="font-mono text-xs uppercase tracking-widest text-white/40">
        {label}
      </p>
    </div>
  );
}