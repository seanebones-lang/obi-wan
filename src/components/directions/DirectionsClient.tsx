"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { getAnchor } from "@/data/anchors";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DirectionsResult } from "@/lib/google/directions";
import { Navigation, ExternalLink, AlertCircle, Loader2 } from "lucide-react";

const presets = [
  {
    key: "presetAirportStadium" as const,
    origin: "DFW Airport, TX",
    destination: "AT&T Stadium, Arlington, TX",
  },
  {
    key: "presetDowntownFestival" as const,
    origin: "Downtown Dallas, TX",
    destination: "Fair Park, Dallas, TX",
  },
  {
    key: "presetVictoryStadium" as const,
    origin: "Victory Station, Dallas, TX",
    destination: "AT&T Stadium, Arlington, TX",
  },
];

export function DirectionsClient() {
  const t = useTranslations("directions");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const destParam = searchParams.get("dest");
  const destAnchor = destParam ? getAnchor(destParam) : null;

  const [origin, setOrigin] = useState(
    destParam === "stadium" ? "DFW Airport, TX" : "",
  );
  const [destination, setDestination] = useState(
    destAnchor
      ? `${destAnchor.lat},${destAnchor.lng}`
      : "AT&T Stadium, Arlington, TX",
  );
  const [mode, setMode] = useState<"transit" | "driving" | "walking">("transit");
  const [result, setResult] = useState<DirectionsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [demo, setDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDirections = async () => {
    if (!origin || !destination) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/directions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination, mode, language: locale }),
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setResult(data);
      setDemo(data.demo ?? false);
    } catch {
      setError(t("loading"));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset: (typeof presets)[0]) => {
    setOrigin(preset.origin);
    setDestination(preset.destination);
  };

  return (
    <div className="space-y-6 p-4 pb-24">
      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted">
            {t("origin")}
          </label>
          <input
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="DFW Airport, TX"
            className="mt-1 w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted">
            {t("destination")}
          </label>
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="AT&T Stadium, Arlington, TX"
            className="mt-1 w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setMode("transit")}
          className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-colors ${
            mode === "transit"
              ? "bg-accent text-accent-foreground"
              : "bg-surface-elevated text-muted border border-border"
          }`}
        >
          {t("modeTransit")}
        </button>
        <button
          onClick={() => setMode("driving")}
          className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-colors ${
            mode === "driving"
              ? "bg-accent text-accent-foreground"
              : "bg-surface-elevated text-muted border border-border"
          }`}
        >
          {t("modeDriving")}
        </button>
        <button
          onClick={() => setMode("walking")}
          className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-colors ${
            mode === "walking"
              ? "bg-accent text-accent-foreground"
              : "bg-surface-elevated text-muted border border-border"
          }`}
        >
          {t("modeWalking")}
        </button>
      </div>

      <Button onClick={fetchDirections} disabled={loading} className="w-full h-12">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Navigation className="h-4 w-4" />
        )}
        {t("getDirections")}
      </Button>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
          {t("presets")}
        </p>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => applyPreset(p)}
              className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-semibold hover:border-accent/50"
            >
              {t(p.key)}
            </button>
          ))}
        </div>
      </div>

      {demo && result && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-xs text-amber-300">
          <AlertCircle className="h-4 w-4" />
          Demo mode
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}

      {result && (
        <Card className="space-y-4">
          {result.legs.map((leg, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm font-semibold mb-3">
                <span>{t("totalDuration")}: {leg.duration}</span>
                <span>{t("totalDistance")}: {leg.distance}</span>
              </div>
              <ol className="space-y-3">
                {leg.steps.map((step, j) => (
                  <li key={j} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                      {j + 1}
                    </span>
                    <div>
                      <p className="text-muted leading-relaxed">{step.instruction}</p>
                      <p className="text-xs text-muted/70 mt-0.5">
                        {step.distance} · {step.duration}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
          <Button variant="outline" asChild className="w-full">
            <a href={result.googleMapsUrl} target="_blank" rel="noopener noreferrer">
              {t("openInMaps")}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </Card>
      )}
    </div>
  );
}
