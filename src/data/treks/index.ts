import { Trek } from "../types";
import { himachalTreks } from "./himachal-pradesh";
import { uttarakhandTreks } from "./uttarakhand";

export const jammuKashmirTreks: Trek[] = [];
export const ladakhTreks: Trek[] = [];

export { himachalTreks, uttarakhandTreks };

export const treks: Trek[] = [
  ...himachalTreks,
  ...uttarakhandTreks,
];

