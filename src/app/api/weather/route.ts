import { NextRequest, NextResponse } from "next/server";
import { getCached, checkRateLimit } from "@/lib/cache";
import { geoHashKey } from "@/lib/geo";
import { getWeather } from "@/lib/weather";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const lat = parseFloat(request.nextUrl.searchParams.get("lat") ?? "");
    const lng = parseFloat(request.nextUrl.searchParams.get("lng") ?? "");

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    const cacheKey = `weather:${geoHashKey(lat, lng, 2)}`;
    const weather = await getCached(cacheKey, 3600, () => getWeather(lat, lng));

    return NextResponse.json({ weather });
  } catch (error) {
    console.error("Weather error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather" },
      { status: 500 },
    );
  }
}
