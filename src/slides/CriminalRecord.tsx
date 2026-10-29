import Photo from "../components/Photo";
import PoliceFile from "../components/PoliceFile";
import { PHOTOS } from "../lib/photos";
import { Kicker, Rise, Slide } from "./Slide";
import type { Wrapped } from "../types";

export default function CriminalRecord({ wrapped }: { wrapped: Wrapped }) {
  return (
    <Slide className="bg-night">
      <Photo photo={PHOTOS.neonPalms} className="opacity-50" fade={90} />
      <Rise className="relative">
        <Kicker className="text-cream/80">Criminal record</Kicker>
      </Rise>
      <div className="relative mt-4">
        <PoliceFile wrapped={wrapped} />
      </div>
    </Slide>
  );
}
