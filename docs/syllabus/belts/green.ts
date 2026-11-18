import type { BeltSyllabus } from "@/lib/types/syllabus";

export const greenBeltSyllabus: BeltSyllabus = {
  slug: "green",
  rank: "Green Belt",
  kyuRank: "3rd Kyu — Sankyu",
  color: "#2E6A49",
  accentBg: "rgba(46, 106, 73, 0.15)",
  prevBeltSlug: "orange",
  nextBeltSlug: "blue",
  summary:
    "The beginning of senior grade Judo. Introduction of sacrifice throws (Sutemi-waza e.g., Tomoe-nage), formal strangulations (Shime-waza), and the 1st Series of Nage-no-Kata (Te-waza).",
  targetSessions: 48,
  reihoAndEtiquette: {
    title: "Kata Etiquette & Maturity",
    description:
      "Green belt demands solemnity, formal Kata bowing protocols, and responsibility for the safety of junior club members.",
    elements: [
      "Strict execution of Kata bowing ceremony: Joseki greeting, Tori and Uke distance regulation (approx. 5.5 meters), and ceremonial step sequence.",
      "Serving as reliable Uke for junior athletes, taking clean breakfalls without resistance or flailing.",
      "Instant submission tapping and instant release during strangulation practice.",
    ],
  },
  ukemi: [
    {
      id: "tomoe-ukemi",
      name: "Sutemi-ukemi (High Flip Breakfall)",
      japaneseKanji: "捨身受身",
      translation: "High Arc Breakfall for Sacrifice Throws",
      category: "ukemi",
      description:
        "High-altitude rotation breakfall from sacrifice throws like Tomoe-nage and Sumi-gaeshi.",
      keyPoints: [
        "Commit completely to the forward arc without stalling or reaching down with stiff arms.",
        "Slap forcefully with both palms simultaneously upon landing.",
        "Keep the chin pinned to the collarbone.",
      ],
    },
  ],
  tachiWaza: [
    {
      id: "tomoe-nage",
      name: "Tomoe-nage",
      japaneseKanji: "巴投",
      translation: "Circular / Stomach Sacrifice Throw",
      category: "tachi-waza",
      subgroup: "ma-sutemi-waza",
      gokyoGroup: 3,
      description:
        "Tori breaks Uke's balance forward, drops their back directly onto the tatami between Uke's feet, places a foot into Uke's lower abdomen, and vaults Uke in an overhead circular arc.",
      keyPoints: [
        "Kuzushi: Strong high lifting pull forward, causing Uke to lean or take a heavy step.",
        "Tsukuri: Step deep between Uke's feet, drop your buttocks close to your heel without jumping backward.",
        "Kake: Place the sole of your foot on Uke's lower abdomen/belt level, and extend the leg upward and overhead while pulling with both sleeves.",
      ],
      commonMistakes: [
        "Jumping backward away from Uke instead of dropping directly beneath their center of gravity.",
        "Pushing Uke away rather than letting them roll overhead.",
      ],
      safetyWarnings: [
        "Never place foot higher than the belt (danger to solar plexus or ribs). Keep toes pointing outward.",
      ],
    },
    {
      id: "kata-guruma",
      name: "Kata-guruma",
      japaneseKanji: "肩車",
      translation: "Shoulder Wheel (Modern / Traditional Variations)",
      category: "tachi-waza",
      subgroup: "te-waza",
      gokyoGroup: 3,
      description:
        "Tori drops beneath Uke's center of gravity, drapes Uke across the back of their shoulders/neck, and wheels Uke off to the side.",
      keyPoints: [
        "Drop low with a deep squat or knee drop beneath Uke's hips.",
        "Lift with legs while steering with the lapel and sleeve.",
        "Dump Uke cleanly to the side.",
      ],
      commonMistakes: [
        "Bending over with straight legs, stressing the lower back.",
      ],
    },
    {
      id: "ashi-guruma",
      name: "Ashi-guruma",
      japaneseKanji: "足車",
      translation: "Leg Wheel",
      category: "tachi-waza",
      subgroup: "ashi-waza",
      gokyoGroup: 3,
      description:
        "Tori rotates Uke forward and extends an outstretched leg diagonally across Uke's knee/thigh (without touching the tatami), wheeling Uke over the leg.",
      keyPoints: [
        "Drive Uke into a circular forward motion.",
        "Extend the leg horizontally across Uke's lower thigh/knee as a spring fulcrum.",
        "Drive the upper body in a rotating circle.",
      ],
      commonMistakes: [
        "Placing the foot on the ground (which turns it into Tai-otoshi).",
      ],
    },
    {
      id: "ko-soto-gake",
      name: "Ko-soto-gake",
      japaneseKanji: "小外掛",
      translation: "Minor Outer Hook",
      category: "tachi-waza",
      subgroup: "ashi-waza",
      gokyoGroup: 3,
      description:
        "Tori hooks Uke's calf from the outside and drives Uke straight backward, anchoring Uke to the mat.",
      keyPoints: [
        "Drive Uke's weight heavily onto the target heel.",
        "Hook behind Uke's ankle/calf with your instep, keeping contact until Uke reaches the mat.",
      ],
      commonMistakes: [
        "Reaping with a kick rather than hooking and driving.",
      ],
    },
    {
      id: "harai-tsuri-komi-ashi",
      name: "Harai-tsuri-komi-ashi",
      japaneseKanji: "払釣込足",
      translation: "Lifting-Pulling Foot Sweep",
      category: "tachi-waza",
      subgroup: "ashi-waza",
      gokyoGroup: 3,
      description:
        "Tori draws Uke forward with strong high lifting hands, sweeping Uke's advancing ankle while backing away.",
      keyPoints: [
        "Lifting tension with collar hand must be immense, keeping Uke light on their feet.",
        "Sweep cleanly with the arch of the foot across the ankle.",
      ],
    },
  ],
  neWaza: [
    {
      id: "nami-juji-jime",
      name: "Nami-juji-jime",
      japaneseKanji: "並十字絞",
      translation: "Normal Cross Strangle",
      category: "ne-waza",
      subgroup: "shime-waza",
      description:
        "Tori crosses forearms in front of Uke's throat with both palms facing downward (thumbs inside the collars).",
      keyPoints: [
        "Grip deep behind Uke's neck on both sides of the collar.",
        "Wrists remain straight, blades of the forearms compressing the carotid arteries.",
        "Pull Uke towards your chest with your back muscles while expanding your elbows.",
      ],
      safetyWarnings: [
        "Release immediately upon tap. Chokes must target the carotid arteries (blood choke), not the trachea windpipe.",
      ],
    },
    {
      id: "gyaku-juji-jime",
      name: "Gyaku-juji-jime",
      japaneseKanji: "逆十字絞",
      translation: "Reverse Cross Strangle",
      category: "ne-waza",
      subgroup: "shime-waza",
      description:
        "Tori crosses forearms with both palms facing upward (four fingers inside the collars, thumbs outside).",
      keyPoints: [
        "Four fingers slide deep into the collar behind Uke's ears.",
        "Cross wrists and squeeze elbows inward toward your ribs.",
      ],
      safetyWarnings: ["Observe partner's consciousness closely at all times."],
    },
    {
      id: "okuri-eri-jime",
      name: "Okuri-eri-jime",
      japaneseKanji: "送襟絞",
      translation: "Sliding Collar Strangle",
      category: "ne-waza",
      subgroup: "shime-waza",
      description:
        "Executed from behind Uke. One hand wraps around Uke's neck taking a deep collar grip, while the other reaches under Uke's armpit to pull the opposite lapel down.",
      keyPoints: [
        "Right hand grips deep into Uke's left collar.",
        "Left hand passes under Uke's left armpit to pull down on the right lapel, removing slack.",
        "Draw your right elbow back while pushing your chest into Uke's upper spine.",
      ],
    },
    {
      id: "hadaka-jime",
      name: "Hadaka-jime",
      japaneseKanji: "裸絞",
      translation: "Naked Choke / Rear Strangle",
      category: "ne-waza",
      subgroup: "shime-waza",
      description:
        "Applied without using the judogi fabric. The radial bone of the forearm wraps around Uke's throat with hands locked.",
      keyPoints: [
        "Blade of the forearm rests across the neck, crook of the elbow under the chin.",
        "Lock hands or clasp your own shoulder, pressing your forehead into the back of Uke's head.",
      ],
      safetyWarnings: [
        "Never crush the Adam's apple. Position the elbow crook centrally.",
      ],
    },
  ],
  kata: [
    {
      name: "Nage-no-Kata (投の形)",
      set: "1st Series: Te-waza (Hand Techniques)",
      role: "Tori",
      focusDescription:
        "The first formal series of the Kodokan Throwing Kata. Performed with ceremonial precision, showing classical balance breaking and throwing control.",
      techniquesCovered: [
        "Uki-otoshi (Floating Drop)",
        "Seoi-nage (Shoulder Throw)",
        "Kata-guruma (Shoulder Wheel)",
      ],
    },
  ],
  generalAwareness: {
    vocabulary: [
      { term: "Shime-waza", kanji: "絞技", meaning: "Strangulation / choking techniques" },
      { term: "Kansetsu-waza", kanji: "関節技", meaning: "Joint locking techniques (primarily armlocks)" },
      { term: "Kata", kanji: "形", meaning: "Formal pattern / choreographed forms preserving principles" },
      { term: "Ma-sutemi-waza", kanji: "真捨身技", meaning: "Rear sacrifice throws (falling straight backward)" },
      { term: "Yoko-sutemi-waza", kanji: "横捨身技", meaning: "Side sacrifice throws (falling onto the side)" },
      { term: "Mairi", kanji: "まいり", meaning: "I surrender / I submit (spoken submission)" },
    ],
    philosophyAndHistory: [
      "The role of Kata in Judo: Kata preserves techniques that are too dangerous for free competition, and refines fundamental principles of posture, balance, and rhythm.",
      "The physiology of Shime-waza: Temporary compression of the carotid arteries reducing blood flow to the brain, inducing rapid surrender without trauma when released immediately.",
    ],
    rulesAndRefereeing: [
      "Strict prohibition of neck cranks or cervical locks (Kawazu-gake, bending head forward).",
      "Age limits for Shime-waza: In international and national rules, strangulations are introduced in the cadet category (typically 14–15 years and older).",
    ],
    hygieneAndSafety: [
      "Any judoka who loses consciousness from a choke must be placed in the recovery position immediately with legs elevated; they are medically retired from further sparring that day.",
    ],
  },
  examRequirements: {
    minimumSessions: 48,
    minimumTimeMonths: 6,
    prerequisites: [
      "Current 4th Kyu (Orange Belt).",
      "Minimum 48 verified sessions logged at Bambili dojo since orange belt.",
      "Age qualification for Shime-waza according to FECAJUDO regulations.",
    ],
    evaluationModules: [
      {
        title: "Nage-no-Kata (1st Series — Te-waza)",
        description: "Execution of the formal opening ceremony and Te-waza series as Tori.",
        tasks: [
          "Ceremonial opening bow, stepping into position.",
          "Uki-otoshi (right and left side with formal kneeling drop).",
          "Seoi-nage (right and left with continuous forward progression).",
          "Kata-guruma (right and left with classic Kata posture).",
        ],
      },
      {
        title: "Tachi-Waza Demonstration (5 Techniques)",
        description: "Demonstrate required 3rd Kyu throws in free movement.",
        tasks: [
          "Tomoe-nage (clean entry without jumping backward, overhead vault).",
          "Kata-guruma or Ashi-guruma.",
          "Ko-soto-gake (driving hook).",
          "Harai-tsuri-komi-ashi.",
        ],
      },
      {
        title: "Shime-Waza (Strangulation) Examination",
        description: "Demonstrate safety awareness and execution of 3 strangulations.",
        tasks: [
          "Nami-juji-jime and Gyaku-juji-jime against bottom guard posture.",
          "Okuri-eri-jime from the rear.",
          "Demonstrate knowledge of the recovery position for unconscious athletes.",
        ],
      },
    ],
    randoriRequirement: {
      tachiWazaMinutes: 4,
      neWazaMinutes: 3,
      focus: "Intense but composed randori demonstrating integration of sacrifice throws and immediate groundwork transitions into pins or chokes.",
    },
    coachingSignOffRequired: true,
  },
};
