import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Credits from "../components/Credits";
import Photo from "../components/Photo";
import { PHOTOS } from "../lib/photos";
import { cleanUsername, FIRST_YEAR, isUsername, THIS_YEAR } from "../lib/format";

const YEARS = Array.from({ length: THIS_YEAR - FIRST_YEAR + 1 }, (_, i) => THIS_YEAR - i);
const EXAMPLES = ["torvalds", "gaearon", "sindresorhus", "yyx990803"];

const field = "rounded-xl bg-white/10 ring-1 ring-white/15 outline-none";

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [year, setYear] = useState(THIS_YEAR);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const name = cleanUsername(username);

    if (!name) return setError("Type a GitHub username first.");
    if (!isUsername(name)) return setError("That doesn't look like a GitHub username.");
    navigate(`/${name}/${year}/story`);
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-night">
      <motion.div initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 8, ease: "easeOut" }} className="absolute inset-0">
        <Photo photo={PHOTOS.lakeSunset} eager fade={88} position="center 60%" />
      </motion.div>

      <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col justify-end px-5 pt-16 pb-10 sm:px-8 lg:justify-center">
        <p className="text-xs font-semibold tracking-[0.35em] text-cream/85 uppercase">A GitHub crime story</p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="sunset-text mt-3 font-logo text-[4.5rem] leading-[0.85] uppercase sm:text-[8rem]"
        >
          Git
          <br />
          Wanted
        </motion.h1>
        <p className="mt-5 max-w-md text-base text-cream/90 sm:text-lg">
          Your year on GitHub as a crime story. Wanted level, weapon of choice, criminal record and a Most Wanted poster for any username.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 max-w-md"
        >
          <form onSubmit={handleSubmit} noValidate className="glass rounded-2xl p-4">
            <div className="flex gap-2">
              <label className={`flex min-w-0 flex-1 items-center px-3.5 focus-within:ring-2 focus-within:ring-pink ${field}`}>
                <span className="text-cream/60">@</span>
                <input
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    setError("");
                  }}
                  placeholder="github username"
                  aria-label="GitHub username"
                  aria-invalid={!!error}
                  aria-describedby="username-error"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  autoFocus
                  className="w-full bg-transparent py-3 pl-1 outline-none placeholder:text-cream/40"
                />
              </label>
              <select value={year} onChange={(event) => setYear(Number(event.target.value))} aria-label="Year" className={`px-2.5 focus:ring-2 focus:ring-pink ${field}`}>
                {YEARS.map((option) => (
                  <option key={option} className="bg-night">
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <p id="username-error" role="alert" className="mt-1.5 min-h-4 text-xs text-pink">
              {error}
            </p>
            <button className="group mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-pink to-orange py-3 font-logo tracking-wide text-night uppercase transition hover:brightness-110">
              Start the story
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </button>
            <p className="mt-3 text-xs text-cream/70">
              Or try{" "}
              {EXAMPLES.map((name, i) => (
                <span key={name}>
                  <Link to={`/${name}/${year}/story`} className="font-semibold text-cream hover:text-gold">
                    {name}
                  </Link>
                  {i < EXAMPLES.length - 1 && ", "}
                </span>
              ))}
            </p>
          </form>

        </motion.div>
      </main>

      <Credits className="relative px-5 pb-4 sm:px-8" />
    </div>
  );
}
