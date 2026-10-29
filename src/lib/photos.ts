// Free under the Unsplash License (unsplash.com/license)
const base = import.meta.env.BASE_URL + "photos/";

export type Photo = { src: string; by: string; link: string };

export const PHOTOS = {
  oceanDrive: { src: base + "ocean-drive.jpg", by: "Tuan Nguyen", link: "https://unsplash.com/photos/kHP6Lfd8e_0" },
  neonStreet: { src: base + "neon-street.jpg", by: "Andre Tan", link: "https://unsplash.com/photos/UVzDdeAMhkA" },
  neonPalms: { src: base + "neon-palms.jpg", by: "Andre Tan", link: "https://unsplash.com/photos/fShCouMUtRk" },
  neonCar: { src: base + "neon-car.jpg", by: "Beres Ioan", link: "https://unsplash.com/photos/0E8zq_98bi8" },
  nightCrowd: { src: base + "night-crowd.jpg", by: "Sunira Moses", link: "https://unsplash.com/photos/M99uIpg7PGM" },
  palmSunset: { src: base + "palm-sunset.jpg", by: "Tom Morbey", link: "https://unsplash.com/photos/BsbOshnkbpY" },
  lakeSunset: { src: base + "lake-sunset.jpg", by: "Andy Ramos", link: "https://unsplash.com/photos/H4aul-MzReo" },
  palmRow: { src: base + "palm-row.jpg", by: "Rolando Yera", link: "https://unsplash.com/photos/ATwi-EmGbSE" },
} satisfies Record<string, Photo>;

export const PHOTOGRAPHERS = [...new Map(Object.values(PHOTOS).map((photo) => [photo.by, photo])).values()];
