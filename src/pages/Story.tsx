import { useState } from "react";
import { useNavigate } from "react-router";
import StoryPlayer, { type StorySlide } from "../components/StoryPlayer";
import Trophies from "../components/Trophies";
import WrappedRoute from "../components/WrappedRoute";
import Intro from "../slides/Intro";
import MissionPassed from "../slides/MissionPassed";
import WantedLevel from "../slides/WantedLevel";
import WeaponWheel from "../slides/WeaponWheel";
import CriminalRecord from "../slides/CriminalRecord";
import MostWanted from "../slides/MostWanted";
import { trophiesFor } from "../lib/stats";
import type { Wrapped } from "../types";

export default function Story() {
  return <WrappedRoute>{(wrapped) => <StoryView wrapped={wrapped} />}</WrappedRoute>;
}

function StoryView({ wrapped }: { wrapped: Wrapped }) {
  const navigate = useNavigate();
  // Changing the key remounts the player, which restarts it from slide 1
  const [round, setRound] = useState(0);
  const { user, year, languages } = wrapped;
  const trophies = trophiesFor(wrapped);

  const slides: StorySlide[] = [
    { id: "intro", duration: 4500, render: () => <Intro wrapped={wrapped} /> },
    { id: "mission", duration: 6500, render: () => <MissionPassed wrapped={wrapped} /> },
    { id: "wanted", duration: 7500, render: () => <WantedLevel wrapped={wrapped} /> },
    { id: "weapon", duration: 7500, render: () => <WeaponWheel wrapped={wrapped} /> },
    { id: "record", duration: 9000, render: () => <CriminalRecord wrapped={wrapped} /> },
    { id: "poster", duration: 0, render: () => <MostWanted wrapped={wrapped} onReplay={() => setRound(round + 1)} /> },
  ];

  const header = (
    <div className="flex items-center gap-2 text-sm">
      <img src={user.avatar} alt="" className="h-7 w-7 rounded-full object-cover ring-2 ring-pink" />
      <span className="font-bold">{user.login}</span>
      <span className="text-cream/60">{year}</span>
    </div>
  );

  return (
    <StoryPlayer
      key={round}
      // No weapon wheel if GitHub found no languages
      slides={languages.length > 0 ? slides : slides.filter((slide) => slide.id !== "weapon")}
      header={header}
      overlay={(id) => <Trophies key={`trophies-${id}`} trophies={trophies.filter((trophy) => trophy.slide === id)} />}
      onClose={() => navigate(`/${user.login}/${year}`)}
    />
  );
}
