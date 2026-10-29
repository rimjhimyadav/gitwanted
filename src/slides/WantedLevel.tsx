import { motion } from "motion/react";
import Photo from "../components/Photo";
import Sirens from "../components/Sirens";
import YearCalendar from "../components/YearCalendar";
import { Star } from "../components/Stars";
import { PHOTOS } from "../lib/photos";
import { formatDay, plural } from "../lib/format";
import { Kicker, Rise, Slide } from "./Slide";
import type { Wrapped } from "../types";

const POLICE_RESPONSE = [
  "Clean record. For now.",
  "The cops are mildly curious.",
  "Patrol cars are circling the block.",
  "Helicopters are in the air.",
  "They're calling in the army.",
  "Most wanted. Nobody can stop you.",
];

export default function WantedLevel({ wrapped }: { wrapped: Wrapped }) {
  const { streak, stars, days, year } = wrapped;
  const hasStreak = streak.length > 1;

  return (
    <Slide>
      <Photo photo={PHOTOS.nightCrowd} className="opacity-35" fade={95} />
      {stars > 0 && <Sirens />}

      <Rise className="relative">
        <Kicker className="text-cream/80">Wanted level</Kicker>
      </Rise>

      <div className="relative mt-4 flex gap-1.5 text-cream/35" role="img" aria-label={`${stars} of 5 stars`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3 + i * 0.22, type: "spring", bounce: 0.55 }}
          >
            <Star filled={i < stars} className="w-12" />
          </motion.div>
        ))}
      </div>

      <Rise delay={1.4} className="relative mt-6">
        <h2 className="game-title font-display text-6xl leading-none uppercase">{plural(streak.length, "day")}</h2>
        <p className="mt-1 text-xs font-bold tracking-[0.25em] text-gold uppercase">Longest streak</p>
        {hasStreak && (
          <p className="mt-3 text-sm text-cream/80">
            {formatDay(streak.start)} to {formatDay(streak.end)}, every single day.
          </p>
        )}
      </Rise>

      <div className="relative mt-auto">
        <YearCalendar year={year} days={days} highlight={hasStreak ? streak : null} delay={1.6} />
      </div>

      <Rise delay={2.2} className="relative mt-5">
        <p className="font-logo text-xl text-teal">{POLICE_RESPONSE[stars]}</p>
      </Rise>
    </Slide>
  );
}
