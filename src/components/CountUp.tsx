import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";
import { formatNumber } from "../lib/format";

type Props = { to: number; prefix?: string; delay?: number };

// Writes to the DOM directly instead of setting state, so React doesn't re-render every frame
export default function CountUp({ to, prefix = "", delay = 0.2 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const controls = animate(0, to, {
      duration: 1.8,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => {
        if (ref.current) ref.current.textContent = prefix + formatNumber(Math.round(value));
      },
    });
    return () => controls.stop();
  }, [to, prefix, delay, reduceMotion]);

  return (
    <>
      <span className="sr-only">{prefix + formatNumber(to)}</span>
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        {prefix + formatNumber(reduceMotion ? to : 0)}
      </span>
    </>
  );
}
