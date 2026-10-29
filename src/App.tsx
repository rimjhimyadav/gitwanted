import { Route, Routes } from "react-router";
import GameOver from "./components/GameOver";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Story from "./pages/Story";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:username/:year" element={<Profile />} />
      <Route path="/:username/:year/story" element={<Story />} />
      <Route
        path="*"
        element={
          <GameOver word="Wasted" color="#c8243a" actions={[{ label: "Back to the city", to: "/" }]}>
            This page doesn't exist.
          </GameOver>
        }
      />
    </Routes>
  );
}
