export interface Door {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  category: string;
  style: string[];
  tags: string[];
  materials: string[];
  finishes: string[];
  colors: string[];
  sizes: string[];
  addons: string[];
  price: number | null;
  price_range: string;
  images: DoorImage[];
  display_priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DoorImage {
  url: string;
  alt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
}

export interface ContactForm {
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  agreed_to_terms: boolean;
  door_name?: string;
  door_id?: string;
  inquiry_type?: 'door_specific' | 'general';
  created_at?: Date;
  status?: 'new' | 'contacted' | 'closed';
}

export interface BusinessInfo {
  id?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  hours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  created_at?: Date;
  updated_at?: Date;
}