"use client";

import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import type { PlaceResult } from "@/lib/google/places";
import type { AnchorZone } from "@/data/anchors";

let mapsOptionsSet = false;

type MapCanvasProps = {
  center: { lat: number; lng: number };
  zoom?: number;
  places?: PlaceResult[];
  anchors?: AnchorZone[];
  selectedPlaceId?: string | null;
  onPlaceClick?: (place: PlaceResult) => void;
  onMapClick?: () => void;
  className?: string;
};

export function MapCanvas({
  center,
  zoom = 14,
  places = [],
  anchors = [],
  selectedPlaceId,
  onPlaceClick,
  onMapClick,
  className,
}: MapCanvasProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const [mapError, setMapError] = useState<string | null>(
    () => (!apiKey ? "Map unavailable — set NEXT_PUBLIC_GOOGLE_MAPS_KEY" : null),
  );

  useEffect(() => {
    if (!apiKey) return;

    let cancelled = false;

    async function bootstrapMap() {
      if (!mapRef.current || mapInstance.current) return;

      try {
        if (!mapsOptionsSet) {
          setOptions({ key: apiKey, v: "weekly" });
          mapsOptionsSet = true;
        }

        const { Map } = await importLibrary("maps");
        if (cancelled || !mapRef.current) return;

        mapInstance.current = new Map(mapRef.current, {
          center,
          zoom,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: darkMapStyles,
        });

        mapInstance.current.addListener("click", () => onMapClick?.());
      } catch {
        if (!cancelled) setMapError("Failed to load map");
      }
    }

    void bootstrapMap();
    return () => {
      cancelled = true;
    };
  }, [apiKey, center, zoom, onMapClick]);

  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setCenter(center);
    }
  }, [center]);

  useEffect(() => {
    if (!mapInstance.current) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    anchors.forEach((anchor) => {
      const marker = new google.maps.Marker({
        position: { lat: anchor.lat, lng: anchor.lng },
        map: mapInstance.current!,
        title: anchor.id,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#22c55e",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
        zIndex: 1000,
      });
      markersRef.current.push(marker);
    });

    places.forEach((place) => {
      const isSelected = place.id === selectedPlaceId;
      const marker = new google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: mapInstance.current!,
        title: place.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 9 : 7,
          fillColor: isSelected ? "#fbbf24" : "#3b82f6",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: isSelected ? 3 : 1,
        },
      });

      marker.addListener("click", () => onPlaceClick?.(place));
      markersRef.current.push(marker);
    });
  }, [places, anchors, selectedPlaceId, onPlaceClick]);

  if (mapError) {
    return (
      <div className={`flex items-center justify-center bg-surface-elevated ${className}`}>
        <div className="text-center p-6">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-sm text-muted">{mapError}</p>
          <p className="text-xs text-muted mt-2">Places list still works below</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className={className} />;
}

const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#334155" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0c4a6e" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }],
  },
];
