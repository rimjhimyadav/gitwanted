import { motion } from "motion/react";
import { Trophy as TrophyIcon } from "lucide-react";
import type { Trophy } from "../types";

// Shown one after another at the bottom of a slide, like console achievements
export default function Trophies({ trophies }: { trophies: Trophy[] }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-16 z-20 flex justify-center px-4">
      {trophies.map((trophy, i) => (
        <motion.div
          key={trophy.title}
          role="status"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: [30, 0, 0, 30], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3, times: [0, 0.1, 0.88, 1], delay: 1.6 + i * 3.1, ease: "easeOut" }}
          className="absolute bottom-0 flex items-center gap-2.5 border-2 border-gold bg-night/95 py-1.5 pr-3.5 pl-1.5 shadow-[4px_4px_0_var(--color-pink)]"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-gold text-night">
            <TrophyIcon size={17} />
          </span>
          <span>
            <span className="block font-display text-sm leading-tight tracking-wide uppercase">
              <span className="text-gold">Trophy:</span> {trophy.title}
            </span>
            <span className="block text-[11px] text-cream/75">{trophy.text}</span>
          </span>
        </motion.div>
      ))}
    </div>
  );
}
