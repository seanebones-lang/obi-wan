import { NextRequest, NextResponse } from "next/server";
import { getCached, checkRateLimit } from "@/lib/cache";
import { geoHashKey } from "@/lib/geo";
import {
  searchNearby,
  getMockPlaces,
  hasGoogleApiKey,
} from "@/lib/google/places";
import { categoryTypes } from "@/data/anchors";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const {
      lat,
      lng,
      radiusMeters = 2000,
      category = "restaurant",
      languageCode = "en",
      rankPreference = "POPULARITY",
    } = body;

    if (typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    const types = categoryTypes[category]?.includedTypes ?? ["restaurant"];
    const cacheKey = `nearby:${geoHashKey(lat, lng)}:${category}:${languageCode}:${rankPreference}`;

    const places = await getCached(cacheKey, 1800, async () => {
      if (!hasGoogleApiKey()) {
        return getMockPlaces(lat, lng, category);
      }
      return searchNearby({
        lat,
        lng,
        radiusMeters,
        includedTypes: types,
        languageCode,
        rankPreference,
      });
    });

    return NextResponse.json({ places, demo: !hasGoogleApiKey() });
  } catch (error) {
    console.error("Places nearby error:", error);
    return NextResponse.json(
      { error: "Failed to fetch places" },
      { status: 500 },
    );
  }
}
