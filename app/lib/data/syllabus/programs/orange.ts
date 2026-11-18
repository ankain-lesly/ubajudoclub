import type { BeltProgram } from "@/lib/types/syllabus";

export const orangeBeltProgram: BeltProgram = {
  slug: "orange",
  intent:
    "Mastering hip sweeping mechanics (Harai-goshi), major inside attacks (Uchi-mata), combination attacks (Renraku-waza), and counter-throws (Kaeshi-waza).",
  leadershipNote:
    "At orange belt, focus on tactical grip fighting (kumikata) and learning to counter attacks with balance rather than brute resistance.",
  learn: {
    ukemi: ["zenpo-kaiten-obstacle"],
    throws: [
      "koshi-guruma",
      "harai-goshi",
      "okuri-ashi-barai",
      "uchi-mata",
      "tsuri-goshi",
      "ko-soto-gake",
    ],
    groundwork: [
      "kata-gatame",
      "ushiro-kesa-gatame",
      "guard-pass-basic",
    ],
    combinations: [
      {
        id: "kouchi-seoinage",
        from: "ko-uchi-gari",
        to: "ippon-seoi-nage",
        cue: "Attack with Ko-uchi-gari; as Uke leans forward to evade, spin into Ippon-seoi-nage.",
      },
    ],
    counters: [
      {
        id: "osoto-gaeshi-counter",
        against: "o-soto-gari",
        counter: "o-soto-gaeshi",
        cue: "As Uke steps deep to reap, absorb on bent knee, clamp upper body, and counter-reap their supporting leg.",
      },
    ],
  },
  terms: ["shido", "hansokumake", "renrakuwaza", "kaeshiwaza", "kumikata", "hikite", "tsurite"],
  rules: [
    "Shido penalties accumulate: 3 Shidos result in disqualification (Hansoku-make).",
    "Stiff-arm defensive holding without attack initiative receives a Shido penalty after 5 seconds.",
    "Judo Moral Code (FFJDA / International tradition) guides respectful conduct on the tatami.",
  ],
  exam: {
    minMonths: 4,
    technical: [
      { id: "orange-ukemi-demo", label: "Execute high Mae-mawari-ukemi over a training obstacle smoothly from both sides" },
      { id: "orange-throws-demo", label: "Demonstrate Harai-goshi, Uchi-mata entry, and Okuri-ashi-barai with proper timing" },
      { id: "orange-renraku-demo", label: "Demonstrate 1 combination attack (Ko-uchi-gari into Seoi-nage)" },
      { id: "orange-counter-demo", label: "Demonstrate 1 counter-technique (O-soto-gaeshi against an incoming O-soto-gari)" },
      { id: "orange-holds-demo", label: "Demonstrate Kata-gatame and Ushiro-kesa-gatame hold-downs" },
      { id: "orange-pass-demo", label: "Demonstrate passing between opponent's legs (guard pass) into side control" },
    ],
    randori: {
      standingMin: 3,
      groundMin: 3,
      focus: "Active combination attacks, transitions from standing throws directly into groundwork hold-downs.",
    },
  },
};
