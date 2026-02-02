
export enum SearchType {
  FLIGHT = 'FLIGHT',
  BUS = 'BUS',
  CAR = 'CAR',
  STAY = 'STAY'
}

export interface SearchParams {
  type: SearchType;
  origin?: string;
  destination: string;
  date: string;
  passengers: number;
}

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  price: string;
  rating?: number;
  imageUrl?: string;
  features: string[];
}

export interface User {
  email: string;
  name: string;
  role: 'ORGANIZER' | 'MEMBER';
  avatar?: string;
  phone?: string;
}

export interface Trip {
  id: string;
  name: string;
  dates: string;
  status: 'planning' | 'booked' | 'completed';
  budget: number;
}
