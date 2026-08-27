"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, animate, motion, motionValue, type PanInfo } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const SPRING = { type: "spring" as const, visualDuration: 0.4, bounce: 0.2 };
const AUTOPLAY_SECONDS = 4.5;
const DRAG_OFFSET_THRESHOLD = 60; // px
const DRAG_VELOCITY_THRESHOLD = 400; // px/s
const TAP_MOVEMENT_THRESHOLD = 5; // px — beyond this, a pointer-up is a drag, not a tap

type GalleryImage = { src: string; alt: string };

export function ProjectGallery({
  heroImage,
  galleryImages,
}: {
  heroImage?: GalleryImage;
  galleryImages: GalleryImage[];
}) {
  const images = useMemo(
    () => (heroImage ? [heroImage, ...galleryImages] : galleryImages),
    [heroImage, galleryImages]
  );
  const reducedMotion = usePrefersReducedMotion();
  const canAutoplay = !reducedMotion && images.length > 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [manualOverride, setManualOverride] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false); // hover or focus — temporary pause
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);

  const progressValues = useMemo(() => images.map(() => motionValue(0)), [images]);
  const trackX = useMemo(() => motionValue(0), []);
  const activeControlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const manualOverrideRef = useRef(false); // synchronous mirror of manualOverride, checked in onComplete to close a click-vs-timer race
  const dragOffsetRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setViewportWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const applyStaticProgress = useCallback(
    (index: number) => {
      progressValues.forEach((pv, i) => pv.set(i < index ? 1 : 0));
    },
    [progressValues]
  );

  const pauseAutoplay = useCallback(() => {
    manualOverrideRef.current = true;
    activeControlsRef.current?.stop();
    activeControlsRef.current = null;
    setManualOverride(true);
  }, []);

  const goTo = useCallback(
    (index: number, opts: { manual?: boolean } = {}) => {
      const clamped = (index + images.length) % images.length;
      if (opts.manual) {
        pauseAutoplay();
        applyStaticProgress(clamped);
      }
      setCurrentIndex(clamped);
    },
    [images.length, pauseAutoplay, applyStaticProgress]
  );

  // Settle the track to the current slide whenever the index changes.
  useEffect(() => {
    animate(trackX, -currentIndex * viewportWidth, SPRING);
  }, [currentIndex, viewportWidth, trackX]);

  // Autoplay: fills the current segment; onComplete advances to the next slide.
  useEffect(() => {
    if (!canAutoplay || manualOverride || lightboxOpen || isInteracting) return;
    const pv = progressValues[currentIndex];
    const remaining = 1 - pv.get();
    if (remaining <= 0) return;
    const controls = animate(pv, 1, {
      duration: AUTOPLAY_SECONDS * remaining,
      ease: "linear",
      onComplete: () => {
        if (manualOverrideRef.current) return;
        setCurrentIndex((i) => {
          const next = (i + 1) % images.length;
          if (next === 0) progressValues.forEach((v) => v.set(0));
          return next;
        });
      },
    });
    activeControlsRef.current = controls;
    return () => {
      controls.stop();
      if (activeControlsRef.current === controls) activeControlsRef.current = null;
    };
  }, [canAutoplay, manualOverride, lightboxOpen, isInteracting, currentIndex, images.length, progressValues]);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goTo(currentIndex - 1, { manual: true });
      if (e.key === "ArrowRight") goTo(currentIndex + 1, { manual: true });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, currentIndex]);

  if (images.length === 0) return null;

  const active = images[currentIndex];

  function openLightbox() {
    pauseAutoplay();
    applyStaticProgress(currentIndex);
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  function handleDragStart() {
    dragOffsetRef.current = 0;
    pauseAutoplay();
  }

  function handleDrag(_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    dragOffsetRef.current = Math.abs(info.offset.x);
  }

  function handleDragEnd(_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    const { offset, velocity } = info;
    let target = currentIndex;
    if (offset.x < -DRAG_OFFSET_THRESHOLD || velocity.x < -DRAG_VELOCITY_THRESHOLD) {
      target = currentIndex + 1;
    } else if (offset.x > DRAG_OFFSET_THRESHOLD || velocity.x > DRAG_VELOCITY_THRESHOLD) {
      target = currentIndex - 1;
    }
    goTo(target, { manual: true });
  }

  function handleSlideClick(index: number) {
    const wasDrag = dragOffsetRef.current > TAP_MOVEMENT_THRESHOLD;
    dragOffsetRef.current = 0;
    if (wasDrag) return;
    if (index !== currentIndex) return;
    openLightbox();
  }

  return (
    <div
      className="relative mt-10"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocus={() => setIsInteracting(true)}
      onBlur={() => setIsInteracting(false)}
    >
      <div ref={viewportRef} className="relative aspect-[16/9] w-full overflow-hidden rounded-card">
        <motion.div
          className="flex h-full w-full cursor-grab active:cursor-grabbing"
          style={{ x: trackX }}
          drag={images.length > 1 ? "x" : false}
          dragConstraints={{ left: -(images.length - 1) * viewportWidth, right: 0 }}
          dragElastic={0.15}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        >
          {images.map((img, i) => (
            <motion.div
              key={img.src}
              onClick={() => handleSlideClick(i)}
              className="relative h-full w-full shrink-0"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 80rem, 100vw"
                priority={i === 0}
                draggable={false}
                className="object-cover object-top"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={false}
          animate={isInteracting ? "hover" : "rest"}
          className="pointer-events-none absolute inset-0"
        >
          <motion.div
            variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
          />
          <motion.p
            variants={{ rest: { opacity: 0, y: 8 }, hover: { opacity: 1, y: 0 } }}
            transition={SPRING}
            className="absolute inset-x-0 bottom-0 p-4 text-sm text-white/90"
          >
            {active.alt}
          </motion.p>
          <motion.div
            variants={{ rest: { opacity: 0, y: -8, scale: 0.8 }, hover: { opacity: 1, y: 0, scale: 1 } }}
            transition={SPRING}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink"
          >
            <ArrowUpRight size={16} />
          </motion.div>
        </motion.div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(currentIndex - 1, { manual: true })}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => goTo(currentIndex + 1, { manual: true })}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {canAutoplay && images.length > 1 && (
        <div className="mt-3 flex gap-1.5">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => goTo(i, { manual: true })}
              aria-label={`Go to image ${i + 1}`}
              className="h-1 flex-1 overflow-hidden rounded-full bg-ink/15"
            >
              <motion.div className="h-full origin-left bg-ink" style={{ scaleX: progressValues[i] }} />
            </button>
          ))}
        </div>
      )}

      {reducedMotion && images.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => goTo(i, { manual: true })}
              aria-label={`Go to image ${i + 1}`}
              className={`h-1.5 w-1.5 rounded-full ${i === currentIndex ? "bg-ink" : "bg-ink/20"}`}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/90 p-4 sm:p-10"
          >
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-sm font-medium text-white/70">
              {currentIndex + 1} / {images.length}
            </div>

            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X size={18} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(currentIndex - 1, { manual: true });
                  }}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(currentIndex + 1, { manual: true });
                  }}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={SPRING}
                onClick={(e) => e.stopPropagation()}
                className="relative aspect-[16/9] w-full max-w-4xl"
              >
                <Image src={active.src} alt={active.alt} fill sizes="90vw" className="rounded-card object-contain" />
              </motion.div>
            </AnimatePresence>

            <motion.p
              key={`caption-${currentIndex}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              onClick={(e) => e.stopPropagation()}
              className="mt-4 max-w-2xl text-center text-sm text-white/70"
            >
              {active.alt}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
