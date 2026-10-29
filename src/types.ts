export type Day = { date: string; count: number };

export type Commit = { date: string; message: string };

export type User = {
  login: string;
  name: string;
  avatar: string;
  joined: string;
};

export type Repo = {
  name: string;
  language: string | null;
  stars: number;
  created: string;
  pushed: string;
  url: string;
};

export type Language = { name: string; count: number; share: number };

export type Streak = { length: number; start: string; end: string };

export type Alias = { name: string; habit: string };

export type SlideId = "intro" | "mission" | "wanted" | "weapon" | "record" | "poster";

export type Trophy = { slide: SlideId; title: string; text: string };

export type Wrapped = {
  user: User;
  year: number;
  ongoing: boolean;
  total: number;
  perDay: number;
  activeDays: number;
  daysInYear: number;
  days: Day[];
  months: number[];
  busiestMonth: number;
  weekdays: number[];
  busiestWeekday: number;
  bestDay: Day | null;
  streak: Streak;
  stars: number;
  languages: Language[];
  repoCount: number;
  topRepo: Repo | null;
  commitCount: number;
  hours: number[];
  peak: number | null;
  word: { word: string; count: number } | null;
  alias: Alias;
};
