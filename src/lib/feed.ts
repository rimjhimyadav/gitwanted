import type { Wrapped } from "../types";
import { formatNumber, WEEKDAYS } from "./format";

export type Account = { name: string; handle: string; color?: string; avatar?: string; verified: boolean };
export type Comment = { who: string; text: string };
export type PostId = "news" | "police" | "armory" | "record";
export type Post = { id: PostId; account: Account; time: string; likes: number; comments: Comment[] };

const NEWS: Account = { name: "GWN 24", handle: "gwn24", color: "#ff2d4a", verified: true };
const POLICE: Account = { name: "Bay City Police", handle: "baycitypd", color: "#2f6bff", verified: true };
const ARMORY: Account = { name: "The Armory", handle: "armory.dev", color: "#25e2cf", verified: false };

const PEOPLE = ["nullpointer", "mergeconflict_mike", "css_witch", "404sleep", "rubberduck.dev", "tabs_not_spaces", "semicolon_sam", "stackoverflowed"];

// Same input, same number, so a profile always shows the same likes and commenters
function hash(text: string) {
  let value = 0;
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) >>> 0;
  return value;
}

export function headline(count: number) {
  if (count >= 100) return `Local dev pushes ${formatNumber(count)} commits in one day`;
  if (count >= 20) return `Local dev goes on ${formatNumber(count)}-commit rampage`;
  if (count >= 2) return `Local dev spotted making ${count} commits in a single day`;
  return "Local dev makes a commit. Experts stunned";
}

function recordComment({ alias, busiestWeekday }: Wrapped) {
  if (alias.name === "The Night Owl") return "it's 3am go to sleep 😭";
  if (alias.name === "The Early Bird") return "who commits before coffee?? 😨";
  return `pushing on a ${WEEKDAYS[busiestWeekday]}, classic`;
}

export function buildFeed(wrapped: Wrapped): Post[] {
  const { user, total, stars, bestDay, streak, languages, topRepo, word } = wrapped;
  const top = languages[0];

  const comment = (seed: string, text: string): Comment => ({ who: PEOPLE[hash(user.login + seed) % PEOPLE.length], text });
  const likes = (seed: string) => 40 + total * 3 + stars * 500 + (hash(user.login + seed) % 900);
  const bestCount = bestDay?.count ?? 0;

  const posts: Post[] = [
    {
      id: "news",
      account: NEWS,
      time: "2h",
      likes: likes("news"),
      comments: [
        comment("n1", bestCount >= 20 ? `${formatNumber(bestCount)} in one day?? 💀` : "slow news day huh"),
        comment("n2", `@${user.login} touch grass challenge (impossible)`),
      ],
    },
    {
      id: "police",
      account: POLICE,
      time: "5h",
      likes: likes("police"),
      comments: [
        comment("p1", streak.length >= 30 ? `bro hasn't seen sunlight in ${streak.length} days` : `${streak.length} days is rookie numbers 😤`),
        comment("p2", stars >= 4 ? "send the helicopters 🚁" : "cops are not even trying"),
      ],
    },
  ];

  if (top) {
    posts.push({
      id: "armory",
      account: ARMORY,
      time: "1d",
      likes: likes("armory"),
      comments: [
        comment("a1", languages.length >= 5 ? "jack of all languages fr" : `${top.name} again?? 🙄`),
        comment("a2", topRepo && topRepo.stars >= 100 ? `${topRepo.name} carrying the whole team` : "ship it"),
      ],
    });
  }

  posts.push({
    id: "record",
    account: POLICE,
    time: "2d",
    likes: likes("record"),
    comments: [
      comment("r1", recordComment(wrapped)),
      comment("r2", word ? `"${word.word}" ×${formatNumber(word.count)} is a cry for help` : "no further questions"),
    ],
  });

  return posts;
}
