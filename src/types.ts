export type Currency = 'EUR' | 'XOF' | 'BRL';

export interface Level {
  id: number;
  code: string;
  name: string;
  is_active?: boolean;
}

export interface City {
  id: number;
  name: string;
  state: string;
  is_active?: boolean;
  description?: string;
  image?: string;
}

export interface Program {
  id: number;
  title: string;
  category: 'pack_visa' | 'in_person' | 'online';
  categoryLabel: string;
  level: string;
  city: string;
  studyMode: string;
  duration: string;
  hours: number;
  priceEur: number;
  isGuaranteed: boolean;
  statusBadge: string;
  description: string;
  features: string[];
}

