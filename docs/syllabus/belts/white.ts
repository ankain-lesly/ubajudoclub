import type { BeltSyllabus } from "@/lib/types/syllabus";

export const whiteBeltSyllabus: BeltSyllabus = {
  slug: "white",
  rank: "White Belt",
  kyuRank: "6th Kyu — Rokkyu",
  color: "#F0E7D6",
  accentBg: "rgba(240, 231, 214, 0.15)",
  nextBeltSlug: "yellow",
  summary:
    "The beginning of the Judo journey. The entire focus is learning to fall safely (ukemi), basic body posture (shisei), mat manners (reiho), and foundational throws and pins.",
  targetSessions: 24,
  reihoAndEtiquette: {
    title: "Reiho — Dojo Manners & Rituals",
    description:
      "Judo begins and ends with respect. Reiho is not mere ceremony; it ensures safety, discipline, and shared responsibility on the tatami.",
    elements: [
      "Ritsurei (standing bow at 30 degrees, eyes lowered calmly) upon entering and stepping off the tatami.",
      "Zarei (kneeling bow in seiza posture) at the opening and closing of every practice session.",
      "Properly folding the judogi and tying the obi (belt) with a secure, flat reef knot.",
      "Observing silence when the coach explains a technique and maintaining respectful posture (no slouching or leaning against walls).",
      "Personal hygiene: clean gi, trimmed fingernails and toenails, no jewelry.",
    ],
  },
  ukemi: [
    {
      id: "ushiro-ukemi",
      name: "Ushiro-ukemi",
      japaneseKanji: "後ろ受身",
      translation: "Rear / Backward Breakfall",
      category: "ukemi",
      description:
        "The essential survival breakfall for all backward falls. Protects the back of the head and distributes impact evenly across the arms and torso.",
      keyPoints: [
        "Chin glued tightly to chest, eyes focused on your belt/obi.",
        "Round the back like a ball to roll smoothly without hard spinal impact.",
        "Both arms slap the tatami firmly at approximately 30° to 45° from the body with open palms.",
        "Never post hands backward with locked wrists or elbows.",
      ],
      commonMistakes: [
        "Letting the head touch the mat.",
        "Slapping too wide (90°) or too close to the body, straining shoulder joints.",
        "Extending stiff arms backward to catch yourself.",
      ],
      safetyWarnings: [
        "Strictly tuck the chin to prevent concussion from head whip.",
      ],
    },
    {
      id: "yoko-ukemi",
      name: "Yoko-ukemi",
      japaneseKanji: "横受身",
      translation: "Side Breakfall",
      category: "ukemi",
      description:
        "Executed when thrown sideways or diagonally. Protects the hips, ribs, and head.",
      keyPoints: [
        "Turn onto the side of the body; do not land flat on the spine or shoulder joint.",
        "Slap the mat forcefully with the ground-side arm at 30° to 45°.",
        "The ground-side leg remains extended along the edge of the foot; the other foot plants on the mat with knee bent.",
        "Keep the head lifted and looking towards the belt knot.",
      ],
      commonMistakes: [
        "Crossing legs or colliding knees on impact.",
        "Landing flat on the hip bone without absorbing force through the slapping arm.",
      ],
    },
    {
      id: "mae-ukemi",
      name: "Mae-ukemi",
      japaneseKanji: "前受身",
      translation: "Forward Breakfall (from knees and standing)",
      category: "ukemi",
      description:
        "Used when propelled directly face-forward to safeguard face, chest, and knees.",
      keyPoints: [
        "Absorb impact simultaneously on both forearms and palms forming an inverted triangle.",
        "Turn head slightly to one side to ensure the nose and jaw avoid contact.",
        "Keep the chest off the mat by bracing the core; knees lifted off the mat when performed from standing.",
      ],
      commonMistakes: [
        "Landing on flat palms with straight wrists.",
        "Letting stomach or hips sag onto the mat.",
      ],
    },
  ],
  tachiWaza: [
    {
      id: "o-soto-gari",
      name: "O-soto-gari",
      japaneseKanji: "大外刈",
      translation: "Major Outer Reap",
      category: "tachi-waza",
      subgroup: "ashi-waza",
      gokyoGroup: 1,
      description:
        "The cornerstone throw of Judo. Tori breaks Uke's balance to the rear-right corner, steps in deeply, and reaps Uke's supporting leg with the back of their own calf.",
      keyPoints: [
        "Kuzushi: Strong pull with the hikite (sleeve hand) while tsurite (collar hand) drives Uke's weight directly onto their rear right heel.",
        "Tsukuri: Tori steps alongside Uke's foot, chest making tight contact with Uke's chest.",
        "Kake: Point the reaping toes like a dancer, swing the leg through and reap high through the back of Uke's knee while bowing forward.",
      ],
      commonMistakes: [
        "Stepping too far away, creating a gap between chests.",
        "Reaping with a bent leg or flat foot.",
        "Leaning back during the reap, leaving yourself vulnerable to O-soto-gaeshi.",
      ],
    },
    {
      id: "de-ashi-barai",
      name: "De-ashi-barai",
      japaneseKanji: "出足払",
      translation: "Forward Foot Sweep",
      category: "tachi-waza",
      subgroup: "ashi-waza",
      gokyoGroup: 1,
      description:
        "A timing throw where Tori sweeps Uke's advancing foot just as weight is about to transfer onto it.",
      keyPoints: [
        "Timing is paramount: sweep the moment Uke advances the foot, before heel pressure sets into the tatami.",
        "Curve the arch of your foot like a spoon and sweep Uke's ankle across their line of motion.",
        "Coordinate the hands in a circular steering wheel motion.",
      ],
      commonMistakes: [
        "Kicking the ankle with toes or shin rather than a sweeping curve of the sole.",
        "Attempting to sweep after Uke's full weight has anchored.",
      ],
    },
    {
      id: "hiza-guruma",
      name: "Hiza-guruma",
      japaneseKanji: "膝車",
      translation: "Knee Wheel",
      category: "tachi-waza",
      subgroup: "ashi-waza",
      gokyoGroup: 1,
      description:
        "Tori draws Uke forward in a circular trajectory and blocks Uke's knee with the sole of the foot, causing Uke to pivot wheel-like over the obstruction.",
      keyPoints: [
        "Draw Uke into a stepping turn with both hands.",
        "Place the bottom of the foot lightly just below Uke's knee cap as a fulcrum — do not kick.",
        "Steer Uke around the blocked knee in a downward spiral.",
      ],
      commonMistakes: [
        "Kicking Uke's knee joint.",
        "Failing to create circular momentum before blocking.",
      ],
      safetyWarnings: [
        "Never push directly against the front of the knee joint. Use the foot as a propping fulcrum.",
      ],
    },
    {
      id: "uki-goshi",
      name: "Uki-goshi",
      japaneseKanji: "浮腰",
      translation: "Floating Hip Throw",
      category: "tachi-waza",
      subgroup: "koshi-waza",
      gokyoGroup: 1,
      description:
        "The historical foundation hip throw created by Jigoro Kano. Tori encircles Uke's waist and twists Uke across the hip with half-hip entry.",
      keyPoints: [
        "Slip your collar arm around Uke's waist, pulling Uke tight against your hip.",
        "Insert only half your hip into Uke's center line (not a deep bent-knee lift like O-goshi).",
        "Twist the upper body sharply while sweeping Uke across the pelvis.",
      ],
      commonMistakes: [
        "Squatting deeply like O-goshi instead of maintaining upright twisting rotational torque.",
      ],
    },
    {
      id: "ippon-seoi-nage",
      name: "Ippon-seoi-nage (Basic Entry)",
      japaneseKanji: "一本背負投",
      translation: "One-Arm Shoulder Throw",
      category: "tachi-waza",
      subgroup: "te-waza",
      gokyoGroup: 1,
      description:
        "Tori pulls Uke forward onto their back, clamps Uke's right arm tightly into their armpit/elbow bend, and throws over the right shoulder.",
      keyPoints: [
        "Kuzushi: Strong high lifting pull with sleeve hand.",
        "Tsukuri: Step right foot inside Uke's right foot, pivot 180°, clamping Uke's tricep tight in your elbow crook.",
        "Kake: Bend knees so hips are slightly below Uke's belt, then spring upward and bow forward.",
      ],
      commonMistakes: [
        "Leaving space between Tori's back and Uke's chest.",
        "Bending forward at the waist before loading Uke onto the back.",
      ],
    },
  ],
  neWaza: [
    {
      id: "hon-kesa-gatame",
      name: "Hon-kesa-gatame",
      japaneseKanji: "本袈裟固",
      translation: "Basic Scarf Hold",
      category: "ne-waza",
      subgroup: "osaekomi-waza",
      description:
        "The foundational pin in Judo. Tori sits beside Uke's right ribs, encircle Uke's neck with right arm, and clamps Uke's right arm under Tori's left armpit.",
      keyPoints: [
        "Sprawl legs wide: right leg forward, left leg tucked back for maximum base.",
        "Keep hips low and heavy; press your side firmly into Uke's chest.",
        "Control Uke's right arm tightly against your torso; never let Uke extract the elbow.",
        "Keep your head lowered to avoid head-push escapes.",
      ],
      commonMistakes: [
        "Sitting on Uke rather than anchoring into the tatami with heavy hips.",
        "Allowing Uke to bridge and get an underhook on your back.",
      ],
    },
    {
      id: "kuzure-kesa-gatame",
      name: "Kuzure-kesa-gatame",
      japaneseKanji: "崩袈裟固",
      translation: "Modified Scarf Hold",
      category: "ne-waza",
      subgroup: "osaekomi-waza",
      description:
        "A variation where instead of encircling Uke's head, Tori reaches under Uke's left armpit to grip the collar or belt, giving greater chest-to-chest control.",
      keyPoints: [
        "Underhook Uke's far arm to prevent them from turning into you.",
        "Drive weight through your sternum into Uke's upper chest.",
      ],
      commonMistakes: ["Failing to trap the near arm tightly."],
    },
    {
      id: "yoko-shiho-gatame",
      name: "Yoko-shiho-gatame",
      japaneseKanji: "横四方固",
      translation: "Side Four-Corner Hold",
      category: "ne-waza",
      subgroup: "osaekomi-waza",
      description:
        "Tori positions perpendicular to Uke's body across the chest, reaching between Uke's legs and under the neck.",
      keyPoints: [
        "Right arm passes through Uke's legs to grip the belt or outer thigh pants.",
        "Left arm controls under Uke's neck, gripping the far collar.",
        "Spread knees wide, dig toes into the tatami, and keep hips lower than shoulders.",
      ],
      commonMistakes: [
        "Raising knees or hips too high, allowing Uke to roll you over.",
      ],
    },
    {
      id: "ebi-escapes",
      name: "Ebi (Shrimping Escapes)",
      japaneseKanji: "海老",
      translation: "Shrimping & Bridging Escapes",
      category: "ne-waza",
      subgroup: "escapes",
      description:
        "Essential body movements to create space and break out of pinning techniques.",
      keyPoints: [
        "Turn onto your side; do not attempt to escape while lying flat on your back.",
        "Bridge (Upa) forcefully on planted feet to create an initial wedge of space.",
        "Kick hips backward (Ebi) and slide knees between yourself and Tori to recover guard.",
      ],
      commonMistakes: [
        "Pushing with straight arms against Tori's chest (straining elbows).",
        "Trying to escape while remaining flat on both shoulder blades.",
      ],
    },
  ],
  generalAwareness: {
    vocabulary: [
      { term: "Dojo", kanji: "道場", meaning: "Place of the way (training hall)" },
      { term: "Tatami", kanji: "畳", meaning: "Judo training mats" },
      { term: "Judogi", kanji: "柔道着", meaning: "Judo uniform (jacket, pants, belt)" },
      { term: "Obi", kanji: "帯", meaning: "Judo belt" },
      { term: "Sensei", kanji: "先生", meaning: "Teacher / instructor" },
      { term: "Tori", kanji: "取り", meaning: "The person who executes the technique" },
      { term: "Uke", kanji: "受け", meaning: "The person who receives the technique and breaks fall" },
      { term: "Hajime", kanji: "始め", meaning: "Begin / Start" },
      { term: "Matte", kanji: "待て", meaning: "Stop / Pause" },
      { term: "Rei", kanji: "礼", meaning: "Bow / Respect" },
    ],
    philosophyAndHistory: [
      "Judo was founded in 1882 in Tokyo, Japan, by Professor Jigoro Kano at the Kodokan Dojo.",
      "The word 'Judo' translates to 'The Gentle Way' or 'The Way of Yielding' (Ju = gentle/supple, Do = path/way).",
      "Two fundamental philosophical tenets: 'Seiryoku Zen'yo' (Maximum Efficiency with Minimum Effort) and 'Jita Kyoei' (Mutual Welfare and Benefit).",
    ],
    rulesAndRefereeing: [
      "When the referee calls 'Matte', all action stops immediately. Disengage safely and return to starting positions.",
      "Never execute any lock or choke against another beginner.",
      "Tapping out: Tap your partner or the mat twice (or shout 'Mairi') to submit immediately. When your partner taps, release instantly.",
    ],
    hygieneAndSafety: [
      "Clean judogi, clean bare feet before stepping on the tatami.",
      "Finger and toe nails clipped short to prevent cutting training partners.",
      "Zori (slippers/sandals) must always be worn when walking off the tatami.",
    ],
  },
  examRequirements: {
    minimumSessions: 24,
    minimumTimeMonths: 3,
    prerequisites: [
      "Official registration with UBa Judo Club and university sports card.",
      "Minimum 24 logged training sessions at Bambili dojo.",
      "Consistent observance of dojo etiquette and attendance discipline.",
    ],
    evaluationModules: [
      {
        title: "Reiho & Etiquette Assessment",
        description: "Execution of standing and kneeling bows, judogi folding and belt tying.",
        tasks: [
          "Demonstrate Ritsurei and Zarei with proper posture.",
          "Tie the obi correctly without assistance in under 30 seconds.",
          "Fold the judogi into a neat, compact bundle.",
        ],
      },
      {
        title: "Ukemi Proficiency (Safety Mandatory)",
        description: "Candidate must demonstrate calm, safe falling mechanics without head contact.",
        tasks: [
          "3 repetitions of Ushiro-ukemi from standing without head touching the mat.",
          "3 repetitions of Yoko-ukemi (left and right) with proper arm slap.",
          "Mae-ukemi from knees or standing with stable forearm absorption.",
        ],
      },
      {
        title: "Tachi-Waza Demonstration",
        description: "Static and moving demonstration of 3 required standing techniques.",
        tasks: [
          "O-soto-gari (clean balance break, chest contact, high reap).",
          "De-ashi-barai (timing the advancing foot).",
          "One choice between Uki-goshi or Ippon-seoi-nage entry.",
        ],
      },
      {
        title: "Ne-Waza Hold-Down & Escape",
        description: "Demonstration of pins and basic escape movement.",
        tasks: [
          "Hon-kesa-gatame (holding for 15 seconds against moderate resistance).",
          "Yoko-shiho-gatame or Kuzure-kesa-gatame.",
          "Demonstrate shrimping (ebi) bridge to create space from the bottom.",
        ],
      },
    ],
    randoriRequirement: {
      tachiWazaMinutes: 2,
      neWazaMinutes: 2,
      focus: "Light French-style Yaku-soku-geiko (cooperative movement, looking for opportunities without stiff arms or aggression).",
    },
    coachingSignOffRequired: true,
  },
};
