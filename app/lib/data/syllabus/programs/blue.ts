import type { BeltProgram } from "@/lib/types/syllabus";

export const blueBeltProgram: BeltProgram = {
  slug: "blue",
  intent:
    "Advanced tactical grade. Introduction of armlocks (Kansetsu-waza), sacrifice throws (Sutemi-waza), and the 2nd Series of Nage-no-Kata (Koshi-waza).",
  leadershipNote:
    "At blue belt, joint-lock control is paramount. Never force an armlock rapidly; apply pressure with smooth, controlled leverage so your partner can tap safely.",
  learn: {
    ukemi: [],
    throws: [
      "sumi-gaeshi",
      "tani-otoshi",
      "o-guruma",
      "soto-makikomi",
      "uki-otoshi",
      "sukui-nage",
      "hane-makikomi",
      "utsuri-goshi",
    ],
    groundwork: [
      "hadaka-jime",
      "juji-gatame",
      "ude-garami",
      "ude-gatame",
      "waki-gatame",
      "armlock-defense",
    ],
  },
  kata: [
    {
      name: "Nage-no-Kata",
      kanji: "投の形",
      series: "1st & 2nd Series: Te-waza & Koshi-waza",
      role: "Both",
      focus:
        "Execution of the first 6 techniques of Nage-no-Kata as both Tori (thrower) and Uke (receiver), showing mutual trust and posture.",
      techniques: [
        "1st Series (Te-waza): Uki-otoshi, Seoi-nage, Kata-guruma",
        "2nd Series (Koshi-waza): Uki-goshi, Harai-goshi, Tsuri-komi-goshi",
      ],
    },
  ],
  terms: ["kansetsuwaza", "tokuiwaza", "seiryokuzenyo", "jitakyoei"],
  rules: [
    "Kansetsu-waza restriction: In Judo, joint locks are permitted exclusively on the elbow joint.",
    "Waki-gatame rule: Applying Waki-gatame while diving to the mat from a standing position is direct Hansoku-make (disqualification).",
    "Sukui-nage note: Classical double-leg scoop is banned in IJF contest shiai. Practice for Kata and Judo syllabus.",
  ],
  exam: {
    minMonths: 6,
    technical: [
      { id: "blue-kata-demo", label: "Perform Nage-no-Kata Series 1 and 2 (Te-waza and Koshi-waza) as both Tori and Uke" },
      { id: "blue-throws-demo", label: "Demonstrate Sumi-gaeshi, Tani-otoshi (safe mat slide), Utsuri-goshi, and Soto-makikomi in motion" },
      { id: "blue-locks-demo", label: "Demonstrate Ude-hishigi-juji-gatame, Ude-garami, and Ude-gatame with controlled progressive pressure" },
      { id: "blue-defense-demo", label: "Demonstrate hitchhiker defense and escape against Juji-gatame" },
      { id: "blue-principles-demo", label: "Explain Seiryoku Zen'yo and Jita Kyoei and their practical application on the tatami" },
    ],
    randori: {
      standingMin: 4,
      groundMin: 4,
      focus: "Technical composure under pressure, tactical gripping (kumikata), and seamless transition into groundwork submissions.",
    },
  },
};
