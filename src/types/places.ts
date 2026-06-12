export type PlaceResult = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  photoUrl?: string;
  types?: string[];
  priceLevel?: string;
  openNow?: boolean;
  weekdayDescriptions?: string[];
};
