"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Accessibility,
  ArrowUpDown,
  Armchair,
  Baby,
  BatteryCharging,
  Bath,
  BedDouble,
  Bell,
  Bike,
  BookOpen,
  Briefcase,
  Building2,
  Bus,
  Camera,
  Car,
  Check,
  CheckCircle2,
  ChefHat,
  Coffee,
  Dog,
  Droplets,
  Dumbbell,
  Fan,
  Flame,
  Flower2,
  Gamepad2,
  Heart,
  Home,
  KeyRound,
  Lamp,
  Leaf,
  Loader2,
  Lock,
  Mountain,
  Music,
  ParkingCircle,
  Phone,
  Plug,
  Recycle,
  Search,
  ShieldCheck,
  Shirt,
  Snowflake,
  Sofa,
  Sparkles,
  Sprout,
  Star,
  Sun,
  Thermometer,
  Trash2,
  Trees,
  Tv,
  Umbrella,
  Utensils,
  Waves,
  Wifi,
  Wind,
  Wine,
  WashingMachine,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  getPropertyAmenities,
  savePropertyAmenities,
  type Amenity,
} from "@/lib/amenity-actions";

type Props = {
  propertyId: string;
  readOnly?: boolean;
};

type Placement = "all" | "internal" | "external";

/* -------------------------------------------------------------------------- */
/* Icons                                                                       */
/* -------------------------------------------------------------------------- */

// Every icon here can be referenced from the `icon` column (case / dash / underscore insensitive).
const ICONS: Record<string, LucideIcon> = {
  accessibility: Accessibility,
  elevator: ArrowUpDown,
  armchair: Armchair,
  baby: Baby,
  charging: BatteryCharging,
  bath: Bath,
  bed: BedDouble,
  beddouble: BedDouble,
  bell: Bell,
  bike: Bike,
  book: BookOpen,
  briefcase: Briefcase,
  building: Building2,
  bus: Bus,
  camera: Camera,
  car: Car,
  chef: ChefHat,
  coffee: Coffee,
  dog: Dog,
  droplets: Droplets,
  dumbbell: Dumbbell,
  fan: Fan,
  flame: Flame,
  flower2: Flower2,
  gamepad: Gamepad2,
  heart: Heart,
  home: Home,
  key: KeyRound,
  lamp: Lamp,
  leaf: Leaf,
  lock: Lock,
  mountain: Mountain,
  music: Music,
  parking: ParkingCircle,
  parkingcircle: ParkingCircle,
  phone: Phone,
  plug: Plug,
  recycle: Recycle,
  shieldcheck: ShieldCheck,
  shirt: Shirt,
  snowflake: Snowflake,
  sofa: Sofa,
  sparkles: Sparkles,
  sprout: Sprout,
  star: Star,
  sun: Sun,
  thermometer: Thermometer,
  trash: Trash2,
  trees: Trees,
  tv: Tv,
  umbrella: Umbrella,
  utensils: Utensils,
  waves: Waves,
  washingmachine: WashingMachine,
  wifi: Wifi,
  wind: Wind,
  wine: Wine,
  zap: Zap,
};

// Used when the `icon` column is empty / unknown: guess from the amenity name.
const KEYWORDS: [RegExp, string][] = [
  [/wi-?fi|internet|broadband/i, "wifi"],
  [/pool|swim/i, "waves"],
  [/gym|fitness|workout/i, "dumbbell"],
  [/park|garage|carport/i, "parking"],
  [/security|cctv|guard|gated/i, "shieldcheck"],
  [/garden|lawn|yard/i, "flower2"],
  [/tree|park land|landscap/i, "trees"],
  [/bath|shower|jacuzzi|spa/i, "bath"],
  [/bed|master|bedroom/i, "bed"],
  [/solar|power|electric|generator/i, "zap"],
  [/air ?con|\bac\b|cooling|cool/i, "snowflake"],
  [/heat|fireplace|fire|bbq|barbecue|grill/i, "flame"],
  [/tv|cable|television|theat/i, "tv"],
  [/kitchen|dining/i, "utensils"],
  [/chef|cook/i, "chef"],
  [/laundry|washer|washing/i, "washingmachine"],
  [/wardrobe|closet/i, "shirt"],
  [/pet|dog/i, "dog"],
  [/child|kid|baby|play/i, "baby"],
  [/bike|bicycle|cycl/i, "bike"],
  [/car wash|driveway/i, "car"],
  [/lift|elevator/i, "elevator"],
  [/balcony|terrace|patio|sun/i, "sun"],
  [/view|mountain|hill/i, "mountain"],
  [/lock|gate|safe/i, "lock"],
  [/key|smart lock/i, "key"],
  [/coffee|cafe|bar\b/i, "coffee"],
  [/game|billiard|pool table/i, "gamepad"],
  [/music|sound|audio/i, "music"],
  [/office|study|work/i, "briefcase"],
  [/lobby|building|apartment/i, "building"],
  [/bus|transport|shuttle/i, "bus"],
  [/cctv|camera|surveillance/i, "camera"],
  [/alarm|intercom|bell/i, "bell"],
  [/phone|telephone/i, "phone"],
  [/ev|charg/i, "charging"],
  [/furnish|sofa|lounge/i, "sofa"],
  [/lamp|lighting|light/i, "lamp"],
  [/water|tank|borehole|well/i, "droplets"],
  [/fan|ventilat/i, "fan"],
  [/wine|cellar/i, "wine"],
  [/umbrella|shade|cover/i, "umbrella"],
  [/waste|garbage|trash|bin/i, "trash"],
  [/recycl|eco|green/i, "recycle"],
  [/library|book|reading/i, "book"],
  [/access|wheelchair|disab/i, "accessibility"],
  [/wind|breeze/i, "wind"],
  [/temperature|thermo/i, "thermometer"],
  [/roof|house|home/i, "home"],
];

// Pool used to guarantee every amenity ends up with its own icon.
const FALLBACK_POOL: string[] = [
  "sparkles",
  "star",
  "heart",
  "leaf",
  "sprout",
  "armchair",
  "lamp",
  "umbrella",
  "bell",
  "music",
  "gamepad",
  "book",
  "coffee",
  "wine",
  "briefcase",
  "camera",
  "key",
  "lock",
  "wind",
  "fan",
  "droplets",
  "recycle",
  "home",
  "building",
  "sun",
  "mountain",
  "thermometer",
  "plug",
  "charging",
  "phone",
];

function normalize(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[-_\s]/g, "");
}

/* -------------------------------------------------------------------------- */
/* Colors (full class names so Tailwind can see them)                          */
/* -------------------------------------------------------------------------- */

type Palette = {
  icon: string; // icon bubble
  active: string; // selected tile
  chip: string; // selected chip
  check: string; // check badge
};

const PALETTES: Palette[] = [
  {
    icon: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300",
    active: "border-rose-400 bg-rose-50 dark:border-rose-500/60 dark:bg-rose-500/10",
    chip: "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200",
    check: "bg-rose-500 text-white",
  },
  {
    icon: "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300",
    active: "border-orange-400 bg-orange-50 dark:border-orange-500/60 dark:bg-orange-500/10",
    chip: "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-200",
    check: "bg-orange-500 text-white",
  },
  {
    icon: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
    active: "border-amber-400 bg-amber-50 dark:border-amber-500/60 dark:bg-amber-500/10",
    chip: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200",
    check: "bg-amber-500 text-white",
  },
  {
    icon: "bg-lime-100 text-lime-600 dark:bg-lime-500/20 dark:text-lime-300",
    active: "border-lime-400 bg-lime-50 dark:border-lime-500/60 dark:bg-lime-500/10",
    chip: "border-lime-300 bg-lime-50 text-lime-700 dark:border-lime-500/40 dark:bg-lime-500/10 dark:text-lime-200",
    check: "bg-lime-500 text-white",
  },
  {
    icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
    active: "border-emerald-400 bg-emerald-50 dark:border-emerald-500/60 dark:bg-emerald-500/10",
    chip: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200",
    check: "bg-emerald-500 text-white",
  },
  {
    icon: "bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300",
    active: "border-teal-400 bg-teal-50 dark:border-teal-500/60 dark:bg-teal-500/10",
    chip: "border-teal-300 bg-teal-50 text-teal-700 dark:border-teal-500/40 dark:bg-teal-500/10 dark:text-teal-200",
    check: "bg-teal-500 text-white",
  },
  {
    icon: "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300",
    active: "border-sky-400 bg-sky-50 dark:border-sky-500/60 dark:bg-sky-500/10",
    chip: "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-200",
    check: "bg-sky-500 text-white",
  },
  {
    icon: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300",
    active: "border-blue-400 bg-blue-50 dark:border-blue-500/60 dark:bg-blue-500/10",
    chip: "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200",
    check: "bg-blue-500 text-white",
  },
  {
    icon: "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300",
    active: "border-violet-400 bg-violet-50 dark:border-violet-500/60 dark:bg-violet-500/10",
    chip: "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-200",
    check: "bg-violet-500 text-white",
  },
  {
    icon: "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-300",
    active: "border-fuchsia-400 bg-fuchsia-50 dark:border-fuchsia-500/60 dark:bg-fuchsia-500/10",
    chip: "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-500/40 dark:bg-fuchsia-500/10 dark:text-fuchsia-200",
    check: "bg-fuchsia-500 text-white",
  },
];

/* -------------------------------------------------------------------------- */
/* Visual assignment: unique icon + stable color for every amenity             */
/* -------------------------------------------------------------------------- */

type Visual = { Icon: LucideIcon; palette: Palette };

function buildVisuals(amenities: Amenity[]): Map<string, Visual> {
  const result = new Map<string, Visual>();
  const used = new Set<string>();
  const sorted = [...amenities].sort((a, b) => a.name.localeCompare(b.name));

  const take = (key: string | undefined) => {
    if (!key || !ICONS[key] || used.has(ICONS[key].displayName ?? key)) {
      return null;
    }
    return key;
  };

  // Track by component identity (aliases like bed/beddouble share an icon).
  const usedComponents = new Set<LucideIcon>();
  const claim = (key: string | undefined): LucideIcon | null => {
    if (!key) return null;
    const Icon = ICONS[key];
    if (!Icon || usedComponents.has(Icon)) return null;
    usedComponents.add(Icon);
    return Icon;
  };
  void take;
  void used;

  // Pass 1: explicit `icon` column wins.
  const pending: Amenity[] = [];
  const assigned = new Map<string, LucideIcon>();

  for (const amenity of sorted) {
    const Icon = claim(amenity.icon ? normalize(amenity.icon) : undefined);
    if (Icon) assigned.set(amenity.id, Icon);
    else pending.push(amenity);
  }

  // Pass 2: guess from the name.
  const stillPending: Amenity[] = [];
  for (const amenity of pending) {
    const match = KEYWORDS.find(([re]) => re.test(amenity.name));
    const Icon = claim(match?.[1]);
    if (Icon) assigned.set(amenity.id, Icon);
    else stillPending.push(amenity);
  }

  // Pass 3: hand out unused icons from the pool so nothing repeats.
  for (const amenity of stillPending) {
    let Icon: LucideIcon | null = null;
    for (const key of FALLBACK_POOL) {
      Icon = claim(key);
      if (Icon) break;
    }
    if (!Icon) {
      for (const key of Object.keys(ICONS)) {
        Icon = claim(key);
        if (Icon) break;
      }
    }
    assigned.set(amenity.id, Icon ?? Sparkles);
  }

  sorted.forEach((amenity, index) => {
    result.set(amenity.id, {
      Icon: assigned.get(amenity.id) ?? Sparkles,
      palette: PALETTES[index % PALETTES.length],
    });
  });

  return result;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

const TABS: { value: Placement; label: string }[] = [
  { value: "all", label: "All" },
  { value: "internal", label: "Inside" },
  { value: "external", label: "Outside" },
];

export default function PropertyAmenities({
  propertyId,
  readOnly = false,
}: Props) {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [placement, setPlacement] = useState<Placement>("all");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await getPropertyAmenities(propertyId);

      if (!result.success) {
        setError(result.message);
        return;
      }

      const catalogue = result.amenities ?? [];
      const ids = result.selectedIds ?? [];

      setAmenities(catalogue);
      setSavedIds(ids);
      setSelectedIds(ids);
    } catch (err) {
      console.error("[PropertyAmenities UI] Load failed", err);
      setError("Unable to load property amenities.");
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    void load();
  }, [load]);

  const visuals = useMemo(() => buildVisuals(amenities), [amenities]);

  const counts = useMemo(
    () => ({
      all: amenities.length,
      internal: amenities.filter((a) => a.placement === "internal").length,
      external: amenities.filter((a) => a.placement === "external").length,
    }),
    [amenities]
  );

  const filteredAmenities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return amenities.filter((amenity) => {
      const matchesQuery = amenity.name.toLowerCase().includes(query);
      const matchesPlacement =
        placement === "all" || amenity.placement === placement;
      return matchesQuery && matchesPlacement;
    });
  }, [amenities, search, placement]);

  const selectedAmenities = useMemo(
    () => amenities.filter((a) => selectedIds.includes(a.id)),
    [amenities, selectedIds]
  );

  const hasChanges =
    selectedIds.length !== savedIds.length ||
    selectedIds.some((id) => !savedIds.includes(id));

  function toggleAmenity(id: string) {
    if (readOnly || saving) return;

    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );

    setError("");
    setSuccess("");
  }

  async function handleSave() {
    if (!hasChanges || saving || readOnly) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await savePropertyAmenities(propertyId, selectedIds);

      if (!result.success) {
        setError(result.message);
        await load();
        return;
      }

      const ids = result.selectedIds ?? selectedIds;

      setSavedIds(ids);
      setSelectedIds(ids);
      setSuccess(result.message);
    } catch (err) {
      console.error("[PropertyAmenities UI] Save failed", err);
      setError("Unable to save property amenities.");
    } finally {
      setSaving(false);
    }
  }

  function discardChanges() {
    setSelectedIds(savedIds);
    setError("");
    setSuccess("");
  }

  function selectAllVisible() {
    if (readOnly || saving) return;
    setSelectedIds((current) => [
      ...new Set([...current, ...filteredAmenities.map((a) => a.id)]),
    ]);
  }

  function clearAll() {
    if (readOnly || saving) return;
    setSelectedIds([]);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border p-10 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading amenities...
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-background">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5">
        <div>
          <h2 className="text-lg font-semibold">Property amenities</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Tap to choose what this property offers.
          </p>
        </div>

        <span className="flex items-center gap-2 rounded-full bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground shadow-sm">
          <CheckCircle2 className="h-4 w-4" />
          {selectedIds.length} selected
        </span>
      </div>

      <div className="space-y-5 p-5">
        {/* Search + tabs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search amenities..."
              aria-label="Search amenities"
              className="h-11 w-full rounded-xl border bg-muted/30 pl-10 pr-9 text-sm outline-none transition focus:bg-background focus:ring-2 focus:ring-primary/30"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div
            role="tablist"
            aria-label="Filter placement"
            className="inline-flex rounded-xl bg-muted p-1"
          >
            {TABS.map((tab) => {
              const active = placement === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setPlacement(tab.value)}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`rounded-full px-1.5 text-[11px] ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "bg-background/60"
                    }`}
                  >
                    {counts[tab.value]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {error && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => void load()}
              className="font-medium underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}

        {success && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-400"
          >
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </p>
        )}

        {/* Selected chips */}
        {selectedAmenities.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Your selection</h3>
              {!readOnly && (
                <button
                  type="button"
                  onClick={clearAll}
                  disabled={saving}
                  className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedAmenities.map((item) => {
                const v = visuals.get(item.id);
                if (!v) return null;
                const { Icon, palette } = v;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={readOnly || saving}
                    onClick={() => toggleAmenity(item.id)}
                    className={`group inline-flex items-center gap-2 rounded-full border py-1.5 pl-2 pr-3 text-sm font-medium transition hover:shadow-sm disabled:cursor-default ${palette.chip}`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${palette.icon}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {item.name}
                    {!readOnly && (
                      <X className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Catalogue */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              {filteredAmenities.length}{" "}
              {filteredAmenities.length === 1 ? "amenity" : "amenities"}
            </h3>
            {!readOnly && filteredAmenities.length > 0 && (
              <button
                type="button"
                onClick={selectAllVisible}
                disabled={saving}
                className="text-xs font-medium text-primary underline-offset-2 hover:underline"
              >
                Select all shown
              </button>
            )}
          </div>

          {filteredAmenities.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              <Search className="h-6 w-6 opacity-50" />
              No matching amenities found.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filteredAmenities.map((item) => {
                const v = visuals.get(item.id);
                if (!v) return null;
                const { Icon, palette } = v;
                const selected = selectedIds.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    disabled={readOnly || saving}
                    onClick={() => toggleAmenity(item.id)}
                    className={`relative flex flex-col items-center gap-2.5 rounded-2xl border-2 p-4 text-center transition-all disabled:cursor-default ${
                      selected
                        ? `${palette.active} shadow-sm`
                        : "border-transparent bg-muted/40 hover:-translate-y-0.5 hover:bg-muted/70 hover:shadow-sm"
                    }`}
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform ${palette.icon} ${
                        selected ? "scale-105" : ""
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </span>

                    <span className="line-clamp-2 text-sm font-medium leading-tight">
                      {item.name}
                    </span>

                    <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {item.placement === "internal" ? "Inside" : "Outside"}
                    </span>

                    {selected && (
                      <span
                        className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full ${palette.check}`}
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {!readOnly && (
        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t bg-background/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <p
            className={`flex items-center gap-2 text-xs ${
              hasChanges
                ? "font-medium text-amber-600 dark:text-amber-400"
                : "text-muted-foreground"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                hasChanges ? "bg-amber-500" : "bg-green-500"
              }`}
            />
            {hasChanges ? "You have unsaved changes" : "All changes saved"}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={!hasChanges || saving}
              onClick={discardChanges}
              className="h-10 rounded-xl border px-4 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
            >
              Discard
            </button>

            <button
              type="button"
              disabled={!hasChanges || saving}
              onClick={() => void handleSave()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}