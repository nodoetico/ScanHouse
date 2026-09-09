import type { Agency } from '../types/agency';
import type { ComparisonRecord, ListingProperty, SearchInterest } from '../types/listing';

const pairCounts: Record<string, [string, string, number][]> = {
  roca: [['casa-laureles', 'departamento-centro', 42]],
  remax: [['casa-puerto', 'loft-sierras', 24], ['casa-puerto', 'terreno-altos', 11]],
  leona: [['casona-gardens', 'duplex-mariano', 31]],
  emilia: [['linda-vista', 'dpto-rivadavia', 19]],
  navarro: [['residencia-el-parque', 'casa-quincho', 27]],
  agostini: [['depto-gorriti', 'casa-buenos-chicos', 15]],
};

export function comparisonsFor(agency: Agency): ComparisonRecord[] {
  const pairs = pairCounts[agency.id] ?? [];
  const ids = new Set(agency.properties.map(p => p.id));
  return pairs
    .filter(([from, to]) => ids.has(from) && ids.has(to))
    .map(([fromPropertyId, toPropertyId, count]) => ({ fromPropertyId, toPropertyId, count }));
}

export const searchInterests: SearchInterest[] = [
  { topic: 'Ubicación / barrio', pct: 32 },
  { topic: 'Precio', pct: 27 },
  { topic: 'Habitaciones', pct: 21 },
  { topic: 'Servicios cercanos', pct: 14 },
  { topic: 'Otros aspectos', pct: 6 },
];

export const zoneLabel: Record<keyof ListingProperty['zoneQuality'], string> = {
  accessibility: 'Accesibilidad',
  commerce: 'Comercios cercanos',
  transport: 'Transporte',
  services: 'Servicios',
  green: 'Espacios verdes',
  connectivity: 'Conectividad',
};

export function stars(value: number): string {
  return '★'.repeat(value) + '☆'.repeat(5 - value);
}

export const priceBest = (l: ListingProperty) => `Mejor precio (${l.price.toLocaleString('es-AR')})`;
export const areaBest = (l: ListingProperty) => `${l.coveredArea} m² cubiertos`;
export const landBest = (l: ListingProperty) => `${l.landArea} m² de terreno`;

export function destacados(items: ListingProperty[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  items.forEach(l => (out[l.id] = []));

  const apply = (ids: string[], label: string) => {
    ids.forEach(id => (out[id] ??= []).push(label));
  };

  const minPrice = Math.min(...items.map(l => l.price));
  apply(items.filter(l => l.price === minPrice).map(l => l.id), 'Mejor precio');

  const maxArea = Math.max(...items.map(l => l.coveredArea));
  apply(items.filter(l => l.coveredArea === maxArea).map(l => l.id), 'Mayor superficie cubierta');

  const maxLand = Math.max(...items.map(l => l.landArea));
  apply(items.filter(l => l.landArea === maxLand).map(l => l.id), 'Mayor terreno');

  const maxRooms = Math.max(...items.map(l => l.bedrooms));
  apply(items.filter(l => l.bedrooms === maxRooms).map(l => l.id), 'Más habitaciones');

  const maxBath = Math.max(...items.map(l => l.bathrooms));
  apply(items.filter(l => l.bathrooms === maxBath).map(l => l.id), 'Más baños');

  const maxGarages = Math.max(...items.map(l => l.garages));
  apply(items.filter(l => l.garages === maxGarages).map(l => l.id), 'Más cocheras');

  const servicesScore = (l: ListingProperty) => l.zoneQuality.commerce + l.zoneQuality.services + l.zoneQuality.accessibility;
  const maxServices = Math.max(...items.map(servicesScore));
  apply(items.filter(l => servicesScore(l) === maxServices).map(l => l.id), 'Excelente cercanía a servicios');

  const greenScore = (l: ListingProperty) => l.zoneQuality.green + l.zoneQuality.connectivity;
  const maxGreen = Math.max(...items.map(greenScore));
  apply(items.filter(l => greenScore(l) === maxGreen).map(l => l.id), 'Mejor cercanía a espacios verdes');

  return out;
}