import { useState, type ReactNode } from "react";
import { BadgeCheck, Heart, MessageCircle, Send } from "lucide-react";
import { compact } from "../lib/format";
import type { Account, Post as PostType } from "../lib/feed";

function AccountPicture({ account }: { account: Account }) {
  if (account.avatar) return <img src={account.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />;
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full font-logo text-xs text-night" style={{ background: account.color }}>
      {account.name[0]}
    </span>
  );
}

export default function Post({ post, children }: { post: PostType; children: ReactNode }) {
  const [liked, setLiked] = useState(false);
  const { account } = post;

  return (
    <article className="overflow-hidden rounded-2xl bg-[#1b1029] ring-1 ring-white/10">
      <header className="flex items-center gap-2.5 px-4 py-3">
        <AccountPicture account={account} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="flex items-center gap-1 truncate text-sm font-semibold">
            {account.name}
            {account.verified && <BadgeCheck size={15} className="shrink-0 fill-siren-blue text-night" aria-label="Verified" />}
          </p>
          <p className="text-xs text-cream/55">
            @{account.handle} · {post.time}
          </p>
        </div>
      </header>

      <div className="relative">{children}</div>

      <div className="px-4 pt-3 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setLiked(!liked)} aria-pressed={liked} aria-label="Like" className="cursor-pointer transition active:scale-90">
            <Heart size={22} className={liked ? "fill-pink text-pink" : ""} />
          </button>
          <MessageCircle size={22} aria-hidden="true" />
          <Send size={21} aria-hidden="true" />
        </div>
        <p className="mt-2 text-sm font-semibold">{compact(post.likes + (liked ? 1 : 0))} likes</p>
        <ul className="mt-1.5 space-y-0.5 text-sm">
          {post.comments.map((comment) => (
            <li key={comment.text}>
              <b>{comment.who}</b> <span className="text-cream/85">{comment.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
