import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  uploadMultipleSessionMedia,
  deleteSessionMedia,
} from "@/lib/supabase/storage";
import type {
  AttendanceRecord,
  SessionCoordinator,
  SessionMedia,
  TrainingSession,
} from "@/lib/types";

export const SESSIONS_QUERY_KEY = ["sessions"] as const;

export function useSessionsQuery(options?: { limit?: number }) {
  return useQuery({
    queryKey: [...SESSIONS_QUERY_KEY, options?.limit ?? 100],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();

      const [sessionsRes, coordinatorsRes, mediaRes] = await Promise.all([
        supabase
          .from("sessions_with_turnout")
          .select("*")
          .order("start_time", { ascending: false })
          .limit(options?.limit ?? 100),
        supabase.from("session_coordinators").select("*").limit(300),
        supabase.from("session_media").select("*").limit(300),
      ]);

      if (sessionsRes.error) throw sessionsRes.error;

      const rawSessions = (sessionsRes.data ?? []) as TrainingSession[];
      const rawCoordinators = (coordinatorsRes.data ?? []) as SessionCoordinator[];
      const rawMedia = (mediaRes.data ?? []) as SessionMedia[];

      return rawSessions.map((s) => ({
        ...s,
        session_date:
          s.session_date || (s.start_time ? s.start_time.split("T")[0] : ""),
        coordinators: rawCoordinators.filter((c) => c.session_id === s.id),
        media: rawMedia.filter((m) => m.session_id === s.id),
      })) as TrainingSession[];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export interface SaveSessionPayload {
  id?: string;
  start_time: string;
  end_time: string | null;
  focus: string;
  coach?: string | null;
  notes: string;
  coordinatorIds: string[];
  stagedFiles?: File[];
}

export function useSaveSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      start_time,
      end_time,
      focus,
      coach,
      notes,
      coordinatorIds,
      stagedFiles,
    }: SaveSessionPayload) => {
      const supabase = getSupabaseBrowserClient();
      let activeSessionId = id;

      if (activeSessionId) {
        const { error } = await supabase
          .from("training_sessions")
          .update({
            start_time,
            end_time,
            focus,
            coach,
            notes,
          })
          .eq("id", activeSessionId);
        if (error) throw error;
      } else {
        const { data: created, error } = await supabase
          .from("training_sessions")
          .insert({
            start_time,
            end_time,
            focus,
            coach,
            notes,
          })
          .select()
          .single();
        if (error) throw error;
        activeSessionId = created.id;
      }

      // Synchronize coordinators
      if (activeSessionId) {
        const { error: delErr } = await supabase
          .from("session_coordinators")
          .delete()
          .eq("session_id", activeSessionId);
        if (delErr) throw delErr;

        if (coordinatorIds.length > 0) {
          const toInsert = coordinatorIds.map((memberId) => ({
            session_id: activeSessionId!,
            member_id: memberId,
            role: "Coordinator",
          }));
          const { error: insErr } = await supabase
            .from("session_coordinators")
            .insert(toInsert);
          if (insErr) throw insErr;
        }

        if (stagedFiles && stagedFiles.length > 0) {
          await uploadMultipleSessionMedia(activeSessionId, stagedFiles);
        }
      }

      return activeSessionId;
    },
    onSuccess: (sessionId) => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard_overview"] });
    },
  });
}

export function useDeleteSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("training_sessions")
        .delete()
        .eq("id", sessionId);
      if (error) throw error;
      return sessionId;
    },
    onSuccess: (sessionId) => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
      queryClient.removeQueries({ queryKey: ["session", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard_overview"] });
    },
  });
}

// Details
export function useSessionDetailQuery(sessionId: string | undefined | null) {
  return useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      const supabase = getSupabaseBrowserClient();

      const [sessionRes, coordinatorsRes, mediaRes] = await Promise.all([
        supabase
          .from("sessions_with_turnout")
          .select("*")
          .eq("id", sessionId)
          .maybeSingle(),
        supabase
          .from("session_coordinators")
          .select("*")
          .eq("session_id", sessionId),
        supabase
          .from("session_media")
          .select("*")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: false })
          .limit(100),
      ]);

      if (sessionRes.error) throw sessionRes.error;
      if (!sessionRes.data) return null;

      const rawSession = sessionRes.data as TrainingSession;
      return {
        ...rawSession,
        session_date:
          rawSession.session_date ||
          (rawSession.start_time ? rawSession.start_time.split("T")[0] : ""),
        coordinators: (coordinatorsRes.data ?? []) as SessionCoordinator[],
        media: (mediaRes.data ?? []) as SessionMedia[],
      } as TrainingSession;
    },
    enabled: Boolean(sessionId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// #############################
// Media
// #############################

export function useSessionMediaQuery(sessionId: string | undefined | null) {
  return useQuery({
    queryKey: ["session_media", sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("session_media")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw error;
      return (data ?? []) as SessionMedia[];
    },
    enabled: Boolean(sessionId),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useUploadMediaMutation(sessionId: string | undefined | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      files,
      onProgress,
    }: {
      files: File[];
      tag?: string;
      caption?: string;
      onProgress?: (completed: number, total: number) => void;
    }) => {
      if (!sessionId)
        throw new Error("No session ID provided for media upload");
      return await uploadMultipleSessionMedia(sessionId, files, onProgress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session_media", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
    },
  });
}

export function useDeleteMediaMutation(sessionId: string | undefined | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      mediaId,
      storagePath,
    }: {
      mediaId: string;
      storagePath?: string;
    }) => {
      await deleteSessionMedia(mediaId, storagePath);
      return mediaId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session_media", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
    },
  });
}

// #######################
// Attendance
// #######################

export function useSessionAttendanceQuery(
  sessionId: string | undefined | null,
) {
  return useQuery({
    queryKey: ["attendance", sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("attendances")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(300);

      if (error) throw error;
      return (data ?? []) as AttendanceRecord[];
    },
    enabled: Boolean(sessionId),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useCheckInMutation(sessionId: string | undefined | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      memberId,
      note,
    }: {
      memberId: string;
      note?: string;
      sessionDate?: string;
    }) => {
      if (!sessionId) throw new Error("No session ID provided for check-in");
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("attendances")
        .insert({
          session_id: sessionId,
          member_id: memberId,
          note: note || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as AttendanceRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", sessionId] });
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard_overview"] });
    },
  });
}

export function useUndoCheckInMutation(sessionId: string | undefined | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attendanceRecordId: string) => {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("attendances")
        .delete()
        .eq("id", attendanceRecordId);
      if (error) throw error;
      return attendanceRecordId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", sessionId] });
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard_overview"] });
    },
  });
}
