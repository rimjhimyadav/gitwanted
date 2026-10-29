import type { ReactNode, Ref } from "react";
import Stars from "./Stars";
import { formatNumber, plural, WEEKDAYS } from "../lib/format";
import type { Wrapped } from "../types";

function Line({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="border-b border-dashed border-night/30 py-1">
      <span className="block text-[9px] font-bold tracking-wider text-night/55 uppercase">{label}</span>
      <span className="block text-[12px] leading-tight font-bold">{children}</span>
    </p>
  );
}

type Props = { wrapped: Wrapped; ref?: Ref<HTMLDivElement> };

export default function Poster({ wrapped, ref }: Props) {
  const { user, year, total, stars, streak, alias, languages, busiestWeekday, ongoing } = wrapped;

  return (
    <div ref={ref} className="relative overflow-hidden border-4 border-night bg-[#f6e8cf] font-mono text-night">
      <div className="sunset relative px-4 pt-3 pb-2 text-center">
        <div className="halftone absolute inset-0 text-night/15" />
        <p className="relative text-[9px] font-bold tracking-[0.35em] text-cream uppercase">Git Wanted · {year}</p>
        <h3 className="game-title relative font-display text-[3.2rem] leading-none text-gold uppercase">Most wanted</h3>
        <div className="relative mx-auto mt-1 w-max">
          <Stars count={stars} className="h-5 w-5 text-night/40" />
        </div>
      </div>

      <div className="flex gap-3 p-3.5">
        <div className="w-[42%] shrink-0">
          <div className="relative border-2 border-night bg-[#cfd2d6]">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0_9px,rgb(20_11_34/0.35)_9px_10px)]" />
            {/* crossOrigin lets html-to-image draw the avatar into the download */}
            <img src={user.avatar} alt="" crossOrigin="anonymous" className="relative aspect-3/4 w-full object-cover grayscale contrast-125" />
          </div>
          <p className="mt-1.5 bg-night py-1 text-center text-[10px] font-bold text-cream uppercase">@{user.login.slice(0, 16)}</p>
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-display text-xl leading-tight uppercase">{user.name}</p>
          <p className="mb-1.5 text-[11px] font-bold text-siren-red uppercase">a.k.a. {alias.name}</p>
          <Line label="Wanted for">{plural(total, "contribution")}</Line>
          <Line label="Longest streak">{plural(streak.length, "day")}</Line>
          <Line label="Armed with">{languages[0]?.name ?? "unknown"}</Line>
          <Line label="Last seen">a {WEEKDAYS[busiestWeekday]}</Line>
        </div>
      </div>

      <div className="flex items-end justify-between border-t-4 border-night px-3.5 py-2">
        <div>
          <p className="text-[9px] font-bold tracking-[0.3em] uppercase">Reward{ongoing && " so far"}</p>
          <p className="font-display text-4xl leading-none text-siren-red">${formatNumber(total)}</p>
        </div>
        <p className="text-right text-[9px] leading-tight text-night/60">
          do not approach
          <br />
          rimjhimyadav.github.io/gitwanted
        </p>
      </div>
    </div>
  );
}
