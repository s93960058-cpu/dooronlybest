// Firebase Timestamp type
export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

// Door interface
export interface Door {
  id: string;
  name: string;
  slug: string;
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
  price_range: string;
  price?: number | null;
  images: Array<{
    url: string;
    alt: string;
  }>;
  display_priority: number;
  is_active: boolean;
}

// Review interface
export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  approved?: boolean;
}

// Contact Form interface
export interface ContactForm {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  door_name?: string;
  inquiry_type?: 'door_specific' | 'general';
  status?: 'new' | 'contacted' | 'closed';
  created_at?: FirebaseTimestamp;
}

// Business Info interface
export interface BusinessInfo {
  id?: string;
  hours: string;
  address: string;
  phone: string;
  email: string;
}

// Category interface
export interface Category {
  id?: string;
  name: string;
  description: string;
  is_active: boolean;
  display_order?: number;
}

// Site Settings interface
export interface SiteSettings {
  id?: string;
  site_title: string;
  site_description: string;
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_description: string;
  catalog_title: string;
  catalog_description: string;
  contact_title: string;
  contact_description: string;
  reviews_title: string;
  reviews_description: string;
  footer_text: string;
  meta_keywords: string;
  social_facebook?: string;
  social_instagram?: string;
  social_whatsapp?: string;
}

// Theme Settings interface
export interface ThemeSettings {
  id?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
}