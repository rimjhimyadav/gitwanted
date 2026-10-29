import type { Photo as PhotoType } from "../lib/photos";

type Props = {
  photo: PhotoType;
  fade?: number;
  eager?: boolean;
  position?: string;
  className?: string;
};

// Full-bleed background photo with a warm tint and a dark fade at the bottom for text
export default function Photo({ photo, fade = 85, eager = false, position = "center", className = "" }: Props) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <img src={photo.src} alt="" loading={eager ? "eager" : "lazy"} className="h-full w-full object-cover" style={{ objectPosition: position }} />
      <div className="absolute inset-0 bg-linear-to-br from-[#ff5fae]/35 via-transparent to-[#ff9a4d]/30 mix-blend-soft-light" />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom, rgb(14 8 24 / 0.35), transparent 30%, rgb(14 8 24 / ${fade / 100}) 92%)` }}
      />
    </div>
  );
}
