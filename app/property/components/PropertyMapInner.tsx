
"use client";

import "./PropertyMap.css";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

type Props = {
  latitude: number;
  longitude: number;
  onLocationChange: (
    latitude: number,
    longitude: number
  ) => void;
};

const markerIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapCenter({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(
      [latitude, longitude],
      map.getZoom()
    );
  }, [map, latitude, longitude]);

  return null;
}

function MapClick({
  onLocationChange,
}: {
  onLocationChange: Props["onLocationChange"];
}) {
  useMapEvents({
    click(event) {
      onLocationChange(
        event.latlng.lat,
        event.latlng.lng
      );
    },
  });

  return null;
}

export default function PropertyMapInner({
  latitude,
  longitude,
  onLocationChange,
}: Props) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  async function searchLocation(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const search = query.trim();

    if (!search) return;

    setSearching(true);
    setError("");

    try {
      const params = new URLSearchParams({
        q: search,
        format: "jsonv2",
        limit: "1",
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`
      );

      if (!response.ok) {
        throw new Error("Location search failed.");
      }

      const results = await response.json();

      if (!results.length) {
        setError("No matching location found.");
        return;
      }

      const lat = Number(results[0].lat);
      const lng = Number(results[0].lon);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        throw new Error("Invalid coordinates.");
      }

      onLocationChange(lat, lng);
    } catch (err) {
      console.error("[PropertyMapInner] Search error:", err);
      setError("Location search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="property-map-wrapper">
      <form
        onSubmit={searchLocation}
        className="property-map-search"
      >
        <input
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Search for a town, street or location..."
          aria-label="Search property location"
        />

        <button type="submit" disabled={searching}>
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <p className="property-map-error">{error}</p>
      )}

      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        scrollWheelZoom
        className="property-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapCenter
          latitude={latitude}
          longitude={longitude}
        />

        <MapClick
          onLocationChange={onLocationChange}
        />

        <Marker
          position={[latitude, longitude]}
          icon={markerIcon}
          draggable
          eventHandlers={{
            dragend(event) {
              const position = event.target.getLatLng();

              onLocationChange(
                position.lat,
                position.lng
              );
            },
          }}
        />
      </MapContainer>

      <p className="property-map-hint">
        Click the map or drag the marker to pinpoint the property.
      </p>
    </div>
  );
}
