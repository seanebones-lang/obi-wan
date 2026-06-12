import "server-only";

import type { DirectionsResult } from "@/types/directions";
import { getGoogleApiKey, hasGoogleApiKey } from "@/lib/google/api-key";

export type { DirectionsResult, DirectionLeg, DirectionStep } from "@/types/directions";

export async function getDirections(params: {
  origin: string;
  destination: string;
  mode: "transit" | "driving" | "walking";
  departureTime?: number;
  language: string;
}): Promise<DirectionsResult> {
  const apiKey = getGoogleApiKey();
  const searchParams = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
    mode: params.mode,
    language: params.language,
    key: apiKey,
  });

  if (params.departureTime) {
    searchParams.set("departure_time", String(params.departureTime));
  }

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/directions/json?${searchParams}`,
  );

  if (!response.ok) {
    throw new Error("Directions request failed");
  }

  const data = await response.json();

  if (data.status !== "OK" || !data.routes?.[0]) {
    throw new Error(data.error_message ?? `Directions failed: ${data.status}`);
  }

  const route = data.routes[0];
  const legs = route.legs.map(
    (leg: {
      distance: { text: string };
      duration: { text: string };
      steps: { html_instructions: string; distance: { text: string }; duration: { text: string }; travel_mode: string }[];
      departure_time?: { text: string };
      arrival_time?: { text: string };
    }) => ({
      distance: leg.distance.text,
      duration: leg.duration.text,
      departureTime: leg.departure_time?.text,
      arrivalTime: leg.arrival_time?.text,
      steps: leg.steps.map((step) => ({
        instruction: step.html_instructions.replace(/<[^>]*>/g, ""),
        distance: step.distance.text,
        duration: step.duration.text,
        travelMode: step.travel_mode,
      })),
    }),
  );

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(params.origin)}&destination=${encodeURIComponent(params.destination)}&travelmode=${params.mode}`;

  return {
    summary: route.summary ?? "",
    legs,
    googleMapsUrl,
  };
}

export function getMockDirections(
  origin: string,
  destination: string,
  mode: string,
): DirectionsResult {
  return {
    summary: `${mode} route (demo mode)`,
    legs: [
      {
        distance: "18 mi",
        duration: mode === "transit" ? "1 hr 15 min" : "35 min",
        steps: [
          {
            instruction: `Head toward ${destination.split(",")[0]}`,
            distance: "2 mi",
            duration: "5 min",
            travelMode: mode.toUpperCase(),
          },
          {
            instruction: "Continue on I-30 W / I-35W S",
            distance: "12 mi",
            duration: "20 min",
            travelMode: mode.toUpperCase(),
          },
          {
            instruction: `Arrive at ${destination.split(",")[0]}`,
            distance: "4 mi",
            duration: "10 min",
            travelMode: mode.toUpperCase(),
          },
        ],
      },
    ],
    googleMapsUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${mode}`,
  };
}

export { hasGoogleApiKey };
