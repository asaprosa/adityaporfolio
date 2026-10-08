/**
 * Feature flags for the effects-experiment branch.
 * true turns an effect on; false restores the original behaviour at its call site.
 * These are all on in the branch so the preview shows them. main never enables them.
 */
export type EffectName = "smoothScroll" | "curtain" | "ticker";

export const effects: Record<EffectName, boolean> = {
  smoothScroll: true,
  curtain: true,
  ticker: true,
};
