export type AgencyId = 'roca' | 'remax' | 'leona' | 'emilia' | 'navarro' | 'agostini';

export interface AgencyBranding {
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export interface AgencyCredentials {
  email: string;
  password: string;
}

export interface AgencyContact {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  domain?: string;
}

export interface AdminProperty {
  id: string;
  name: string;
  location: string;
  price: number;
  currency: 'USD' | 'ARS';
  status: 'activa' | 'pausada' | 'en-preparacion';
  image: string;
  bedrooms: number;
  bathrooms: number;
  coveredArea: number;
  visitors: number;
  avgTime: string;
  interactions: number;
  leads: number;
  visits: number;
  confirmedVisits: number;
  aiQuestions: number;
  whatsappContacts: number;
  hasExperience360: boolean;
}

export type LeadStatus =
  | 'Nuevo'
  | 'Contactado'
  | 'Interesado'
  | 'Visita solicitada'
  | 'Visita confirmada'
  | 'Cerrado';

export type LeadOrigin = 'Experiencia 360' | 'WhatsApp' | 'Portal' | 'Referido' | 'Redes';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  status: LeadStatus;
  date: string;
  origin: LeadOrigin;
  advisor: string;
  interactions: LeadInteraction[];
}

export interface LeadInteraction {
  time: string;
  description: string;
}

export type VisitStatus = 'Proxima' | 'Pendiente' | 'Confirmada' | 'Historial';

export interface Visit {
  id: string;
  client: string;
  propertyId: string;
  date: string;
  time: string;
  status: VisitStatus;
  advisor: string;
}

export interface AIQuestion {
  question: string;
  count: number;
  propertyId: string;
  category: string;
  trend: 'up' | 'down' | 'stable';
}

export interface ActivityItem {
  id: string;
  type:
    | 'nuevo-lead'
    | 'visita-solicitada'
    | 'plano-interactivo'
    | 'consulta-ia'
    | 'whatsapp'
    | 'visita-confirmada'
    | 'tour-completado';
  description: string;
  time: string;
}

export interface VisitorsPerDay {
  day: string;
  count: number;
}

export interface AnalyticsData {
  visitors: number;
  uniqueVisitors: number;
  avgTime: string;
  toursCompleted: number;
  interactions: number;
  leads: number;
  visitRequests: number;
  whatsappContacts: number;
  aiConversations: number;
  visitorsByDay: VisitorsPerDay[];
  interactionsByDay: VisitorsPerDay[];
  environmentVisits: {
    scene: string;
    time: string;
  }[];
  propertyComparison: {
    propertyId: string;
    visitors: number;
    aiQuestions: number;
    leads: number;
    visits: number;
  }[];
  funnel: {
    label: string;
    value: number;
  }[];
  conversions: {
    label: string;
    value: string;
  }[];
}

export interface AutomationItem {
  trigger: string;
  action: string;
  status: 'activo' | 'proximamente';
}

export interface Agency {
  id: AgencyId;
  name: string;
  shortName: string;
  logo: string;
  loginHintUser: string;
  loginHintPassword: string;
  credentials: AgencyCredentials;
  branding: AgencyBranding;
  contact: AgencyContact;
  properties: AdminProperty[];
  leads: Lead[];
  visits: Visit[];
  analytics: AnalyticsData;
  aiQuestions: AIQuestion[];
  activity: ActivityItem[];
  automations: AutomationItem[];
}