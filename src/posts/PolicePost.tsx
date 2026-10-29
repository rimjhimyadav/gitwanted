import Sirens from "../components/Sirens";
import Stars from "../components/Stars";
import YearCalendar from "../components/YearCalendar";
import { formatDay, plural } from "../lib/format";
import type { Wrapped } from "../types";

export default function PolicePost({ wrapped }: { wrapped: Wrapped }) {
  const { year, streak, stars, days } = wrapped;
  const hasStreak = streak.length > 1;

  return (
    <div className="relative overflow-hidden bg-[#120a1f] p-5">
      <Sirens />
      <div className="relative">
        <p className="text-xs font-semibold tracking-[0.3em] text-cream/70 uppercase">Wanted level</p>
        <div className="mt-2">
          <Stars count={stars} className="h-9 w-9" />
        </div>
        <p className="mt-3 font-logo text-3xl">{plural(streak.length, "day")} straight</p>
        {hasStreak && (
          <p className="text-sm text-cream/70">
            {formatDay(streak.start)} to {formatDay(streak.end)}. Suspect has not stopped.
          </p>
        )}
        <div className="mt-5">
          <YearCalendar year={year} days={days} highlight={hasStreak ? streak : null} />
        </div>
      </div>
    </div>
  );
}
