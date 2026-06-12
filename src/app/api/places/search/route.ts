import { NextRequest, NextResponse } from "next/server";
import { getCached, checkRateLimit } from "@/lib/cache";
import { geoHashKey } from "@/lib/geo";
import {
  textSearch,
  getMockPlaces,
  hasGoogleApiKey,
} from "@/lib/google/places";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const {
      query,
      lat,
      lng,
      radiusMeters = 5000,
      languageCode = "en",
    } = body;

    if (!query || typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const cacheKey = `search:${geoHashKey(lat, lng)}:${query}:${languageCode}`;

    const places = await getCached(cacheKey, 1800, async () => {
      if (!hasGoogleApiKey()) {
        return getMockPlaces(lat, lng, "restaurant").filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase().slice(0, 3)) ||
          query.length < 3,
        );
      }
      return textSearch({ query, lat, lng, radiusMeters, languageCode });
    });

    return NextResponse.json({ places, demo: !hasGoogleApiKey() });
  } catch (error) {
    console.error("Places search error:", error);
    return NextResponse.json(
      { error: "Failed to search places" },
      { status: 500 },
    );
  }
}
