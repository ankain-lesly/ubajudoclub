import type { Rank } from "@/lib/types";

export interface BeltInfo {
  rank: Rank;
  kyu: string;
  color: string;
  sessions: number;
  focus: string;
}

export const BELTS: BeltInfo[] = [
  {
    rank: "White",
    kyu: "6th Kyu — Rokkyu",
    color: "#F0E7D6",
    sessions: 24,
    focus: "Ukemi, posture and rei-ho",
  },
  {
    rank: "Yellow",
    kyu: "5th Kyu — Gokyu",
    color: "#E4B62B",
    sessions: 32,
    focus: "First throws, grip fighting",
  },
  {
    rank: "Orange",
    kyu: "4th Kyu — Yonkyu",
    color: "#DD7A2E",
    sessions: 40,
    focus: "Combination attacks",
  },
  {
    rank: "Green",
    kyu: "3rd Kyu — Sankyu",
    color: "#2E6A49",
    sessions: 48,
    focus: "Ne-waza: pins and turnovers",
  },
  {
    rank: "Blue",
    kyu: "2nd Kyu — Nikyu",
    color: "#2A4A88",
    sessions: 56,
    focus: "Randori tactics and counters",
  },
  {
    rank: "Brown",
    kyu: "1st Kyu — Ikkyu",
    color: "#6A4126",
    sessions: 64,
    focus: "Kata and shiai preparation",
  },
  {
    rank: "Black",
    kyu: "Shodan — Dan grade",
    color: "#14150F",
    sessions: 80,
    focus: "Full syllabus, first coaching hours",
  },
];

export const beltFor = (rank?: string): BeltInfo =>
  BELTS.find((b) => b.rank === rank) ?? BELTS[0];

export const VENUE = {
  name: "Multi-Purpose Sports Hall",
  campus: "University of Bamenda — Bambili Campus",
  region: "Bambili, North West Region, Cameroon",
  note: "Enter through the north court doors. Mats are laid 20 minutes before the first session.",
};

export interface SessionTemplate {
  day: string;
  time: string;
  focus: string;
  group: string;
}

export const WEEK: SessionTemplate[] = [
  {
    day: "Monday",
    time: "17:30 – 19:00",
    focus: "Ukemi and fundamentals",
    group: "All ranks",
  },
  {
    day: "Wednesday",
    time: "17:30 – 19:00",
    focus: "Tachi-waza and randori",
    group: "Yellow belt and above",
  },
  {
    day: "Friday",
    time: "17:30 – 19:00",
    focus: "Ne-waza and grading prep",
    group: "All ranks",
  },
  {
    day: "Saturday",
    time: "08:00 – 09:30",
    focus: "Kata and open mat",
    group: "Open session",
  },
];

export interface Pillar {
  n: string;
  title: string;
  body: string;
}

export const PILLARS: Pillar[] = [
  {
    n: "01",
    title: "Attendance you can trust",
    body: "One tap at the door replaces the paper sheet. Every session is logged in seconds, so the record finally matches the mat.",
  },
  {
    n: "02",
    title: "Grading, not guesswork",
    body: "Each rank has a clear session target. Athletes and coaches see the same numbers, so promotion conversations start from facts.",
  },
  {
    n: "03",
    title: "Private by default",
    body: "The club publishes turnout and progress as numbers. Names and individual records stay inside the coaching team.",
  },
];

export interface Coach {
  name: string;
  role: string;
  detail: string;
  initials: string;
}

export const COACHES: Coach[] = [
  {
    name: "Sensei A. Nfor",
    role: "Head coach · 4th Dan",
    detail: "Technical syllabus, grading board and the competition squad.",
    initials: "AN",
  },
  {
    name: "Sensei B. Tatah",
    role: "Ne-waza lead · 2nd Dan",
    detail: "Groundwork, pins and turnovers for every rank on the mat.",
    initials: "BT",
  },
  {
    name: "M. Achidi",
    role: "Athlete welfare · 1st Kyu",
    detail: "Onboarding, loaner gis and first-session nerves.",
    initials: "MA",
  },
];

export interface Voice {
  quote: string;
  name: string;
  detail: string;
}

export const VOICES: Voice[] = [
  {
    quote:
      "I walked in with no idea how to fall. Six weeks later I was thrown properly for the first time and it did not hurt. That is the whole club, really.",
    name: "M.",
    detail: "Blue belt · Year 3, Physics",
  },
  {
    quote:
      "The session targets are printed and counted. Nobody argues about who is ready for the next belt any more — we just train and the numbers show it.",
    name: "T.",
    detail: "Green belt · Year 2, Economics",
  },
  {
    quote:
      "Saturday kata with the senior grades is the calmest hour of my week. Bambili is quiet at 8am and the hall smells of tatami.",
    name: "A.",
    detail: "Brown belt · Year 4, Law",
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "Do I need my own gi to start?",
    a: "No. The club keeps loaner gis for the first month, in every size from 150cm up. Bring a t-shirt and shorts for your first session and we will fit you properly afterwards.",
  },
  {
    q: "I have never done a martial art. Can I still join?",
    a: "That is most of the club. Your first month is ukemi — learning to fall safely — plus posture, grips and the etiquette of the mat. No sparring until you can fall without thinking about it.",
  },
  {
    q: "How much does it cost?",
    a: "A registration fee that covers university sports insurance, then termly club dues. Loaner equipment and grading sessions are included. Ask at any session — nobody is turned away for money.",
  },
  {
    q: "How does grading actually work?",
    a: "Every rank has a session target and a technical focus, both listed on the belt pathway page. When an athlete reaches the target and the technical board signs off, they grade at the end of term.",
  },
  {
    q: "Is my attendance visible to other students?",
    a: "No. Public pages show turnout counts and belt distribution only. Individual attendance, absence flags and grading notes are visible to signed-in coaches.",
  },
];
