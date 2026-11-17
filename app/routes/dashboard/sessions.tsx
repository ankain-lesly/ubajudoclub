import { useState } from "react";
import { useNavigate } from "react-router";
import { SessionsPanel } from "@/components/coach/SessionsPanel";
import { SessionSheet } from "@/components/coach/SessionSheet";
import {
  useSessionsQuery,
  useSaveSessionMutation,
  useDeleteSessionMutation,
} from "@/lib/api/session.queries";
import type { TrainingSession } from "@/lib/types";
import { useMembersQuery } from "@/lib/api/member.queries";

export default function DashboardSessionsRoute() {
  const navigate = useNavigate();
  const { data: sessions = [], isLoading } = useSessionsQuery();
  const { data: members = [] } = useMembersQuery();
  const saveSessionMutation = useSaveSessionMutation();
  const deleteSessionMutation = useDeleteSessionMutation();

  const [sessionSheetOpen, setSessionSheetOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);

  const handleEditSession = (session: TrainingSession) => {
    setEditingSession(session);
    setSessionSheetOpen(true);
  };

  const handleScheduleNew = () => {
    setEditingSession(null);
    setSessionSheetOpen(true);
  };

  const handleDeleteSession = async (sessionId: string) => {
    await deleteSessionMutation.mutateAsync(sessionId);
  };

  const handleSelectSessionForCheckIn = (session: TrainingSession) => {
    navigate(`/dashboard/sessions/${session.id}?tab=checkin`);
  };

  const handleSelectSessionForWrapUp = (session: TrainingSession) => {
    navigate(`/dashboard/sessions/${session.id}?tab=wrapup`);
  };

  return (
    <div className="space-y-6">
      <SessionsPanel
        sessions={sessions}
        members={members}
        onScheduleNew={handleScheduleNew}
        onEditSession={handleEditSession}
        onDeleteSession={handleDeleteSession}
        onSelectSessionForCheckIn={handleSelectSessionForCheckIn}
        onSelectSessionForWrapUp={handleSelectSessionForWrapUp}
      />

      <SessionSheet
        open={sessionSheetOpen}
        session={editingSession}
        members={members}
        onClose={() => {
          setSessionSheetOpen(false);
          setEditingSession(null);
        }}
        onSave={async (data) => {
          await saveSessionMutation.mutateAsync({
            id: editingSession?.id,
            ...data,
          });
          setSessionSheetOpen(false);
          setEditingSession(null);
        }}
      />
    </div>
  );
}
