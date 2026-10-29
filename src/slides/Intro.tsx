import { motion } from "motion/react";
import Photo from "../components/Photo";
import { PHOTOS } from "../lib/photos";
import { Kicker, Rise, Slide } from "./Slide";
import type { Wrapped } from "../types";

export default function Intro({ wrapped }: { wrapped: Wrapped }) {
  const { user, year, ongoing } = wrapped;

  return (
    <Slide className="justify-end bg-night">
      <motion.div initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 6, ease: "easeOut" }} className="absolute inset-0">
        <Photo photo={PHOTOS.palmSunset} eager fade={92} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, rotate: -14, scale: 0.8 }}
        animate={{ opacity: 1, rotate: -4, scale: 1 }}
        transition={{ type: "spring", bounce: 0.45, duration: 0.9, delay: 0.2 }}
        className="relative mb-7 w-36 self-start border-4 border-cream bg-cream shadow-[6px_6px_0_rgb(14_8_24/0.7)]"
      >
        <img src={user.avatar} alt="" className="aspect-square w-full object-cover" />
        <p className="truncate px-2 py-1 text-center font-display text-sm tracking-wider text-night uppercase">{user.name}</p>
      </motion.div>

      <div className="relative">
        <Rise delay={0.4}>
          <Kicker className="text-cream/85">A GitHub crime story</Kicker>
        </Rise>
        <Rise delay={0.55}>
          <h2 className="sunset-text mt-2 font-logo text-[4.4rem] leading-[0.86] uppercase">
            Git
            <br />
            Wanted
          </h2>
        </Rise>
        <Rise delay={0.8} className="mt-4 flex items-center gap-3">
          <p className="truncate font-logo text-xl">@{user.login}</p>
          <span className="h-px flex-1 bg-cream/40" />
          <Kicker className="shrink-0 text-gold">
            {year}
            {ongoing && " so far"}
          </Kicker>
        </Rise>
      </div>
    </Slide>
  );
}
