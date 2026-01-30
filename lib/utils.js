import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


import slugify from "slugify";

export const makeSlug = (text) => {
  const safe = (text ?? "").replace(/[^a-zA-Z0-9]+/g, "-"); // special char → -

  return slugify(safe, {
    lower: true,
    strict: true,
    trim: true,
  });
};
