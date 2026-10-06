import patalsuRoute from "./patalsu-peak.json";
import { RouteData } from "../types";

export const routesMap: Record<string, RouteData> = {
  "patalsu-peak": patalsuRoute as unknown as RouteData,
};

export function getRouteData(placeId: string): RouteData | null {
  return routesMap[placeId] ?? null;
}
