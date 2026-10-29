import { motion } from "motion/react";
import CountUp from "../components/CountUp";
import Photo from "../components/Photo";
import { PHOTOS } from "../lib/photos";
import { formatNumber, plural } from "../lib/format";
import { Rise, Slide } from "./Slide";
import type { Wrapped } from "../types";

function verdict(total: number) {
  if (total >= 3000) return "Okay, kingpin.";
  if (total >= 1000) return "The whole city knows your name.";
  if (total >= 300) return "Respect earned.";
  if (total >= 50) return "Every job counts.";
  return "Small jobs, clean getaway.";
}

export default function MissionPassed({ wrapped }: { wrapped: Wrapped }) {
  const { total, perDay, activeDays, daysInYear } = wrapped;

  return (
    <Slide className="justify-center bg-night">
      <Photo photo={PHOTOS.oceanDrive} fade={80} />
      <div className="absolute inset-0 bg-night/45" />

      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative -mx-7 bg-night/85 px-7 py-8 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, letterSpacing: "0.3em" }}
          animate={{ opacity: 1, letterSpacing: "0.02em" }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="game-title font-display text-[3.4rem] leading-none text-gold uppercase"
        >
          Mission passed!
        </motion.h2>
        <p className="mt-5 font-display text-6xl text-cash">
          <CountUp to={total} prefix="+$" delay={0.9} />
        </p>
        <p className="mt-1 text-xs font-bold tracking-[0.3em] text-cream/80 uppercase">Contributions</p>
      </motion.div>

      <Rise delay={1.6} className="relative mt-8 space-y-1.5 text-center text-sm">
        <p>
          About <b className="text-gold">{formatNumber(Math.round(perDay * 10) / 10)}</b> a day
        </p>
        <p>
          On the job <b className="text-gold">{plural(activeDays, "day")}</b> out of {formatNumber(daysInYear)}
        </p>
      </Rise>
      <Rise delay={2} className="relative mt-6 text-center">
        <p className="font-logo text-2xl text-pink">{verdict(total)}</p>
      </Rise>
    </Slide>
  );
}
