import { useEffect, useState } from "react";
import { Loader2, User, Award, Phone, Mail, FileText, CheckCircle2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BELTS } from "@/lib/data/club";
import type { Member, Rank, MemberStatus } from "@/lib/types";

interface MemberSheetProps {
  open: boolean;
  member: Member | null; // null means create mode
  onClose: () => void;
  onSave: (data: Partial<Member>) => Promise<void>;
}

export function MemberSheet({ open, member, onClose, onSave }: MemberSheetProps) {
  const [fullName, setFullName] = useState("");
  const [matricule, setMatricule] = useState("");
  const [program, setProgram] = useState("");
  const [beltRank, setBeltRank] = useState<Rank>("White");
  const [status, setStatus] = useState<MemberStatus>("active");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(member?.id);

  useEffect(() => {
    if (member) {
      setFullName(member.full_name || "");
      setMatricule(member.matricule || "");
      setProgram(member.program || "");
      setBeltRank(member.belt_rank || "White");
      setStatus(member.status || "active");
      setPhone(member.phone || "");
      setEmail(member.email || "");
      setNotes(member.notes || "");
    } else {
      setFullName("");
      setMatricule("");
      setProgram("");
      setBeltRank("White");
      setStatus("active");
      setPhone("");
      setEmail("");
      setNotes("");
    }
    setError("");
  }, [member, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Athlete full name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({
        full_name: fullName.trim(),
        matricule: matricule.trim() || null,
        program: program.trim() || null,
        belt_rank: beltRank,
        status,
        phone: phone.trim() || null,
        email: email.trim() || null,
        notes: notes.trim() || null,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save athlete details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-card border-l border-ink/12 overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <SheetHeader className="border-b border-ink/10 pb-5">
            <SheetTitle className="font-display text-xl tracking-[-0.02em]">
              {isEditing ? "Athlete Profile" : "Register New Athlete"}
            </SheetTitle>
            <SheetDescription className="text-[13px] text-muted-foreground">
              {isEditing
                ? "Manage dojo membership details and rank progression."
                : "Add an athlete to the UBa Judo Club roster."}
            </SheetDescription>
          </SheetHeader>

          {isEditing && member && (
            <div className="grid grid-cols-3 gap-2 py-4 my-3 bg-secondary/50 rounded-lg p-3 text-center border border-ink/8">
              <div>
                <p className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Total</p>
                <p className="font-display text-lg font-bold text-foreground">{member.sessions_total ?? 0}</p>
                <p className="text-[10px] text-muted-foreground">sessions</p>
              </div>
              <div className="border-x border-ink/8">
                <p className="text-[10px] uppercase font-mono tracking-widest text-primary">In Rank</p>
                <p className="font-display text-lg font-bold text-primary">{member.sessions_since_promotion ?? 0}</p>
                <p className="text-[10px] text-muted-foreground">towards next</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Last On Mat</p>
                <p className="font-display text-xs font-semibold text-foreground mt-1 truncate">
                  {member.last_attended ? member.last_attended.split("T")[0] : "None yet"}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4 py-4 flex-1">
            {error && (
              <div className="rounded-md bg-destructive/15 border border-destructive/30 p-3 text-xs text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="full_name" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Full Name *
              </Label>
              <Input
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Roland Chenwi"
                className="bg-background"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="matricule" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Matricule
                </Label>
                <Input
                  id="matricule"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  placeholder="UBa23E0124"
                  className="bg-background font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Status
                </Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as MemberStatus)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="active">Active (On mat)</option>
                  <option value="paused">Paused (Term off)</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="program" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Faculty / Department
              </Label>
              <Input
                id="program"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                placeholder="Faculty of Science - Computer Engineering"
                className="bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="belt" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Current Belt Rank
              </Label>
              <select
                id="belt"
                value={beltRank}
                onChange={(e) => setBeltRank(e.target.value as Rank)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
              >
                {BELTS.map((belt) => (
                  <option key={belt.rank} value={belt.rank}>
                    {belt.rank} Belt ({belt.kyu})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+237 6..."
                  className="bg-background font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@uba.cm"
                  className="bg-background text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Coach Notes / Medical
              </Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ukemi background, competition goals, injuries..."
                rows={3}
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          </div>

          <SheetFooter className="border-t border-ink/10 pt-4 flex gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />}
              {isEditing ? "Save Changes" : "Register Athlete"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
