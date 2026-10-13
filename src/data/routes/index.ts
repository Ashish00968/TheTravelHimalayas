import patalsuRoute from "./patalsu-peak.json";
import jogniRoute from "./jogni-falls.json";
import beasKundRoute from "./beas-kund.json";
import hamptaPassRoute from "./hampta-pass.json";
import bhriguLakeRoute from "./bhrigu-lake.json";
import lamadughRoute from "./lamadugh.json";
import chandrakhaniRoute from "./chandrakhani-pass.json";
import jaloriRoute from "./jalori-pass-serolsar.json";
import kheergangaRoute from "./kheerganga.json";
import deoTibbaRoute from "./deo-tibba.json";
import { RouteData } from "../types";

export const routesMap: Record<string, RouteData> = {
  "patalsu-peak": patalsuRoute as unknown as RouteData,
  "jogni-falls": jogniRoute as unknown as RouteData,
  "beas-kund": beasKundRoute as unknown as RouteData,
  "hampta-pass": hamptaPassRoute as unknown as RouteData,
  "bhrigu-lake": bhriguLakeRoute as unknown as RouteData,
  "lamadugh": lamadughRoute as unknown as RouteData,
  "chandrakhani-pass": chandrakhaniRoute as unknown as RouteData,
  "jalori-pass-serolsar": jaloriRoute as unknown as RouteData,
  "kheerganga": kheergangaRoute as unknown as RouteData,
  "deo-tibba": deoTibbaRoute as unknown as RouteData,
};

export function getRouteData(placeId: string): RouteData | null {
  return routesMap[placeId] ?? null;
}
