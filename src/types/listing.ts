import type { AdminProperty } from './agency';
import type { Branding } from './property';

export type Operation = 'venta' | 'alquiler';
export type PropertyType = 'casa' | 'departamento' | 'ph' | 'loft' | 'terreno' | 'duplex';

export interface SurroundingItem {
  type: string;
  label: string;
  distance: string;
  time: string;
  kind: 'comercio' | 'servicio' | 'educacion' | 'salud' | 'transporte' | 'verde' | 'deporte' | 'gastronomia';
}

export interface ZoneQuality {
  accessibility: number;
  commerce: number;
  transport: number;
  services: number;
  green: number;
  connectivity: number;
}

export interface AccessItem {
  label: string;
  ok: boolean;
}

export interface ListingExtras {
  id: string;
  operation: Operation;
  propertyType: PropertyType;
  landArea: number;
  garages: number;
  age: string;
  description: string;
  features: string[];
  sceneIds: string[];
  surrounding: SurroundingItem[];
  zoneQuality: ZoneQuality;
  whyChooseZone: string[];
  access: AccessItem[];
  zoneDescription: string;
  compareTitles?: string[];
}

export interface ListingProperty extends AdminProperty {
  agencyId: string;
  agencyName: string;
  agencyLogo: string;
  agencyBranding: Branding;
  operation: Operation;
  propertyType: PropertyType;
  landArea: number;
  garages: number;
  age: string;
  description: string;
  features: string[];
  images: string[];
  sceneIds: string[];
  surrounding: SurroundingItem[];
  zoneQuality: ZoneQuality;
  whyChooseZone: string[];
  access: AccessItem[];
  zoneDescription: string;
  compareTitles: string[];
}

export interface ComparisonRecord {
  fromPropertyId: string;
  toPropertyId: string;
  count: number;
}

export interface SearchInterest {
  topic: string;
  pct: number;
}