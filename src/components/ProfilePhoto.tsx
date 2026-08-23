"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { personal } from "@/data/personal";
import { ticker } from "@/lib/ticker";
import { usePrefersReducedMotion } from "@/lib/hooks";

const HERO_FILTER = { grayscale: 1, sepia: 0, contrast: 1.25 };
const ABOUT_FILTER = { grayscale: 0, sepia: 1, contrast: 1.1 };

// Genuine 3D card-flip: rotates on the Y axis and turns fully edge-on (90deg) at the midpoint,
// then unflips back to facing the viewer — like a flashcard, not a flat spinning coin. Never
// passes 90deg, so the "back" (which would render mirrored) is never actually shown.
const FLIP_PEAK_DEG = 90;
const FLIP_PERSPECTIVE_PX = 1000;

// Transition spans the actual document distance between the two anchors: starts when the hero
// photo's original position reaches the top of the viewport, completes when About's does. Using
// the real gap (not a fixed viewport-height guess) keeps this correct regardless of section height.

type Rect = { top: number; left: number; width: number; height: number };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function docRect(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return {
    top: r.top + window.scrollY,
    left: r.left + window.scrollX,
    width: r.width,
    height: r.height,
  };
}

export function ProfilePhoto() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const heroAnchor = document.getElementById("hero-photo-anchor");
    const aboutAnchor = document.getElementById("about-photo-anchor");
    if (!wrap || !heroAnchor || !aboutAnchor) return;

    let heroRect: Rect = { top: 0, left: 0, width: 0, height: 0 };
    let aboutRect: Rect = { top: 0, left: 0, width: 0, height: 0 };
    let heroDocTop = 0;
    let aboutDocTop = 0;

    function measure() {
      const parentEl = (wrap!.offsetParent as HTMLElement) ?? document.body;
      const parentDoc = docRect(parentEl);
      const hero = docRect(heroAnchor!);
      const about = docRect(aboutAnchor!);

      heroRect = {
        top: hero.top - parentDoc.top,
        left: hero.left - parentDoc.left,
        width: hero.width,
        height: hero.height,
      };
      aboutRect = {
        top: about.top - parentDoc.top,
        left: about.left - parentDoc.left,
        width: about.width,
        height: about.height,
      };
      heroDocTop = hero.top;
      aboutDocTop = about.top;
    }

    function applyStyle(rect: Rect, filter: typeof HERO_FILTER, rotateDeg: number) {
      wrap!.style.top = `${rect.top}px`;
      wrap!.style.left = `${rect.left}px`;
      wrap!.style.width = `${rect.width}px`;
      wrap!.style.height = `${rect.height}px`;
      wrap!.style.filter = `grayscale(${filter.grayscale}) sepia(${filter.sepia}) contrast(${filter.contrast})`;
      wrap!.style.transform = `perspective(${FLIP_PERSPECTIVE_PX}px) rotateY(${rotateDeg}deg)`;
    }

    measure();

    if (reducedMotion) {
      applyStyle(aboutRect, ABOUT_FILTER, 0);
      const onResize = () => {
        measure();
        applyStyle(aboutRect, ABOUT_FILTER, 0);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    function tick() {
      const range = Math.max(1, aboutDocTop - heroDocTop);
      const progress = Math.min(1, Math.max(0, (window.scrollY - heroDocTop) / range));

      const rect: Rect = {
        top: lerp(heroRect.top, aboutRect.top, progress),
        left: lerp(heroRect.left, aboutRect.left, progress),
        width: lerp(heroRect.width, aboutRect.width, progress),
        height: lerp(heroRect.height, aboutRect.height, progress),
      };
      const filter = {
        grayscale: lerp(HERO_FILTER.grayscale, ABOUT_FILTER.grayscale, progress),
        sepia: lerp(HERO_FILTER.sepia, ABOUT_FILTER.sepia, progress),
        contrast: lerp(HERO_FILTER.contrast, ABOUT_FILTER.contrast, progress),
      };
      const rotateDeg = FLIP_PEAK_DEG * Math.sin(progress * Math.PI);
      applyStyle(rect, filter, rotateDeg);
    }

    // A couple of delayed re-measures catch layout shift from web-font swap / late reflow.
    const remeasureTimers = [200, 800].map((ms) => window.setTimeout(measure, ms));
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(document.body);

    const unsubscribe = ticker.add(tick);

    return () => {
      unsubscribe();
      resizeObserver.disconnect();
      remeasureTimers.forEach(window.clearTimeout);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute z-20 overflow-hidden rounded-card"
      style={{ top: 0, left: 0, width: 0, height: 0 }}
    >
      <Image
        src="/images/profile.jpg"
        alt={personal.name}
        fill
        sizes="400px"
        priority
        className="object-cover object-top"
      />
    </div>
  );
}
