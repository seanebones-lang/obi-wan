"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { anchors, getAnchor } from "@/data/anchors";
import { anchorTranslationKeys } from "@/data/anchor-keys";
import type { PlaceResult } from "@/lib/google/places";
import { MapCanvas } from "@/components/map/MapCanvas";
import { CategoryFilters } from "@/components/map/CategoryFilters";
import { PlaceDetailSheet, PlaceList } from "@/components/map/PlaceDetailSheet";
import { Button } from "@/components/ui/button";
import { MapPin, Search, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function ExploreClient() {
  const t = useTranslations("explore");
  const tAll = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const zoneParam = searchParams.get("zone") ?? "stadium";
  const categoryParam = searchParams.get("category") ?? "restaurant";

  const [zoneId, setZoneId] = useState(zoneParam);
  const [category, setCategory] = useState(categoryParam);
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [demo, setDemo] = useState(false);
  const [sort, setSort] = useState<"POPULARITY" | "DISTANCE">("POPULARITY");

  const anchor = getAnchor(zoneId) ?? anchors[0];

  useEffect(() => {
    let cancelled = false;

    async function loadPlaces() {
      try {
        const endpoint = searchQuery.trim()
          ? "/api/places/search"
          : "/api/places/nearby";

        const body = searchQuery.trim()
          ? {
              query: searchQuery,
              lat: anchor.lat,
              lng: anchor.lng,
              radiusMeters: anchor.radiusMeters,
              languageCode: locale,
            }
          : {
              lat: anchor.lat,
              lng: anchor.lng,
              radiusMeters: anchor.radiusMeters,
              category,
              languageCode: locale,
              rankPreference: sort,
            };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!cancelled) {
          setPlaces(data.places ?? []);
          setDemo(data.demo ?? false);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setPlaces([]);
          setLoading(false);
        }
      }
    }

    void loadPlaces();
    return () => {
      cancelled = true;
    };
  }, [anchor, category, locale, searchQuery, sort]);

  const handleNearMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      setLoading(true);
      try {
        const res = await fetch("/api/places/nearby", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            radiusMeters: 2000,
            category,
            languageCode: locale,
            rankPreference: sort,
          }),
        });
        const data = await res.json();
        setPlaces(data.places ?? []);
        setDemo(data.demo ?? false);
        setZoneId("stadium");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleDirections = (place: PlaceResult) => {
    const dest = encodeURIComponent(`${place.lat},${place.lng}`);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${dest}`,
      "_blank",
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {demo && (
        <div className="mx-4 mt-2 flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-xs text-amber-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {t("demoMode")}
        </div>
      )}

      <div className="p-4 space-y-3 shrink-0">
        <div className="flex gap-2">
          <select
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value)}
            className="flex-1 rounded-xl border border-border bg-surface-elevated px-3 py-2.5 text-sm font-medium"
          >
            {anchors.map((a) => {
              const keys = anchorTranslationKeys[a.id];
              return (
                <option key={a.id} value={a.id}>
                  {keys ? tAll(keys.name) : a.id}
                </option>
              );
            })}
          </select>
          <Button variant="secondary" size="sm" onClick={handleNearMe}>
            <MapPin className="h-4 w-4" />
            {t("nearMe")}
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-elevated pl-10 pr-4 py-2.5 text-sm"
          />
        </div>

        <CategoryFilters active={category} onChange={setCategory} />

        <div className="flex gap-2">
          <button
            onClick={() => setSort("POPULARITY")}
            className={`text-xs font-semibold px-3 py-1 rounded-full ${sort === "POPULARITY" ? "bg-accent/20 text-accent" : "text-muted"}`}
          >
            {t("sortPopular")}
          </button>
          <button
            onClick={() => setSort("DISTANCE")}
            className={`text-xs font-semibold px-3 py-1 rounded-full ${sort === "DISTANCE" ? "bg-accent/20 text-accent" : "text-muted"}`}
          >
            {t("sortDistance")}
          </button>
        </div>
      </div>

      <MapCanvas
        center={{ lat: anchor.lat, lng: anchor.lng }}
        zoom={14}
        places={places}
        anchors={[anchor]}
        selectedPlaceId={selectedPlace?.id}
        onPlaceClick={setSelectedPlace}
        onMapClick={() => setSelectedPlace(null)}
        className="flex-1 min-h-[200px] w-full"
      />

      <div className="shrink-0 border-t border-border bg-background">
        <PlaceList
          places={places}
          selectedId={selectedPlace?.id}
          onSelect={setSelectedPlace}
          loading={loading}
        />
      </div>

      <PlaceDetailSheet
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
        onDirections={handleDirections}
      />
    </div>
  );
}

export function QuickLaunchCard({
  href,
  title,
  description,
  icon,
  accent = false,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-2xl border p-5 transition-all hover:scale-[1.02] active:scale-[0.98] ${
        accent
          ? "border-accent/50 bg-accent/10 hover:bg-accent/15"
          : "border-border bg-surface-elevated hover:border-accent/30"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
            accent ? "bg-accent/20" : "bg-background"
          }`}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-display font-bold text-base">{title}</h3>
          <p className="text-sm text-muted mt-0.5">{description}</p>
        </div>
      </div>
    </Link>
  );
}
