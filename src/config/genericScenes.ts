import type { Scene } from '../types/property';

const nav = (
  id: string,
  name: string,
  pitch: number,
  yaw: number,
  targetSceneId: string,
) => ({ id, type: 'navigation' as const, name, pitch, yaw, targetSceneId });

const info = (
  id: string,
  name: string,
  pitch: number,
  yaw: number,
  content: string,
) => ({ id, type: 'info' as const, name, pitch, yaw, content });

export const genericScenes: Scene[] = [
  {
    id: 'salon',
    name: 'SALÓN',
    panorama: '/panoramas/salon.jpg',
    thumbnail: '/thumbnails/salon.jpg',
    description:
      'Amplio living-comedor luminoso, pensado para el día a día en familia. Espacio fluido y acogedor, con la conexión perfecta hacia el resto de la vivienda.',
    position: { x: 0, y: 0, z: 0 },
    rotation: { yaw: 0, pitch: 0, hfov: 100 },
    hotspots: [
      nav('salon-cocina', 'COCINA', 0, 90, 'cocina'),
      nav('salon-pasillo', 'PASILLO', 0, -90, 'pasillo'),
      nav('salon-patio', 'PATIO', 10, 180, 'patio'),
      info('salon-info-luz', 'LUZ NATURAL', -15, 45, 'Amplios ventanales que llenan el ambiente de luz natural durante todo el día.'),
      info('salon-info-pisos', 'PISOS', 0, -40, 'Pisos en excelente estado, resistentes y fáciles de mantener.'),
    ],
    connections: [
      { targetSceneId: 'cocina', hotspotId: 'salon-cocina' },
      { targetSceneId: 'pasillo', hotspotId: 'salon-pasillo' },
      { targetSceneId: 'patio', hotspotId: 'salon-patio' },
    ],
  },
  {
    id: 'cocina',
    name: 'COCINA',
    panorama: '/panoramas/cocina.jpg',
    thumbnail: '/thumbnails/cocina.jpg',
    description:
      'Cocina integrada con buen espacio de guardado y mesada amplia. Equipada y lista para usar, con circulación que se integra a la zona de estar.',
    position: { x: 4, y: 0, z: 0 },
    rotation: { yaw: 90, pitch: 0, hfov: 100 },
    hotspots: [
      nav('cocina-salon', 'SALÓN', 0, -90, 'salon'),
      nav('cocina-pasillo', 'PASILLO', 0, 180, 'pasillo'),
      info('cocina-info-mesada', 'MESADA', 5, 30, 'Mesada amplia con buen espacio de trabajo y bacha integrada.'),
      info('cocina-info-anafe', 'ANAFE', -5, -30, 'Anafe en óptimas condiciones, listo para cocinar.'),
    ],
    connections: [
      { targetSceneId: 'salon', hotspotId: 'cocina-salon' },
      { targetSceneId: 'pasillo', hotspotId: 'cocina-pasillo' },
    ],
  },
  {
    id: 'pasillo',
    name: 'PASILLO',
    panorama: '/panoramas/pasillo.jpg',
    thumbnail: '/thumbnails/pasillo.jpg',
    description:
      'Distribuidor que conecta la zona social con la zona privada, con espacios de guardado que aprovechan al máximo cada metro cuadrado.',
    position: { x: 0, y: 4, z: 0 },
    rotation: { yaw: 180, pitch: 0, hfov: 100 },
    hotspots: [
      nav('pasillo-salon', 'SALÓN', 0, 90, 'salon'),
      nav('pasillo-cocina', 'COCINA', 0, -90, 'cocina'),
      nav('pasillo-dormitorio1', 'DORMITORIO PRINCIPAL', 0, 0, 'dormitorio-principal'),
      nav('pasillo-dormitorio2', 'DORMITORIO 2', 0, 180, 'dormitorio-2'),
      nav('pasillo-bano', 'BAÑO', 0, -45, 'bano'),
      info('pasillo-info-guardado', 'GUARDADO', 0, 30, 'Placares de guardado que optimizan el espacio.'),
    ],
    connections: [
      { targetSceneId: 'salon', hotspotId: 'pasillo-salon' },
      { targetSceneId: 'cocina', hotspotId: 'pasillo-cocina' },
      { targetSceneId: 'dormitorio-principal', hotspotId: 'pasillo-dormitorio1' },
      { targetSceneId: 'dormitorio-2', hotspotId: 'pasillo-dormitorio2' },
      { targetSceneId: 'bano', hotspotId: 'pasillo-bano' },
    ],
  },
  {
    id: 'dormitorio-principal',
    name: 'DORMITORIO PRINCIPAL',
    panorama: '/panoramas/dormitorio-principal.jpg',
    thumbnail: '/thumbnails/dormitorio-principal.jpg',
    description:
      'Dormitorio principal con buen dimensionamiento, placard y ventanal que aporta luz y ventilación natural.',
    position: { x: -4, y: 4, z: 0 },
    rotation: { yaw: -90, pitch: 0, hfov: 100 },
    hotspots: [
      nav('dorm1-pasillo', 'PASILLO', 0, 180, 'pasillo'),
      nav('dorm1-bano', 'BAÑO EN SUITE', 0, -90, 'bano'),
      info('dorm1-info-placard', 'PLACARD', -10, 45, 'Placard amplio con estantes y espacio de colgado.'),
      info('dorm1-info-luz', 'VENTANAL', -15, -45, 'Ventanal que brinda excelente luz natural.'),
    ],
    connections: [
      { targetSceneId: 'pasillo', hotspotId: 'dorm1-pasillo' },
      { targetSceneId: 'bano', hotspotId: 'dorm1-bano' },
    ],
  },
  {
    id: 'dormitorio-2',
    name: 'DORMITORIO 2',
    panorama: '/panoramas/dormitorio-2.jpg',
    thumbnail: '/thumbnails/dormitorio-2.jpg',
    description:
      'Dormitorio adicional con placard completo, ideal para habitación de hijos, huéspedes u oficina.',
    position: { x: 4, y: 4, z: 0 },
    rotation: { yaw: 90, pitch: 0, hfov: 100 },
    hotspots: [
      nav('dorm2-pasillo', 'PASILLO', 0, 0, 'pasillo'),
      info('dorm2-info-placard', 'PLACARD', 5, 30, 'Placard completo con estantes y cajoneras.'),
    ],
    connections: [{ targetSceneId: 'pasillo', hotspotId: 'dorm2-pasillo' }],
  },
  {
    id: 'bano',
    name: 'BAÑO',
    panorama: '/panoramas/bano.jpg',
    thumbnail: '/thumbnails/bano.jpg',
    description:
      'Baño completo con mesada, espejo y espacio de ducha. Terminaciones en buen estado y funcionamiento correcto.',
    position: { x: 0, y: 6, z: 0 },
    rotation: { yaw: 0, pitch: 0, hfov: 100 },
    hotspots: [
      nav('bano-pasillo', 'PASILLO', 0, 180, 'pasillo'),
      nav('bano-dorm1', 'DORMITORIO PRINCIPAL', 0, 90, 'dormitorio-principal'),
      info('bano-info-ducha', 'DUCHA', 0, -45, 'Ducha con buena presión y grifería en óptimo estado.'),
      info('bano-info-mesada', 'MESADA', -10, 45, 'Mesada con bacha y espacio de guardado bajo.'),
    ],
    connections: [
      { targetSceneId: 'pasillo', hotspotId: 'bano-pasillo' },
      { targetSceneId: 'dormitorio-principal', hotspotId: 'bano-dorm1' },
    ],
  },
  {
    id: 'patio',
    name: 'PATIO',
    panorama: '/panoramas/patio.jpg',
    thumbnail: '/thumbnails/patio.jpg',
    description:
      'Excelente espacio exterior con sector preparado para parrilla y reuniones, perfecto para disfrutar al aire libre.',
    position: { x: 0, y: -4, z: 0 },
    rotation: { yaw: 180, pitch: 0, hfov: 100 },
    hotspots: [
      nav('patio-salon', 'SALÓN', -10, 0, 'salon'),
      nav('patio-cochera', 'COCHERA', 0, 90, 'cochera'),
      info('patio-info-parrilla', 'PARRILLA', 5, 30, 'Sector preparado para parrilla con buen espacio de trabajo.'),
      info('patio-info-exterior', 'EXTERIOR', -15, -30, 'Espacio al aire libre para disfrutar durante todo el año.'),
    ],
    connections: [
      { targetSceneId: 'salon', hotspotId: 'patio-salon' },
      { targetSceneId: 'cochera', hotspotId: 'patio-cochera' },
    ],
  },
  {
    id: 'cochera',
    name: 'COCHERA',
    panorama: '/panoramas/cochera.jpg',
    thumbnail: '/thumbnails/cochera.jpg',
    description:
      'Cochera cubierta con acceso directo al interior y espacio adicional de guardado.',
    position: { x: 4, y: -4, z: 0 },
    rotation: { yaw: -90, pitch: 0, hfov: 100 },
    hotspots: [
      nav('cochera-patio', 'PATIO', 0, -90, 'patio'),
      info('cochera-info-guardado', 'GUARDADO', 0, 0, 'Espacio de guardado adicional aprovechable.'),
    ],
    connections: [{ targetSceneId: 'patio', hotspotId: 'cochera-patio' }],
  },
];