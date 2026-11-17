import { useState } from "react";
import AthletesPanel from "@/components/coach/AthletesPanel";
import { MemberSheet } from "@/components/coach/MemberSheet";
import PromoteDialog from "@/components/coach/PromoteDialog";
import {
  useMembersQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  usePromoteMemberMutation,
} from "@/lib/api/member.queries";
import type { Member, Rank } from "@/lib/types";

export default function DashboardAthletesRoute() {
  const { data: members = [] } = useMembersQuery();
  const createMemberMutation = useCreateMemberMutation();
  const updateMemberMutation = useUpdateMemberMutation();
  const promoteMemberMutation = usePromoteMemberMutation();

  const [memberSheetOpen, setMemberSheetOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [promoteTarget, setPromoteTarget] = useState<Member | null>(null);

  const handleSaveMember = async (data: Partial<Member>) => {
    if (editingMember?.id) {
      await updateMemberMutation.mutateAsync({
        id: editingMember.id,
        data,
      });
    } else {
      await createMemberMutation.mutateAsync(data);
    }
    setMemberSheetOpen(false);
    setEditingMember(null);
  };

  const handlePromote = async (toRank: Rank, note?: string) => {
    if (!promoteTarget) return;
    await promoteMemberMutation.mutateAsync({
      memberId: promoteTarget.id,
      toRank,
      note,
    });
    setPromoteTarget(null);
  };

  return (
    <div className="space-y-6">
      <AthletesPanel
        members={members}
        onPromote={(member) => setPromoteTarget(member)}
        onAdd={() => {
          setEditingMember(null);
          setMemberSheetOpen(true);
        }}
        onEdit={(member) => {
          setEditingMember(member);
          setMemberSheetOpen(true);
        }}
      />

      <MemberSheet
        open={memberSheetOpen}
        member={editingMember}
        onClose={() => {
          setMemberSheetOpen(false);
          setEditingMember(null);
        }}
        onSave={handleSaveMember}
      />

      <PromoteDialog
        member={promoteTarget}
        onClose={() => setPromoteTarget(null)}
        onSubmit={handlePromote}
      />
    </div>
  );
}
