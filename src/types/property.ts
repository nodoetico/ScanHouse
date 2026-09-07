export interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  currency: 'USD' | 'ARS';
  bedrooms: number;
  bathrooms: number;
  coveredArea: number;
  landArea: number;
  garages: number;
  features: string[];
  description: string;
  images: string[];
  scenes: Scene[];
  floorPlan: FloorPlan;
  assistantKnowledge: AssistantKnowledge;
  branding: Branding;
}

export interface Scene {
  id: string;
  name: string;
  panorama: string;
  thumbnail: string;
  description: string;
  position: { x: number; y: number; z: number };
  rotation: { yaw: number; pitch: number; hfov: number };
  hotspots: Hotspot[];
  connections: SceneConnection[];
}

export interface Hotspot {
  id: string;
  type: 'navigation' | 'info' | 'cta' | 'contact';
  name: string;
  pitch: number;
  yaw: number;
  targetSceneId?: string;
  content?: string;
  icon?: string;
}

export interface SceneConnection {
  targetSceneId: string;
  hotspotId: string;
}

export interface FloorPlan {
  image: string;
  rooms: FloorPlanRoom[];
}

export interface FloorPlanRoom {
  id: string;
  name: string;
  sceneId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

export interface AssistantKnowledge {
  propertyDescription: string;
  features: string[];
  price: string;
  location: string;
  rules: string[];
  services: string[];
  faq: FAQItem[];
  contact: ContactInfo;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ContactInfo {
  whatsapp: string;
  email: string;
  phone: string;
  agency: string;
}

export interface Branding {
  name: string;
  tagline: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}