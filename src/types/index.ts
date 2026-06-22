export interface Listing {
  id: string;
  title: string;
  location: string;
  category: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  badgeLabel?: string;
}

export interface RoomAmenity {
  icon: string;
  label: string;
}

export interface Room extends Listing {
  description: string;
  hostName: string;
  hostYears: number;
  isSuperhost: boolean;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  amenities: RoomAmenity[];
  galleryImages: string[];
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export type SortOrder = 'asc' | 'desc';
