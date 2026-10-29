import { motion } from "motion/react";
import { MONTHS } from "../lib/format";

type Props = { months: number[]; busiestMonth: number; delay?: number; className?: string };

export default function MonthBars({ months, busiestMonth, delay = 0, className = "h-28" }: Props) {
  const max = Math.max(...months, 1);

  return (
    <div className={`flex items-end gap-1 ${className}`} role="img" aria-label={`Busiest month: ${MONTHS[busiestMonth]}`}>
      {months.map((count, i) => (
        <div key={MONTHS[i]} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: `${Math.max((count / max) * 100, 3)}%` }}
            viewport={{ once: true }}
            transition={{ delay: delay + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full rounded-t-sm ${i === busiestMonth ? "bg-pink" : "bg-cream/30"}`}
          />
          <span className="text-[9px] text-cream/60">{MONTHS[i][0]}</span>
        </div>
      ))}
    </div>
  );
}
