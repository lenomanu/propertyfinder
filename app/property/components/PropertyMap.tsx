
"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  getPropertyLocation,
  savePropertyLocation,
} from "@/app/property/actions/location-actions";

const MapView = dynamic(
  () => import("./PropertyMapInner"),
  {
    ssr: false,
    loading: () => (
      <div className="property-map-loading">
        Loading interactive map...
      </div>
    ),
  }
);

type Props = {
  propertyId: string;
};

const DEFAULT_LATITUDE = -0.4254;
const DEFAULT_LONGITUDE = 36.9498;

export default function PropertyMap({
  propertyId,
}: Props) {
  const [latitude, setLatitude] = useState(DEFAULT_LATITUDE);
  const [longitude, setLongitude] = useState(DEFAULT_LONGITUDE);
  const [hasLocation, setHasLocation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLocation() {
      setLoading(true);
      setError("");
      setMessage("");
      setDirty(false);

      try {
        const result = await getPropertyLocation(propertyId);

        if (cancelled) return;

        if (!result.success) {
          setError(result.error);
          return;
        }

        const savedLat = result.location.latitude;
        const savedLng = result.location.longitude;

        if (savedLat !== null && savedLng !== null) {
          setLatitude(savedLat);
          setLongitude(savedLng);
          setHasLocation(true);
        } else {
          setLatitude(DEFAULT_LATITUDE);
          setLongitude(DEFAULT_LONGITUDE);
          setHasLocation(false);
        }
      } catch (err) {
        console.error("[PropertyMap] Load error:", err);

        if (!cancelled) {
          setError("Unable to load the property location.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (propertyId) {
      void loadLocation();
    } else {
      setError("Property ID is required.");
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  const handleLocationChange = useCallback(
    (lat: number, lng: number) => {
      setLatitude(lat);
      setLongitude(lng);
      setDirty(true);
      setError("");
      setMessage("");
    },
    []
  );

  async function handleSave() {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const result = await savePropertyLocation(
        propertyId,
        latitude,
        longitude
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      setLatitude(result.location.latitude);
      setLongitude(result.location.longitude);
      setHasLocation(true);
      setDirty(false);
      setMessage("Property location saved successfully.");
    } catch (err) {
      console.error("[PropertyMap] Save error:", err);
      setError("An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="property-map-loading">
        Loading property location...
      </div>
    );
  }

  if (error && !hasLocation && !dirty) {
    return (
      <div className="property-map-error">
        {error}
        <button
          type="button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="property-location-section">
      <div className="property-location-heading">
        <div>
          <h3>Locate Property</h3>
          <p>
            Search for an address or click the map to
            select the property location.
          </p>
        </div>
      </div>

      <MapView
        latitude={latitude}
        longitude={longitude}
        onLocationChange={handleLocationChange}
      />

      <div className="property-coordinate-grid">
        <label>
          Latitude
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(event) => {
              const value = event.target.valueAsNumber;

              if (Number.isFinite(value)) {
                setLatitude(value);
                setDirty(true);
                setError("");
                setMessage("");
              }
            }}
          />
        </label>

        <label>
          Longitude
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(event) => {
              const value = event.target.valueAsNumber;

              if (Number.isFinite(value)) {
                setLongitude(value);
                setDirty(true);
                setError("");
                setMessage("");
              }
            }}
          />
        </label>
      </div>

      {error && (
        <p className="property-map-error">{error}</p>
      )}

      {message && (
        <p className="property-map-success">{message}</p>
      )}

      <div className="property-location-footer">
        <span>
          {hasLocation
            ? "A location has been saved."
            : "No location has been saved yet."}
          {dirty ? " Unsaved changes." : ""}
        </span>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !dirty}
        >
          {saving ? "Saving..." : "Save Location"}
        </button>
      </div>
    </section>
  );
}
