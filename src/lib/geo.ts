export type LatLng = { lat: number; lng: number };

export function haversineDistance(a: LatLng, b: LatLng): number {
  const R = 6371e3;
  const φ1 = (a.lat * Math.PI) / 180;
  const φ2 = (b.lat * Math.PI) / 180;
  const Δφ = ((b.lat - a.lat) * Math.PI) / 180;
  const Δλ = ((b.lng - a.lng) * Math.PI) / 180;

  const sinΔφ = Math.sin(Δφ / 2);
  const sinΔλ = Math.sin(Δλ / 2);
  const h =
    sinΔφ * sinΔφ +
    Math.cos(φ1) * Math.cos(φ2) * sinΔλ * sinΔλ;

  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function formatDistance(meters: number, locale: string): string {
  if (meters < 1000) {
    return new Intl.NumberFormat(locale, {
      style: "unit",
      unit: "meter",
      unitDisplay: "short",
      maximumFractionDigits: 0,
    }).format(meters);
  }
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "kilometer",
    unitDisplay: "short",
    maximumFractionDigits: 1,
  }).format(meters / 1000);
}

export function geoHashKey(lat: number, lng: number, precision = 3): string {
  const factor = Math.pow(10, precision);
  return `${Math.round(lat * factor) / factor},${Math.round(lng * factor) / factor}`;
}
