import type { BeltSyllabus } from "@/lib/types/syllabus";

export const orangeBeltSyllabus: BeltSyllabus = {
  slug: "orange",
  rank: "Orange Belt",
  kyuRank: "4th Kyu — Yonkyu",
  color: "#DD7A2E",
  accentBg: "rgba(221, 122, 46, 0.15)",
  prevBeltSlug: "yellow",
  nextBeltSlug: "green",
  summary:
    "Mastering intermediate sweeping, hip sweeping mechanics (Harai-goshi), inside foot reaps (Ko-uchi-gari), and combination attacks (Renraku-waza) and counter-throws (Kaeshi-waza).",
  targetSessions: 40,
  reihoAndEtiquette: {
    title: "Etiquette & Randori Discipline",
    description:
      "Balancing vigor with safety, maintaining self-control (Jisei) during competitive exchanges, and bowing punctually.",
    elements: [
      "Respecting training partners of all weight classes and experience levels.",
      "Maintaining uniform tidiness (jacket crossed left over right, belt properly retied quickly when loosened).",
      "Showing humility in victory and composure in defeat during club mini-tournaments.",
    ],
  },
  ukemi: [
    {
      id: "zenpo-kaiten-obstacle",
      name: "Zenpo-kaiten-ukemi over Obstacle",
      japaneseKanji: "障害物越え前方回転受身",
      translation: "High / Extended Rolling Breakfall",
      category: "ukemi",
      description:
        "Rolling breakfall over an obstacle (kneeling partner or cushion) simulating being thrown with high elevation.",
      keyPoints: [
        "Jump cleanly off both feet, clearing the obstacle without grazing.",
        "Form the wheel arm and absorb landing along the diagonal of the back.",
        "Slap forcefully with palm and forearm on impact.",
      ],
      safetyWarnings: ["Ensure chin stays tucked to chest throughout flight."],
    },
  ],
  tachiWaza: [
    {
      id: "ko-uchi-gari",
      name: "Ko-uchi-gari",
      japaneseKanji: "小内刈",
      translation: "Minor Inner Reap",
      category: "tachi-waza",
      subgroup: "ashi-waza",
      gokyoGroup: 2,
      description:
        "Tori steps in and reaps Uke's advancing or weighted heel from the inside with the sole/instep of the foot.",
      keyPoints: [
        "Drive Uke's center of gravity backward-right, making the right heel heavy.",
        "Slide the bottom of your right foot flat along the mat like a broom, scooping Uke's heel.",
        "Push down and back with both hands simultaneously.",
      ],
      commonMistakes: [
        "Reaping with the toe rather than spooning with the sole.",
        "Failing to drive upper body weight into Uke.",
      ],
    },
    {
      id: "harai-goshi",
      name: "Harai-goshi",
      japaneseKanji: "払腰",
      translation: "Sweeping Hip Throw",
      category: "tachi-waza",
      subgroup: "koshi-waza",
      gokyoGroup: 2,
      description:
        "Tori pulls Uke forward onto the hip, reaches high on Uke's back/collar, and sweeps Uke's right thigh with their own right leg in a high, elegant arc.",
      keyPoints: [
        "Kuzushi: Strong high forward pull onto the toes.",
        "Tsukuri: Deep hip entry with high grip over Uke's shoulder/latissimus.",
        "Kake: Sweep the right thigh against Uke's outer thigh while driving the upper body in a rotating downward throw.",
      ],
      commonMistakes: [
        "Kicking Uke's leg without first loading Uke's weight onto the hip.",
        "Dropping the head back instead of rotating through the shoulders.",
      ],
    },
    {
      id: "uchi-mata-intro",
      name: "Uchi-mata (Introductory Entry)",
      japaneseKanji: "内股",
      translation: "Inner Thigh Throw",
      category: "tachi-waza",
      subgroup: "ashi-waza",
      gokyoGroup: 2,
      description:
        "One of the highest-scoring throws in modern Judo. Tori enters beneath Uke's center of gravity and reaps/lifts between Uke's thighs with the back of their thigh.",
      keyPoints: [
        "Keep the supporting foot planted deep between Uke's feet with knee flexible.",
        "Drive your head and chest down in a seesaw motion while lifting the inner leg high.",
        "Pull continuously with the sleeve hand across your chest.",
      ],
      commonMistakes: [
        "Lifting with the calf instead of the back of the upper thigh.",
        "Standing too far away without breaking Uke's forward balance.",
      ],
    },
    {
      id: "okuri-ashi-barai",
      name: "Okuri-ashi-barai",
      japaneseKanji: "送足払",
      translation: "Assisted / Double Foot Sweep",
      category: "tachi-waza",
      subgroup: "ashi-waza",
      gokyoGroup: 2,
      description:
        "Tori moves sideways with Uke and sweeps Uke's trailing ankle into their leading ankle, sweeping both feet clean off the tatami.",
      keyPoints: [
        "Coordinate sideways side-stepping rhythm with Uke.",
        "Sweep with the sole of the foot just as Uke steps their feet together.",
        "Use both hands to lift and steer Uke in an arc.",
      ],
      commonMistakes: [
        "Sweeping when Uke's feet are spread wide apart.",
        "Kicking instead of a smooth arching sweep.",
      ],
    },
    {
      id: "sasae-tsuri-komi-ashi",
      name: "Sasae-tsuri-komi-ashi",
      japaneseKanji: "支釣込足",
      translation: "Propping-Drawing Ankle Throw",
      category: "tachi-waza",
      subgroup: "ashi-waza",
      gokyoGroup: 1,
      description:
        "Tori steps back diagonally, draws Uke forward with high collar and sleeve tension, and props the sole of the foot against Uke's advancing ankle.",
      keyPoints: [
        "Create maximum tension with circular backward stepping.",
        "Place the sole of the foot against Uke's ankle as a firm, non-kicking post.",
        "Drive the arms in a strong steering wheel circle.",
      ],
      commonMistakes: [
        "Kicking the ankle instead of placing a stationary prop.",
        "Failing to maintain the lifting-drawing action with the hands.",
      ],
    },
  ],
  neWaza: [
    {
      id: "kata-gatame",
      name: "Kata-gatame",
      japaneseKanji: "肩固",
      translation: "Shoulder Hold",
      category: "ne-waza",
      subgroup: "osaekomi-waza",
      description:
        "Tori traps Uke's arm across Uke's neck, locking their hands in a gable grip or bicep tie while sprawling beside Uke.",
      keyPoints: [
        "Trap Uke's right arm across their own neck with your head and shoulder.",
        "Lock your hands tightly together, driving your neck and cheek into Uke's arm.",
        "Sprawl low to the side at a 45-degree angle, driving into Uke.",
      ],
      commonMistakes: [
        "Leaving space between your neck and Uke's trapped arm, allowing them to slip out.",
      ],
    },
    {
      id: "guard-pass-basic",
      name: "Basic Guard Pass (Do-jime Escape to Kesa)",
      japaneseKanji: "足がらみ崩し",
      translation: "Passing the Closed Guard into Pin",
      category: "ne-waza",
      subgroup: "turnovers",
      description:
        "When trapped between Uke's legs (closed guard), Tori establishes posture, breaks the ankle lock, and slides through to secure a pin.",
      keyPoints: [
        "Maintain upright spine posture with hands anchored on Uke's belt/hips.",
        "Insert a knee in the center of Uke's tailbone and push Uke's knee down with elbow/hand.",
        "Pass the opened leg immediately and drop heavy chest-to-chest weight into Yoko-shiho-gatame.",
      ],
      commonMistakes: [
        "Reaching forward with both hands inside the guard, leaving yourself vulnerable to triangles or armlocks.",
      ],
    },
  ],
  renrakuKaeshiWaza: [
    {
      id: "kaeshi-osoto-gaeshi",
      name: "O-soto-gaeshi",
      japaneseKanji: "大外返",
      translation: "Counter to Major Outer Reap",
      category: "kaeshi-waza",
      description:
        "As Uke attacks with O-soto-gari, Tori absorbs the reap by flexing the supporting knee, steps around Uke's balance, and reaps Uke backward with counter O-soto.",
      keyPoints: [
        "Anticipate Uke's entry and do not lean back.",
        "Drop weight into your base, clamp Uke's body, and reap their supporting leg.",
      ],
    },
    {
      id: "renraku-kouchi-seoinage",
      name: "Ko-uchi-gari → Seoi-nage",
      japaneseKanji: "小内刈 → 背負投",
      translation: "Minor Inner Reap to Shoulder Throw Combination",
      category: "renraku-waza",
      description:
        "Tori attacks with Ko-uchi-gari. As Uke pulls their leg backward and leans upper body forward, Tori immediately spins into Seoi-nage.",
      keyPoints: [
        "A classic rear-to-front combination exploiting Uke's forward momentum.",
      ],
    },
  ],
  generalAwareness: {
    vocabulary: [
      { term: "Shido", kanji: "指導", meaning: "Slight infringement / penalty (3 Shidos = Hansoku-make)" },
      { term: "Hansoku-make", kanji: "反則負け", meaning: "Disqualification / grave infringement" },
      { term: "Renraku-waza", kanji: "連絡技", meaning: "Combination / sequential techniques" },
      { term: "Kaeshi-waza", kanji: "返し技", meaning: "Counter / reversal techniques" },
      { term: "Kumi-kata", kanji: "組み方", meaning: "Grip fighting methods and forms" },
      { term: "Hikite", kanji: "引き手", meaning: "Pulling hand (sleeve grip)" },
      { term: "Tsurite", kanji: "釣り手", meaning: "Lifting / fishing hand (lapel grip)" },
      { term: "Shintai", kanji: "進退", meaning: "Proper mat footwork (Tsugi-ashi, Ayumi-ashi)" },
    ],
    philosophyAndHistory: [
      "The Moral Code of Judo: Courtesy (Reigi), Courage (Yuki), Sincerity (Makoto), Honor (Meiyo), Modesty (Kensen), Respect (Sonkei), Self-control (Jisei), Friendship (Yujo).",
      "Kano's synthesis of ancient Jujutsu schools: Kito-ryu (focusing on throwing and balance) and Tenjin Shinyo-ryu (focusing on striking and grappling).",
    ],
    rulesAndRefereeing: [
      "Penalties for defensive stalling: Pushing opponent out of the contest area without attacking, defensive posturing with stiff arms for > 5 seconds.",
      "Three Shidos accumulate to Hansoku-make (loss of the contest).",
    ],
    hygieneAndSafety: [
      "Proper nail care and personal grooming are scrutinized at official weigh-ins.",
      "Hydration and concussion awareness: reporting any dizziness immediately to coaches.",
    ],
  },
  examRequirements: {
    minimumSessions: 40,
    minimumTimeMonths: 4,
    prerequisites: [
      "Current 5th Kyu (Yellow Belt).",
      "Minimum 40 verified sessions logged at Bambili dojo since yellow belt.",
      "Demonstrated ability to perform combination throws in moving drills.",
    ],
    evaluationModules: [
      {
        title: "Breakfall Mastery",
        description: "Execution of Mae-mawari-ukemi over a kneeling obstacle and high breakfalls.",
        tasks: [
          "Mae-mawari-ukemi over a training obstacle smoothly from both sides.",
          "High Ushiro-ukemi from standing throw.",
        ],
      },
      {
        title: "Tachi-Waza Examination (5 Techniques)",
        description: "Demonstrate 4 new Orange belt throws with flowing movement.",
        tasks: [
          "Harai-goshi (clean hip loading and sweeping leg arc).",
          "Ko-uchi-gari (sliding foot sweep with upper body drive).",
          "Okuri-ashi-barai (sideways timing sweep of both ankles).",
          "Sasae-tsuri-komi-ashi or Uchi-mata entry.",
          "Demonstrate 1 combination: Ko-uchi-gari to Seoi-nage.",
          "Demonstrate 1 counter: O-soto-gaeshi.",
        ],
      },
      {
        title: "Ne-Waza Holds & Guard Passing",
        description: "Holding pins and demonstrating guard pass mechanics.",
        tasks: [
          "Kata-gatame (holding for 15 seconds against resistance).",
          "Demonstrate passing the closed guard into an established hold-down.",
          "Demonstrate bridge-and-roll escape from Tate-shiho-gatame.",
        ],
      },
      {
        title: "Judo Moral Code & Rules Oral Exam",
        description: "Reciting components of the Moral Code and penalty rules.",
        tasks: [
          "Name at least 4 values of the Judo Moral Code.",
          "Explain the penalty structure: Shido and Hansoku-make.",
          "Explain the roles of Hikite and Tsurite in creating Kuzushi.",
        ],
      },
    ],
    randoriRequirement: {
      tachiWazaMinutes: 3,
      neWazaMinutes: 3,
      focus: "Continuous randori emphasizing combination attacks (Renraku-waza) and transitions from throw to groundwork.",
    },
    coachingSignOffRequired: true,
  },
};
