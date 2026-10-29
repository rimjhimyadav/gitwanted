export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const FULL_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// GitHub launched in 2008
export const FIRST_YEAR = 2008;
export const THIS_YEAR = new Date().getFullYear();

export function isValidYear(year: number) {
  return Number.isInteger(year) && year >= FIRST_YEAR && year <= THIS_YEAR;
}

// "2026-10-29" in local time, the same format the contributions API uses
export function todayString() {
  return new Date().toLocaleDateString("en-CA");
}

export function formatDay(date: string) {
  return new Date(date + "T12:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long" });
}

export function formatNumber(number: number) {
  return number.toLocaleString("en-US");
}

export function plural(count: number, word: string) {
  return `${formatNumber(count)} ${word}${count === 1 ? "" : "s"}`;
}

// 1234 -> "1.2K"
export function compact(number: number) {
  if (number >= 1e6) return `${+(number / 1e6).toFixed(1)}M`;
  if (number >= 1e3) return `${+(number / 1e3).toFixed(1)}K`;
  return String(number);
}

// Accepts "octocat", "@octocat" or "https://github.com/octocat/"
export function cleanUsername(input: string) {
  return input.trim().replace(/\/+$/, "").split("/").pop()!.replace(/^@/, "");
}

export function isUsername(text: string) {
  return /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(text);
}
