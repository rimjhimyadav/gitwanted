import { motion } from "motion/react";
import { MONTHS } from "../lib/format";
import type { Day, Streak } from "../types";

const LEVELS = ["rgb(255 244 227 / 0.07)", "#5c1d4f", "#9b2463", "#e0337c", "#ff6aa3"];

type Cell = { date: string; count: number | null } | null;

// 12 small month grids fit a tall story frame better than GitHub's single wide strip
function buildMonths(year: number, counts: Map<string, number>) {
  return MONTHS.map((name, month) => {
    const date = new Date(Date.UTC(year, month, 1));
    const cells: Cell[] = new Array(date.getUTCDay()).fill(null);

    while (date.getUTCMonth() === month) {
      const key = date.toISOString().slice(0, 10);
      cells.push({ date: key, count: counts.get(key) ?? null });
      date.setUTCDate(date.getUTCDate() + 1);
    }
    return { name, cells };
  });
}

// Scale against a busy day (90th percentile) instead of the busiest one,
// so a single huge day doesn't make the rest of the year look empty
function levelScale(days: Day[]) {
  const counts = days.map((day) => day.count).filter(Boolean).sort((a, b) => a - b);
  const busy = counts[Math.floor(counts.length * 0.9)] || 1;
  return (count: number) => (count ? Math.min(4, Math.ceil((count / busy) * 4)) : 0);
}

type Props = { year: number; days: Day[]; highlight?: Streak | null; delay?: number };

export default function YearCalendar({ year, days, highlight, delay = 0 }: Props) {
  const counts = new Map(days.map((day) => [day.date, day.count]));
  const level = levelScale(days);
  const inHighlight = (date: string) => !!highlight && date >= highlight.start && date <= highlight.end;

  function cellColor(cell: Cell) {
    if (!cell) return "transparent";
    if (inHighlight(cell.date)) return "var(--color-gold)";
    return LEVELS[level(cell.count ?? 0)];
  }

  return (
    <div className="grid grid-cols-4 gap-x-3 gap-y-2.5" role="img" aria-label={`Contribution calendar for ${year}`}>
      {buildMonths(year, counts).map((month, i) => (
        <motion.div
          key={month.name}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + i * 0.05, duration: 0.35 }}
        >
          <p className="mb-1 text-[9px] font-bold tracking-wider text-cream/60 uppercase">{month.name}</p>
          <div className="grid grid-cols-7 gap-px">
            {month.cells.map((cell, j) => (
              <div
                key={j}
                className="aspect-square"
                style={{ background: cellColor(cell), opacity: cell && cell.count === null ? 0.3 : 1 }}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
