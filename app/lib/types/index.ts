export type UserRole = "admin" | "staff" | "member";

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
  profile_id?: string | null;
  full_name: string;
  matricule?: string | null;
  program?: string | null;
  belt_rank: Rank;
  status: MemberStatus;
  joined_on?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  sessions_total?: number;
  sessions_since_promotion?: number;
  last_attended?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SessionCoordinator {
  id: string;
  session_id: string;
  member_id: string;
  role?: string | null;
  member?: Member | null;
}

export interface SessionMedia {
  id: string;
  session_id: string;
  url: string;
  public_id?: string | null;
  thumbnail_url?: string | null;
  media_type: "IMAGE" | "VIDEO" | string;
  caption?: string | null;
  is_cover?: boolean;
  created_at?: string;
}

export interface TrainingSession {
  id: string;
  session_date?: string;
  start_time?: string | null;
  end_time?: string | null;
  focus?: string | null;
  coach?: string | null;
  attended_count?: number;
  notes?: string | null;
  coordinators?: SessionCoordinator[];
  media?: SessionMedia[];
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceRecord {
  id: string;
  session_id: string;
  member_id: string;
  member_name?: string;
  session_date?: string;
  note?: string | null;
  created_at?: string;
}

export interface JoinRequest {
  id?: string;
  full_name: string;
  email: string;
  phone?: string | null;
  program?: string | null;
  experience?: string | null;
  message?: string | null;
  status?: "new" | "contacted" | "joined" | "declined";
  converted_member_id?: string | null;
  created_at?: string;
  updated_at?: string;
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
  | "Camp"
  | string;

export interface ClubEvent {
  id: string;
  title: string;
  kind: EventKind;
  start_date: string;
  end_date?: string;
  start_time?: string;
  venue?: string;
  location?: string | null;
  summary?: string;
  description?: string | null;
  image_url?: string;
  entry_note?: string;
  featured?: boolean;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryItem {
  id?: string;
  src: string;
  alt: string;
  caption: string;
  category: "Mat work" | "Training" | "Competition" | "Community" | "Photos" | "Videos" | string;
  year: string;
  sessionId?: string;
  sessionFocus?: string;
  sessionDate?: string;
  coach?: string;
  mediaType?: "IMAGE" | "VIDEO" | string;
  thumbnailUrl?: string;
}

export interface PublicStats {
  active_athletes: number;
  sessions_logged: number;
  average_turnout: number;
  promotions_this_term: number;
  turnout_series: TurnoutPoint[];
  belt_distribution: BeltCount[];
}
