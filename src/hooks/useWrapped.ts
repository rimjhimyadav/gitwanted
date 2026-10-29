import { useEffect, useState } from "react";
import { getCommits, getContributions, getRepos, getUser } from "../api/github";
import { buildWrapped } from "../lib/stats";
import { todayString } from "../lib/format";
import type { Wrapped } from "../types";

export const STEPS = ["profile", "contributions", "repos", "commits"] as const;
export type Step = (typeof STEPS)[number];

// The caller renders this under a key of username + year, so state starts fresh for each profile
export function useWrapped(username: string, year: number) {
  const [wrapped, setWrapped] = useState<Wrapped | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [done, setDone] = useState<Step[]>([]);

  useEffect(() => {
    let active = true;

    function track<T>(step: Step, promise: Promise<T>) {
      return promise.then((value) => {
        if (active) setDone((steps) => [...steps, step]);
        return value;
      });
    }

    Promise.all([
      track("profile", getUser(username)),
      track("contributions", getContributions(username, year)),
      // Repos and commits only feed a few slides, so the story still works without them
      track("repos", getRepos(username)).catch(() => []),
      track("commits", getCommits(username, year)).catch(() => []),
    ])
      .then(([user, contributions, repos, commits]) => {
        if (active) setWrapped(buildWrapped({ user, contributions, repos, commits }, year, todayString()));
      })
      .catch((err: Error) => {
        if (active) setError(err);
      });

    return () => {
      active = false;
    };
  }, [username, year]);

  return { wrapped, error, done };
}
