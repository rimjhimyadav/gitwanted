import type { CSSProperties, ReactNode } from "react";
import { motion } from "motion/react";

type SlideProps = { className?: string; style?: CSSProperties; children: ReactNode };

// pt-24 leaves room for the story header
export function Slide({ className = "bg-night", style, children }: SlideProps) {
  return (
    <div className={`relative flex h-full flex-col overflow-hidden px-7 pt-24 pb-10 ${className}`} style={style}>
      {children}
    </div>
  );
}

export function Rise({ delay = 0, className = "", children }: { delay?: number; className?: string; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Kicker({ className = "", children }: { className?: string; children: ReactNode }) {
  return <p className={`text-[11px] font-bold tracking-[0.3em] uppercase ${className}`}>{children}</p>;
}
