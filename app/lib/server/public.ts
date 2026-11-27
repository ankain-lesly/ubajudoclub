import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getMockMembers } from "@/lib/data/members";
import { getMockSessions, getMockSessionById } from "@/lib/data/sessions";
import { GALLERY } from "@/lib/data/gallery";
import type {
  ClubEvent,
  GalleryItem,
  Member,
  PublicStats,
  SessionCoordinator,
  SessionMedia,
  TrainingSession,
} from "@/lib/types";

/**
 * Format ISO datetime into HH:mm (e.g. "17:00")
 */
function formatTimeHHmm(isoString?: string | null, fallback = "17:00"): string {
  if (!isoString) return fallback;
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return fallback;
  }
}

/**
 * Fetch all members from Supabase view `members_with_stats`.
 * Falls back to mock data if no database records exist yet.
 */
export async function getPublicMembers(request?: Request): Promise<Member[]> {
  try {
    const { supabase } = getSupabaseServerClient(request);
    const { data, error } = await supabase
      .from("members_with_stats")
      .select("*")
      .order("full_name", { ascending: true });

    if (error) {
      console.warn("Supabase public members query error:", error.message);
      return getMockMembers();
    }

    if (!data || data.length === 0) {
      return getMockMembers();
    }

    return data as Member[];
  } catch (err) {
    console.warn("Failed to fetch public members from Supabase:", err);
    return getMockMembers();
  }
}

/**
 * Fetch all training sessions with live turnout, assigned coordinators, and media captures.
 * Falls back to mock data if no database records exist yet.
 */
export async function getPublicSessions(request?: Request): Promise<TrainingSession[]> {
  try {
    const { supabase } = getSupabaseServerClient(request);

    const [sessionsRes, coordinatorsRes, mediaRes, membersRes] = await Promise.all([
      supabase.from("sessions_with_turnout").select("*").order("start_time", { ascending: false }),
      supabase.from("session_coordinators").select("*"),
      supabase.from("session_media").select("*").order("created_at", { ascending: false }),
      supabase.from("members").select("id, full_name, belt_rank"),
    ]);

    if (sessionsRes.error) {
      console.warn("Supabase public sessions query error:", sessionsRes.error.message);
      return getMockSessions();
    }

    const rawSessions = sessionsRes.data || [];
    if (rawSessions.length === 0) {
      return getMockSessions();
    }

    const membersMap = new Map((membersRes.data || []).map((m) => [m.id, m]));
    const rawCoordinators = (coordinatorsRes.data || []).map((c) => ({
      ...c,
      member: membersMap.get(c.member_id) || null,
    }));
    const rawMedia = mediaRes.data || [];

    const enriched: TrainingSession[] = rawSessions.map((s: any) => {
      const sessionCoords = rawCoordinators.filter((c) => c.session_id === s.id);
      const sessionMedia = rawMedia.filter((m) => m.session_id === s.id);
      const leadCoordinator = sessionCoords[0]?.member?.full_name;

      const datePart = (s as any).session_date || (s.start_time ? s.start_time.split("T")[0] : "");
      const startFormatted = formatTimeHHmm(s.start_time, "17:00");
      const endFormatted = formatTimeHHmm(s.end_time, "19:00");

      return {
        id: s.id || "",
        session_date: datePart,
        start_time: startFormatted,
        end_time: endFormatted,
        focus: s.focus || "Open Mat & Randori",
        notes: s.notes || null,
        coach: leadCoordinator || "Sensei Roland",
        attended_count: Number(s.attended_count) || 0,
        coordinators: sessionCoords as SessionCoordinator[],
        media: sessionMedia as SessionMedia[],
        created_at: s.created_at ?? undefined,
        updated_at: s.updated_at ?? undefined,
      };
    });

    return enriched;
  } catch (err) {
    console.warn("Failed to fetch public sessions from Supabase:", err);
    return getMockSessions();
  }
}

/**
 * Fetch a single public session by ID along with its coordinators, media, and 2 other sessions.
 */
export async function getPublicSessionById(
  id: string,
  request?: Request,
): Promise<{ session: TrainingSession | null; others: TrainingSession[] }> {
  // If it's a mock identifier, return from mock data
  if (id.startsWith("sess-")) {
    const mock = getMockSessionById(id);
    const allMocks = getMockSessions();
    const others = allMocks.filter((s) => s.id !== id).slice(0, 2);
    return { session: mock ?? null, others };
  }

  try {
    const { supabase } = getSupabaseServerClient(request);

    const [sessionRes, coordinatorsRes, mediaRes, membersRes, otherSessionsRes] = await Promise.all([
      supabase.from("sessions_with_turnout").select("*").eq("id", id).maybeSingle(),
      supabase.from("session_coordinators").select("*").eq("session_id", id),
      supabase.from("session_media").select("*").eq("session_id", id).order("created_at", { ascending: false }),
      supabase.from("members").select("id, full_name, belt_rank"),
      supabase.from("sessions_with_turnout").select("*").neq("id", id).order("start_time", { ascending: false }).limit(3),
    ]);

    if (sessionRes.error || !sessionRes.data) {
      // Fallback check against mock data
      const mock = getMockSessionById(id);
      const allMocks = getMockSessions();
      const others = allMocks.filter((s) => s.id !== id).slice(0, 3);
      return { session: mock ?? null, others };
    }

    const s = sessionRes.data;
    const membersMap = new Map((membersRes.data || []).map((m) => [m.id, m]));
    const coordinators = (coordinatorsRes.data || []).map((c) => ({
      ...c,
      member: membersMap.get(c.member_id) || null,
    }));
    const media = mediaRes.data || [];

    const leadCoordinator = coordinators[0]?.member?.full_name;
    const datePart = (s as any).session_date || (s.start_time ? s.start_time.split("T")[0] : "");
    const startFormatted = formatTimeHHmm(s.start_time, "17:00");
    const endFormatted = formatTimeHHmm(s.end_time, "19:00");

    const session: TrainingSession = {
      id: s.id || id,
      session_date: datePart,
      start_time: startFormatted,
      end_time: endFormatted,
      focus: s.focus || "Open Mat & Randori",
      notes: s.notes || null,
      coach: leadCoordinator || "Team Captains",
      attended_count: Number(s.attended_count) || 0,
      coordinators: coordinators as SessionCoordinator[],
      media: media as SessionMedia[],
      created_at: s.created_at ?? undefined,
      updated_at: s.updated_at ?? undefined,
    };

    const otherData = otherSessionsRes.data || [];
    const otherIds = otherData.map((o: any) => o.id).filter(Boolean);
    let otherMediaMap = new Map<string, SessionMedia[]>();
    if (otherIds.length > 0) {
      try {
        const { data: oMedia } = await supabase
          .from("session_media")
          .select("*")
          .in("session_id", otherIds)
          .order("created_at", { ascending: false });
        (oMedia || []).forEach((m) => {
          const list = otherMediaMap.get(m.session_id) || [];
          list.push(m as SessionMedia);
          otherMediaMap.set(m.session_id, list);
        });
      } catch {}
    }

    const others: TrainingSession[] = otherData.map((other: any) => ({
      id: other.id || "",
      session_date: other.session_date || (other.start_time ? other.start_time.split("T")[0] : ""),
      start_time: formatTimeHHmm(other.start_time, "17:00"),
      end_time: formatTimeHHmm(other.end_time, "19:00"),
      focus: other.focus || "Training Session",
      notes: other.notes || null,
      coach: other.coach || "Sensei",
      attended_count: Number(other.attended_count) || 0,
      media: otherMediaMap.get(other.id) || [],
    }));

    return { session, others };
  } catch (err) {
    console.warn("Failed to fetch session detail from Supabase:", err);
    const mock = getMockSessionById(id);
    const allMocks = getMockSessions();
    const others = allMocks.filter((s) => s.id !== id).slice(0, 2);
    return { session: mock ?? null, others };
  }
}

/**
 * Public events data access
 */
export async function listEvents(limit = 100): Promise<ClubEvent[]> {
  const { supabase } = getSupabaseServerClient();
  const { data } = await supabase.from("events").select("*").order("start_date", { ascending: true }).limit(limit);
  return (data || []) as ClubEvent[];
}

export async function getEvent(id: string): Promise<ClubEvent | null> {
  const { supabase } = getSupabaseServerClient();
  const { data } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
  return (data || null) as ClubEvent | null;
}

export async function getPublicStats(): Promise<PublicStats | null> {
  try {
    const { supabase } = getSupabaseServerClient();
    const { data } = await supabase.rpc("get_public_stats");
    return (data as PublicStats | null) ?? null;
  } catch {
    return null;
  }
}

/**
 * Public gallery data access:
 * Fetches all persisted session media enriched with parent training session details.
 * Falls back to curated static gallery items if no media exists.
 */
export async function getPublicGalleryItems(request?: Request): Promise<GalleryItem[]> {
  try {
    const { supabase } = getSupabaseServerClient(request);

    const { data: mediaList, error } = await supabase
      .from("session_media")
      .select("*, training_sessions(id, focus, start_time, coach)")
      .order("created_at", { ascending: false });

    if (error || !mediaList || mediaList.length === 0) {
      if (error) console.warn("Supabase public gallery query error:", error.message);
      return GALLERY;
    }

    return mediaList.map((m: any) => {
      const session = m.training_sessions;
      const sessionDate = session?.start_time ? session.start_time.split("T")[0] : "";
      const year = sessionDate
        ? sessionDate.split("-")[0]
        : new Date(m.created_at).getFullYear().toString();
      const isVideo = m.media_type === "VIDEO";

      const focusLower = (session?.focus || "").toLowerCase();
      let category = isVideo ? "Videos" : "Mat work";
      if (
        focusLower.includes("competition") ||
        focusLower.includes("tournament") ||
        focusLower.includes("shiai")
      ) {
        category = "Competition";
      } else if (
        focusLower.includes("grading") ||
        focusLower.includes("kata") ||
        focusLower.includes("belt")
      ) {
        category = "Community";
      } else if (
        focusLower.includes("randori") ||
        focusLower.includes("drill") ||
        focusLower.includes("throw") ||
        focusLower.includes("tachi")
      ) {
        category = "Training";
      }

      return {
        id: m.id,
        src: m.url,
        thumbnailUrl: m.url,
        alt: m.caption || session?.focus || "UBa Judo Tatami Capture",
        caption: m.caption || session?.focus || "Mat practice at UBa Campus Amphi 100",
        category,
        year,
        sessionId: m.session_id,
        sessionFocus: session?.focus || "Mat Session",
        sessionDate,
        coach: session?.coach || "Club Coach",
        mediaType: isVideo ? "VIDEO" : "IMAGE",
      };
    });
  } catch (err) {
    console.warn("Failed to fetch gallery items from Supabase:", err);
    return GALLERY;
  }
}
