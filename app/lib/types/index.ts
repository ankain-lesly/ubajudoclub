export type Rank =
  | "White"
  | "Yellow"
  | "Orange"
  | "Green"
  | "Blue"
  | "Brown"
  | "Black";

export type MemberStatus = "active" | "paused" | "inactive";

export interface Member {
  id: string;
  full_name: string;
  matricule?: string;
  program?: string;
  belt_rank: Rank;
  status: MemberStatus;
  joined_on?: string;
  phone?: string;
  email?: string;
  notes?: string;
  sessions_total?: number;
  sessions_since_promotion?: number;
  last_attended?: string;
  last_promotion_date?: string;
  created_date?: string;
}

export interface TrainingSession {
  id: string;
  session_date: string;
  focus?: string;
  coach?: string;
  attended_count?: number;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  session_id: string;
  member_id: string;
  member_name?: string;
  session_date: string;
  note?: string;
}

export interface Promotion {
  id: string;
  member_id: string;
  member_name?: string;
  from_rank: Rank;
  to_rank: Rank;
  promoted_on: string;
  sessions_at_promotion?: number;
  note?: string;
}

export interface JoinRequest {
  id?: string;
  created_date?: string;
  full_name: string;
  email: string;
  phone?: string;
  program?: string;
  experience?: string;
  message?: string;
  status?: "new" | "contacted" | "joined" | "declined";
}

export interface NewMemberInput {
  full_name: string;
  matricule: string;
  program: string;
  belt_rank: Rank;
}

export interface TurnoutPoint {
  label: string;
  value: number;
}

export interface BeltCount {
  rank: string;
  count: number;
}

export type EventKind =
  | "Competition"
  | "Grading"
  | "Seminar"
  | "Social"
  | "Camp";

export interface ClubEvent {
  id: string;
  title: string;
  kind: EventKind;
  start_date: string;
  end_date?: string;
  start_time?: string;
  venue?: string;
  summary?: string;
  description?: string;
  image_url?: string;
  entry_note?: string;
  featured?: boolean;
}

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  category: "Mat work" | "Training" | "Competition" | "Community";
  year: string;
}

export interface PublicStats {
  active_athletes: number;
  sessions_logged: number;
  average_turnout: number;
  promotions_this_term: number;
  turnout_series: TurnoutPoint[];
  belt_distribution: BeltCount[];
  updated_at?: string;
}
