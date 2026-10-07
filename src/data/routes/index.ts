import patalsuRoute from "./patalsu-peak.json";
import jogniRoute from "./jogni-falls.json";
import { RouteData } from "../types";

export const routesMap: Record<string, RouteData> = {
  "patalsu-peak": patalsuRoute as unknown as RouteData,
  "jogni-falls": jogniRoute as unknown as RouteData,
};

export function getRouteData(placeId: string): RouteData | null {
  return routesMap[placeId] ?? null;
}
