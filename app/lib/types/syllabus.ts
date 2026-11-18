import type { Rank } from "@/lib/types";

export type BeltSlug =
  | "white"
  | "yellow"
  | "orange"
  | "green"
  | "blue"
  | "brown"
  | "black";

export type TechniqueGroup =
  | "te-waza"
  | "koshi-waza"
  | "ashi-waza"
  | "ma-sutemi-waza"
  | "yoko-sutemi-waza"
  | "osaekomi-waza"
  | "shime-waza"
  | "kansetsu-waza"
  | "ukemi"
  | "turnovers"
  | "escapes";

export interface Technique {
  id: string;
  name: string;
  kanji?: string;
  translation: string;
  group: TechniqueGroup;
  gokyoGroup?: 1 | 2 | 3 | 4 | 5;
  shiaiStatus?: "allowed" | "banned_leg_grab";
  cues: [string, string];
  safety?: string[];
  details: {
    kuzushi: string;
    tsukuri: string;
    kake: string;
    mistakes?: string[];
    coachingNote?: string;
  };
}

export interface VocabularyTerm {
  id: string;
  term: string;
  kanji?: string;
  meaning: string;
  context?: string;
}

export interface KataSet {
  name: string;
  kanji?: string;
  series: string;
  role: "Tori" | "Uke" | "Both";
  focus: string;
  techniques: string[];
}

export interface ExamTask {
  id: string;
  label: string;
}

export interface BeltProgram {
  slug: BeltSlug;
  intent: string;
  leadershipNote?: string;
  learn: {
    throws: string[];
    groundwork: string[];
    ukemi: string[];
    combinations?: Array<{
      id: string;
      from: string;
      to: string;
      cue: string;
    }>;
    counters?: Array<{
      id: string;
      against: string;
      counter: string;
      cue: string;
    }>;
  };
  kata?: KataSet[];
  terms: string[];
  rules?: string[];
  exam?: {
    minMonths: number;
    technical: ExamTask[];
    randori: {
      standingMin: number;
      groundMin: number;
      focus: string;
    };
  };
}

export interface ResolvedBeltView {
  slug: BeltSlug;
  rankName: string;
  kyuTitle: string;
  color: string;
  sessions: number;
  intent: string;
  leadershipNote?: string;
  nextRankName?: string;
  nextColor?: string;
  nextSlug?: BeltSlug;
  prevSlug?: BeltSlug;
  resolvedThrows: Technique[];
  resolvedGroundwork: Technique[];
  resolvedUkemi: Technique[];
  combinations?: Array<{
    id: string;
    fromTechnique: Technique;
    toTechnique: Technique;
    cue: string;
  }>;
  counters?: Array<{
    id: string;
    againstTechnique: Technique;
    counterTechnique: Technique;
    cue: string;
  }>;
  kata?: KataSet[];
  terms: VocabularyTerm[];
  rules: string[];
  exam?: {
    targetSessions: number;
    minMonths: number;
    nextRankTitle: string;
    technical: ExamTask[];
    randori: {
      standingMin: number;
      groundMin: number;
      focus: string;
    };
  };
  cumulativeReviewThrows: Array<{
    id: string;
    name: string;
    translation: string;
    kanji?: string;
    beltRank: string;
    group: TechniqueGroup;
    gokyoGroup?: number;
  }>;
  cumulativeReviewGroundwork: Array<{
    id: string;
    name: string;
    translation: string;
    kanji?: string;
    beltRank: string;
    group: TechniqueGroup;
  }>;
}
