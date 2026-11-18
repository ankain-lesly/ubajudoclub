import type { BeltProgram } from "@/lib/types/syllabus";

export const whiteBeltProgram: BeltProgram = {
  slug: "white",
  intent:
    "The beginning of the Judo journey. Learning to fall safely (ukemi), body posture (shisei), dojo etiquette (reiho), and fundamental throws and pins.",
  leadershipNote:
    "At white belt, your highest priority is safety: learning to fall without fear and respecting every partner on the tatami.",
  learn: {
    ukemi: ["ushiro-ukemi", "yoko-ukemi", "mae-ukemi"],
    throws: [
      "o-soto-gari",
      "o-goshi",
      "de-ashi-barai",
      "hiza-guruma",
      "uki-goshi",
      "ippon-seoi-nage",
    ],
    groundwork: [
      "hon-kesa-gatame",
      "kuzure-kesa-gatame",
      "yoko-shiho-gatame",
      "ebi-escapes",
    ],
  },
  terms: ["dojo", "tatami", "judogi", "obi", "sensei", "tori", "uke", "hajime", "matte", "rei"],
  rules: [
    "Stop immediately on the command 'Matte' and disengage safely.",
    "Never apply any joint lock or choke at White Belt.",
    "Tapping twice on partner or tatami signals instant surrender and immediate release.",
  ],
  exam: {
    minMonths: 3,
    technical: [
      { id: "white-ukemi-demo", label: "Demonstrate Ushiro-ukemi, Yoko-ukemi, and Mae-ukemi safely from standing without head touching the mat" },
      { id: "white-throws-demo", label: "Demonstrate O-soto-gari, O-goshi, and De-ashi-barai with clean balance-break (Kuzushi) and finish" },
      { id: "white-holds-demo", label: "Demonstrate Hon-kesa-gatame and Yoko-shiho-gatame holding for 15 seconds against moderate resistance" },
      { id: "white-ebi-demo", label: "Demonstrate bridging and shrimping (Ebi) movements to create space from the bottom" },
      { id: "white-reiho-demo", label: "Tie the obi correctly in under 30 seconds and execute formal standing and kneeling bows" },
    ],
    randori: {
      standingMin: 2,
      groundMin: 2,
      focus: "Light Yakusoku-geiko (cooperative practice) focusing on posture and taking falls smoothly without tension.",
    },
  },
};
