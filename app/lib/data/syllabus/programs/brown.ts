import type { BeltProgram } from "@/lib/types/syllabus";

export const brownBeltProgram: BeltProgram = {
  slug: "brown",
  intent:
    "The final Kyu rank before Black Belt. Mastery of the final Gokyo throws, advanced turnovers, Sankaku-jime, Nage-no-Kata (Series 1–3), and preparing for the Shodan board.",
  leadershipNote:
    "As an Ikkyu (1st Kyu), you are an assistant mentor in the dojo. You help coaches run drills, guide junior athletes, and prepare for formal Yudansha examination.",
  learn: {
    ukemi: [],
    throws: [
      "o-soto-guruma",
      "uki-waza",
      "yoko-wakare",
      "yoko-guruma",
      "ushiro-goshi",
      "ura-nage",
      "sumi-otoshi",
      "yoko-gake",
    ],
    groundwork: [
      "kata-ha-jime",
      "sankaku-jime",
      "hiza-gatame",
      "ashi-gatame",
      "sankaku-turnover",
    ],
    counters: [
      {
        id: "uchimata-sukashi-counter",
        against: "uchi-mata",
        counter: "uchi-mata-sukashi",
        cue: "As Uke turns to reap, pull your hip backward out of range and steer Uke's forward momentum straight down to the tatami.",
      },
    ],
  },
  kata: [
    {
      name: "Nage-no-Kata",
      kanji: "投の形",
      series: "First 3 Series: Te-waza, Koshi-waza & Ashi-waza",
      role: "Both",
      focus:
        "Complete demonstration of the first 9 techniques of Nage-no-Kata (right and left side) as both Tori and Uke before the technical board.",
      techniques: [
        "1st Series (Te-waza): Uki-otoshi, Seoi-nage, Kata-guruma",
        "2nd Series (Koshi-waza): Uki-goshi, Harai-goshi, Tsuri-komi-goshi",
        "3rd Series (Ashi-waza): Okuri-ashi-barai, Sasae-tsuri-komi-ashi, Uchi-mata",
      ],
    },
  ],
  terms: ["shiai", "goldenscore", "shodan", "yudansha", "mudansha", "shoshin"],
  rules: [
    "Golden Score rules: Unlimited overtime where first score (Ippon or Waza-ari) or Hansoku-make ends the contest immediately.",
    "Banned actions: Kawazu-gake (leg-entanglement throw) is direct Hansoku-make due to severe risk of knee ligament destruction.",
    "Medical stoppage protocols: Handling bleeding, joint injury assessment, and concussion removal from the mat.",
  ],
  exam: {
    minMonths: 8,
    technical: [
      { id: "brown-kata-demo", label: "Perform full Nage-no-Kata Series 1, 2, and 3 (Te-waza, Koshi-waza, Ashi-waza) right & left as both Tori and Uke" },
      { id: "brown-gokyo-demo", label: "Demonstrate 4 throws selected by the board from the 40 Gokyo throws, explaining the balance-break vectors" },
      { id: "brown-sankaku-demo", label: "Demonstrate Sankaku-jime and the Sankaku turnover into pin from bottom and top guard positions" },
      { id: "brown-counter-demo", label: "Demonstrate Ura-nage or Uchi-mata-sukashi as an evasive counter-technique" },
      { id: "brown-coaching-demo", label: "Demonstrate ability to teach and correct a beginner on O-soto-gari and Ushiro-ukemi" },
    ],
    randori: {
      standingMin: 5,
      groundMin: 4,
      focus: "High-intensity competition randori showing stamina, strategic kumikata, and diverse throwing combinations.",
    },
  },
};
