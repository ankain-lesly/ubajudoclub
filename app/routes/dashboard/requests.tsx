import RequestsPanel from "@/components/coach/RequestsPanel";
import { MEMBERS_QUERY_KEY } from "@/lib/api/member.queries";
import { useQueryClient } from "@tanstack/react-query";

export default function DashboardRequestsRoute() {
  const queryClient = useQueryClient();

  return (
    <div className="space-y-6">
      <RequestsPanel
        onMemberAdded={() => {
          queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY });
          queryClient.invalidateQueries({ queryKey: ["dashboard_overview"] });
        }}
      />
    </div>
  );
}
