import { describe, expect, test } from "vitest";
import type { Repo, User } from "../types";
import {
  buildWrapped,
  favoriteWord,
  getAlias,
  hourTotals,
  longestStreak,
  peakHours,
  reposOfYear,
  topLanguages,
  trophiesFor,
  wantedStars,
} from "./stats";

// Days from Jan 1 with the given counts
function makeDays(counts: number[], year = 2026) {
  return counts.map((count, i) => ({
    date: new Date(Date.UTC(year, 0, 1 + i)).toISOString().slice(0, 10),
    count,
  }));
}

function makeRepo(repo: Partial<Repo>): Repo {
  return { name: "repo", language: null, stars: 0, created: "2020-01-01", pushed: "2020-01-01", url: "", ...repo };
}

const user: User = { login: "octo", name: "Octo", avatar: "", joined: "2015-01-01T00:00:00Z" };

describe("longestStreak", () => {
  test("finds the longest run of active days", () => {
    expect(longestStreak(makeDays([1, 2, 0, 3, 1, 4, 0, 1]))).toEqual({ length: 3, start: "2026-01-04", end: "2026-01-06" });
  });

  test("is 0 for an empty year", () => {
    expect(longestStreak(makeDays([0, 0, 0])).length).toBe(0);
  });

  test("counts a streak that runs until the last day", () => {
    expect(longestStreak(makeDays([0, 1, 1])).length).toBe(2);
  });
});

test.each([
  [0, 0],
  [1, 0],
  [2, 1],
  [9, 2],
  [10, 3],
  [29, 4],
  [30, 5],
  [200, 5],
])("a %i day streak gives %i stars", (days, stars) => {
  expect(wantedStars(days)).toBe(stars);
});

test("reposOfYear keeps repos that existed and were pushed that year", () => {
  const repos = [
    makeRepo({ name: "old", created: "2019-05-01", pushed: "2026-02-01" }),
    makeRepo({ name: "new", created: "2026-03-01", pushed: "2026-04-01" }),
    makeRepo({ name: "dead", created: "2018-01-01", pushed: "2024-01-01" }),
    makeRepo({ name: "future", created: "2027-01-01", pushed: "2027-02-01" }),
  ];
  expect(reposOfYear(repos, 2026).map((repo) => repo.name)).toEqual(["old", "new"]);
});

test("topLanguages counts repos per language and skips repos without one", () => {
  const languages = topLanguages([makeRepo({ language: "Go" }), makeRepo({ language: "Rust" }), makeRepo({ language: "Go" }), makeRepo({})]);
  expect(languages.map((language) => language.name)).toEqual(["Go", "Rust"]);
  expect(languages[0].share).toBeCloseTo(2 / 3);
});

test("hourTotals uses the committer's own clock", () => {
  const hours = hourTotals([
    { date: "2026-10-29T23:15:00+05:30", message: "" },
    { date: "2026-10-29T23:59:00-08:00", message: "" },
    { date: "2026-10-30T07:00:00Z", message: "" },
  ]);
  expect(hours[23]).toBe(2);
  expect(hours[7]).toBe(1);
});

describe("peakHours", () => {
  test("finds the busiest 3 hours, even across midnight", () => {
    const hours = new Array(24).fill(0);
    hours[23] = 4;
    hours[0] = 5;
    hours[1] = 3;
    hours[14] = 6;
    expect(peakHours(hours)).toBe(23);
  });

  test("is null without commits", () => {
    expect(peakHours(new Array(24).fill(0))).toBeNull();
  });
});

describe("favoriteWord", () => {
  test("uses only the first line and skips common words", () => {
    const word = favoriteWord([
      { date: "", message: "fix the login bug" },
      { date: "", message: "Fix typo" },
      { date: "", message: "Merge pull request #12 from main\n\nfix fix fix fix" },
      { date: "", message: "add tests" },
    ]);
    expect(word).toEqual({ word: "fix", count: 2 });
  });

  test("is null with no commits", () => {
    expect(favoriteWord([])).toBeNull();
  });
});

describe("getAlias", () => {
  const quiet = { weekdays: [0, 1, 1, 1, 1, 1, 0], streak: 3, perDay: 1 };

  test("night owl when 30% of commits are between 22:00 and 04:00", () => {
    const hours = new Array(24).fill(0);
    hours[23] = 3;
    hours[14] = 7;
    expect(getAlias({ ...quiet, hours }).name).toBe("The Night Owl");
  });

  test("weekend warrior when weekends are 35% or more", () => {
    const hours = new Array(24).fill(0);
    hours[14] = 10;
    expect(getAlias({ ...quiet, hours, weekdays: [5, 1, 1, 1, 1, 1, 5] }).name).toBe("The Weekend Warrior");
  });

  test("falls back to the professional", () => {
    expect(getAlias({ ...quiet, hours: new Array(24).fill(0) }).name).toBe("The Professional");
  });
});

describe("buildWrapped", () => {
  const contributions = makeDays([3, 0, 5, 5, 0, ...new Array(360).fill(0)]);

  test("only counts days up to today in the current year", () => {
    const wrapped = buildWrapped({ user, repos: [], contributions }, 2026, "2026-01-04");
    expect(wrapped.total).toBe(13);
    expect(wrapped.daysInYear).toBe(4);
    expect(wrapped.perDay).toBe(13 / 4);
    expect(wrapped.ongoing).toBe(true);
    expect(wrapped.bestDay?.date).toBe("2026-01-03");
  });

  test("a finished year isn't ongoing", () => {
    const wrapped = buildWrapped({ user, repos: [], contributions }, 2026, "2027-03-01");
    expect(wrapped.ongoing).toBe(false);
    expect(wrapped.daysInYear).toBe(365);
  });

  test("works without commits", () => {
    const wrapped = buildWrapped({ user, repos: [], contributions }, 2026, "2026-12-31");
    expect(wrapped.commitCount).toBe(0);
    expect(wrapped.word).toBeNull();
    expect(wrapped.alias.name).toBeTruthy();
  });

  // Jan 1-7 2026 is Thursday to Wednesday: only 2 weekend days, not enough for Weekend Warrior
  test("gives the right trophies", () => {
    const wrapped = buildWrapped({ user, repos: [], contributions: makeDays(new Array(7).fill(20)) }, 2026, "2026-12-31");
    expect(trophiesFor(wrapped).map((trophy) => trophy.title)).toEqual(["Centurion", "Day One", "Iron Streak"]);
  });
});
