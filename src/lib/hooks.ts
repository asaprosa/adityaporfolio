"use client";

import { useSyncExternalStore } from "react";

/**
 * Live-updating media query hook.
 *
 * Adapted from Darkroom Engineering's Hamo (https://github.com/darkroomengineering/hamo, MIT)
 * `useMediaQuery`. Unlike a one-shot `matchMedia(...).matches` check in a useEffect (which was
 * duplicated across four components in this project), this reacts if the user changes the OS
 * setting — e.g. toggling reduced-motion — while the tab is open.
 */
function subscribe(query: string, callback: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => subscribe(query, callback),
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
