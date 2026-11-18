import type { BeltProgram } from "@/lib/types/syllabus";

export const yellowBeltProgram: BeltProgram = {
  slug: "yellow",
  intent:
    "Transitioning into dynamic movement. Introducing rolling breakfalls (Mae-mawari-ukemi), directional balance breaking (Happo-no-Kuzushi), inside leg reaps, and turtle turnovers.",
  leadershipNote:
    "At yellow belt, you support new beginners in their first falls and maintain relaxed, non-stiff grips during randori.",
  learn: {
    ukemi: ["mae-mawari-ukemi"],
    throws: [
      "o-uchi-gari",
      "sasae-tsuri-komi-ashi",
      "ko-soto-gari",
      "ko-uchi-gari",
      "tai-otoshi",
      "tsuri-komi-goshi",
    ],
    groundwork: [
      "kami-shiho-gatame",
      "kuzure-kami-shiho-gatame",
      "tate-shiho-gatame",
      "turtle-turnover-arm-collar",
      "kesa-escape-bridge",
    ],
    combinations: [
      {
        id: "ouchi-taiotoshi",
        from: "o-uchi-gari",
        to: "tai-otoshi",
        cue: "Attack with O-uchi-gari; as Uke withdraws leg and leans forward, pivot immediately into Tai-otoshi.",
      },
      {
        id: "deashi-osoto",
        from: "de-ashi-barai",
        to: "o-soto-gari",
        cue: "Feint with foot sweep; as Uke steps heavily onto trailing heel, follow through with deep O-soto-gari.",
      },
    ],
  },
  terms: ["ippon", "wazaari", "osaekomi", "toketa", "sonomama", "yoshi", "kuzushi", "tsukuri", "kake", "randori"],
  rules: [
    "Osaekomi scoring: 10 seconds = Waza-ari; 20 seconds = Ippon.",
    "Two Waza-ari scores in a contest combine to make Ippon (Waza-ari awasete Ippon).",
    "Grips below the belt in standing posture are prohibited under modern IJF rules.",
  ],
  exam: {
    minMonths: 4,
    technical: [
      { id: "yellow-ukemi-demo", label: "Demonstrate Mae-mawari-ukemi rolling breakfalls from both left and right sides smoothly" },
      { id: "yellow-throws-demo", label: "Demonstrate O-uchi-gari, Tai-otoshi, and Ko-soto-gari in continuous moving drills" },
      { id: "yellow-renraku-demo", label: "Execute 1 smooth combination (O-uchi-gari into Tai-otoshi OR De-ashi-barai into O-soto-gari)" },
      { id: "yellow-holds-demo", label: "Demonstrate Kami-shiho-gatame and Tate-shiho-gatame with proper hip weight distribution" },
      { id: "yellow-turnover-demo", label: "Execute the arm-and-collar turnover against an opponent defending in turtle position" },
      { id: "yellow-escape-demo", label: "Demonstrate bridge-and-roll escape from Hon-kesa-gatame" },
    ],
    randori: {
      standingMin: 3,
      groundMin: 3,
      focus: "Fluid continuous movement, attacking with combination attempts and taking falls without resistance.",
    },
  },
};
