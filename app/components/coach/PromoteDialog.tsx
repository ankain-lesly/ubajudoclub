import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { Member, Rank } from "@/lib/types";
import Modal from "@/components/coach/Modal";
import { nextRank, sessionsNeeded } from "@/lib/data/coach";

interface PromoteDialogProps {
  member: Member | null;
  onClose: () => void;
  onSubmit: (toRank: Rank, note: string) => Promise<void>;
}

const PromoteDialog = ({ member, onClose, onSubmit }: PromoteDialogProps) => {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  if (!member) return null;
  const target = nextRank(member.belt_rank);

  const submit = async () => {
    if (!target) return;
    setSaving(true);
    try {
      await onSubmit(target, note);
      setNote("");
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title="Record a grading"
      description="This resets the session counter and updates the athlete's belt."
      onClose={onClose}>
      <div className="rounded-md border border-ink/12 bg-background p-4">
        <p className="font-medium">{member.full_name}</p>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
          {member.belt_rank} → {target ?? "top grade"} ·{" "}
          {member.sessions_since_promotion ?? 0} of {sessionsNeeded(member)}{" "}
          sessions
        </p>
      </div>

      <label className="mt-4 block">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
          Board note
        </span>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ukemi clean, tai-otoshi solid, needs work on ne-waza escapes"
          className="mt-2 w-full resize-none rounded-md border border-ink/15 bg-background px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-primary"
        />
      </label>

      <button
        type="button"
        onClick={submit}
        disabled={saving || !target}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-[13px] font-semibold text-primary-foreground disabled:opacity-60">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Award {target ?? "grade"}
      </button>
    </Modal>
  );
};

export default PromoteDialog;
