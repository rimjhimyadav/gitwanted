import type { ReactNode } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";

type Action = { label: string; to?: string; onClick?: () => void };

type Props = { word: string; color: string; children: ReactNode; actions: Action[] };

const buttonStyles = [
  "border-2 border-night bg-gold text-night shadow-[4px_4px_0_var(--color-pink)]",
  "cursor-pointer border-2 border-cream/40 hover:border-gold hover:text-gold",
];

// Full-screen "WASTED" style message used for errors and empty results
export default function GameOver({ word, color, children, actions }: Props) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[radial-gradient(circle,#3b3640,#121014_75%)] px-6">
      <div className="max-w-md text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 1.25 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className={`game-title font-display tracking-wide uppercase ${word.length > 8 ? "text-6xl" : "text-8xl"}`}
          style={{ color }}
        >
          {word}
        </motion.h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
          <p className="mt-6 text-cream/85">{children}</p>
          <div className="mt-8 flex justify-center gap-2">
            {actions.map((action, i) => {
              const className = `px-5 py-2.5 font-display tracking-widest uppercase ${buttonStyles[i === 0 ? 0 : 1]}`;
              return action.to ? (
                <Link key={action.label} to={action.to} className={className}>
                  {action.label}
                </Link>
              ) : (
                <button key={action.label} onClick={action.onClick} className={className}>
                  {action.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
