import { Trek } from "../types";
import { himachalTreks } from "./himachal-pradesh";
import { uttarakhandTreks } from "./uttarakhand";

export { himachalTreks, uttarakhandTreks };

export const treks: Trek[] = [
  ...himachalTreks,
  ...uttarakhandTreks,
];
