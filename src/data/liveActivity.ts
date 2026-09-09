export type LiveEventKind =
  | 'vista-propiedad'
  | 'tour-360'
  | 'plano'
  | 'info'
  | 'ia'
  | 'entorno'
  | 'comparacion'
  | 'whatsapp'
  | 'visita';

export interface LiveEvent {
  id: number;
  agencyId: string;
  propertyName: string;
  kind: LiveEventKind;
  time: number;
}

let counter = 0;
const events: LiveEvent[] = [];
const listeners = new Set<() => void>();

export function pushLiveEvent(agencyId: string, propertyName: string, kind: LiveEventKind) {
  events.push({ id: ++counter, agencyId, propertyName, kind, time: Date.now() });
  if (events.length > 80) events.splice(0, events.length - 80);
  listeners.forEach(l => l());
}

export function liveEventsFor(agencyId: string): LiveEvent[] {
  return events
    .filter(e => e.agencyId === agencyId)
    .sort((a, b) => b.time - a.time)
    .slice(0, 12);
}

export function subscribeLive(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export const liveEventLabel: Record<LiveEventKind, string> = {
  'vista-propiedad': 'Visitó una propiedad',
  'tour-360': 'Abrió la experiencia 360°',
  plano: 'Consultó el plano interactivo',
  info: 'Consultó información del ambiente',
  ia: 'Preguntó a la IA',
  entorno: 'Consultó el entorno / barrio',
  comparacion: 'Comparó propiedades',
  whatsapp: 'Clic en WhatsApp',
  visita: 'Solicitó una visita',
};

export const liveEventIcon: Record<LiveEventKind, string> = {
  'vista-propiedad': '⌂',
  'tour-360': '◉',
  plano: '▦',
  info: 'i',
  ia: '◈',
  entorno: '◌',
  comparacion: '⇄',
  whatsapp: '✆',
  visita: '✚',
};