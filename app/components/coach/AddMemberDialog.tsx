import { useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "@/components/coach/Modal";
import { BELTS } from "@/lib/data/club";
import type { NewMemberInput, Rank } from "@/lib/types";

interface AddMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: NewMemberInput) => Promise<void>;
}

const empty: NewMemberInput = {
  full_name: "",
  matricule: "",
  program: "",
  belt_rank: "White",
};

const AddMemberDialog = ({ open, onClose, onSubmit }: AddMemberDialogProps) => {
  const [form, setForm] = useState<NewMemberInput>(empty);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.full_name.trim()) return;
    setSaving(true);
    try {
      await onSubmit(form);
      setForm(empty);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Add an athlete"
      description="Only a name is required. Belts and session counts start at zero."
      onClose={onClose}>
      <div className="space-y-4">
        <label className="block">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Full name
          </span>
          <input
            value={form.full_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, full_name: e.target.value }))
            }
            className="mt-2 w-full rounded-md border border-ink/15 bg-background px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-primary"
            placeholder="Athlete name"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Matricule
            </span>
            <input
              value={form.matricule}
              onChange={(e) =>
                setForm((f) => ({ ...f, matricule: e.target.value }))
              }
              className="mt-2 w-full rounded-md border border-ink/15 bg-background px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-primary"
              placeholder="UBa/2026/…"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Belt
            </span>
            <select
              value={form.belt_rank}
              onChange={(e) =>
                setForm((f) => ({ ...f, belt_rank: e.target.value as Rank }))
              }
              className="mt-2 w-full rounded-md border border-ink/15 bg-background px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-primary">
              {BELTS.map((belt) => (
                <option key={belt.rank} value={belt.rank}>
                  {belt.rank}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Programme
          </span>
          <input
            value={form.program}
            onChange={(e) =>
              setForm((f) => ({ ...f, program: e.target.value }))
            }
            className="mt-2 w-full rounded-md border border-ink/15 bg-background px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-primary"
            placeholder="Year 1 Computer Science"
          />
        </label>
        <button
          type="button"
          onClick={submit}
          disabled={saving || !form.full_name.trim()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-semibold text-paper disabled:opacity-50">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Add to register
        </button>
      </div>
    </Modal>
  );
};

export default AddMemberDialog;
