"use client";

import { useEffect, useRef } from "react";
import { ticker } from "@/lib/ticker";
import { usePrefersReducedMotion } from "@/lib/hooks";

type AsciiFieldProps = {
  className?: string;
};

// Charset ordered dark -> bright: empty, binary digits, then katakana ramping up in visual density.
const CHARSET = " 01ｦｱｲｳｴｵｶｷｸｹｺ";
const LEVELS = 16;
const CELL_SIZE = 22;
const SPEED = 0.55;
const DENSITY = 0.4;
const CONTRAST = 1.6;
const CURSOR_RADIUS = 140;
const CURSOR_STRENGTH = 0.7;
const MAX_FPS = 30;
const MAX_DPR = 1.5;

// Ink-toned glow: faint at rest, brightens (still subtle) near the cursor.
const DIM = { r: 17, g: 17, b: 17, a: 0.05 };
const BRIGHT = { r: 17, g: 17, b: 17, a: 0.42 };

function hash(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Falling "digital rain" column: a bright head with a fading parabolic trail.
 * seedA/seedB are per-column constants, precomputed once per resize (not per frame)
 * since they don't depend on row or time.
 */
function rainValue(seedA: number, seedB: number, col: number, row: number, t: number, rows: number) {
  const speed = 6 + seedA * 14;
  const trailLen = 6 + rows * 0.08 * seedB;
  const cycle = rows + trailLen;
  const rawOffset = t * speed + seedB * cycle * 7;
  const distFromHead = (((rawOffset % cycle) + cycle) % cycle) - row;

  if (distFromHead < 0 || distFromHead > trailLen) return -1;

  const flicker = 0.85 + 0.15 * hash(col, row + Math.floor(t * 9));
  const falloff = distFromHead / trailLen;
  return (1 - falloff * falloff) * 2 * flicker - 1;
}

export function AsciiField({ className = "" }: AsciiFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    let cols = 0;
    let rows = 0;
    let width = 0;
    let height = 0;
    let atlas: HTMLCanvasElement | null = null;
    let colSeedA: Float32Array = new Float32Array(0);
    let colSeedB: Float32Array = new Float32Array(0);
    let skipMask: Uint8Array = new Uint8Array(0);
    const cursor = { x: -9999, y: -9999 };

    function mixColor(t: number) {
      const r = Math.round(DIM.r + (BRIGHT.r - DIM.r) * t);
      const g = Math.round(DIM.g + (BRIGHT.g - DIM.g) * t);
      const b = Math.round(DIM.b + (BRIGHT.b - DIM.b) * t);
      const a = DIM.a + (BRIGHT.a - DIM.a) * t;
      return `rgba(${r},${g},${b},${a.toFixed(3)})`;
    }

    function buildAtlas() {
      atlas = document.createElement("canvas");
      atlas.width = CHARSET.length * CELL_SIZE * dpr;
      atlas.height = LEVELS * CELL_SIZE * dpr;
      const actx = atlas.getContext("2d");
      if (!actx) return;
      actx.scale(dpr, dpr);
      actx.font = `500 ${CELL_SIZE * 0.9}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
      actx.textAlign = "center";
      actx.textBaseline = "middle";
      for (let level = 0; level < LEVELS; level++) {
        actx.fillStyle = mixColor(level / (LEVELS - 1));
        for (let c = 0; c < CHARSET.length; c++) {
          actx.fillText(CHARSET[c], c * CELL_SIZE + CELL_SIZE / 2, level * CELL_SIZE + CELL_SIZE / 2);
        }
      }
    }

    /** Precompute everything that's constant across frames so the draw loop only does per-frame work. */
    function buildStaticFields() {
      colSeedA = new Float32Array(cols);
      colSeedB = new Float32Array(cols);
      for (let col = 0; col < cols; col++) {
        colSeedA[col] = hash(col, 1);
        colSeedB[col] = hash(col, 2);
      }

      skipMask = new Uint8Array(cols * rows);
      if (DENSITY < 1) {
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            skipMask[row * cols + col] = hash(col * 3 + 7, row * 5 + 11) > DENSITY ? 1 : 0;
          }
        }
      }
    }

    function resize() {
      width = Math.max(1, container!.offsetWidth);
      height = Math.max(1, container!.offsetHeight);
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      cols = Math.ceil(width / CELL_SIZE);
      rows = Math.ceil(height / CELL_SIZE);
      buildAtlas();
      buildStaticFields();
    }

    function draw(timeMs: number) {
      if (!atlas) return;
      const t = (timeMs / 1000) * SPEED;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, width, height);

      const radiusSq = CURSOR_RADIUS * CURSOR_RADIUS;

      for (let row = 0; row < rows; row++) {
        const cy = row * CELL_SIZE + CELL_SIZE / 2;
        const rowOffset = row * cols;
        for (let col = 0; col < cols; col++) {
          if (skipMask[rowOffset + col]) continue;

          const cx = col * CELL_SIZE + CELL_SIZE / 2;
          let v = rainValue(colSeedA[col], colSeedB[col], col, row, t, rows) * 0.5 + 0.5;
          v **= CONTRAST;

          const dx = cx - cursor.x;
          const dy = cy - cursor.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < radiusSq * 9) {
            v += CURSOR_STRENGTH * Math.exp(-distSq / radiusSq);
          }
          v = Math.max(0, Math.min(1, v));

          const charIndex = Math.min(CHARSET.length - 1, Math.floor(v * CHARSET.length));
          if (CHARSET[charIndex] === " ") continue;
          const level = Math.min(LEVELS - 1, Math.floor(v * LEVELS));

          ctx!.drawImage(
            atlas,
            charIndex * CELL_SIZE * dpr,
            level * CELL_SIZE * dpr,
            CELL_SIZE * dpr,
            CELL_SIZE * dpr,
            cx - CELL_SIZE / 2,
            cy - CELL_SIZE / 2,
            CELL_SIZE,
            CELL_SIZE
          );
        }
      }
    }

    function onPointerMove(e: PointerEvent) {
      const rect = container!.getBoundingClientRect();
      cursor.x = e.clientX - rect.left;
      cursor.y = e.clientY - rect.top;
    }

    function onPointerLeave() {
      cursor.x = -9999;
      cursor.y = -9999;
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave);
    const unsubscribe = ticker.add(({ time }) => draw(time), { fps: MAX_FPS });

    return () => {
      unsubscribe();
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className={className} aria-hidden>
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
