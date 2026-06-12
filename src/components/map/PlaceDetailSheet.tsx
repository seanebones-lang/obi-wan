"use client";

import { useTranslations } from "next-intl";
import type { PlaceResult } from "@/types/places";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type PlaceDetailSheetProps = {
  place: PlaceResult | null;
  onClose: () => void;
  onDirections: (place: PlaceResult) => void;
};

export function PlaceDetailSheet({
  place,
  onClose,
  onDirections,
}: PlaceDetailSheetProps) {
  const t = useTranslations("explore");

  if (!place) return null;

  return (
    <div className="fixed inset-x-0 bottom-16 z-40 mx-auto max-w-lg animate-in slide-in-from-bottom duration-300">
      <div className="mx-3 rounded-2xl border border-border bg-background shadow-2xl">
        <div className="relative">
          {place.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={place.photoUrl}
              alt={place.name}
              className="h-36 w-full rounded-t-2xl object-cover"
            />
          ) : (
            <div className="h-24 w-full rounded-t-2xl bg-surface-elevated flex items-center justify-center text-3xl">
              📍
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 rounded-full bg-background/80 p-1.5 backdrop-blur"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-display text-lg font-bold">{place.name}</h3>
            <p className="text-sm text-muted flex items-center gap-1 mt-0.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {place.address}
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm">
            {place.rating && (
              <span className="flex items-center gap-1 text-accent">
                <Star className="h-4 w-4 fill-current" />
                {place.rating.toFixed(1)}
                {place.userRatingCount && (
                  <span className="text-muted">
                    ({place.userRatingCount} {t("reviews")})
                  </span>
                )}
              </span>
            )}
            {place.openNow !== undefined && (
              <span
                className={cn(
                  "flex items-center gap-1 text-xs font-semibold",
                  place.openNow ? "text-green-400" : "text-red-400",
                )}
              >
                <Clock className="h-3.5 w-3.5" />
                {place.openNow ? t("openNow") : "Closed"}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => onDirections(place)}
            >
              {t("getDirections")}
            </Button>
            {place.googleMapsUri && (
              <Button variant="secondary" size="icon" asChild>
                <a href={place.googleMapsUri} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type PlaceListProps = {
  places: PlaceResult[];
  selectedId?: string | null;
  onSelect: (place: PlaceResult) => void;
  loading?: boolean;
};

export function PlaceList({
  places,
  selectedId,
  onSelect,
  loading,
}: PlaceListProps) {
  const t = useTranslations("explore");

  if (loading) {
    return (
      <div className="space-y-2 p-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-surface-elevated animate-pulse" />
        ))}
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <p className="p-4 text-center text-sm text-muted">{t("noResults")}</p>
    );
  }

  return (
    <div className="max-h-48 overflow-y-auto space-y-1.5 p-3">
      {places.map((place) => (
        <button
          key={place.id}
          onClick={() => onSelect(place)}
          className={cn(
            "w-full rounded-xl p-3 text-left transition-colors",
            selectedId === place.id
              ? "bg-accent/15 border border-accent/30"
              : "bg-surface-elevated hover:bg-surface-elevated/80 border border-transparent",
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{place.name}</p>
              <p className="text-xs text-muted truncate">{place.address}</p>
            </div>
            {place.rating && (
              <span className="flex shrink-0 items-center gap-0.5 text-xs text-accent font-semibold">
                <Star className="h-3 w-3 fill-current" />
                {place.rating.toFixed(1)}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
