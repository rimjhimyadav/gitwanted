import { useState, type RefObject } from "react";
import { Download } from "lucide-react";
import { downloadPoster } from "../lib/download";
import type { Wrapped } from "../types";

type Props = { posterRef: RefObject<HTMLDivElement | null>; wrapped: Wrapped; className?: string };

export default function DownloadButton({ posterRef, wrapped, className = "" }: Props) {
  const [saving, setSaving] = useState(false);

  async function handleClick() {
    if (!posterRef.current) return;
    setSaving(true);
    try {
      await downloadPoster(posterRef.current, wrapped);
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={saving}
      className={`flex w-full cursor-pointer items-center justify-center gap-2 bg-gold text-night transition hover:brightness-105 disabled:opacity-60 ${className}`}
    >
      <Download size={17} /> {saving ? "Printing..." : "Download poster"}
    </button>
  );
}
