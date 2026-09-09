import { property } from '../config/property';
import { genericScenes } from '../config/genericScenes';
import { getAgencyById } from './agencies';
import type { ListingProperty } from '../types/listing';
import type { Property } from '../types/property';

const isLaureles = (listing: ListingProperty) => listing.id === 'casa-laureles';

function buildScenes(listing: ListingProperty): Property['scenes'] {
  const source = isLaureles(listing) ? property.scenes : genericScenes;
  return listing.sceneIds.map(sceneId => {
    const scene = source.find(s => s.id === sceneId);
    if (!scene) throw new Error(`Escena ${sceneId} inexistente para ${listing.id}`);
    const hotspots = scene.hotspots.filter(
      h => !h.targetSceneId || listing.sceneIds.includes(h.targetSceneId),
    );
    const connections = scene.connections.filter(c =>
      listing.sceneIds.includes(c.targetSceneId),
    );
    return { ...scene, hotspots, connections };
  });
}

function buildFloorPlan(listing: ListingProperty): Property['floorPlan'] {
  const rooms = property.floorPlan.rooms.filter(r =>
    listing.sceneIds.includes(r.sceneId),
  );
  return { image: property.floorPlan.image, rooms };
}

const spaceLabel = (listing: ListingProperty) =>
  listing.coveredArea > 0
    ? ` ${listing.coveredArea}m² cubiertos${listing.landArea > 0 ? ` sobre terreno de ${listing.landArea}m²` : ''}`
    : ` terreno de ${listing.landArea}m²`;

function buildKnowledge(listing: ListingProperty): Property['assistantKnowledge'] {
  const agency = getAgencyById(listing.agencyId as Parameters<typeof getAgencyById>[0]);
  const price = `${listing.currency === 'USD' ? 'USD' : '$'} ${listing.price.toLocaleString('es-AR')}`;
  const isRent = listing.operation === 'alquiler';

  const faq: Property['assistantKnowledge']['faq'] = [];
  if (listing.bedrooms > 0) {
    faq.push({
      question: '¿Cuántos dormitorios tiene?',
      answer: `Tiene ${listing.bedrooms} dormitorio${listing.bedrooms > 1 ? 's' : ''}.`,
    });
  }
  if (listing.propertyType !== 'terreno') {
    faq.push({
      question: '¿Tiene cochera?',
      answer:
        listing.garages > 0
          ? `Sí, cochera para ${listing.garages} vehículo${listing.garages > 1 ? 's' : ''}.`
          : 'No cuenta con cochera, pero la zona tiene buen estacionamiento.',
    });
  }
  faq.push({
    question: isRent ? '¿Cuánto cuesta el alquiler?' : '¿Cuánto cuesta?',
    answer: isRent ? `${price} mensuales.` : `${price} (precio de venta).`,
  });
  faq.push({
    question: '¿Dónde está ubicada?',
    answer: `${listing.location}. ${listing.zoneDescription}`,
  });
  if (listing.coveredArea > 0 || listing.landArea > 0) {
    faq.push({
      question: '¿Cuántos metros cuadrados tiene?',
      answer: spaceLabel(listing).trim(),
    });
  }
  faq.push({
    question: '¿Qué hay cerca?',
    answer: listing.surrounding
      .slice(0, 3)
      .map(s => `${s.label} a ${s.distance}`)
      .join(', ') + '.',
  });
  faq.push({
    question: '¿Puedo visitarla?',
    answer:
      'Sí, las visitas se coordinan con 24hs de antelación. Complete el formulario "SOLICITAR VISITA" o contacte por WhatsApp.',
  });

  return {
    propertyDescription: `${listing.description} ${spaceLabel(listing)}, con ${listing.bedrooms > 0 ? `${listing.bedrooms} dormitorios, ` : ''}${listing.bathrooms} baños${listing.garages > 0 ? ` y cochera para ${listing.garages}` : ''}.`,
    features: listing.features,
    price,
    location: `${listing.location}. ${listing.zoneDescription}`,
    rules: isRent
      ? [
          'Contrato mínimo 12 meses',
          'Se aceptan mascotas (consultar condiciones)',
          'No se permite fumar en interiores',
          'Visitas coordinadas con 24hs de antelación',
        ]
      : [
          'Documentación en orden',
          'Escritura inmediata disponible',
          'Visitas coordinadas con 24hs de antelación',
          'Se aceptan ofertas',
        ],
    services: [
      'Agua corriente',
      'Internet fibra óptica',
      'Recolección de residuos',
      'Servicios en regla',
    ],
    faq,
    contact: {
      whatsapp: agency.contact.whatsapp,
      email: agency.contact.email,
      phone: agency.contact.phone,
      agency: listing.agencyName,
    },
  };
}

export function buildExperience(listing: ListingProperty): Property {
  return {
    id: listing.id,
    name: listing.name.toUpperCase(),
    location: listing.location,
    price: listing.price,
    currency: listing.currency,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    coveredArea: listing.coveredArea,
    landArea: listing.landArea,
    garages: listing.garages,
    features: listing.features,
    description: listing.description,
    images: listing.images,
    scenes: buildScenes(listing),
    floorPlan: buildFloorPlan(listing),
    assistantKnowledge: buildKnowledge(listing),
    branding: listing.agencyBranding,
  };
}