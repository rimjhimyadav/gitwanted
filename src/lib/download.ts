import type { Wrapped } from "../types";

export async function downloadPoster(element: HTMLElement, wrapped: Wrapped) {
  // Loaded on demand, most visitors never download
  const { toPng } = await import("html-to-image");
  const image = await toPng(element, { pixelRatio: 3, cacheBust: true });

  const link = document.createElement("a");
  link.download = `gitwanted-${wrapped.user.login}-${wrapped.year}.png`;
  link.href = image;
  link.click();
}
