import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { todayISO } from "@/lib/data/coach";
import type { JoinRequest, Member, TrainingSession } from "@/lib/types";

export function useDashboardOverviewQuery() {
  return useQuery({
    queryKey: ["dashboard_overview"],
    queryFn: async () => {
      const today = todayISO();
      const [membersRes, sessionsRes, requestsRes] = await Promise.all([
        api.entities.Member.filter({}, { limit: 500 }),
        api.entities.TrainingSession.filter(
          {},
          { sort: "-start_time", limit: 20 }
        ),
        api.entities.JoinRequest.filter({}, { limit: 200 }),
      ]);

      const members = (membersRes.items ?? []) as Member[];
      const sessions = (sessionsRes.items ?? []) as TrainingSession[];
      const allRequests = (requestsRes.items ?? []) as JoinRequest[];
      const pendingRequests = allRequests.filter(
        (r) => r.status === "new" || !r.status
      );

      const activeMembers = members.filter((m) => m.status !== "inactive");

      // Calculate turnout stats across completed / recent sessions with headcount
      const pastSessionsWithTurnout = sessions.filter(
        (s) => typeof s.attended_count === "number" && s.attended_count > 0
      );
      const recentTurnouts = pastSessionsWithTurnout.slice(0, 6);
      const avgTurnout =
        recentTurnouts.length > 0
          ? Math.round(
              recentTurnouts.reduce((acc, curr) => acc + (curr.attended_count ?? 0), 0) /
                recentTurnouts.length
            )
          : 0;

      // Find today's session or the next upcoming scheduled session
      const todaySession = sessions.find((s) => {
        const date = s.session_date || (s.start_time ? s.start_time.split("T")[0] : "");
        return date === today;
      });

      const upcomingSession =
        todaySession ??
        [...sessions]
          .reverse()
          .find((s) => {
            const date = s.session_date || (s.start_time ? s.start_time.split("T")[0] : "");
            return date >= today;
          }) ??
        sessions[0] ??
        null;

      return {
        totalMembersCount: members.length,
        activeMembersCount: activeMembers.length,
        totalSessionsCount: sessions.length,
        avgTurnout,
        pendingRequestsCount: pendingRequests.length,
        todaySession: todaySession ?? null,
        nextSession: upcomingSession,
        recentSessions: sessions.slice(0, 5),
        recentMembers: members.slice(0, 5),
      };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
