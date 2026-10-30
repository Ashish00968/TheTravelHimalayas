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
import triundRoute from "./triund.json";
import kareriRoute from "./kareri-lake.json";
import indraharRoute from "./indrahar-pass.json";
import hemkundRoute from "./hemkund-sahib.json";
import valleyOfFlowersRoute from "./valley-of-flowers.json";
import kedarkanthaRoute from "./kedarkantha.json";
import markhaValleyRoute from "./markha-valley.json";
import tarsarMarsarRoute from "./tarsar-marsar.json";
import kashmirGreatLakesRoute from "./kashmir-great-lakes.json";
import roopkundRoute from "./roopkund-trek.json";
import gangotriGaumukhRoute from "./gangotri-gaumukh.json";
import dayaraBugyalRoute from "./dayara-bugyal.json";
import choptaTungnathRoute from "./chopta-tungnath.json";
import kuariPassRoute from "./kuari-pass.json";
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
  "triund": triundRoute as unknown as RouteData,
  "kareri-lake": kareriRoute as unknown as RouteData,
  "indrahar-pass": indraharRoute as unknown as RouteData,
  "hemkund-sahib": hemkundRoute as unknown as RouteData,
  "valley-of-flowers": valleyOfFlowersRoute as unknown as RouteData,
  "kedarkantha": kedarkanthaRoute as unknown as RouteData,
  "markha-valley": markhaValleyRoute as unknown as RouteData,
  "tarsar-marsar": tarsarMarsarRoute as unknown as RouteData,
  "kashmir-great-lakes": kashmirGreatLakesRoute as unknown as RouteData,
  "roopkund-trek": roopkundRoute as unknown as RouteData,
  "gangotri-gaumukh": gangotriGaumukhRoute as unknown as RouteData,
  "dayara-bugyal": dayaraBugyalRoute as unknown as RouteData,
  "chopta-tungnath": choptaTungnathRoute as unknown as RouteData,
  "kuari-pass": kuariPassRoute as unknown as RouteData,
};

export function getRouteData(placeId: string): RouteData | null {
  return routesMap[placeId] ?? null;
}
