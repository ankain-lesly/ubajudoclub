import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import type {
  AttendanceRecord,
  Member,
  Promotion,
  TrainingSession,
} from "@/lib/types";

interface CoachData {
  members: Member[];
  sessions: TrainingSession[];
  attendance: AttendanceRecord[];
  promotions: Promotion[];
}

const EMPTY: CoachData = {
  members: [],
  sessions: [],
  attendance: [],
  promotions: [],
};

export const useCoachData = () => {
  const [data, setData] = useState<CoachData>(EMPTY);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const [members, sessions, attendance, promotions] = await Promise.all([
      api.entities.Member.filter({}, { sort: "full_name", limit: 300 }),
      api.entities.TrainingSession.filter(
        {},
        { sort: "-session_date", limit: 24 },
      ),
      api.entities.Attendance.filter(
        {},
        { sort: "-session_date", limit: 800 },
      ),
      api.entities.Promotion.filter({}, { sort: "-promoted_on", limit: 60 }),
    ]);
    setData({
      members: (members.items ?? []) as Member[],
      sessions: (sessions.items ?? []) as TrainingSession[],
      attendance: (attendance.items ?? []) as AttendanceRecord[],
      promotions: (promotions.items ?? []) as Promotion[],
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...data, loading, reload };
};
