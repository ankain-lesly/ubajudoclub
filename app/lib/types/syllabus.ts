export type BeltSlug =
  | "white"
  | "yellow"
  | "orange"
  | "green"
  | "blue"
  | "brown"
  | "black";

export type TechniqueCategory =
  | "ukemi"
  | "tachi-waza"
  | "ne-waza"
  | "renraku-waza"
  | "kaeshi-waza"
  | "kata"
  | "reiho"
  | "culture-theory";

export type TachiWazaSubgroup =
  | "te-waza" // Hand techniques
  | "koshi-waza" // Hip techniques
  | "ashi-waza" // Foot / leg techniques
  | "ma-sutemi-waza" // Rear sacrifice throws
  | "yoko-sutemi-waza"; // Side sacrifice throws

export type NeWazaSubgroup =
  | "osaekomi-waza" // Pinning / holding
  | "shime-waza" // Strangulations / chokes
  | "kansetsu-waza" // Joint locks
  | "turnovers" // Entries against turtle/flat defense
  | "escapes"; // Escapes from pins

export interface TechniqueItem {
  id: string;
  name: string;
  japaneseKanji?: string;
  translation: string;
  category: TechniqueCategory;
  subgroup?: TachiWazaSubgroup | NeWazaSubgroup | string;
  description: string;
  keyPoints: string[];
  commonMistakes?: string[];
  safetyWarnings?: string[];
  gokyoGroup?: number;
}

export interface KataRequirement {
  name: string;
  japaneseKanji?: string;
  set: string;
  role: "Tori" | "Uke" | "Both";
  focusDescription: string;
  techniquesCovered: string[];
}

export interface VocabularyTerm {
  term: string;
  kanji?: string;
  meaning: string;
  context?: string;
}

export interface GeneralAwareness {
  vocabulary: VocabularyTerm[];
  philosophyAndHistory: string[];
  rulesAndRefereeing: string[];
  hygieneAndSafety: string[];
}

export interface EvaluationModule {
  title: string;
  description: string;
  weightPercentage?: number;
  tasks: string[];
}

export interface PassageDeGradeExam {
  minimumSessions: number;
  minimumTimeMonths: number;
  prerequisites: string[];
  evaluationModules: EvaluationModule[];
  randoriRequirement: {
    tachiWazaMinutes: number;
    neWazaMinutes: number;
    focus: string;
  };
  coachingSignOffRequired: boolean;
}

export interface BeltSyllabus {
  slug: BeltSlug;
  rank: string;
  kyuRank: string;
  color: string;
  accentBg: string;
  nextBeltSlug?: BeltSlug;
  prevBeltSlug?: BeltSlug;
  summary: string;
  targetSessions: number;
  reihoAndEtiquette: {
    title: string;
    description: string;
    elements: string[];
  };
  ukemi: TechniqueItem[];
  tachiWaza: TechniqueItem[];
  neWaza: TechniqueItem[];
  renrakuKaeshiWaza?: TechniqueItem[];
  kata?: KataRequirement[];
  generalAwareness: GeneralAwareness;
  examRequirements: PassageDeGradeExam;
}
