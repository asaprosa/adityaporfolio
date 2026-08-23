/**
 * Shared animation-frame ticker.
 *
 * Adapted from Darkroom Engineering's Tempus (https://github.com/darkroomengineering/tempus,
 * MIT): rather than every animated component running its own requestAnimationFrame loop, they
 * all subscribe here and share a single rAF call per frame. Also supports a per-subscriber `fps`
 * cap, mirroring Tempus's `{ fps }` option, so throttled loops don't need to hand-roll their own
 * frame-interval bookkeeping.
 */

type TickState = { time: number; deltaTime: number };
type TickCallback = (state: TickState) => void;

type Subscriber = {
  callback: TickCallback;
  fps?: number;
  lastTick: number;
};

const subscribers = new Set<Subscriber>();
let rafId = 0;
let lastTime = 0;

function loop(time: number) {
  rafId = requestAnimationFrame(loop);
  const deltaTime = lastTime ? time - lastTime : 0;
  lastTime = time;

  for (const sub of subscribers) {
    if (sub.fps) {
      const interval = 1000 / sub.fps;
      if (time - sub.lastTick < interval) continue;
      sub.lastTick = time;
    }
    sub.callback({ time, deltaTime });
  }
}

/** Subscribe to the shared frame loop. Returns an unsubscribe function. */
export function add(callback: TickCallback, options: { fps?: number } = {}): () => void {
  const sub: Subscriber = { callback, fps: options.fps, lastTick: 0 };
  subscribers.add(sub);
  if (subscribers.size === 1) {
    lastTime = 0;
    rafId = requestAnimationFrame(loop);
  }
  return () => {
    subscribers.delete(sub);
    if (subscribers.size === 0) {
      cancelAnimationFrame(rafId);
    }
  };
}

export const ticker = { add };
