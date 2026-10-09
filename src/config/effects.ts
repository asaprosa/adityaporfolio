/**
 * Feature flags for the effects-experiment branch.
 * true turns an effect on; false restores the original behaviour at its call site.
 * These are all on in the branch so the preview shows them. main never enables them.
 */
export type EffectName = "smoothScroll" | "curtain" | "ticker" | "horizontalSkills" | "cinema" | "cursorTrail" | "projectIndex" | "morphDropdown" | "experienceCountUp";

export const effects: Record<EffectName, boolean> = {
  smoothScroll: true,
  curtain: true,
  ticker: true,
  horizontalSkills: true,
  cinema: true,
  cursorTrail: true,
  projectIndex: true,
  morphDropdown: true,
  // Off by default: the Experience stat row is static. Turn on for a single count-up on first view.
  experienceCountUp: false,
};
