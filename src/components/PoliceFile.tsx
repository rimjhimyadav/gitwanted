import type { ReactNode } from "react";
import { motion } from "motion/react";
import { formatNumber, WEEKDAYS } from "../lib/format";
import type { Wrapped } from "../types";

const clock = (hour: number) => `${String(hour % 24).padStart(2, "0")}:00`;

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-b border-night/20 py-1.5">
      <p className="text-[9px] font-bold tracking-[0.2em] text-night/55 uppercase">{label}</p>
      <p className="text-[13px] leading-snug font-bold">{children}</p>
    </div>
  );
}

function HourChart({ hours, peak, animate }: { hours: number[]; peak: number | null; animate: boolean }) {
  const max = Math.max(...hours, 1);
  const inPeak = (hour: number) => peak !== null && (hour - peak + 24) % 24 < 3;

  return (
    <>
      <div className="flex h-12 items-end gap-px" role="img" aria-label="Commits by hour of the day">
        {hours.map((count, hour) => (
          <motion.div
            key={hour}
            initial={animate ? { height: 0 } : false}
            animate={{ height: `${Math.max((count / max) * 100, 4)}%` }}
            transition={{ delay: animate ? 0.9 + hour * 0.03 : 0, duration: 0.4 }}
            className={`flex-1 ${inPeak(hour) ? "bg-siren-red" : "bg-night/70"}`}
          />
        ))}
      </div>
      <div className="mt-0.5 flex justify-between text-[8px] text-night/55">
        {["00", "06", "12", "18", "23"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </>
  );
}

type Props = { wrapped: Wrapped; animate?: boolean };

export default function PoliceFile({ wrapped, animate = true }: Props) {
  const { user, alias, peak, word, hours, busiestWeekday, languages, commitCount, year } = wrapped;

  return (
    <motion.div
      initial={animate ? { y: 60, rotate: 6, opacity: 0 } : false}
      animate={{ y: 0, rotate: -1.5, opacity: 1 }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.8, delay: 0.15 }}
      className="relative bg-[#e9d3a0] p-4 pb-16 font-mono text-night shadow-[8px_8px_0_rgb(0_0_0/0.45)]"
    >
      <div className="absolute -top-4 left-0 h-4 w-28 bg-[#e9d3a0]" />

      <div className="flex gap-3.5">
        <div className="relative w-28 shrink-0 overflow-hidden border-2 border-night bg-[#cfd2d6]">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0_10px,rgb(20_11_34/0.35)_10px_11px)]" />
          <img src={user.avatar} alt="" className="relative aspect-3/4 w-full object-cover grayscale contrast-125" />
          <p className="absolute inset-x-0 bottom-0 bg-night py-0.5 text-center text-[9px] font-bold text-cream">
            #{user.login.slice(0, 12).toUpperCase()}
          </p>
        </div>

        <div className="min-w-0 flex-1">
          <Field label="Name">{user.name}</Field>
          <Field label="Alias">
            <span className="font-display text-xl font-normal tracking-wide text-siren-red uppercase">{alias.name}</span>
          </Field>
          <Field label="Known for">{alias.habit}</Field>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-x-3">
        {peak !== null && (
          <Field label="Peak hours">
            {clock(peak)} – {clock(peak + 3)}
          </Field>
        )}
        <Field label="Strikes on">{WEEKDAYS[busiestWeekday]}s</Field>
        {languages[0] && <Field label="Weapon">{languages[0].name}</Field>}
        {word && (
          <Field label="Catchphrase">
            “{word.word}” ×{formatNumber(word.count)}
          </Field>
        )}
      </div>

      {commitCount > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-[9px] font-bold tracking-[0.2em] text-night/55 uppercase">
            Activity by hour · last {formatNumber(commitCount)} commits of {year}
          </p>
          <HourChart hours={hours} peak={peak} animate={animate} />
        </div>
      )}

      <motion.p
        initial={animate ? { scale: 2.4, opacity: 0, rotate: -30 } : false}
        animate={{ scale: 1, opacity: 0.85, rotate: -14 }}
        transition={{ delay: animate ? 1.8 : 0, duration: 0.25, ease: "easeIn" }}
        className="absolute right-4 bottom-3 border-4 border-siren-red px-2 py-0.5 font-display text-2xl tracking-widest text-siren-red uppercase mix-blend-multiply"
      >
        Confirmed
      </motion.p>
    </motion.div>
  );
}
