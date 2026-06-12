"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { matches, type Match } from "@/data/matches";
import { getAnchor } from "@/data/anchors";
import { MatchSelector } from "./MatchSelector";
import { TransitCard } from "./TransitCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { Map, Navigation, Cloud, Thermometer } from "lucide-react";
import type { WeatherResult } from "@/lib/weather";

export function MatchDayClient() {
  const t = useTranslations("matchDay");
  const searchParams = useSearchParams();
  const matchParam = searchParams.get("match");

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(
    matchParam ? matches.find((m) => m.id === matchParam) ?? null : matches[0],
  );
  const [weather, setWeather] = useState<WeatherResult | null>(null);

  const stadium = getAnchor("stadium")!;

  useEffect(() => {
    if (!selectedMatch) return;
    fetch(`/api/weather?lat=${stadium.lat}&lng=${stadium.lng}`)
      .then((r) => r.json())
      .then((d) => setWeather(d.weather))
      .catch(() => setWeather(null));
  }, [selectedMatch, stadium.lat, stadium.lng]);

  return (
    <div className="space-y-6 p-4 pb-24">
      <div>
        <h2 className="font-display text-xl font-bold">{t("selectMatch")}</h2>
        <div className="mt-3">
          <MatchSelector
            selectedId={selectedMatch?.id ?? null}
            onSelect={setSelectedMatch}
          />
        </div>
      </div>

      {selectedMatch && (
        <>
          {weather && (
            <Card className="flex items-center gap-4">
              <Cloud className="h-8 w-8 text-accent shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted">
                  {t("weatherAtKickoff")}
                </p>
                <p className="font-display font-bold text-lg capitalize flex items-center gap-2">
                  <Thermometer className="h-4 w-4" />
                  {weather.temp}°{weather.unit} — {weather.description}
                </p>
                <p className="text-xs text-muted">
                  Feels like {weather.feelsLike}°{weather.unit}
                </p>
              </div>
            </Card>
          )}

          <TransitCard />

          <div className="grid gap-3">
            <Button asChild className="w-full h-12">
              <Link
                href={`/explore?zone=stadium&category=parking`}
              >
                <Map className="h-4 w-4" />
                {t("layersActive")}
              </Link>
            </Button>
            <Button variant="secondary" asChild className="w-full h-12">
              <Link
                href={`/directions?dest=stadium&match=${selectedMatch.id}`}
              >
                <Navigation className="h-4 w-4" />
                {t("directionsToStadium")}
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
