import { NextRequest, NextResponse } from "next/server";
import { getCached, checkRateLimit } from "@/lib/cache";
import {
  getPlaceDetails,
  hasGoogleApiKey,
} from "@/lib/google/places";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ placeId: string }> },
) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const { placeId } = await params;
    const languageCode = request.nextUrl.searchParams.get("language") ?? "en";

    if (!placeId) {
      return NextResponse.json({ error: "Missing place ID" }, { status: 400 });
    }

    if (!hasGoogleApiKey() || placeId.startsWith("mock-")) {
      return NextResponse.json({
        place: {
          id: placeId,
          name: "Sample Place (Demo Mode)",
          address: "Dallas-Fort Worth, TX",
          lat: 32.7767,
          lng: -96.797,
          rating: 4.5,
          userRatingCount: 250,
          openNow: true,
          editorialSummary:
            "Configure GOOGLE_MAPS_API_KEY for live place details.",
        },
        demo: true,
      });
    }

    const cacheKey = `details:${placeId}:${languageCode}`;
    const place = await getCached(cacheKey, 86400, () =>
      getPlaceDetails(placeId, languageCode),
    );

    return NextResponse.json({ place, demo: false });
  } catch (error) {
    console.error("Place details error:", error);
    return NextResponse.json(
      { error: "Failed to fetch place details" },
      { status: 500 },
    );
  }
}
