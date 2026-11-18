import { BELTS, beltFor } from "@/lib/data/club";
import type {
  BeltSlug,
  BeltProgram,
  ResolvedBeltView,
  Technique,
  VocabularyTerm,
} from "@/lib/types/syllabus";
import { TECHNIQUES_REGISTRY } from "./techniques";
import { GLOSSARY } from "./glossary";

import { whiteBeltProgram } from "./programs/white";
import { yellowBeltProgram } from "./programs/yellow";
import { orangeBeltProgram } from "./programs/orange";
import { greenBeltProgram } from "./programs/green";
import { blueBeltProgram } from "./programs/blue";
import { brownBeltProgram } from "./programs/brown";
import { blackBeltProgram } from "./programs/black";

export const BELT_PROGRAMS: Record<BeltSlug, BeltProgram> = {
  white: whiteBeltProgram,
  yellow: yellowBeltProgram,
  orange: orangeBeltProgram,
  green: greenBeltProgram,
  blue: blueBeltProgram,
  brown: brownBeltProgram,
  black: blackBeltProgram,
};

export const ORDERED_SLUGS: BeltSlug[] = [
  "white",
  "yellow",
  "orange",
  "green",
  "blue",
  "brown",
  "black",
];

export function isValidBeltSlug(slug: string): slug is BeltSlug {
  return ORDERED_SLUGS.includes(slug?.toLowerCase() as BeltSlug);
}

export function getAllBeltSlugs(): BeltSlug[] {
  return ORDERED_SLUGS;
}

export function getBeltProgram(slug: string): BeltProgram | null {
  const normalized = slug?.toLowerCase();
  if (isValidBeltSlug(normalized)) {
    return BELT_PROGRAMS[normalized];
  }
  return null;
}

/**
 * Resolves full belt view data including technique objects,
 * next belt exam metadata, and cumulative review lists from earlier ranks.
 */
export function getBeltView(slug: string): ResolvedBeltView | null {
  const normalized = slug?.toLowerCase();
  if (!isValidBeltSlug(normalized)) return null;

  const currentIdx = ORDERED_SLUGS.indexOf(normalized);
  const program = BELT_PROGRAMS[normalized];

  const clubBelt = BELTS[currentIdx];
  const prevSlug = currentIdx > 0 ? ORDERED_SLUGS[currentIdx - 1] : undefined;
  const nextSlug =
    currentIdx < ORDERED_SLUGS.length - 1
      ? ORDERED_SLUGS[currentIdx + 1]
      : undefined;
  const nextClubBelt = nextSlug
    ? BELTS[currentIdx + 1]
    : undefined;

  // Resolve active belt techniques
  const resolvedThrows = program.learn.throws
    .map((id) => TECHNIQUES_REGISTRY[id])
    .filter(Boolean);
  const resolvedGroundwork = program.learn.groundwork
    .map((id) => TECHNIQUES_REGISTRY[id])
    .filter(Boolean);
  const resolvedUkemi = program.learn.ukemi
    .map((id) => TECHNIQUES_REGISTRY[id])
    .filter(Boolean);

  // Resolve combinations & counters
  const combinations = program.learn.combinations?.map((c) => ({
    id: c.id,
    fromTechnique: TECHNIQUES_REGISTRY[c.from],
    toTechnique: TECHNIQUES_REGISTRY[c.to],
    cue: c.cue,
  })).filter((c) => c.fromTechnique && c.toTechnique);

  const counters = program.learn.counters?.map((c) => ({
    id: c.id,
    againstTechnique: TECHNIQUES_REGISTRY[c.against],
    counterTechnique: TECHNIQUES_REGISTRY[c.counter],
    cue: c.cue,
  })).filter((c) => c.againstTechnique && c.counterTechnique);

  // Resolve terms
  const terms: VocabularyTerm[] = program.terms
    .map((id) => GLOSSARY[id])
    .filter(Boolean);

  // Compute cumulative review (techniques from ALL strictly previous belts)
  const cumulativeReviewThrows: ResolvedBeltView["cumulativeReviewThrows"] = [];
  const cumulativeReviewGroundwork: ResolvedBeltView["cumulativeReviewGroundwork"] = [];

  for (let i = 0; i < currentIdx; i++) {
    const priorSlug = ORDERED_SLUGS[i];
    const priorProgram = BELT_PROGRAMS[priorSlug];
    const priorBeltInfo = BELTS[i];

    for (const throwId of priorProgram.learn.throws) {
      const t = TECHNIQUES_REGISTRY[throwId];
      if (t) {
        cumulativeReviewThrows.push({
          id: t.id,
          name: t.name,
          translation: t.translation,
          kanji: t.kanji,
          beltRank: priorBeltInfo.rank,
          group: t.group,
          gokyoGroup: t.gokyoGroup,
        });
      }
    }

    for (const gwId of priorProgram.learn.groundwork) {
      const g = TECHNIQUES_REGISTRY[gwId];
      if (g) {
        cumulativeReviewGroundwork.push({
          id: g.id,
          name: g.name,
          translation: g.translation,
          kanji: g.kanji,
          beltRank: priorBeltInfo.rank,
          group: g.group,
        });
      }
    }
  }

  // Construct exam info if next rank exists
  const exam =
    program.exam && nextClubBelt
      ? {
          targetSessions: clubBelt.sessions,
          minMonths: program.exam.minMonths,
          nextRankTitle: `${nextClubBelt.rank} (${nextClubBelt.kyu})`,
          technical: program.exam.technical,
          randori: program.exam.randori,
        }
      : undefined;

  return {
    slug: normalized,
    rankName: clubBelt.rank,
    kyuTitle: clubBelt.kyu,
    color: clubBelt.color,
    sessions: clubBelt.sessions,
    intent: program.intent,
    leadershipNote: program.leadershipNote,
    nextRankName: nextClubBelt?.rank,
    nextColor: nextClubBelt?.color,
    prevSlug,
    nextSlug,
    resolvedThrows,
    resolvedGroundwork,
    resolvedUkemi,
    combinations,
    counters,
    kata: program.kata,
    terms,
    rules: program.rules ?? [],
    exam,
    cumulativeReviewThrows,
    cumulativeReviewGroundwork,
  };
}
