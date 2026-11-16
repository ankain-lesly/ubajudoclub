import type { TrainingSession } from "@/lib/types";

export const MOCK_SESSIONS: TrainingSession[] = [
  {
    id: "sess-2026-11-14",
    session_date: "2026-11-14",
    start_time: "08:00",
    end_time: "10:30",
    focus: "Kata Mastery & Senior Randori",
    coach: "Coach Ngwa (3rd Dan)",
    attended_count: 28,
    notes:
      "Intensive Saturday morning session focusing on Nage-no-Kata sets 1 to 3 for blue and brown belts. Concluded with 45 minutes of situational randori emphasizing low-energy defensive gripping.",
    coordinators: [
      {
        id: "coord-1",
        session_id: "sess-2026-11-14",
        member_id: "mem-3",
        role: "Tatami Marshal",
        member: {
          id: "mem-3",
          full_name: "Brenda Tche",
          belt_rank: "Brown",
          status: "active",
          program: "Law, Year 4",
        },
      },
      {
        id: "coord-2",
        session_id: "sess-2026-11-14",
        member_id: "mem-5",
        role: "Warmup Lead",
        member: {
          id: "mem-5",
          full_name: "Colins Nfor",
          belt_rank: "Blue",
          status: "active",
          program: "Physics, Year 3",
        },
      },
    ],
    media: [
      {
        id: "med-1",
        session_id: "sess-2026-11-14",
        url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&h=630&q=85",
        media_type: "IMAGE",
        caption: "Senior brown belts performing Uki-goshi during Nage-no-Kata demonstration",
      },
      {
        id: "med-2",
        session_id: "sess-2026-11-14",
        url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&h=630&q=85",
        media_type: "IMAGE",
        caption: "Opening Rei-ho ceremony on the Bambili main tatami",
      },
      {
        id: "med-3",
        session_id: "sess-2026-11-14",
        url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&h=630&q=85",
        media_type: "IMAGE",
        caption: "Cool-down and breathwork alignment in seiza",
      },
    ],
  },
  {
    id: "sess-2026-11-11",
    session_date: "2026-11-11",
    start_time: "17:30",
    end_time: "19:00",
    focus: "Tachi-waza: Osoto-gari Entry & Angles",
    coach: "Coach Fon (2nd Dan)",
    attended_count: 34,
    notes:
      "Wednesday throwing mechanics. Drilling deep lapel steps and head positioning against opposite-stance opponents. High turnout among yellow and orange ranks.",
    coordinators: [
      {
        id: "coord-3",
        session_id: "sess-2026-11-11",
        member_id: "mem-2",
        role: "Attendance & Mat Setup",
        member: {
          id: "mem-2",
          full_name: "Eric Mbuh",
          belt_rank: "Green",
          status: "active",
          program: "Computer Science, Year 2",
        },
      },
    ],
    media: [
      {
        id: "med-4",
        session_id: "sess-2026-11-11",
        url: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?auto=format&fit=crop&w=1200&h=630&q=85",
        media_type: "IMAGE",
        caption: "Coach Fon demonstrating foot placement for Osoto-gari",
      },
      {
        id: "med-5",
        session_id: "sess-2026-11-11",
        url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&h=630&q=85",
        media_type: "IMAGE",
        caption: "Uchikomi resistance bands drill along the sideline",
      },
    ],
  },
  {
    id: "sess-2026-11-09",
    session_date: "2026-11-09",
    start_time: "17:30",
    end_time: "19:00",
    focus: "Ukemi Fundamentals & Balance Breaking",
    coach: "Coach Ngwa (3rd Dan)",
    attended_count: 42,
    notes:
      "Monday beginners intake. Mae-mawari-ukemi (forward rolling breakfalls) progression from kneeling to standing over mats. Excellent composure from all 14 new white belts.",
    coordinators: [
      {
        id: "coord-4",
        session_id: "sess-2026-11-09",
        member_id: "mem-4",
        role: "Beginner Liaison",
        member: {
          id: "mem-4",
          full_name: "Fongoh Danielle",
          belt_rank: "Blue",
          status: "active",
          program: "Nursing Sciences, Year 3",
        },
      },
    ],
    media: [
      {
        id: "med-6",
        session_id: "sess-2026-11-09",
        url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&h=630&q=85",
        media_type: "IMAGE",
        caption: "White belts practicing Mae-ukemi forearm impact drills",
      },
    ],
  },
  {
    id: "sess-2026-11-07",
    session_date: "2026-11-07",
    start_time: "08:00",
    end_time: "10:30",
    focus: "Kosen Ne-waza: Guard Transitions & Pins",
    coach: "Guest Sensei Abanda",
    attended_count: 31,
    notes:
      "Special weekend ground fighting intensive. Sankaku-jime setup from bottom guard, turn-overs from turtle defense, and 6x5-minute continuous ground sparring rounds.",
    coordinators: [],
    media: [
      {
        id: "med-7",
        session_id: "sess-2026-11-07",
        url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&h=630&q=85",
        media_type: "IMAGE",
        caption: "Sensei Abanda breaking down the Kesa-gatame escape counter",
      },
    ],
  },
  {
    id: "sess-2026-11-18",
    session_date: "2026-11-18",
    start_time: "17:30",
    end_time: "19:00",
    focus: "Seoi-nage Speed Drills & Gripping Grips",
    coach: "Coach Fon (2nd Dan)",
    attended_count: 0,
    notes:
      "Upcoming session: Morote vs Ippon Seoi-nage entry variations, breaking high lapel collar grips, and continuous transition into Kesa-gatame pins.",
    coordinators: [
      {
        id: "coord-5",
        session_id: "sess-2026-11-18",
        member_id: "mem-2",
        role: "Mat Lead",
      },
    ],
    media: [
      {
        id: "med-8",
        session_id: "sess-2026-11-18",
        url: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?auto=format&fit=crop&w=1200&h=630&q=85",
        media_type: "IMAGE",
        caption: "Preview of the Bambili competition mat for the upcoming session",
      },
    ],
  },
  {
    id: "sess-2026-11-20",
    session_date: "2026-11-20",
    start_time: "17:30",
    end_time: "19:00",
    focus: "Competition Prep & Situational Mat Work",
    coach: "Coach Ngwa (3rd Dan)",
    attended_count: 0,
    notes:
      "Upcoming Friday session: Refereeing rules review, Golden Score time management simulation, and weight-class specific sparring matches.",
    coordinators: [],
    media: [
      {
        id: "med-9",
        session_id: "sess-2026-11-20",
        url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&h=630&q=85",
        media_type: "IMAGE",
        caption: "The Bambili sports hall mats prepped for Friday competition randori",
      },
    ],
  },
];

export function getMockSessions(): TrainingSession[] {
  return [...MOCK_SESSIONS].sort((a, b) => {
    const da = new Date(`${a.session_date}T${a.start_time || "12:00"}`).getTime();
    const db = new Date(`${b.session_date}T${b.start_time || "12:00"}`).getTime();
    return db - da;
  });
}

export function getMockSessionById(id: string): TrainingSession | null {
  return MOCK_SESSIONS.find((s) => s.id === id) ?? null;
}
