import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
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
      const [sessionsRes, coordinatorsRes, mediaRes] = await Promise.all([
        api.entities.TrainingSession.filter(
          {},
          { sort: "-start_time", limit: options?.limit ?? 100 },
        ),
        api.entities.SessionCoordinator.filter({}, { limit: 300 }),
        api.entities.SessionMedia.filter({}, { limit: 300 }),
      ]);

      const rawSessions = (sessionsRes.items ?? []) as TrainingSession[];
      const rawCoordinators = (coordinatorsRes.items ??
        []) as SessionCoordinator[];
      const rawMedia = (mediaRes.items ?? []) as SessionMedia[];

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
      let activeSessionId = id;

      if (activeSessionId) {
        await api.entities.TrainingSession.update(activeSessionId, {
          start_time,
          end_time,
          focus,
          coach,
          notes,
        });
      } else {
        const created = await api.entities.TrainingSession.create({
          start_time,
          end_time,
          focus,
          coach,
          notes,
        });
        activeSessionId = created.id;
      }

      // Synchronize coordinators
      if (activeSessionId) {
        const existing = await api.entities.SessionCoordinator.filter({
          session_id: activeSessionId,
        });
        for (const item of existing.items) {
          await api.entities.SessionCoordinator.delete(item.id);
        }
        for (const memberId of coordinatorIds) {
          await api.entities.SessionCoordinator.create({
            session_id: activeSessionId,
            member_id: memberId,
            role: "Coordinator",
          });
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
      await api.entities.TrainingSession.delete(sessionId);
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

      const [session, coordinatorsRes, mediaRes] = await Promise.all([
        api.entities.TrainingSession.get(sessionId),
        api.entities.SessionCoordinator.filter({ session_id: sessionId }),
        api.entities.SessionMedia.filter(
          { session_id: sessionId },
          { sort: "-created_at", limit: 100 },
        ),
      ]);

      const rawSession = session as TrainingSession;
      return {
        ...rawSession,
        session_date:
          rawSession.session_date ||
          (rawSession.start_time ? rawSession.start_time.split("T")[0] : ""),
        coordinators: (coordinatorsRes.items ?? []) as SessionCoordinator[],
        media: (mediaRes.items ?? []) as SessionMedia[],
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
      const res = await api.entities.SessionMedia.filter(
        { session_id: sessionId },
        { sort: "-created_at", limit: 200 },
      );
      return (res.items ?? []) as SessionMedia[];
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
      const res = await api.entities.Attendance.filter(
        { session_id: sessionId },
        { sort: "-created_at", limit: 300 },
      );
      return (res.items ?? []) as AttendanceRecord[];
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
      sessionDate,
    }: {
      memberId: string;
      sessionDate?: string;
    }) => {
      if (!sessionId) throw new Error("No session ID provided for check-in");
      return (await api.entities.Attendance.create({
        session_id: sessionId,
        member_id: memberId,
        ...(sessionDate ? { session_date: sessionDate } : {}),
      })) as AttendanceRecord;
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
      await api.entities.Attendance.delete(attendanceRecordId);
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
