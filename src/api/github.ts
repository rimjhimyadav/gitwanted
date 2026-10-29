import type { Commit, Day, Repo, User } from "../types";

// No token on purpose: anything in frontend code is public. We stay on the free
// limit (60 requests an hour) and cache every answer in sessionStorage.
const GITHUB = "https://api.github.com";
const CONTRIBUTIONS = "https://github-contributions-api.jogruber.de/v4";

export class NotFoundError extends Error {}

export class RateLimitError extends Error {
  constructor(public resetAt: Date) {
    super("GitHub rate limit");
  }
}

async function get<T>(url: string): Promise<T> {
  const cached = sessionStorage.getItem(url);
  if (cached) return JSON.parse(cached);

  const response = await fetch(url);

  if (response.status === 404) throw new NotFoundError(url);

  if (response.headers.get("x-ratelimit-remaining") === "0" && [403, 429].includes(response.status)) {
    const reset = Number(response.headers.get("x-ratelimit-reset"));
    throw new RateLimitError(new Date(reset * 1000));
  }

  if (!response.ok) throw new Error(`Request failed: ${response.status}`);

  const data = await response.json();
  try {
    sessionStorage.setItem(url, JSON.stringify(data));
  } catch {
    // storage full, skip caching
  }
  return data;
}

type GitHubUser = { login: string; name: string | null; avatar_url: string; created_at: string };

export async function getUser(username: string): Promise<User> {
  const user = await get<GitHubUser>(`${GITHUB}/users/${username}`);
  return {
    login: user.login,
    name: user.name || user.login,
    avatar: user.avatar_url,
    joined: user.created_at,
  };
}

type GitHubRepo = {
  name: string;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  created_at: string;
  pushed_at: string;
  html_url: string;
};

export async function getRepos(username: string): Promise<Repo[]> {
  const repos = await get<GitHubRepo[]>(`${GITHUB}/users/${username}/repos?per_page=100&sort=pushed`);
  return repos
    .filter((repo) => !repo.fork)
    .map((repo) => ({
      name: repo.name,
      language: repo.language,
      stars: repo.stargazers_count,
      created: repo.created_at,
      pushed: repo.pushed_at,
      url: repo.html_url,
    }));
}

// GitHub only exposes the daily graph through GraphQL, which needs a token.
// This free API reads the same graph from the public profile page.
export async function getContributions(username: string, year: number): Promise<Day[]> {
  const data = await get<{ contributions: Day[] }>(`${CONTRIBUTIONS}/${username}?y=${year}`);
  return data.contributions.map(({ date, count }) => ({ date, count }));
}

type SearchResult = { items: { commit: { author: { date: string }; message: string } }[] };

export async function getCommits(username: string, year: number): Promise<Commit[]> {
  const query = encodeURIComponent(`author:${username} author-date:${year}-01-01..${year}-12-31`);
  const data = await get<SearchResult>(`${GITHUB}/search/commits?q=${query}&sort=author-date&per_page=100`);
  return data.items.map(({ commit }) => ({ date: commit.author.date, message: commit.message }));
}
