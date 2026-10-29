import Photo from "../components/Photo";
import { formatNumber, plural } from "../lib/format";
import { languageColor } from "../lib/languages";
import { PHOTOS } from "../lib/photos";
import type { Wrapped } from "../types";

export default function ArmoryPost({ wrapped }: { wrapped: Wrapped }) {
  const { languages, repoCount, topRepo } = wrapped;
  const top = languages[0];

  return (
    <div className="relative p-5">
      <Photo photo={PHOTOS.neonCar} className="opacity-40" fade={95} />
      <div className="relative">
        <p className="text-xs font-semibold tracking-[0.3em] text-cream/70 uppercase">New weapon unlocked</p>
        <p className="mt-1 font-logo text-4xl" style={{ color: languageColor(top.name) }}>
          {top.name}
        </p>
        <p className="text-sm text-cream/70">
          Used in {plural(top.count, "repo")} of {plural(repoCount, "repo")} this year
        </p>

        <ul className="mt-5 space-y-2.5">
          {languages.slice(0, 5).map((language) => (
            <li key={language.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: languageColor(language.name) }} />
                  {language.name}
                </span>
                <span className="text-cream/60">{Math.round(language.share * 100)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full" style={{ width: `${language.share * 100}%`, background: languageColor(language.name) }} />
              </div>
            </li>
          ))}
        </ul>

        {topRepo && topRepo.stars > 0 && (
          <a href={topRepo.url} target="_blank" className="mt-5 block rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
            Most feared repo: <b>{topRepo.name}</b> · ★ {formatNumber(topRepo.stars)}
          </a>
        )}
      </div>
    </div>
  );
}
