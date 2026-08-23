"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ticker } from "@/lib/ticker";
import { usePrefersReducedMotion } from "@/lib/hooks";

export type HorizontalMarqueeProps<T> = {
  items: T[];
  renderItem: (item: T, copyIndex: number) => ReactNode;
  getKey: (item: T, copyIndex: number) => string;
  /** Number of scrolling rows. @default 2 */
  rows?: 1 | 2;
  /** Scroll duration in seconds per full loop, for the first row. @default 20 */
  speed?: number;
  /** Horizontal gap between cards in px. Also used as the vertical gap between rows. @default 16 */
  gap?: number;
  /** Width of the fade zone at the left and right edges in px. @default 120 */
  blurSize?: number;
  /** Smoothly decelerate to a stop while the cursor is anywhere over the component. @default true */
  pauseOnHover?: boolean;
  className?: string;
};

// Rows scroll in opposite directions at slightly different speeds.
const SPEED_RATIO_PER_ROW = [1, 1.35];
const DIRECTION_PER_ROW = [1, -1];
const VELOCITY_EASE = 0.06;

type HoverState = { target: number };

function Row<T>({
  items,
  renderItem,
  getKey,
  gap,
  speedSeconds,
  direction,
  hoverState,
}: {
  items: T[];
  renderItem: (item: T, copyIndex: number) => ReactNode;
  getKey: (item: T, copyIndex: number) => string;
  gap: number;
  speedSeconds: number;
  direction: 1 | -1;
  hoverState: HoverState;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const loopMarkerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const track = trackRef.current;
    const loopMarker = loopMarkerRef.current;
    if (!track || !loopMarker) return;

    let offset = 0;
    let velocityFactor = 1;
    let loopDistance = loopMarker.offsetLeft;

    const resizeObserver = new ResizeObserver(() => {
      loopDistance = loopMarker.offsetLeft;
    });
    resizeObserver.observe(track);

    const unsubscribe = ticker.add(({ deltaTime }) => {
      velocityFactor += (hoverState.target - velocityFactor) * VELOCITY_EASE;

      if (loopDistance > 0) {
        const pxPerMs = loopDistance / (speedSeconds * 1000);
        offset += direction * pxPerMs * deltaTime * velocityFactor;
        offset = ((offset % loopDistance) + loopDistance) % loopDistance;
      }

      track!.style.transform = `translateX(${-offset}px)`;
    });

    return () => {
      unsubscribe();
      resizeObserver.disconnect();
    };
  }, [direction, hoverState, speedSeconds, reducedMotion]);

  return (
    <div className="relative overflow-hidden">
      <div ref={trackRef} className="flex w-max flex-row" style={{ gap }}>
        {items.map((item) => (
          <div key={getKey(item, 0)} className="shrink-0">
            {renderItem(item, 0)}
          </div>
        ))}
        {items.map((item, i) => (
          <div key={getKey(item, 1)} ref={i === 0 ? loopMarkerRef : undefined} className="shrink-0">
            {renderItem(item, 1)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HorizontalMarquee<T>({
  items,
  renderItem,
  getKey,
  rows = 2,
  speed = 20,
  gap = 16,
  blurSize = 120,
  pauseOnHover = true,
  className = "",
}: HorizontalMarqueeProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverStateRef = useRef<HoverState>({ target: 1 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !pauseOnHover) return;
    const onEnter = () => (hoverStateRef.current.target = 0);
    const onLeave = () => (hoverStateRef.current.target = 1);
    container.addEventListener("pointerenter", onEnter);
    container.addEventListener("pointerleave", onLeave);
    return () => {
      container.removeEventListener("pointerenter", onEnter);
      container.removeEventListener("pointerleave", onLeave);
    };
  }, [pauseOnHover]);

  if (!items.length) return null;

  const rowItems: T[][] =
    rows === 1
      ? [items]
      : items.reduce<T[][]>(
          (acc, item, i) => {
            acc[i % 2].push(item);
            return acc;
          },
          [[], []]
        );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex flex-col" style={{ gap }}>
        {rowItems.map((items, rowIndex) => (
          <Row
            key={rowIndex}
            items={items}
            renderItem={renderItem}
            getKey={getKey}
            gap={gap}
            speedSeconds={speed * SPEED_RATIO_PER_ROW[rowIndex % 2]}
            direction={DIRECTION_PER_ROW[rowIndex % 2] as 1 | -1}
            hoverState={hoverStateRef.current}
          />
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r from-paper to-transparent"
        style={{ width: blurSize }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 bg-gradient-to-l from-paper to-transparent"
        style={{ width: blurSize }}
      />
    </div>
  );
}
