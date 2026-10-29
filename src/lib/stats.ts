import type { Alias, Commit, Day, Language, Repo, Streak, Trophy, User, Wrapped } from "../types";
import { formatNumber } from "./format";

const sum = (numbers: number[]) => numbers.reduce((total, n) => total + n, 0);
const indexOfMax = (numbers: number[]) => numbers.indexOf(Math.max(...numbers));

export function longestStreak(days: Day[]): Streak {
  let best: Streak = { length: 0, start: "", end: "" };
  let length = 0;
  let start = "";

  for (const day of days) {
    if (day.count === 0) {
      length = 0;
      continue;
    }
    if (length === 0) start = day.date;
    length++;
    if (length > best.length) best = { length, start, end: day.date };
  }
  return best;
}

export function monthTotals(days: Day[]) {
  const totals = new Array(12).fill(0);
  for (const day of days) totals[Number(day.date.slice(5, 7)) - 1] += day.count;
  return totals;
}

export function weekdayTotals(days: Day[]) {
  const totals = new Array(7).fill(0);
  for (const day of days) totals[new Date(day.date + "T00:00:00Z").getUTCDay()] += day.count;
  return totals;
}

// The hour is read from the text so it stays on the committer's own clock
export function hourTotals(commits: Commit[]) {
  const totals = new Array(24).fill(0);
  for (const commit of commits) totals[Number(commit.date.slice(11, 13))]++;
  return totals;
}

// The 3-hour window with the most commits, e.g. 23 means 23:00 to 02:00
export function peakHours(hours: number[]) {
  let best: number | null = null;
  let bestCount = 0;
  for (let start = 0; start < 24; start++) {
    const count = hours[start] + hours[(start + 1) % 24] + hours[(start + 2) % 24];
    if (count > bestCount) {
      best = start;
      bestCount = count;
    }
  }
  return best;
}

const IGNORED_WORDS = new Set(
  "the and for with from into this that was are has have not but you your our its all use when then than also merge pull request branch main master https http com github www signed off authored".split(" ")
);

export function favoriteWord(commits: Commit[]) {
  const counts = new Map<string, number>();
  for (const commit of commits) {
    const firstLine = commit.message.split("\n")[0].toLowerCase();
    for (const word of firstLine.match(/[a-z][a-z']+/g) ?? []) {
      if (word.length < 3 || IGNORED_WORDS.has(word)) continue;
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
  }

  let best: { word: string; count: number } | null = null;
  for (const [word, count] of counts) {
    if (!best || count > best.count) best = { word, count };
  }
  return best;
}

function shareBetween(hours: number[], from: number, to: number) {
  const total = sum(hours);
  if (total === 0) return 0;
  let inside = 0;
  for (let hour = from; hour !== to; hour = (hour + 1) % 24) inside += hours[hour];
  return inside / total;
}

export function getAlias({ hours, weekdays, streak, perDay }: { hours: number[]; weekdays: number[]; streak: number; perDay: number }): Alias {
  const weekendShare = (weekdays[0] + weekdays[6]) / (sum(weekdays) || 1);

  if (shareBetween(hours, 22, 4) >= 0.3) return { name: "The Night Owl", habit: "pushing code after midnight" };
  if (shareBetween(hours, 5, 9) >= 0.25) return { name: "The Early Bird", habit: "committing before breakfast" };
  if (weekendShare >= 0.35) return { name: "The Weekend Warrior", habit: "working while everyone else rests" };
  if (streak >= 30) return { name: "The Machine", habit: "never, ever taking a day off" };
  if (perDay >= 10) return { name: "The Speed Demon", habit: "shipping faster than CI can keep up" };
  return { name: "The Professional", habit: "clean 9 to 5 commits, very suspicious" };
}

export function wantedStars(streak: number) {
  return [2, 5, 10, 20, 30].filter((days) => streak >= days).length;
}

// GitHub only gives the last push date, so a repo pushed in 2024 and 2026 also counts for 2025
export function reposOfYear(repos: Repo[], year: number) {
  const y = String(year);
  return repos.filter((repo) => repo.created.slice(0, 4) <= y && repo.pushed.slice(0, 4) >= y);
}

export function topLanguages(repos: Repo[]): Language[] {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  const total = sum([...counts.values()]);
  return [...counts]
    .map(([name, count]) => ({ name, count, share: count / total }))
    .sort((a, b) => b.count - a.count);
}

type Input = { user: User; repos: Repo[]; contributions: Day[]; commits?: Commit[] };

// `today` is a parameter so tests can pick any date
export function buildWrapped({ user, repos, contributions, commits = [] }: Input, year: number, today: string): Wrapped {
  // The API returns future days too, so only count up to today
  const days = contributions.filter((day) => day.date <= today);
  const total = sum(days.map((day) => day.count));
  const perDay = days.length ? total / days.length : 0;
  const months = monthTotals(days);
  const weekdays = weekdayTotals(days);
  const streak = longestStreak(days);
  const hours = hourTotals(commits);
  const yearRepos = reposOfYear(repos, year);
  const bestDay = days.reduce<Day | null>((best, day) => (day.count > (best?.count ?? 0) ? day : best), null);

  return {
    user,
    year,
    ongoing: today < `${year}-12-31`,
    total,
    perDay,
    activeDays: days.filter((day) => day.count > 0).length,
    daysInYear: days.length,
    days,
    months,
    busiestMonth: indexOfMax(months),
    weekdays,
    busiestWeekday: indexOfMax(weekdays),
    bestDay,
    streak,
    stars: wantedStars(streak.length),
    languages: topLanguages(yearRepos),
    repoCount: yearRepos.length,
    topRepo: [...yearRepos].sort((a, b) => b.stars - a.stars)[0] ?? null,
    commitCount: commits.length,
    hours,
    peak: peakHours(hours),
    word: favoriteWord(commits),
    alias: getAlias({ hours, weekdays, streak: streak.length, perDay }),
  };
}

export function trophiesFor(wrapped: Wrapped): Trophy[] {
  const { total, streak, languages, days, weekdays, alias, topRepo, year } = wrapped;
  const weekendShare = (weekdays[0] + weekdays[6]) / (total || 1);
  const newYearsDay = days[0]?.date === `${year}-01-01` && days[0].count > 0;

  const trophies: (Trophy | false)[] = [
    total >= 1000 && { slide: "mission", title: "Thousand Club", text: "1,000+ contributions in a year" },
    total >= 100 && total < 1000 && { slide: "mission", title: "Centurion", text: "100+ contributions in a year" },
    newYearsDay && { slide: "mission", title: "Day One", text: "Coded on New Year's Day" },
    streak.length >= 7 && { slide: "wanted", title: "Iron Streak", text: `${streak.length} days without a break` },
    languages.length >= 5 && { slide: "weapon", title: "Polyglot", text: `${languages.length} languages in one year` },
    !!topRepo && topRepo.stars >= 100 && { slide: "weapon", title: "Star Collector", text: `${topRepo.name} has ${formatNumber(topRepo.stars)} stars` },
    weekendShare >= 0.3 && { slide: "record", title: "Weekend Warrior", text: "Saturdays are for shipping" },
    alias.name === "The Night Owl" && { slide: "record", title: "Night Shift", text: "Most commits after 10 PM" },
  ];
  return trophies.filter((trophy) => trophy !== false);
}
