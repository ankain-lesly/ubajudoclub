import type { BeltSyllabus } from "@/lib/types/syllabus";

export const blackBeltSyllabus: BeltSyllabus = {
  slug: "black",
  rank: "Black Belt",
  kyuRank: "Shodan — 1st Dan",
  color: "#14150F",
  accentBg: "rgba(20, 21, 15, 0.15)",
  prevBeltSlug: "brown",
  summary:
    "Shodan ('Beginning Degree'). The black belt does not signify the end of learning, but that the student has mastered the fundamentals and is now truly ready to study Judo deeply. Requires complete knowledge of the 40 Gokyo throws, full Nage-no-Kata, Katame-no-Kata, and formal national federation examination.",
  targetSessions: 80,
  reihoAndEtiquette: {
    title: "Black Belt Dignity & Lifetime Budo",
    description:
      "A Shodan represents the club, the university, and the art of Jigoro Kano. Etiquette is now the athlete's natural character.",
    elements: [
      "Serving as an official club instructor / assistant coach with formal coaching hours.",
      "Conducting oneself with dignity both inside and outside the dojo.",
      "Maintaining an open, receptive mind (Shoshin — Beginner's Mind), continuing to train with humility alongside white belts.",
    ],
  },
  ukemi: [
    {
      id: "shodan-ukemi",
      name: "Mastery Ukemi (All Throws)",
      japaneseKanji: "全受身",
      translation: "Total Breakfall Mastery",
      category: "ukemi",
      description:
        "The ability to take any throw from the Gokyo-no-waza safely, smoothly, and without hesitation at full speed.",
      keyPoints: [
        "Effortless adaptation to any vector of momentum.",
        "Total relaxation until the instantaneous moment of mat impact.",
      ],
    },
  ],
  tachiWaza: [
    {
      id: "gokyo-synthesis",
      name: "The Complete Kodokan Gokyo-no-Waza (40 Throws)",
      japaneseKanji: "五教の解説 (40技)",
      translation: "Comprehensive Mastery of all 5 Groups of Throws",
      category: "tachi-waza",
      description:
        "A Shodan must understand the mechanics, classification, and application of all 40 classical throws in the Kodokan Gokyo system.",
      keyPoints: [
        "Group 1 (Dai-ikkyo): De-ashi-barai, Hiza-guruma, Sasae-tsuri-komi-ashi, Uki-goshi, O-soto-gari, O-goshi, O-uchi-gari, Seoi-nage.",
        "Group 2 (Dai-nikyo): Ko-soto-gari, Ko-uchi-gari, Koshi-guruma, Tsuri-komi-goshi, Okuri-ashi-barai, Tai-otoshi, Harai-goshi, Uchi-mata.",
        "Group 3 (Dai-sankyo): Ko-soto-gake, Tsuri-goshi, Yoko-otoshi, Ashi-guruma, Hane-goshi, Harai-tsuri-komi-ashi, Tomoe-nage, Kata-guruma.",
        "Group 4 (Dai-yonkyo): Sumi-gaeshi, Tani-otoshi, Hane-makikomi, Sukui-nage, Utsuri-goshi, O-guruma, Soto-makikomi, Uki-otoshi.",
        "Group 5 (Dai-gokyo): O-soto-guruma, Uki-waza, Yoko-wakare, Yoko-guruma, Ushiro-goshi, Ura-nage, Sumi-otoshi, Yoko-gake.",
      ],
    },
  ],
  neWaza: [
    {
      id: "katame-no-kata-intro",
      name: "Katame-no-Kata Principles",
      japaneseKanji: "固の形",
      translation: "Forms of Grappling / Groundwork",
      category: "ne-waza",
      description:
        "Formal study of the 15 classical groundwork techniques comprising Osaekomi-waza (5 holds), Shime-waza (5 strangles), and Kansetsu-waza (5 armlocks).",
      keyPoints: [
        "Osaekomi-waza: Kesa-gatame, Kata-gatame, Kami-shiho-gatame, Kuzure-kami-shiho-gatame, Gyaku-kesa-gatame.",
        "Shime-waza: Kata-juji-jime, Hadaka-jime, Okuri-eri-jime, Kata-ha-jime, Gyaku-juji-jime.",
        "Kansetsu-waza: Ude-garami, Juji-gatame, Ude-gatame, Hiza-gatame, Ashi-gatame.",
      ],
    },
  ],
  kata: [
    {
      name: "Nage-no-Kata (投の形 — Complete)",
      set: "All 5 Series (15 Techniques, 30 Throws)",
      role: "Both",
      focusDescription:
        "Full Kodokan Nage-no-Kata executed on both right and left sides as both Tori and Uke before the National Dan Grading Commission.",
      techniquesCovered: [
        "1st Series (Te-waza): Uki-otoshi, Ippon-seoi-nage, Kata-guruma",
        "2nd Series (Koshi-waza): Uki-goshi, Harai-goshi, Tsuri-komi-goshi",
        "3rd Series (Ashi-waza): Okuri-ashi-barai, Sasae-tsuri-komi-ashi, Uchi-mata",
        "4th Series (Ma-sutemi-waza): Tomoe-nage, Ura-nage, Sumi-gaeshi",
        "5th Series (Yoko-sutemi-waza): Yoko-gake, Yoko-guruma, Uki-waza",
      ],
    },
  ],
  generalAwareness: {
    vocabulary: [
      { term: "Dan", kanji: "段", meaning: "Degree / step / grade (black belt levels 1st to 10th Dan)" },
      { term: "Yudansha", kanji: "有段者", meaning: "Dan grade holders / black belts" },
      { term: "Mudansha", kanji: "無段者", meaning: "Kyu grade students / colored belts" },
      { term: "Shoshin", kanji: "初心", meaning: "Beginner's mind (humility in mastery)" },
      { term: "Mondo", kanji: "問答", meaning: "Dialogue / technical questioning between master and student" },
    ],
    philosophyAndHistory: [
      "Jigoro Kano's address on Shodan: 'The 1st Dan is not the pinnacle of accomplishment; it is the threshold where the student has learned how to walk without stumbling, ready to explore the deeper landscape of Judo.'",
      "Kano's founding of the International Olympic Committee (IOC) as Asia's first member, and the introduction of Judo into the 1964 Tokyo Olympic Games.",
    ],
    rulesAndRefereeing: [
      "Full command of IJF Refereeing Rules, hand gestures, VAR (Care system) protocol, and contest administration.",
    ],
    hygieneAndSafety: [
      "First aid, CPR certification, concussion management, and orthopedic injury response on the mat.",
    ],
  },
  examRequirements: {
    minimumSessions: 80,
    minimumTimeMonths: 12,
    prerequisites: [
      "Current 1st Kyu (Brown Belt) held for at least 1 full year.",
      "Minimum 80 logged sessions since brown belt.",
      "National Federation (FECAJUDO) official registration and sports medical certificate.",
      "Passing regional or national Dan examination board.",
    ],
    evaluationModules: [
      {
        title: "Complete Nage-no-Kata (All 5 Series)",
        description: "Official demonstration of all 15 techniques of Nage-no-Kata (Right & Left) as Tori and Uke before the Dan panel.",
        tasks: [
          "Te-waza (Uki-otoshi, Seoi-nage, Kata-guruma).",
          "Koshi-waza (Uki-goshi, Harai-goshi, Tsuri-komi-goshi).",
          "Ashi-waza (Okuri-ashi-barai, Sasae-tsuri-komi-ashi, Uchi-mata).",
          "Ma-sutemi-waza (Tomoe-nage, Ura-nage, Sumi-gaeshi).",
          "Yoko-sutemi-waza (Yoko-gake, Yoko-guruma, Uki-waza).",
        ],
      },
      {
        title: "Technical Syllabus Defense (Mondo & Gokyo)",
        description: "Comprehensive demonstration of any throw selected by the panel from the 40 Gokyo throws.",
        tasks: [
          "Demonstrate 3 throws selected at random by the examination jury.",
          "Explain the balance breaking vectors and mechanical levers of each throw.",
          "Demonstrate 2 transitions from standing into submission.",
        ],
      },
      {
        title: "Shiai & Competitive Points (Batsugun or Points)",
        description: "Accumulation of official shiai points or competitive victory in national grading matches.",
        tasks: [
          "Minimum required wins/points against other 1st Kyu or 1st Dan candidates in official grading shiai.",
        ],
      },
      {
        title: "Coaching & Contribution to Judo",
        description: "Minimum hours of verified assistant coaching at UBa Judo Club.",
        tasks: [
          "Verified coaching log of at least 20 hours assisting junior athletes.",
        ],
      },
    ],
    randoriRequirement: {
      tachiWazaMinutes: 6,
      neWazaMinutes: 5,
      focus: "Demonstration of effortless efficiency (Seiryoku Zen'yo), composure under pressure, and mutual respect (Jita Kyoei).",
    },
    coachingSignOffRequired: true,
  },
};
