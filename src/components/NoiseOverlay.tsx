// Monochrome grain, fixed over the whole viewport above all page chrome. Same noise family as
// the local .grain-surface/.grain-text treatments in globals.css, just promoted to a page-wide
// layer with its own explicit stacking (this replaces the old body::before global grain rule).
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

export function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-multiply"
      style={{ backgroundImage: NOISE_URL }}
    />
  );
}
