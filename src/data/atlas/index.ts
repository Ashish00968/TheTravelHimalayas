import { jammuKashmirRegion } from "./jammu-kashmir";
import { himachalPradeshRegion } from "./himachal-pradesh";
import { uttarakhandRegion } from "./uttarakhand";
import { ladakhRegion } from "./ladakh";
import {
  HimalayaRegion,
  HimalayaSubRegion,
  HimalayaPlace,
  PlaceLocation,
} from "./types";

export * from "./types";
export {
  jammuKashmirRegion,
  himachalPradeshRegion,
  uttarakhandRegion,
  ladakhRegion,
};

export const himalayaAtlas: HimalayaRegion[] = [
  jammuKashmirRegion,
  himachalPradeshRegion,
  uttarakhandRegion,
  ladakhRegion,
];

// ── O(1) index structures (built once at module load) ──────────────────────

/** region.id → HimalayaRegion */
export const regionIndex = new Map<string, HimalayaRegion>(
  himalayaAtlas.map((r) => [r.id, r])
);

/** `${regionId}/${subRegionId}` → HimalayaSubRegion */
export const subRegionIndex = new Map<string, HimalayaSubRegion>(
  himalayaAtlas.flatMap((r) => r.subregions.map((s) => [`${r.id}/${s.id}`, s]))
);

/** `${regionId}/${subRegionId}/${placeId}` → HimalayaPlace */
export const placeIndex = new Map<string, HimalayaPlace>(
  himalayaAtlas.flatMap((r) =>
    r.subregions.flatMap((s) =>
      s.places.map((p) => [`${r.id}/${s.id}/${p.id}`, p])
    )
  )
);

export const placeLocationIndex = new Map<string, PlaceLocation>(
  himalayaAtlas.flatMap((r) =>
    r.subregions.flatMap((s) =>
      s.places.map((p) => [
        p.id,
        {
          name: p.name,
          regionId: r.id,
          regionName: r.name,
          subRegionId: s.id,
          subRegionName: s.name,
          href: `/explore/${r.id}/${s.id}/${p.id}`,
        },
      ])
    )
  )
);

// ── Lookup helpers (O(1) via index) ─────────────────────────────────────────

export function getRegion(id: string): HimalayaRegion | undefined {
  return regionIndex.get(id);
}

export function getSubRegion(
  regionId: string,
  subRegionId: string
): HimalayaSubRegion | undefined {
  return subRegionIndex.get(`${regionId}/${subRegionId}`);
}

export function getPlace(
  regionId: string,
  subRegionId: string,
  placeId: string
): HimalayaPlace | undefined {
  return placeIndex.get(`${regionId}/${subRegionId}/${placeId}`);
}

/** Resolve a placeId → full location without nested scans. */
export function getPlaceLocation(placeId: string): PlaceLocation | undefined {
  return placeLocationIndex.get(placeId);
}
