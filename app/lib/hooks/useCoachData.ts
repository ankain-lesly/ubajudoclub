import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import type {
  AttendanceRecord,
  Member,
  SessionCoordinator,
  SessionMedia,
  TrainingSession,
} from "@/lib/types";

interface CoachData {
  members: Member[];
  sessions: TrainingSession[];
  attendance: AttendanceRecord[];
  coordinators: SessionCoordinator[];
  media: SessionMedia[];
}

const EMPTY: CoachData = {
  members: [],
  sessions: [],
  attendance: [],
  coordinators: [],
  media: [],
};

export const useCoachData = () => {
  const [data, setData] = useState<CoachData>(EMPTY);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      const [membersRes, sessionsRes, attendanceRes, coordinatorsRes, mediaRes] =
        await Promise.all([
          api.entities.Member.filter({}, { sort: "full_name", limit: 300 }),
          api.entities.TrainingSession.filter(
            {},
            { sort: "-start_time", limit: 30 },
          ),
          api.entities.Attendance.filter(
            {},
            { sort: "-created_at", limit: 1000 },
          ),
          api.entities.SessionCoordinator.filter({}, { limit: 200 }),
          api.entities.SessionMedia.filter({}, { sort: "-created_at", limit: 200 }),
        ]);

      const rawSessions = (sessionsRes.items ?? []) as TrainingSession[];
      const rawCoordinators = (coordinatorsRes.items ?? []) as SessionCoordinator[];
      const rawMedia = (mediaRes.items ?? []) as SessionMedia[];

      // Stitch coordinators and media into sessions for convenience
      const enrichedSessions = rawSessions.map((s) => ({
        ...s,
        session_date: s.session_date || (s.start_time ? s.start_time.split("T")[0] : ""),
        coordinators: rawCoordinators.filter((c) => c.session_id === s.id),
        media: rawMedia.filter((m) => m.session_id === s.id),
      }));

      setData({
        members: (membersRes.items ?? []) as Member[],
        sessions: enrichedSessions,
        attendance: (attendanceRes.items ?? []) as AttendanceRecord[],
        coordinators: rawCoordinators,
        media: rawMedia,
      });
    } catch (err) {
      console.error("Failed to load coach data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...data, loading, reload };
};
