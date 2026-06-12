import { NextRequest, NextResponse } from "next/server";
import { getCached, checkRateLimit } from "@/lib/cache";
import {
  getDirections,
  getMockDirections,
  hasGoogleApiKey,
} from "@/lib/google/directions";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const {
      origin,
      destination,
      mode = "transit",
      departureTime,
      language = "en",
    } = body;

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Origin and destination required" },
        { status: 400 },
      );
    }

    const cacheKey = `directions:${origin}:${destination}:${mode}:${departureTime ?? "now"}:${language}`;

    const result = await getCached(cacheKey, 900, async () => {
      if (!hasGoogleApiKey()) {
        return getMockDirections(origin, destination, mode);
      }
      return getDirections({
        origin,
        destination,
        mode,
        departureTime,
        language,
      });
    });

    return NextResponse.json({ ...result, demo: !hasGoogleApiKey() });
  } catch (error) {
    console.error("Directions error:", error);
    return NextResponse.json(
      { error: "Failed to get directions" },
      { status: 500 },
    );
  }
}
