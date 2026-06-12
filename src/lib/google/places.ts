const PLACES_BASE = "https://places.googleapis.com/v1";

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

const NEARBY_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.googleMapsUri",
  "places.photos",
  "places.types",
  "places.priceLevel",
  "places.currentOpeningHours",
].join(",");

const DETAILS_FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "location",
  "rating",
  "userRatingCount",
  "googleMapsUri",
  "photos",
  "types",
  "priceLevel",
  "currentOpeningHours",
  "regularOpeningHours",
  "editorialSummary",
  "reviews",
].join(",");

function getApiKey(): string {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) throw new Error("GOOGLE_MAPS_API_KEY is not configured");
  return key;
}

function mapPlace(place: Record<string, unknown>, apiKey: string): PlaceResult {
  const displayName = place.displayName as { text?: string } | undefined;
  const location = place.location as { latitude?: number; longitude?: number } | undefined;
  const photos = place.photos as { name?: string }[] | undefined;
  const hours = place.currentOpeningHours as {
    openNow?: boolean;
    weekdayDescriptions?: string[];
  } | undefined;

  let photoUrl: string | undefined;
  if (photos?.[0]?.name) {
    photoUrl = `https://places.googleapis.com/v1/${photos[0].name}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`;
  }

  const id = (place.id as string) ?? "";

  return {
    id,
    name: displayName?.text ?? "Unknown",
    address: (place.formattedAddress as string) ?? "",
    lat: location?.latitude ?? 0,
    lng: location?.longitude ?? 0,
    rating: place.rating as number | undefined,
    userRatingCount: place.userRatingCount as number | undefined,
    googleMapsUri: place.googleMapsUri as string | undefined,
    photoUrl,
    types: place.types as string[] | undefined,
    priceLevel: place.priceLevel as string | undefined,
    openNow: hours?.openNow,
    weekdayDescriptions: hours?.weekdayDescriptions,
  };
}

export async function searchNearby(params: {
  lat: number;
  lng: number;
  radiusMeters: number;
  includedTypes: string[];
  languageCode: string;
  rankPreference?: "DISTANCE" | "POPULARITY";
  maxResultCount?: number;
}): Promise<PlaceResult[]> {
  const apiKey = getApiKey();

  const response = await fetch(`${PLACES_BASE}/places:searchNearby`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": NEARBY_FIELD_MASK,
    },
    body: JSON.stringify({
      includedTypes: params.includedTypes,
      maxResultCount: params.maxResultCount ?? 20,
      languageCode: params.languageCode,
      rankPreference: params.rankPreference ?? "POPULARITY",
      locationRestriction: {
        circle: {
          center: { latitude: params.lat, longitude: params.lng },
          radius: Math.min(params.radiusMeters, 50000),
        },
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Places nearby search failed: ${err}`);
  }

  const data = (await response.json()) as { places?: Record<string, unknown>[] };
  return (data.places ?? []).map((p) => mapPlace(p, apiKey));
}

export async function textSearch(params: {
  query: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  languageCode: string;
}): Promise<PlaceResult[]> {
  const apiKey = getApiKey();

  const response = await fetch(`${PLACES_BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": NEARBY_FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: params.query,
      languageCode: params.languageCode,
      maxResultCount: 20,
      locationBias: {
        circle: {
          center: { latitude: params.lat, longitude: params.lng },
          radius: Math.min(params.radiusMeters, 50000),
        },
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Places text search failed: ${err}`);
  }

  const data = (await response.json()) as { places?: Record<string, unknown>[] };
  return (data.places ?? []).map((p) => mapPlace(p, apiKey));
}

export async function getPlaceDetails(
  placeId: string,
  languageCode: string,
): Promise<PlaceResult & { editorialSummary?: string; reviews?: { text?: string; rating?: number }[] }> {
  const apiKey = getApiKey();
  const id = placeId.startsWith("places/") ? placeId : `places/${placeId}`;

  const response = await fetch(
    `${PLACES_BASE}/${id}?languageCode=${encodeURIComponent(languageCode)}`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": DETAILS_FIELD_MASK,
      },
    },
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Place details failed: ${err}`);
  }

  const place = (await response.json()) as Record<string, unknown>;
  const mapped = mapPlace(place, apiKey);
  const editorial = place.editorialSummary as { text?: string } | undefined;
  const reviews = place.reviews as { text?: { text?: string }; rating?: number }[] | undefined;

  return {
    ...mapped,
    editorialSummary: editorial?.text,
    reviews: reviews?.slice(0, 3).map((r) => ({
      text: r.text?.text,
      rating: r.rating,
    })),
  };
}

export function getMockPlaces(
  lat: number,
  lng: number,
  category: string,
): PlaceResult[] {
  const offsets = [
    { dlat: 0.002, dlng: 0.001 },
    { dlat: -0.001, dlng: 0.002 },
    { dlat: 0.001, dlng: -0.002 },
    { dlat: -0.002, dlng: -0.001 },
    { dlat: 0.003, dlng: 0.003 },
  ];

  const names: Record<string, string[]> = {
    restaurant: ["Local BBQ Joint", "Tex-Mex Cantina", "Sports Grill", "Taco Stand", "Steakhouse"],
    bar: ["Sports Bar & Grill", "Craft Beer Hall", "Rooftop Lounge", "Irish Pub", "Fan Zone Bar"],
    parking: ["Stadium Lot A", "Garage Parking", "Event Parking", "Street Parking", "Premium Lot"],
    lodging: ["Downtown Hotel", "Airport Inn", "Boutique Stay", "Extended Stay", "Budget Motel"],
    cafe: ["Coffee House", "Morning Brew", "Café Central", "Espresso Bar", "Bakery Café"],
    pharmacy: ["City Pharmacy", "Drug Store", "Health Mart", "Care Pharmacy", "Quick Rx"],
    atm: ["Bank ATM", "Credit Union ATM", "Corner ATM", "Mall ATM", "Gas Station ATM"],
    convenience: ["Corner Store", "Quick Mart", "Grocery Express", "Mini Market", "7-Eleven"],
  };

  const list = names[category] ?? names.restaurant;

  return offsets.map((o, i) => ({
    id: `mock-${category}-${i}`,
    name: list[i] ?? `Sample ${category} ${i + 1}`,
    address: `${100 + i * 50} Main St, Dallas, TX`,
    lat: lat + o.dlat,
    lng: lng + o.dlng,
    rating: 4 + (i % 10) / 10,
    userRatingCount: 100 + i * 47,
    types: [category],
    openNow: i % 2 === 0,
  }));
}

export function hasGoogleApiKey(): boolean {
  return Boolean(process.env.GOOGLE_MAPS_API_KEY);
}
