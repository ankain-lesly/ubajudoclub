import type { BeltSyllabus } from "@/lib/types/syllabus";

export const brownBeltSyllabus: BeltSyllabus = {
  slug: "brown",
  rank: "Brown Belt",
  kyuRank: "1st Kyu — Ikkyu",
  color: "#6A4126",
  accentBg: "rgba(106, 65, 38, 0.15)",
  prevBeltSlug: "blue",
  nextBeltSlug: "black",
  summary:
    "The final Kyu rank before Black Belt (Shodan). Comprehensive mastery of the 3rd Series of Nage-no-Kata (Ashi-waza), side sacrifice throws, advanced turnovers, tournament rules (IJF), and mentoring junior members.",
  targetSessions: 64,
  reihoAndEtiquette: {
    title: "Senior Stewardship & Mat Leadership",
    description:
      "As a 1st Kyu, the athlete is an assistant instructor on the mat. Etiquette becomes an unspoken habit of dignity, calm, and protection of the whole club.",
    elements: [
      "Assisting Head Coach Sensei A. Nfor and Sensei B. Tatah during regular warmup and technical demonstrations.",
      "Mentoring athletes from White through Blue ranks during Randori sessions.",
      "Upholding impeccably clean white and blue competition judogis conforming to IJF size and patch specifications.",
    ],
  },
  ukemi: [
    {
      id: "shiai-ukemi",
      name: "Competitive Shiai Ukemi",
      japaneseKanji: "試合受身",
      translation: "High-Speed Dynamic Combat Breakfall",
      category: "ukemi",
      description:
        "High-velocity breakfalls from full-throttle competition throws, ensuring no head or collarbone trauma.",
      keyPoints: [
        "Involuntary reflexive tucking of chin and neck bracing.",
        "Dispersing kinetic force across entire forearm and torso perimeter.",
      ],
    },
  ],
  tachiWaza: [
    {
      id: "tani-otoshi",
      name: "Tani-otoshi",
      japaneseKanji: "谷落",
      translation: "Valley Drop",
      category: "tachi-waza",
      subgroup: "yoko-sutemi-waza",
      gokyoGroup: 4,
      description:
        "A counter and direct sacrifice throw where Tori slides behind Uke's legs and drops backwards onto their side, pulling Uke into the 'valley'.",
      keyPoints: [
        "Slide the rear leg flat along the floor behind both of Uke's heels.",
        "Keep upper body tight to Uke's back/side.",
        "Fall directly sideways-backward, pulling Uke down with you.",
      ],
      safetyWarnings: [
        "Never scissor the leg or drive your body directly into the back of Uke's knees (grave danger of tearing Uke's ACL). The slide must be flat along the mat.",
      ],
    },
    {
      id: "yoko-guruma",
      name: "Yoko-guruma",
      japaneseKanji: "横車",
      translation: "Side Wheel",
      category: "tachi-waza",
      subgroup: "yoko-sutemi-waza",
      gokyoGroup: 5,
      description:
        "When Uke bends forward or attacks, Tori drops between Uke's legs, slides their leg through, and wheels Uke sideways over the body.",
      keyPoints: [
        "Enter deeply between Uke's legs with low posture.",
        "Wheel Uke in a smooth circle across your side.",
      ],
    },
    {
      id: "hane-goshi",
      name: "Hane-goshi",
      japaneseKanji: "跳腰",
      translation: "Spring Hip Throw",
      category: "tachi-waza",
      subgroup: "koshi-waza",
      gokyoGroup: 3,
      description:
        "Tori bends their supporting leg, springs their hip and bent leg into Uke's inner thigh, and launches Uke forward like a coiled spring.",
      keyPoints: [
        "Load Uke's weight evenly across your hip and bent leg.",
        "Spring upward through your supporting leg while lifting with the bent leg.",
      ],
    },
    {
      id: "soto-makikomi",
      name: "Soto-makikomi",
      japaneseKanji: "外巻込",
      translation: "Outer Winding Throw",
      category: "tachi-waza",
      subgroup: "yoko-sutemi-waza",
      gokyoGroup: 4,
      description:
        "Tori wraps Uke's arm under their armpit, pivots with high momentum, and winds their entire body forward onto the mat, rolling Uke over them.",
      keyPoints: [
        "Trap Uke's arm completely across your chest/underarm.",
        "Drive your shoulder towards the mat in a continuous winding spiral.",
      ],
      safetyWarnings: [
        "Avoid landing full weight on Uke's ribs or shoulder.",
      ],
    },
    {
      id: "uchi-mata-sukashi",
      name: "Uchi-mata-sukashi",
      japaneseKanji: "内股透",
      translation: "Inner Thigh Slip / Evacuation Counter",
      category: "tachi-waza",
      subgroup: "te-waza",
      gokyoGroup: 5,
      description:
        "As Uke attacks with Uchi-mata, Tori dodges their hip backward, letting Uke reap empty air, and pulls Uke forward onto their face with hand action.",
      keyPoints: [
        "Anticipate Uke's reap and pull the targeted leg and hip sharply backward.",
        "Guide Uke's missed momentum straight down to the tatami.",
      ],
    },
  ],
  neWaza: [
    {
      id: "sankaku-jime",
      name: "Sankaku-jime",
      japaneseKanji: "三角絞",
      translation: "Triangle Choke / Leg Strangle",
      category: "ne-waza",
      subgroup: "shime-waza",
      description:
        "Tori traps Uke's head and one arm between their legs, forming a figure-four triangle with their shins and calves to compress the neck.",
      keyPoints: [
        "Trap one arm in, one arm out between your legs.",
        "Lock your ankle beneath your opposite knee (forming the triangle).",
        "Pull Uke's head down while raising your hips slightly to seal the choke.",
      ],
    },
    {
      id: "sankaku-turnover",
      name: "Sankaku Turnover to Pin",
      japaneseKanji: "三角返し",
      translation: "Triangle Turnover to Kuzure-kami-shiho-gatame",
      category: "ne-waza",
      subgroup: "turnovers",
      description:
        "Locking Uke's shoulder and head with a reverse triangle from the side while Uke is in turtle defense, rolling them over into a dominant hold.",
      keyPoints: [
        "Hook Uke's neck and arm from the front/side with your legs.",
        "Roll across your shoulder to turn Uke onto their back, retaining the leg clamp.",
      ],
    },
    {
      id: "ashi-gatame",
      name: "Ude-hishigi-ashi-gatame",
      japaneseKanji: "腕挫脚固",
      translation: "Leg Armlock",
      category: "ne-waza",
      subgroup: "kansetsu-waza",
      description:
        "Hyperextending Uke's elbow using the power and leverage of your legs while in guard or during a pin.",
      keyPoints: [
        "Trap Uke's arm across your thigh.",
        "Apply downward leverage on the wrist with your hands while your leg acts as the fulcrum.",
      ],
    },
  ],
  kata: [
    {
      name: "Nage-no-Kata (投の形)",
      set: "First 3 Series: Te-waza, Koshi-waza, and Ashi-waza",
      role: "Both",
      focusDescription:
        "Execution of the first 9 techniques of the Kodokan Throwing Kata as both Tori and Uke with complete ceremonial etiquette.",
      techniquesCovered: [
        "1st Series (Te-waza): Uki-otoshi, Seoi-nage, Kata-guruma",
        "2nd Series (Koshi-waza): Uki-goshi, Harai-goshi, Tsuri-komi-goshi",
        "3rd Series (Ashi-waza): Okuri-ashi-barai, Sasae-tsuri-komi-ashi, Uchi-mata",
      ],
    },
  ],
  generalAwareness: {
    vocabulary: [
      { term: "Shiai", kanji: "試合", meaning: "Formal competition match" },
      { term: "Golden Score", meaning: "Overtime period where first score or disqualification ends the match immediately" },
      { term: "Ikkyu", kanji: "一級", meaning: "First class student rank (highest kyu grade before black belt)" },
      { term: "Shodan", kanji: "初段", meaning: "First degree black belt (the true beginning of serious practice)" },
      { term: "Tandoku-renshu", kanji: "単独練習", meaning: "Solo technical practice / shadow judo" },
      { term: "Sotai-renshu", kanji: "相対練習", meaning: "Partner technical practice" },
    ],
    philosophyAndHistory: [
      "The meaning of the Brown Belt: In Japanese budo, Ikkyu marks the culmination of the apprenticeship. The athlete now possesses the full physical toolkit and begins cultivating internal mastery (Shin-Gi-Tai: Mind, Technique, Body).",
      "Structure of the Cameroon Judo Federation (FECAJUDO) and International Judo Federation (IJF).",
    ],
    rulesAndRefereeing: [
      "Complete knowledge of Golden Score competition rules.",
      "Recognizing medical stoppage protocols (bleeding management, concussion protocols, dislocated joints).",
    ],
    hygieneAndSafety: [
      "Dojo safety inspections: Ensuring tatami seams are flush without gaps to protect toes and ankles.",
    ],
  },
  examRequirements: {
    minimumSessions: 64,
    minimumTimeMonths: 8,
    prerequisites: [
      "Current 2nd Kyu (Blue Belt).",
      "Minimum 64 verified sessions logged at Bambili dojo since blue belt.",
      "Coaching board assessment of character, mentorship, and technical reliability.",
    ],
    evaluationModules: [
      {
        title: "Nage-no-Kata (Series 1, 2, and 3)",
        description: "Full demonstration of Te-waza, Koshi-waza, and Ashi-waza series as both Tori and Uke.",
        tasks: [
          "Demonstrate all 3 techniques of Te-waza (Uki-otoshi, Seoi-nage, Kata-guruma).",
          "Demonstrate all 3 techniques of Koshi-waza (Uki-goshi, Harai-goshi, Tsuri-komi-goshi).",
          "Demonstrate all 3 techniques of Ashi-waza (Okuri-ashi-barai, Sasae-tsuri-komi-ashi, Uchi-mata).",
          "Demonstrate flawless ceremonial entry, pacing, and exit.",
        ],
      },
      {
        title: "Tachi-Waza Syllabus (Gokyo 4th & 5th Group)",
        description: "Demonstration of advanced sacrifice throws, counters, and combinations.",
        tasks: [
          "Tani-otoshi (safe execution with straight mat slide).",
          "Yoko-guruma or Soto-makikomi.",
          "Hane-goshi (dynamic spring throw).",
          "Uchi-mata-sukashi (evasion counter).",
        ],
      },
      {
        title: "Advanced Ne-Waza Synthesis",
        description: "Sankaku-jime, turnover transitions, and armlock integration.",
        tasks: [
          "Sankaku-jime applied from bottom guard.",
          "Sankaku turnover into Kuzure-kami-shiho-gatame against turtle.",
          "Ashi-gatame application.",
        ],
      },
      {
        title: "Assistant Coaching & Shiai Experience",
        description: "Demonstration of teaching basics to a beginner and refereeing a mini-contest.",
        tasks: [
          "Teach and correct a beginner on O-soto-gari and Ushiro-ukemi.",
          "Act as referee for a 3-minute club practice contest with proper calls.",
        ],
      },
    ],
    randoriRequirement: {
      tachiWazaMinutes: 5,
      neWazaMinutes: 4,
      focus: "High-intensity competition randori showing stamina, tactical gripping, and versatile throwing options.",
    },
    coachingSignOffRequired: true,
  },
};
