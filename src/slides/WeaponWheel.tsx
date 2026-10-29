import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Star } from "lucide-react";
import Photo from "../components/Photo";
import { PHOTOS } from "../lib/photos";
import { languageColor, textOn } from "../lib/languages";
import { formatNumber, plural } from "../lib/format";
import { Kicker, Rise, Slide } from "./Slide";
import type { Language, Wrapped } from "../types";

const SLOTS = 8;
const OUTER = 96;
const INNER = 44;

// Two laps that end on slot 0, where the top language sits
const SPIN = Array.from({ length: SLOTS * 2 }, (_, step) => (step + 1) % SLOTS);

function polar(radius: number, degrees: number) {
  const angle = (degrees * Math.PI) / 180;
  return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
}

const slotAngle = (slot: number) => -90 + (slot * 360) / SLOTS;

function slicePath(slot: number) {
  const half = 180 / SLOTS - 1.4;
  const [a, b] = [slotAngle(slot) - half, slotAngle(slot) + half];
  const p = (radius: number, deg: number) => `${polar(radius, deg).x.toFixed(2)} ${polar(radius, deg).y.toFixed(2)}`;
  return `M ${p(OUTER, a)} A ${OUTER} ${OUTER} 0 0 1 ${p(OUTER, b)} L ${p(INNER, b)} A ${INNER} ${INNER} 0 0 0 ${p(INNER, a)} Z`;
}

const shortName = (name: string) => (name.length > 10 ? name.slice(0, 9) + "." : name);

// Steps through the slots, slowing down each time, then lands on slot 0
function useSpin() {
  const reduceMotion = useReducedMotion();
  const [slot, setSlot] = useState(0);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    const timers: number[] = [];
    let time = 400;
    SPIN.forEach((next, step) => {
      time += 50 + step * step * 1.1;
      timers.push(window.setTimeout(() => setSlot(next), time));
    });
    timers.push(window.setTimeout(() => setLanded(true), time + 150));
    return () => timers.forEach(clearTimeout);
  }, [reduceMotion]);

  return { slot: reduceMotion ? 0 : slot, landed: reduceMotion || landed };
}

function Slice({ slot, language, lit }: { slot: number; language: Language | undefined; lit: boolean }) {
  const color = language ? languageColor(language.name) : "";
  const label = polar(70, slotAngle(slot));
  const textColor = lit ? textOn(color) : language ? "var(--color-cream)" : "rgb(255 244 227 / 0.3)";

  return (
    <g>
      <path
        d={slicePath(slot)}
        fill={lit ? color : "rgb(20 11 34 / 0.85)"}
        stroke={lit ? "var(--color-cream)" : "rgb(255 244 227 / 0.35)"}
        strokeWidth={lit ? 2 : 1}
      />
      <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" fontSize="8" fontWeight="700" fontFamily="IBM Plex Mono" fill={textColor}>
        {language ? shortName(language.name) : "—"}
      </text>
    </g>
  );
}

export default function WeaponWheel({ wrapped }: { wrapped: Wrapped }) {
  const { languages, repoCount, topRepo } = wrapped;
  const { slot: litSlot, landed } = useSpin();
  const top = languages[0];

  return (
    <Slide className="bg-night">
      <Photo photo={PHOTOS.neonCar} className="opacity-45" fade={92} />
      <Rise className="relative">
        <Kicker className="text-cream/80">Weapon of choice</Kicker>
      </Rise>

      <motion.svg
        viewBox="-100 -100 200 200"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.35, duration: 0.7 }}
        className="relative mx-auto mt-5 w-full max-w-72"
        role="img"
        aria-label={`Weapon wheel, top language ${top.name}`}
      >
        {Array.from({ length: SLOTS }, (_, slot) => (
          <Slice key={slot} slot={slot} language={languages[slot]} lit={slot === litSlot && !!languages[slot]} />
        ))}
        <circle r={INNER - 6} fill="var(--color-night)" stroke="rgb(255 244 227 / 0.35)" />
        <text y="-6" textAnchor="middle" fontSize="7" fontFamily="IBM Plex Mono" letterSpacing="1.5" fill="rgb(255 244 227 / 0.6)">
          EQUIPPED
        </text>
        <text y="9" textAnchor="middle" fontSize="11" fontFamily="Anton" fill="var(--color-gold)">
          {landed ? `${Math.round(top.share * 100)}%` : "···"}
        </text>
      </motion.svg>

      {landed && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative mt-6">
          <h2
            className="game-title font-logo leading-none uppercase"
            // Long names like "TypeScript" get smaller so they fit a phone
            style={{ color: languageColor(top.name), fontSize: `${Math.min(3.3, 22 / top.name.length)}rem` }}
          >
            {top.name}
          </h2>
          <p className="mt-2 text-sm text-cream/85">
            Your go-to in {plural(top.count, "repo")} out of the {plural(repoCount, "repo")} you worked on.
          </p>
          {topRepo && topRepo.stars > 0 && (
            <p className="mt-4 flex items-center gap-1.5 border-l-4 border-gold pl-3 text-sm">
              Most feared repo: <b className="truncate">{topRepo.name}</b>
              <Star size={14} className="shrink-0 fill-gold text-gold" />
              {formatNumber(topRepo.stars)}
            </p>
          )}
        </motion.div>
      )}
    </Slide>
  );
}
