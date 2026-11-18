import type { BeltProgram } from "@/lib/types/syllabus";

export const blackBeltProgram: BeltProgram = {
  slug: "black",
  intent:
    "Shodan ('Beginning Degree'). The black belt is not the finish line, but the threshold where the student has learned how to walk without stumbling, ready to study Judo deeply. Focuses on full Gokyo mastery, Katame-no-Kata, assistant coaching, and lifetime Judo.",
  leadershipNote:
    "As a Yudansha, you represent the legacy of Jigoro Kano and the dojo. Model humility (Shoshin), uphold dojo safety, and actively give back to younger athletes on the mat.",
  learn: {
    ukemi: [],
    throws: [],
    groundwork: [],
  },
  kata: [
    {
      name: "Nage-no-Kata (投の形 — Complete)",
      kanji: "投の形",
      series: "All 5 Series (15 Techniques / 30 Throws)",
      role: "Both",
      focus:
        "Full Kodokan Nage-no-Kata executed on both right and left sides as both Tori and Uke before the National Dan Commission.",
      techniques: [
        "1st Series (Te-waza): Uki-otoshi, Seoi-nage, Kata-guruma",
        "2nd Series (Koshi-waza): Uki-goshi, Harai-goshi, Tsuri-komi-goshi",
        "3rd Series (Ashi-waza): Okuri-ashi-barai, Sasae-tsuri-komi-ashi, Uchi-mata",
        "4th Series (Ma-sutemi-waza): Tomoe-nage, Ura-nage, Sumi-gaeshi",
        "5th Series (Yoko-sutemi-waza): Yoko-gake, Yoko-guruma, Uki-waza",
      ],
    },
    {
      name: "Katame-no-Kata (固の形 — Forms of Grappling)",
      kanji: "固の形",
      series: "15 Groundwork Techniques (Holds, Chokes, Locks)",
      role: "Both",
      focus:
        "The official groundwork Kata of the Kodokan demonstrating foundational control, submission, and escape principles.",
      techniques: [
        "Osaekomi-waza (5 Holds): Kesa-gatame, Kata-gatame, Kami-shiho-gatame, Kuzure-kami-shiho-gatame, Yoko-shiho-gatame",
        "Shime-waza (5 Chokes): Kata-juji-jime, Hadaka-jime, Okuri-eri-jime, Kata-ha-jime, Gyaku-juji-jime",
        "Kansetsu-waza (5 Locks): Ude-garami, Juji-gatame, Ude-gatame, Hiza-gatame, Ashi-gatame",
      ],
    },
  ],
  terms: ["shodan", "yudansha", "shoshin", "seiryokuzenyo", "jitakyoei"],
  rules: [
    "Full command of IJF international refereeing standards and care system review protocols.",
    "First aid, concussion safety, and orthopedic injury response on the tatami.",
    "National federation (FECAJUDO) official licensing and continuous coaching education.",
  ],
};
