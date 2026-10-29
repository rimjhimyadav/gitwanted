// Police lights flashing red and blue in the top corners
export default function Sirens() {
  return (
    <>
      <div className="motion-loop absolute -top-24 -left-24 h-72 w-72 animate-[siren_0.9s_infinite] rounded-full bg-siren-red/45 blur-3xl" />
      <div className="motion-loop absolute -top-24 -right-24 h-72 w-72 animate-[siren_0.9s_0.45s_infinite] rounded-full bg-siren-blue/50 blur-3xl" />
    </>
  );
}
