import { useRef } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { LayoutList, RotateCcw } from "lucide-react";
import DownloadButton from "../components/DownloadButton";
import Photo from "../components/Photo";
import Poster from "../components/Poster";
import { PHOTOS } from "../lib/photos";
import { Rise, Slide } from "./Slide";
import type { Wrapped } from "../types";

const button =
  "glass flex cursor-pointer items-center justify-center gap-2 border-2 border-cream/40 py-2.5 font-display tracking-wider uppercase transition hover:border-gold hover:text-gold";

export default function MostWanted({ wrapped, onReplay }: { wrapped: Wrapped; onReplay: () => void }) {
  const posterRef = useRef<HTMLDivElement>(null);

  return (
    <Slide className="justify-center bg-night">
      <Photo photo={PHOTOS.lakeSunset} fade={90} />

      <motion.div
        initial={{ y: -40, rotate: -8, opacity: 0 }}
        animate={{ y: 0, rotate: -1.5, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.35, duration: 0.8 }}
        className="relative shadow-[8px_8px_0_var(--color-pink)]"
      >
        <Poster ref={posterRef} wrapped={wrapped} />
      </motion.div>

      <Rise delay={0.6} className="relative mt-6 space-y-2">
        <DownloadButton
          posterRef={posterRef}
          wrapped={wrapped}
          className="border-2 border-night py-2.5 font-display tracking-wider uppercase shadow-[4px_4px_0_var(--color-pink)]"
        />
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onReplay} className={button}>
            <RotateCcw size={16} /> Replay
          </button>
          <Link to={`/${wrapped.user.login}/${wrapped.year}`} className={button}>
            <LayoutList size={16} /> Full profile
          </Link>
        </div>
      </Rise>
    </Slide>
  );
}
