import { Link } from "react-router";
import { Play, Trophy } from "lucide-react";
import CountUp from "./CountUp";
import Photo from "./Photo";
import Stars from "./Stars";
import { trophiesFor } from "../lib/stats";
import { formatNumber, plural } from "../lib/format";
import { PHOTOS } from "../lib/photos";
import type { Wrapped } from "../types";

export default function ProfileCard({ wrapped }: { wrapped: Wrapped }) {
  const { user, year, total, streak, activeDays, stars, alias } = wrapped;
  const storyLink = `/${user.login}/${year}/story`;
  const trophies = trophiesFor(wrapped);

  const stats = [
    { label: "contributions", value: <CountUp to={total} delay={0} /> },
    { label: "longest streak", value: plural(streak.length, "day") },
    { label: "active days", value: formatNumber(activeDays) },
  ];

  return (
    <div className="overflow-hidden rounded-2xl bg-[#1b1029] ring-1 ring-white/10">
      <div className="relative h-24">
        <Photo photo={PHOTOS.oceanDrive} eager fade={40} />
      </div>

      <div className="px-5 pb-5">
        {/* Gradient ring means "has a story", like on Instagram */}
        <Link
          to={storyLink}
          aria-label="Play the story"
          className="group relative -mt-11 block w-max rounded-full bg-linear-to-tr from-gold via-pink to-[#b98cff] p-[3px]"
        >
          <img src={user.avatar} alt="" className="h-20 w-20 rounded-full border-4 border-[#1b1029] object-cover" />
          <span className="absolute -right-1 bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-pink text-night ring-4 ring-[#1b1029] transition group-hover:scale-110">
            <Play size={13} fill="currentColor" />
          </span>
        </Link>

        <h1 className="mt-3 font-logo text-xl leading-tight">{user.name}</h1>
        <p className="text-sm text-cream/60">@{user.login}</p>
        <p className="mt-2 inline-block rounded-full bg-siren-red/15 px-2.5 py-0.5 text-xs font-semibold text-siren-red">a.k.a. {alias.name}</p>

        <div className="mt-4">
          <Stars count={stars} />
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse rounded-xl bg-white/5 px-1 py-2">
              <dt className="text-[10px] text-cream/55">{stat.label}</dt>
              <dd className="font-logo text-lg leading-tight">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <Link
          to={storyLink}
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-pink to-orange py-2.5 font-logo text-sm tracking-wide text-night uppercase hover:brightness-110"
        >
          <Play size={15} fill="currentColor" /> Play the story
        </Link>

        {trophies.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-cream/60 uppercase">Trophies</p>
            <ul className="space-y-1.5">
              {trophies.map((trophy) => (
                <li key={trophy.title} className="flex items-center gap-2.5 text-sm">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                    <Trophy size={14} />
                  </span>
                  <span className="leading-tight">
                    <b className="block">{trophy.title}</b>
                    <span className="text-xs text-cream/60">{trophy.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
