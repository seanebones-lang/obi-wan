import "server-only";

/** Server-side Google Maps API key. Falls back to the public browser key when only one key is configured (e.g. on Netlify). */
export function getGoogleApiKey(): string {
  const key =
    process.env.GOOGLE_MAPS_API_KEY ??
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  if (!key) {
    throw new Error(
      "Google Maps API key not configured. Set GOOGLE_MAPS_API_KEY or NEXT_PUBLIC_GOOGLE_MAPS_KEY.",
    );
  }
  return key;
}

export function hasGoogleApiKey(): boolean {
  return Boolean(
    process.env.GOOGLE_MAPS_API_KEY ??
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
  );
}
