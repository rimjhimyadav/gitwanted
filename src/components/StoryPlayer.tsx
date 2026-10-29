import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { SlideId } from "../types";

export type StorySlide = { id: SlideId; duration: number; render: () => ReactNode };

type Props = {
  slides: StorySlide[];
  header: ReactNode;
  overlay?: (id: SlideId) => ReactNode;
  onClose: () => void;
};

const HOLD_MS = 220;

const isButton = (event: PointerEvent) => (event.target as HTMLElement).closest("button, a") !== null;

// Instagram-style story: progress bars, auto-advance, tap left/right, hold to pause
export default function StoryPlayer({ slides, header, overlay, onClose }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const holdTimer = useRef(0);
  const holding = useRef(false);

  const last = slides.length - 1;
  const slide = slides[index];
  const autoPlay = !reduceMotion && index < last;

  const next = () => setIndex((i) => Math.min(i + 1, last));
  const back = () => setIndex((i) => Math.max(i - 1, 0));
  const togglePause = () => setPaused((p) => !p);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") setIndex((i) => Math.min(i + 1, last));
      if (event.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
      if (event.key === "Escape") onClose();
      if (event.key === " ") {
        event.preventDefault();
        setPaused((p) => !p);
      }
    }
    // Don't keep playing in a background tab
    function onVisibilityChange() {
      if (document.hidden) setPaused(true);
    }

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [last, onClose]);

  function endHold() {
    window.clearTimeout(holdTimer.current);
    const wasHolding = holding.current;
    holding.current = false;
    if (wasHolding) setPaused(false);
    return wasHolding;
  }

  function handlePointerDown(event: PointerEvent) {
    if (isButton(event)) return;
    holdTimer.current = window.setTimeout(() => {
      holding.current = true;
      setPaused(true);
    }, HOLD_MS);
  }

  function handlePointerUp(event: PointerEvent<HTMLElement>) {
    if (isButton(event) || endHold()) return;
    const box = event.currentTarget.getBoundingClientRect();
    if (event.clientX - box.left < box.width / 3) back();
    else next();
  }

  const sideButton =
    "hidden h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-cream transition hover:bg-white/20 disabled:invisible sm:flex";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0b0613] sm:gap-6">
      <button onClick={back} disabled={index === 0} aria-label="Previous slide" className={sideButton}>
        <ChevronLeft size={24} />
      </button>

      <section
        aria-roledescription="story"
        aria-label={`Slide ${index + 1} of ${slides.length}`}
        className="relative h-full w-full touch-none overflow-hidden select-none sm:aspect-9/16 sm:h-[min(92dvh,880px)] sm:w-auto sm:rounded-3xl sm:shadow-[0_30px_80px_rgb(255_95_174/0.25)]"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={endHold}
        onPointerLeave={endHold}
        onContextMenu={(event) => event.preventDefault()}
      >
        {/* A new key remounts the slide so its animations replay */}
        <div key={slide.id} className="absolute inset-0">
          {slide.render()}
        </div>

        <div className="absolute inset-x-0 top-0 z-10 bg-linear-to-b from-night/70 to-transparent px-3 pt-3 pb-4">
          <div className="flex gap-1">
            {slides.map((item, i) => (
              <div key={item.id} className="h-1 flex-1 overflow-hidden rounded-full bg-cream/25">
                {i < index && <div className="h-full w-full bg-cream" />}
                {i === index && (
                  <div
                    key={index}
                    className="h-full bg-cream"
                    style={
                      autoPlay
                        ? { animation: `fill ${item.duration}ms linear forwards`, animationPlayState: paused ? "paused" : "running" }
                        : { width: "100%" }
                    }
                    onAnimationEnd={next}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1">{header}</div>
            {autoPlay && (
              <button onClick={togglePause} aria-label={paused ? "Play" : "Pause"} className="cursor-pointer p-1.5 hover:text-gold">
                {paused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
              </button>
            )}
            <button
              onClick={onClose}
              className="cursor-pointer rounded-full bg-cream/15 px-3 py-1 text-xs font-semibold backdrop-blur hover:bg-cream/25"
            >
              Skip
            </button>
          </div>
        </div>

        {overlay?.(slide.id)}

        <AnimatePresence>
          {paused && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-x-0 bottom-6 z-10 text-center font-display text-2xl tracking-widest text-cream/80 uppercase"
            >
              Paused
            </motion.p>
          )}
        </AnimatePresence>
      </section>

      <button onClick={next} disabled={index === last} aria-label="Next slide" className={sideButton}>
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
