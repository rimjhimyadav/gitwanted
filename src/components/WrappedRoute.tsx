import { useEffect, type ReactNode } from "react";
import { useParams } from "react-router";
import GameOver from "./GameOver";
import ErrorScreen from "./ErrorScreen";
import Loading from "./Loading";
import { useWrapped } from "../hooks/useWrapped";
import { isValidYear } from "../lib/format";
import type { Wrapped } from "../types";

type Render = (wrapped: Wrapped) => ReactNode;

// Shared by the story and profile pages: reads the URL, loads the data,
// and handles the loading, error and empty states
export default function WrappedRoute({ children }: { children: Render }) {
  const { username = "", year = "" } = useParams();

  if (!isValidYear(Number(year))) {
    return (
      <GameOver word="Wasted" color="#c8243a" actions={[{ label: "Back to the city", to: "/" }]}>
        This page doesn't exist.
      </GameOver>
    );
  }

  // The key resets all state when the username or year changes
  return (
    <LoadWrapped key={`${username}/${year}`} username={username} year={Number(year)}>
      {children}
    </LoadWrapped>
  );
}

function LoadWrapped({ username, year, children }: { username: string; year: number; children: Render }) {
  const { wrapped, error, done } = useWrapped(username, year);

  useEffect(() => {
    document.title = `@${username} ${year} | Git Wanted`;
  }, [username, year]);

  if (error) return <ErrorScreen error={error} username={username} />;
  if (!wrapped) return <Loading username={username} done={done} />;

  if (wrapped.total === 0) {
    const canGoBack = year - 1 >= Number(wrapped.user.joined.slice(0, 4));
    return (
      <GameOver
        word="Clean"
        color="var(--color-teal)"
        actions={[...(canGoBack ? [{ label: `Try ${year - 1}`, to: `/${wrapped.user.login}/${year - 1}` }] : []), { label: "New game", to: "/" }]}
      >
        No public contributions from <b>@{wrapped.user.login}</b> in {year}. Suspiciously clean.
      </GameOver>
    );
  }

  return children(wrapped);
}
