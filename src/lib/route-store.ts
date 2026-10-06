import { useSyncExternalStore } from "react";

export interface ActiveRoutePoint {
  progress: number; // 0 to 1
  distanceKm: number;
  elevationM: number;
  lat: number;
  lng: number;
  label?: string;
}

type Listener = () => void;

let currentPoint: ActiveRoutePoint | null = null;
const listeners = new Set<Listener>();

export function setActiveRoutePoint(point: ActiveRoutePoint | null) {
  if (currentPoint === point) return;
  // If coordinates and elevation match closely, don't trigger unnecessary re-renders
  if (
    currentPoint &&
    point &&
    currentPoint.progress === point.progress &&
    currentPoint.elevationM === point.elevationM
  ) {
    return;
  }
  currentPoint = point;
  listeners.forEach((listener) => listener());
}

export function getActiveRoutePointSnapshot(): ActiveRoutePoint | null {
  return currentPoint;
}

export function getActiveRoutePointServerSnapshot(): ActiveRoutePoint | null {
  return null;
}

export function subscribeToRoutePoint(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useActiveRoutePoint() {
  return useSyncExternalStore(
    subscribeToRoutePoint,
    getActiveRoutePointSnapshot,
    getActiveRoutePointServerSnapshot
  );
}
