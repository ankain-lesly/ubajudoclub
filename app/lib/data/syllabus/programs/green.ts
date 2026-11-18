import type { BeltProgram } from "@/lib/types/syllabus";

export const greenBeltProgram: BeltProgram = {
  slug: "green",
  intent:
    "The beginning of senior grade Judo. Introduction of sacrifice throws (Sutemi-waza), strangulations (Shime-waza), and the 1st Series of Nage-no-Kata (Te-waza).",
  leadershipNote:
    "At green belt, you step into senior rank. You are trusted with partner safety during strangulations and must set an example in ceremonial Kata etiquette.",
  learn: {
    ukemi: ["sutemi-ukemi"],
    throws: [
      "tomoe-nage",
      "kata-guruma",
      "ashi-guruma",
      "harai-tsuri-komi-ashi",
      "hane-goshi",
      "yoko-otoshi",
    ],
    groundwork: [
      "nami-juji-jime",
      "gyaku-juji-jime",
      "kata-juji-jime",
      "okuri-eri-jime",
      "kami-shiho-escape",
    ],
  },
  kata: [
    {
      name: "Nage-no-Kata",
      kanji: "投の形",
      series: "1st Series: Te-waza (Hand Techniques)",
      role: "Tori",
      focus:
        "Formal opening ceremony, stepping cadence, and classical balance-breaking across the 3 hand techniques as Tori.",
      techniques: ["Uki-otoshi", "Ippon-seoi-nage", "Kata-guruma"],
    },
  ],
  terms: ["shimewaza", "kata", "masutemi", "yokosutemi", "mairi"],
  rules: [
    "Shime-waza rules: Strangles must strictly target the lateral carotid arteries. Direct trachea compression is forbidden.",
    "Release immediately upon tap (two physical taps or shouting 'Mairi').",
    "Kata-guruma note: The classical leg-grab variation is banned in IJF contest shiai. Practice in Kata and modern non-leg-grab variations.",
  ],
  exam: {
    minMonths: 6,
    technical: [
      { id: "green-kata-demo", label: "Perform Nage-no-Kata 1st Series (Te-waza: Uki-otoshi, Seoi-nage, Kata-guruma) as Tori with formal bows" },
      { id: "green-throws-demo", label: "Demonstrate Tomoe-nage (clean overhead vault), Ashi-guruma, and Hane-goshi in motion" },
      { id: "green-chokes-demo", label: "Demonstrate Nami-juji-jime, Gyaku-juji-jime, and Okuri-eri-jime with correct carotid blade alignment" },
      { id: "green-escape-demo", label: "Demonstrate pendulum-turn escape from Kami-shiho-gatame" },
      { id: "green-safety-demo", label: "Demonstrate knowledge of recovery position for an unconscious partner" },
    ],
    randori: {
      standingMin: 4,
      groundMin: 3,
      focus: "High-paced sparring demonstrating integration of sacrifice throws and immediate groundwork choke submissions.",
    },
  },
};
