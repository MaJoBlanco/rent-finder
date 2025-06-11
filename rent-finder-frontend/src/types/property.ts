// /src/types/property.ts

export interface Location {
  type?: string;
  coordinates?: number[];
  is_location_exact?: boolean;
}

export interface Address {
  street?: string;
  suburb?: string;
  government_area?: string;
  market?: string;
  country?: string;
  country_code?: string;
  location?: Location;
}

export interface Property {
  id?: string; // alias de _id en backend
  _id?: string; // por si viene sin transformar
  name: string;
  summary?: string;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  price?: string;
  address?: Address;
  picture_url?: string; // alias de images.picture_url
  amenities?: string[];
  review_scores_rating?: number;
}
