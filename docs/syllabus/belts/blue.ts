import type { BeltSyllabus } from "@/lib/types/syllabus";

export const blueBeltSyllabus: BeltSyllabus = {
  slug: "blue",
  rank: "Blue Belt",
  kyuRank: "2nd Kyu — Nikyu",
  color: "#2A4A88",
  accentBg: "rgba(42, 74, 136, 0.15)",
  prevBeltSlug: "green",
  nextBeltSlug: "brown",
  summary:
    "Advanced tactical grade. Introduction of armlocks (Kansetsu-waza e.g., Juji-gatame, Ude-garami), side sacrifice throws (Yoko-sutemi-waza), and the 2nd Series of Nage-no-Kata (Koshi-waza).",
  targetSessions: 56,
  reihoAndEtiquette: {
    title: "Leadership & Armlock Safety",
    description:
      "Blue belts are senior athletes in the dojo. They must model absolute control during joint-locking techniques and lead by example in dojo hygiene and humility.",
    elements: [
      "Zero tolerance for hyperextending elbows during Kansetsu-waza practice: apply progressive pressure and stop the instant the partner signals tap.",
      "Assisting coaching staff with session logistics, welcoming trial athletes, and monitoring safety in randori rounds.",
      "Performing Kata both as Tori (executor) and Uke (receiver), showing mutual trust.",
    ],
  },
  ukemi: [
    {
      id: "yoko-sutemi-ukemi",
      name: "Yoko-sutemi-ukemi",
      japaneseKanji: "横捨身受身",
      translation: "Side Sacrifice Breakfall",
      category: "ukemi",
      description:
        "Absorbing dynamic impact from side throws like Ura-nage, Yoko-otoshi, and Sumi-gaeshi.",
      keyPoints: [
        "Commit into the rolling momentum; avoid twisting knees or ankles awkwardly.",
        "Slap the mat firmly with the leading arm while exhaling sharply.",
      ],
    },
  ],
  tachiWaza: [
    {
      id: "ura-nage",
      name: "Ura-nage",
      japaneseKanji: "裏投",
      translation: "Rear Throw / Back Throw",
      category: "tachi-waza",
      subgroup: "ma-sutemi-waza",
      gokyoGroup: 5,
      description:
        "One of the most dramatic counter-attacks in Judo. When Uke attacks with a forward turn throw (e.g. Seoi-nage or Harai-goshi), Tori steps around, clasps Uke's waist from behind, bridges backward and throws Uke over their shoulder.",
      keyPoints: [
        "Block Uke's hip entry by dropping your hips low and clamping your stomach to Uke's lower back.",
        "Wrap one arm around Uke's belt/waist, the other hand assisting the lift.",
        "Arch backward powerfully with legs and hips, guiding Uke over your left or right shoulder as you land on your back.",
      ],
      safetyWarnings: [
        "Never drop directly on your own head or neck. Turn your head sideways during the backward arch.",
      ],
    },
    {
      id: "sumi-gaeshi",
      name: "Sumi-gaeshi",
      japaneseKanji: "隅返",
      translation: "Corner Reversal / Corner Throw",
      category: "tachi-waza",
      subgroup: "ma-sutemi-waza",
      gokyoGroup: 4,
      description:
        "Tori grips over Uke's back/belt, drops backward, and hooks Uke's inner thigh with their instep to flip Uke over the corner.",
      keyPoints: [
        "High belt grip over Uke's shoulder.",
        "Drop hips under Uke's center while hooking Uke's inner thigh with the instep.",
        "Kick upward and over the opposite shoulder in a high corner arch.",
      ],
    },
    {
      id: "yoko-otoshi",
      name: "Yoko-otoshi",
      japaneseKanji: "横落",
      translation: "Side Drop",
      category: "tachi-waza",
      subgroup: "yoko-sutemi-waza",
      gokyoGroup: 3,
      description:
        "Tori pulls Uke forward-sideways onto one foot, slides their own leg flat along the tatami outside Uke's foot, and falls sideways pulling Uke down.",
      keyPoints: [
        "Break Uke's balance directly sideways onto their leading foot.",
        "Slide your throwing leg flat along the mat; do not place the foot sole on the ground.",
        "Fall onto your side in a continuous sweeping pull.",
      ],
    },
    {
      id: "o-guruma",
      name: "O-guruma",
      japaneseKanji: "大車",
      translation: "Major Wheel",
      category: "tachi-waza",
      subgroup: "ashi-waza",
      gokyoGroup: 4,
      description:
        "Similar to Harai-goshi, but Tori extends the leg horizontally across Uke's lower abdomen/thighs as a pivot fulcrum, wheeling Uke through the air.",
      keyPoints: [
        "Keep the outstretched leg high and straight across both of Uke's thighs.",
        "Wheel Uke with strong rotational torque from the hands and upper body.",
      ],
    },
    {
      id: "uki-waza",
      name: "Uki-waza",
      japaneseKanji: "浮技",
      translation: "Floating Drop",
      category: "tachi-waza",
      subgroup: "yoko-sutemi-waza",
      gokyoGroup: 5,
      description:
        "When Uke advances with stiff posture, Tori drops sideways to the mat and pulls Uke in a gentle floating arc over their extended leg.",
      keyPoints: [
        "Time the throw when Uke steps forward with a rigid stance.",
        "Drop to your side at a 45-degree angle, maintaining continuous sleeve tension.",
      ],
    },
  ],
  neWaza: [
    {
      id: "juji-gatame",
      name: "Ude-hishigi-juji-gatame",
      japaneseKanji: "腕挫十字固",
      translation: "Cross Armlock",
      category: "ne-waza",
      subgroup: "kansetsu-waza",
      description:
        "The premier armlock in grappling. Tori traps Uke's extended arm between their thighs, clamps their knees together, and bridges their hips to hyperextend Uke's elbow joint.",
      keyPoints: [
        "Pinch both knees tightly together to prevent Uke from turning their elbow.",
        "Hold Uke's wrist with thumb pointing upward toward the ceiling.",
        "Slowly arch hips off the mat to apply leverage directly across the fulcrum of the pelvis.",
      ],
      safetyWarnings: [
        "Apply pressure smoothly and progressively. Never yank or jerk the lock.",
      ],
    },
    {
      id: "ude-garami",
      name: "Ude-garami",
      japaneseKanji: "腕緘",
      translation: "Entangled Armlock (Keylock / Kimura)",
      category: "ne-waza",
      subgroup: "kansetsu-waza",
      description:
        "A figure-four shoulder and elbow lock applied by isolating Uke's bent arm with both hands.",
      keyPoints: [
        "Grab Uke's wrist with one hand, slide the other arm under Uke's tricep to grip your own wrist.",
        "Keep Uke's elbow bent at 90 degrees.",
        "Rotate Uke's arm toward their hip while pinning their elbow to the tatami.",
      ],
    },
    {
      id: "ude-gatame",
      name: "Ude-hishigi-ude-gatame",
      japaneseKanji: "腕挫腕固",
      translation: "Straight Armlock with Forearms",
      category: "ne-waza",
      subgroup: "kansetsu-waza",
      description:
        "Tori traps Uke's extended arm against their chest or shoulder, using both hands to apply pressure onto the elbow joint.",
      keyPoints: [
        "Clamp Uke's wrist against your neck/shoulder.",
        "Press your forearms directly down on the backside of Uke's elbow.",
      ],
    },
  ],
  kata: [
    {
      name: "Nage-no-Kata (投の形)",
      set: "2nd Series: Koshi-waza (Hip Techniques)",
      role: "Both",
      focusDescription:
        "Demonstration of the second series of Nage-no-Kata covering classical hip throws in both Tori and Uke roles.",
      techniquesCovered: [
        "Uki-goshi (Floating Hip)",
        "Harai-goshi (Sweeping Hip)",
        "Tsuri-komi-goshi (Lifting-Pulling Hip)",
      ],
    },
  ],
  generalAwareness: {
    vocabulary: [
      { term: "Kansetsu-waza", kanji: "関節技", meaning: "Joint locks (restricted exclusively to the elbow in Judo competition)" },
      { term: "Uki-waza", kanji: "浮技", meaning: "Floating technique (sacrifice throw)" },
      { term: "Tokui-waza", kanji: "得意技", meaning: "A judoka's favorite / specialized throw" },
      { term: "Seiryoku Zen'yo", kanji: "精力善用", meaning: "Maximum efficient use of mind and body energy" },
      { term: "Jita Kyoei", kanji: "自他共栄", meaning: "Mutual welfare and prosperity for self and others" },
    ],
    philosophyAndHistory: [
      "The anatomy of armlocks: Why the Kodokan restricted Kansetsu-waza exclusively to the elbow joint (to eliminate high-risk fractures of wrists, knees, and ankles from sport competition).",
      "Kano's educational vision: Judo as a system of physical education, moral cultivation, and self-defense for universities.",
    ],
    rulesAndRefereeing: [
      "Penalties for illegal armlock actions: Applying armlocks from standing (Waki-gatame standing dive is direct Hansoku-make).",
      "Simultaneous score and lock: Submissions can be initiated on the edge of the mat if action commenced in bounds.",
    ],
    hygieneAndSafety: [
      "Immediate release upon tap (two physical taps on partner, mat, or shouting 'Mairi'). Failure to release results in immediate disciplinary suspension.",
    ],
  },
  examRequirements: {
    minimumSessions: 56,
    minimumTimeMonths: 6,
    prerequisites: [
      "Current 3rd Kyu (Green Belt).",
      "Minimum 56 verified training sessions logged at Bambili dojo since green belt.",
      "Eligible age according to national federation rules for Kansetsu-waza.",
    ],
    evaluationModules: [
      {
        title: "Nage-no-Kata (2nd Series — Koshi-waza)",
        description: "Execution of Koshi-waza series in Nage-no-Kata as both Tori and Uke.",
        tasks: [
          "Demonstrate Uki-goshi (left and right with formal kata grip and entry).",
          "Demonstrate Harai-goshi (left and right with kata rhythm).",
          "Demonstrate Tsuri-komi-goshi (left and right).",
          "Demonstrate proper Uke breakfalls and posture recovery.",
        ],
      },
      {
        title: "Tachi-Waza Examination",
        description: "Demonstrate 4 new Blue belt techniques in dynamic motion.",
        tasks: [
          "Ura-nage (countering a forward throw with safe backward bridge).",
          "Sumi-gaeshi (corner sacrifice throw with thigh hook).",
          "Yoko-otoshi or Uki-waza.",
          "O-guruma.",
        ],
      },
      {
        title: "Kansetsu-Waza (Armlock) Proficiency",
        description: "Flawless demonstration of 3 armlocks with strict safety protocols.",
        tasks: [
          "Ude-hishigi-juji-gatame (from mount and from bottom guard).",
          "Ude-garami (from top hold-down position).",
          "Ude-gatame (straight armlock control).",
        ],
      },
    ],
    randoriRequirement: {
      tachiWazaMinutes: 4,
      neWazaMinutes: 4,
      focus: "High-level randori demonstrating tactical grip fighting (Kumikata), transitions into Ne-waza, and submission awareness.",
    },
    coachingSignOffRequired: true,
  },
};
