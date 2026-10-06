import { Trek } from "../types";
import { himachalTreks } from "./himachal-pradesh";
import { uttarakhandTreks } from "./uttarakhand";
import { jammuKashmirTreks } from "./jammu-kashmir";
import { ladakhTreks } from "./ladakh";

export { himachalTreks, uttarakhandTreks, jammuKashmirTreks, ladakhTreks };

export const treks: Trek[] = [
  ...himachalTreks,
  ...uttarakhandTreks,
  ...jammuKashmirTreks,
  ...ladakhTreks,
];
