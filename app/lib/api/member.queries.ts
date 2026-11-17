import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { todayISO } from "@/lib/data/coach";
import type { JoinRequest, Member, Rank } from "@/lib/types";

export const MEMBERS_QUERY_KEY = ["members"] as const;

export function useMembersQuery(options?: { sort?: string; limit?: number }) {
  return useQuery({
    queryKey: [...MEMBERS_QUERY_KEY, options?.sort ?? "full_name"],
    queryFn: async () => {
      const res = await api.entities.Member.filter(
        {},
        { sort: options?.sort ?? "full_name", limit: options?.limit ?? 500 }
      );
      return (res.items ?? []) as Member[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Member>) => {
      return (await api.entities.Member.create({
        ...data,
        status: data.status || "active",
        joined_on: data.joined_on || todayISO(),
      })) as Member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard_overview"] });
    },
  });
}

export function useUpdateMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Member> }) => {
      return (await api.entities.Member.update(id, data)) as Member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard_overview"] });
    },
  });
}

export function usePromoteMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      memberId,
      toRank,
      note,
    }: {
      memberId: string;
      toRank: Rank;
      note?: string;
    }) => {
      return (await api.entities.Member.update(memberId, {
        belt_rank: toRank,
        ...(note ? { notes: note } : {}),
      })) as Member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard_overview"] });
    },
  });
}

export const JOIN_REQUESTS_QUERY_KEY = ["join_requests"] as const;

export function useJoinRequestsQuery(status?: string) {
  return useQuery({
    queryKey: [...JOIN_REQUESTS_QUERY_KEY, status ?? "all"],
    queryFn: async () => {
      const criteria: Record<string, unknown> = {};
      if (status && status !== "all") {
        criteria.status = status;
      }
      const res = await api.entities.JoinRequest.filter(criteria, {
        sort: "-created_at",
        limit: 200,
      });
      return (res.items ?? []) as JoinRequest[];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useUpdateJoinRequestStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "new" | "contacted" | "joined" | "declined";
    }) => {
      return (await api.entities.JoinRequest.update(id, {
        status,
      })) as JoinRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOIN_REQUESTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard_overview"] });
    },
  });
}

export function useConvertJoinRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      request,
      memberData,
    }: {
      request: JoinRequest;
      memberData?: Partial<Member>;
    }) => {
      // 1. Create the member
      const member = (await api.entities.Member.create({
        full_name: memberData?.full_name || request.full_name,
        email: memberData?.email || request.email,
        phone: memberData?.phone || request.phone,
        matricule: memberData?.matricule || null,
        status: "active",
        belt_rank: memberData?.belt_rank || "White",
        joined_on: todayISO(),
        program: memberData?.program || request.program || null,
        notes: memberData?.notes || null,
      })) as Member;

      // 2. Mark the join request as joined
      if (request.id) {
        await api.entities.JoinRequest.update(request.id, {
          status: "joined",
          converted_member_id: member.id,
        });
      }

      return member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOIN_REQUESTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard_overview"] });
    },
  });
}

export function useDeleteJoinRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.entities.JoinRequest.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOIN_REQUESTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard_overview"] });
    },
  });
}
