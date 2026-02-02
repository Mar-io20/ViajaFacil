
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
  id: string; // Added ID for permission checks
  email: string;
  name: string;
  role: 'ORGANIZER' | 'MEMBER';
  avatar?: string;
  phone?: string;
}

export interface Member {
  userId: string;
  name: string;
  email?: string; // Added optional email for identification
  avatar?: string;
  role: 'LEADER' | 'COORDINATOR' | 'MEMBER';
  canEdit: boolean; // Permission flag
}

export type ItineraryType = 'FLIGHT' | 'STAY' | 'CAR' | 'ACTIVITY';

export interface ItineraryItem {
  id: string;
  type: ItineraryType;
  title: string;
  date: string;
  details: {
    location?: string; // For Stay/Activity
    flightNumber?: string; // For Flight
    seat?: string; // For Flight
    carModel?: string; // For Car
    provider?: string; // Airline, Rental Company, Hotel Name
  };
  attachments?: {
    name: string;
    url: string; // URL or Base64
    type: 'BOARDING_PASS' | 'VOUCHER' | 'OTHER';
  }[];
}

export interface Trip {
  id: string;
  code: string; // 6-char code for joining
  name: string;
  dates: string;
  status: 'planning' | 'booked' | 'completed';
  budget: number;
  spent: number; // New field for financial control
  ownerId: string;
  members: Member[];
  memberIds?: string[]; // Helper for Firestore Security Rules query
  itinerary: ItineraryItem[];
}