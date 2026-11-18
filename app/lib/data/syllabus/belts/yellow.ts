import type { BeltSyllabus } from "@/lib/types/syllabus";

export const yellowBeltSyllabus: BeltSyllabus = {
  slug: "yellow",
  rank: "Yellow Belt",
  kyuRank: "5th Kyu — Gokyu",
  color: "#E4B62B",
  accentBg: "rgba(228, 182, 43, 0.15)",
  prevBeltSlug: "white",
  nextBeltSlug: "orange",
  summary:
    "Transitioning from mere survival to dynamic movement. Introducing rolling breakfalls (Mae-mawari-ukemi), directional balance breaking (Happo-no-Kuzushi), inside leg reaps, and turtle turnover entries.",
  targetSessions: 32,
  reihoAndEtiquette: {
    title: "Etiquette & Grip Protocol",
    description:
      "Respecting the partner during higher-paced randori and mastering standard symmetrical kumikata (lapel & sleeve).",
    elements: [
      "Kumikata etiquette: engaging with standard fundamental sleeve and lapel grips without pulling fingers or twisting the gi fabric around wrists.",
      "Assisting lower grade white belts during warmups and ukemi drills.",
      "Acknowledging calls by coaches or referees promptly and bowing respectfully to all sparring partners before and after randori.",
    ],
  },
  ukemi: [
    {
      id: "mae-mawari-ukemi",
      name: "Mae-mawari-ukemi (Zenpo-kaiten-ukemi)",
      japaneseKanji: "前回り受身 / 前方回転受身",
      translation: "Forward Rolling Breakfall (Left and Right)",
      category: "ukemi",
      description:
        "The premier rolling breakfall indispensable for forward throwing techniques (Seoi-nage, Tai-otoshi). Absorbs momentum by rolling diagonally across the back from shoulder to opposite hip.",
      keyPoints: [
        "Form a curved wheel with the leading arm (fingers pointing back between legs).",
        "Tuck chin towards opposite shoulder so the head never touches the tatami.",
        "Roll diagonally across the back: from leading shoulder blade to trailing hip.",
        "Finish in side breakfall (Yoko-ukemi) slapping firmly with trailing arm, or pop smoothly back up onto feet.",
      ],
      commonMistakes: [
        "Collapsing the leading arm and bumping the shoulder point hard.",
        "Rolling straight down the spine instead of diagonally.",
        "Letting head touch or bounce on the tatami.",
      ],
      safetyWarnings: [
        "Head must remain tucked throughout rotation to safeguard cervical spine.",
      ],
    },
  ],
  tachiWaza: [
    {
      id: "o-uchi-gari",
      name: "O-uchi-gari",
      japaneseKanji: "大内刈",
      translation: "Major Inner Reap",
      category: "tachi-waza",
      subgroup: "ashi-waza",
      gokyoGroup: 1,
      description:
        "Tori opens Uke's stance with circular backward-diagonal pressure and hooks Uke's inner calf/thigh with their own leg in a wide sweeping arc.",
      keyPoints: [
        "Kuzushi: Drive Uke backwards onto their heels, spreading their legs into an open posture.",
        "Tsukuri: Step deep with supporting foot between Uke's feet, aligning your sternum with Uke's center.",
        "Kake: Hook behind Uke's calf with your instep/calf, driving forward and down like rowing an oar.",
      ],
      commonMistakes: [
        "Reaping with a straight leg without driving Uke's balance backwards.",
        "Leaving head back, resulting in Uke falling on top of you.",
      ],
    },
    {
      id: "ko-soto-gari",
      name: "Ko-soto-gari",
      japaneseKanji: "小外刈",
      translation: "Minor Outer Reap",
      category: "tachi-waza",
      subgroup: "ashi-waza",
      gokyoGroup: 2,
      description:
        "Tori reaps the heel of Uke's retreating or weighted foot with the sole of their foot from the outside.",
      keyPoints: [
        "Pull downward with sleeve hand while collar hand pushes Uke onto the target heel.",
        "Cup the sole of the foot to scoop Uke's heel in the direction their toes are pointing.",
        "Execute swiftly as Uke steps backward.",
      ],
      commonMistakes: [
        "Reaping the upper calf instead of scooping the heel from behind.",
      ],
    },
    {
      id: "koshi-guruma",
      name: "Koshi-guruma",
      japaneseKanji: "腰車",
      translation: "Hip Wheel",
      category: "tachi-waza",
      subgroup: "koshi-waza",
      gokyoGroup: 2,
      description:
        "Tori wraps an arm around the back of Uke's neck, steps deep across Uke's hips, and wheels Uke over the pelvis.",
      keyPoints: [
        "Encircle Uke's neck securely while controlling the sleeve hand.",
        "Place your hips lower than Uke's belt, bent at the knees.",
        "Wheel Uke forward in a smooth circular arc over the hip.",
      ],
      commonMistakes: [
        "Cranking Uke's neck backward rather than rotating the hips.",
        "Failing to bend knees, creating an obstacle rather than a wheeling fulcrum.",
      ],
      safetyWarnings: [
        "Do not wrench the neck downwards violently. The throw is powered by hip rotation.",
      ],
    },
    {
      id: "tai-otoshi",
      name: "Tai-otoshi",
      japaneseKanji: "体落",
      translation: "Body Drop",
      category: "tachi-waza",
      subgroup: "te-waza",
      gokyoGroup: 2,
      description:
        "A devastating hand throw where Tori pulls Uke forward over a planted, outstretched leg that blocks Uke's shin, without using hip lift.",
      keyPoints: [
        "Kuzushi: Strong two-handed forward pull, forcing Uke onto the tips of their toes.",
        "Tsukuri: Pivot 180° and extend the right leg across Uke's right shin/ankle, ball of the foot gripping the mat.",
        "Kake: Powerful rotational hand drive (steering wheel motion) dropping Uke forward over the leg.",
      ],
      commonMistakes: [
        "Leaning your hip into Uke (turning it into a bad hip throw).",
        "Lifting the leg off the ground (Tai-otoshi requires the foot planted on the mat).",
      ],
      safetyWarnings: [
        "Never block with the side of your knee bent backward — keep the leg active with the foot planted to protect joints.",
      ],
    },
    {
      id: "tsuri-komi-goshi",
      name: "Tsuri-komi-goshi",
      japaneseKanji: "釣込腰",
      translation: "Lifting-Pulling Hip Throw",
      category: "tachi-waza",
      subgroup: "koshi-waza",
      gokyoGroup: 1,
      description:
        "Tori grips high on Uke's collar, lifts and pulls Uke onto their toes, then enters deeply beneath Uke's center of gravity with straight back and bent knees.",
      keyPoints: [
        "Tsuri-te (collar hand) lifts high like holding an umbrella in a storm.",
        "Drop hips low beneath Uke's belt level.",
        "Spring upward through the legs while pulling with sleeve hand.",
      ],
      commonMistakes: [
        "Bending forward at the waist instead of squatting with an upright torso.",
      ],
    },
  ],
  neWaza: [
    {
      id: "kami-shiho-gatame",
      name: "Kami-shiho-gatame",
      japaneseKanji: "上四方固",
      translation: "Upper Four-Corner Hold",
      category: "ne-waza",
      subgroup: "osaekomi-waza",
      description:
        "Tori controls Uke from behind Uke's head, reaching beneath Uke's shoulders to grip both sides of the belt.",
      keyPoints: [
        "Slide both arms under Uke's shoulders to take firm grips on the belt.",
        "Press your sternum directly down onto Uke's chest, chin tucked.",
        "Sprawl legs straight back with toes dug in, or knees spread wide to resist rolling.",
      ],
      commonMistakes: [
        "Lifting chest up, allowing Uke to bridge and insert an arm or roll you sideways.",
      ],
    },
    {
      id: "tate-shiho-gatame",
      name: "Tate-shiho-gatame",
      japaneseKanji: "縦四方固",
      translation: "Straight Four-Corner Hold (Full Mount)",
      category: "ne-waza",
      subgroup: "osaekomi-waza",
      description:
        "Tori mounts straddling Uke's torso lengthwise, locking Uke's hips and upper body.",
      keyPoints: [
        "Hook feet under Uke's thighs or cross ankles under Uke's hips (grapevine).",
        "Control Uke's head with one arm around the neck, the other posted out for base.",
        "Keep your weight heavy through the pelvis.",
      ],
      commonMistakes: [
        "Sitting too high up towards Uke's head without base, making yourself easy to buck off.",
      ],
    },
    {
      id: "turtle-turnover-basic",
      name: "Basic Turtle Turnover (Arm & Collar)",
      japaneseKanji: "亀返し",
      translation: "Turnover against Defensive Turtle Posture",
      category: "ne-waza",
      subgroup: "turnovers",
      description:
        "When Uke curls into a defensive four-point / turtle stance, Tori breaks down the posture into a pinning hold.",
      keyPoints: [
        "Reach under Uke's armpit to feed the far lapel into your grip.",
        "Use your hip and leg as a wedge against Uke's side.",
        "Roll Uke over the trapped shoulder directly into Kuzure-kesa-gatame or Yoko-shiho-gatame.",
      ],
      commonMistakes: [
        "Reaching carelessly over Uke's head and getting rolled over yourself.",
      ],
    },
  ],
  renrakuKaeshiWaza: [
    {
      id: "renraku-ouchi-taiotoshi",
      name: "O-uchi-gari → Tai-otoshi",
      japaneseKanji: "大内刈 → 体落",
      translation: "Major Inner Reap to Body Drop Combination",
      category: "renraku-waza",
      description:
        "Tori attacks with O-uchi-gari. As Uke pulls their leg back and leans forward to avoid the reap, Tori spins into Tai-otoshi.",
      keyPoints: [
        "The first attack must be genuine to provoke Uke's forward defensive reaction.",
        "Spin seamlessly without pausing between attacks.",
      ],
    },
    {
      id: "renraku-deashi-osotogari",
      name: "De-ashi-barai → O-soto-gari",
      japaneseKanji: "出足払 → 大外刈",
      translation: "Foot Sweep to Major Outer Reap Combination",
      category: "renraku-waza",
      description:
        "Tori feints De-ashi-barai to make Uke step heavily onto the trailing leg, immediately following through with deep O-soto-gari.",
      keyPoints: [
        "Timing: Capitalize on Uke's sudden weight transfer onto their heel.",
      ],
    },
  ],
  generalAwareness: {
    vocabulary: [
      { term: "Ippon", kanji: "一本", meaning: "Full point (instant victory)" },
      { term: "Waza-ari", kanji: "技あり", meaning: "Half point (two Waza-ari make Ippon: Waza-ari awasete Ippon)" },
      { term: "Osaekomi", kanji: "抑え込み", meaning: "Hold-down is active (timer running)" },
      { term: "Toketa", kanji: "解けた", meaning: "Hold-down is broken" },
      { term: "Sono-mama", kanji: "そのまま", meaning: "Freeze / Do not move (referee command in ne-waza)" },
      { term: "Yoshi", kanji: "よし", meaning: "Continue / Resume after Sono-mama" },
      { term: "Kuzushi", kanji: "崩し", meaning: "Balance breaking (the first principle of throwing)" },
      { term: "Tsukuri", kanji: "作り", meaning: "Fitting into the technique / positioning" },
      { term: "Kake", kanji: "掛け", meaning: "Execution / finishing the throw" },
      { term: "Randori", kanji: "乱取り", meaning: "Free practice / sparring" },
    ],
    philosophyAndHistory: [
      "Happo-no-Kuzushi: The eight directions of unbalancing in Judo (front, back, left, right, and four 45-degree diagonals).",
      "Action-Reaction principle: Every throw exploits the natural motion or defensive reaction of the opponent.",
      "The Gokyo-no-Waza: The traditional syllabus of 40 throws codified by the Kodokan in 1895 and revised in 1920.",
    ],
    rulesAndRefereeing: [
      "Understanding competition scoring: Ippon ends the contest immediately (requires speed, force, landing largely on the back, and continuous control).",
      "Osaekomi durations: 10 seconds = Waza-ari; 20 seconds = Ippon.",
      "Illegal actions: Grabbing below the belt in standing posture, gouging eyes, or kicking.",
    ],
    hygieneAndSafety: [
      "Controlling Uke's descent: Never drop full bodyweight recklessly onto Uke's ribs during training.",
      "Never pull Uke's head directly into the mat during Koshi-guruma.",
    ],
  },
  examRequirements: {
    minimumSessions: 32,
    minimumTimeMonths: 4,
    prerequisites: [
      "Current 6th Kyu (White Belt) registered member.",
      "Minimum 32 verified session attendances since white belt.",
      "Coach endorsement of safe falling mechanics in dynamic randori.",
    ],
    evaluationModules: [
      {
        title: "Dynamic Ukemi Test",
        description: "Rolling breakfall test from both sides.",
        tasks: [
          "Mae-mawari-ukemi (right and left side) demonstrating smooth recovery to standing.",
          "High Ushiro-ukemi demonstrating solid chin tuck and double arm slap.",
        ],
      },
      {
        title: "Tachi-Waza Examination (5 Techniques)",
        description: "Demonstrate 4 new Yellow belt throws and 1 White belt throw with proper Kuzushi, Tsukuri, and Kake.",
        tasks: [
          "O-uchi-gari (demonstrating proper leg hook and drive).",
          "Ko-soto-gari (timing the retreating heel).",
          "Tai-otoshi (clear hand pull and planted blocking leg).",
          "Koshi-guruma or Tsuri-komi-goshi.",
          "One combination: O-uchi-gari to Tai-otoshi OR De-ashi-barai to O-soto-gari.",
        ],
      },
      {
        title: "Ne-Waza Holds & Transitions",
        description: "Demonstrate pinning controls and one turnover against turtle defense.",
        tasks: [
          "Kami-shiho-gatame and Tate-shiho-gatame (holding for 15 seconds each).",
          "Transition smoothly from Hon-kesa-gatame to Kuzure-kesa-gatame without losing chest pressure.",
          "One effective turnover against an opponent in turtle posture.",
        ],
      },
      {
        title: "Theory & Terminology",
        description: "Oral quiz on Judo referee terminology and principles.",
        tasks: [
          "Explain the 3 phases of a throw (Kuzushi, Tsukuri, Kake).",
          "Explain what Happo-no-Kuzushi means.",
          "Identify referee terms: Ippon, Waza-ari, Osaekomi, Toketa, Sono-mama.",
        ],
      },
    ],
    randoriRequirement: {
      tachiWazaMinutes: 3,
      neWazaMinutes: 3,
      focus: "Continuous relaxed randori showing active attempt of learned throws and proper ukemi when thrown.",
    },
    coachingSignOffRequired: true,
  },
};
