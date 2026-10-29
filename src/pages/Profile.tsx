import { useRef, type ReactNode } from "react";
import { Link } from "react-router";
import Credits from "../components/Credits";
import DownloadButton from "../components/DownloadButton";
import Post from "../components/Post";
import Poster from "../components/Poster";
import ProfileCard from "../components/ProfileCard";
import WrappedRoute from "../components/WrappedRoute";
import ArmoryPost from "../posts/ArmoryPost";
import NewsPost from "../posts/NewsPost";
import PolicePost from "../posts/PolicePost";
import RecordPost from "../posts/RecordPost";
import { buildFeed, type PostId } from "../lib/feed";
import type { Wrapped } from "../types";

const POST_BODIES: Record<PostId, (props: { wrapped: Wrapped }) => ReactNode> = {
  news: NewsPost,
  police: PolicePost,
  armory: ArmoryPost,
  record: RecordPost,
};

export default function Profile() {
  return <WrappedRoute>{(wrapped) => <Feed wrapped={wrapped} />}</WrappedRoute>;
}

function Feed({ wrapped }: { wrapped: Wrapped }) {
  const posterRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-dvh bg-night">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-night/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="sunset-text font-logo text-xl uppercase">
            Git Wanted
          </Link>
          <Link to="/" className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold hover:bg-white/15">
            New search
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[300px_minmax(0,1fr)_330px]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <ProfileCard wrapped={wrapped} />
        </aside>

        <main className="mx-auto w-full max-w-lg space-y-6">
          {buildFeed(wrapped).map((post) => {
            const Body = POST_BODIES[post.id];
            return (
              <Post key={post.id} post={post}>
                <Body wrapped={wrapped} />
              </Post>
            );
          })}
        </main>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rotate-1 shadow-[8px_8px_0_var(--color-pink)]">
            <Poster ref={posterRef} wrapped={wrapped} />
          </div>
          <DownloadButton posterRef={posterRef} wrapped={wrapped} className="mt-5 rounded-xl py-2.5 font-logo text-sm tracking-wide uppercase" />
          <p className="mt-2 text-center text-xs text-cream/55">Post it, tag your friends, raise your wanted level.</p>
        </aside>
      </div>

      <Credits className="mx-auto max-w-6xl px-4 pb-8" />
    </div>
  );
}
