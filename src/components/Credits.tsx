import { PHOTOGRAPHERS } from "../lib/photos";

export default function Credits({ className = "" }: { className?: string }) {
  return (
    <footer className={`text-[11px] text-cream/55 ${className}`}>
      <p>Fan-made parody, not affiliated with Rockstar Games or GitHub. Uses public GitHub data.</p>
      <p className="mt-0.5">
        Photos on Unsplash by{" "}
        {PHOTOGRAPHERS.map((photo, i) => (
          <span key={photo.by}>
            <a href={photo.link} target="_blank" className="hover:text-cream hover:underline">
              {photo.by}
            </a>
            {i < PHOTOGRAPHERS.length - 1 && ", "}
          </span>
        ))}
      </p>
    </footer>
  );
}
