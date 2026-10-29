type Props = { count: number; className?: string };

function Star({ filled, className }: { filled: boolean; className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="m12 2 2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.1l-6 3.3 1.3-6.7-5-4.7 6.8-.8z"
        fill={filled ? "var(--color-gold)" : "none"}
        stroke={filled ? "var(--color-night)" : "currentColor"}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Wanted level: `count` gold stars out of 5
export default function Stars({ count, className = "h-6 w-6" }: Props) {
  return (
    <div className="flex gap-1 text-cream/30" role="img" aria-label={`Wanted level ${count} of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} filled={i < count} className={className} />
      ))}
    </div>
  );
}

export { Star };
