import MonthBars from "../components/MonthBars";
import Photo from "../components/Photo";
import { headline } from "../lib/feed";
import { formatDay } from "../lib/format";
import { PHOTOS } from "../lib/photos";
import type { Wrapped } from "../types";

export default function NewsPost({ wrapped }: { wrapped: Wrapped }) {
  const { user, year, bestDay, months, busiestMonth } = wrapped;

  return (
    <div className="relative aspect-4/5">
      <Photo photo={PHOTOS.neonStreet} fade={92} />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="inline-block -skew-x-12 bg-siren-red px-2.5 py-0.5 font-display tracking-wider uppercase">
          <span className="inline-block skew-x-12">Breaking news</span>
        </p>
        <h2 className="mt-2 font-display text-[2.1rem] leading-[0.95] uppercase">{headline(bestDay?.count ?? 0)}</h2>
        {bestDay && (
          <p className="mt-1.5 text-xs tracking-wider text-cream/70 uppercase">
            {formatDay(bestDay.date)} {year} · suspect: @{user.login}
          </p>
        )}
        <div className="glass mt-4 rounded-xl p-3">
          <MonthBars months={months} busiestMonth={busiestMonth} className="h-20" />
        </div>
      </div>
    </div>
  );
}
