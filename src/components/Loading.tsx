import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Photo from "./Photo";
import { Star } from "./Stars";
import { PHOTOS } from "../lib/photos";
import { STEPS, type Step } from "../hooks/useWrapped";

const STEP_LABELS: Record<Step, string> = {
  profile: "Finding the suspect",
  contributions: "Counting the crimes",
  repos: "Searching the hideouts",
  commits: "Reading the evidence",
};

const TIPS = [
  'Commits named "fix" are not documentation.',
  "You can't get a merge conflict if you never pull.",
  "Force pushing to main raises your wanted level.",
  "It works on your machine. Nobody else's.",
  "Every bug is a feature if you don't write the docs.",
  "Deleting the tests makes them pass faster.",
];

export default function Loading({ username, done }: { username: string; done: Step[] }) {
  const [tip, setTip] = useState(() => Math.floor(Math.random() * TIPS.length));

  useEffect(() => {
    const timer = setInterval(() => setTip((i) => (i + 1) % TIPS.length), 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div role="status" className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-night p-6 sm:p-10">
      <Photo photo={PHOTOS.palmRow} eager fade={75} />

      <div className="relative">
        <p className="sunset-text font-logo text-4xl">@{username}</p>
        <ul className="mt-4 space-y-1.5 text-sm">
          {STEPS.map((step) => (
            <li key={step} className={`flex items-center gap-2 ${done.includes(step) ? "text-cream" : "text-cream/55"}`}>
              {done.includes(step) ? <Check size={16} className="text-cash" /> : <span className="w-4 text-center">·</span>}
              {STEP_LABELS[step]}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative flex items-end justify-between gap-6">
        <div className="glass max-w-sm rounded-xl px-4 py-3">
          <p className="font-logo text-sm tracking-widest text-gold">TIP</p>
          <p className="mt-0.5 text-sm">{TIPS[tip]}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="font-logo text-sm tracking-widest">LOADING</span>
          <Star filled className="motion-loop h-7 w-7 animate-spin" />
        </div>
      </div>
    </div>
  );
}
