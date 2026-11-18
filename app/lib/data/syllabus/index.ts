import type { BeltSlug, BeltSyllabus } from "@/lib/types/syllabus";
import { whiteBeltSyllabus } from "./belts/white";
import { yellowBeltSyllabus } from "./belts/yellow";
import { orangeBeltSyllabus } from "./belts/orange";
import { greenBeltSyllabus } from "./belts/green";
import { blueBeltSyllabus } from "./belts/blue";
import { brownBeltSyllabus } from "./belts/brown";
import { blackBeltSyllabus } from "./belts/black";

export const ALL_SYLLABI: Record<BeltSlug, BeltSyllabus> = {
  white: whiteBeltSyllabus,
  yellow: yellowBeltSyllabus,
  orange: orangeBeltSyllabus,
  green: greenBeltSyllabus,
  blue: blueBeltSyllabus,
  brown: brownBeltSyllabus,
  black: blackBeltSyllabus,
};

export const VALID_BELT_SLUGS: BeltSlug[] = [
  "white",
  "yellow",
  "orange",
  "green",
  "blue",
  "brown",
  "black",
];

export function isValidBeltSlug(slug: string): slug is BeltSlug {
  return VALID_BELT_SLUGS.includes(slug?.toLowerCase() as BeltSlug);
}

export function getSyllabusBySlug(slug: string): BeltSyllabus | null {
  const normalized = slug?.toLowerCase();
  if (isValidBeltSlug(normalized)) {
    return ALL_SYLLABI[normalized];
  }
  return null;
}

export function getAllSyllabi(): BeltSyllabus[] {
  return VALID_BELT_SLUGS.map((slug) => ALL_SYLLABI[slug]);
}
