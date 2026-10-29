import { useEffect, useState } from "react";
import GameOver from "./GameOver";
import { NotFoundError, RateLimitError } from "../api/github";

function useCountdown(until: Date | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!until) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [until]);

  if (!until) return "";
  const seconds = Math.max(0, Math.round((until.getTime() - now) / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function ErrorScreen({ error, username }: { error: Error; username: string }) {
  const countdown = useCountdown(error instanceof RateLimitError ? error.resetAt : null);
  const newGame = { label: "New game", to: "/" };
  const retry = { label: "Retry", onClick: () => window.location.reload() };

  if (error instanceof NotFoundError) {
    return (
      <GameOver word="Wasted" color="#c8243a" actions={[newGame]}>
        No GitHub user called <b>@{username}</b>. Check the spelling, it's the name in their profile link.
      </GameOver>
    );
  }

  if (error instanceof RateLimitError) {
    return (
      <GameOver word="Busted" color="var(--color-siren-blue)" actions={[newGame, retry]}>
        GitHub allows 60 requests an hour without a login, and they're used up. Lay low for <b className="text-gold">{countdown}</b>.
      </GameOver>
    );
  }

  return (
    <GameOver word="Mission failed" color="var(--color-pink)" actions={[newGame, retry]}>
      Couldn't reach GitHub. Check your internet and try again.
    </GameOver>
  );
}
