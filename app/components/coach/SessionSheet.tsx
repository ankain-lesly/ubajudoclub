import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  Calendar,
  Clock,
  Users,
  BookOpen,
  CheckCircle2,
  UploadCloud,
  X,
} from "lucide-react";
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
import type { Member, TrainingSession } from "@/lib/types";
import { SessionMediaPanel } from "./SessionMediaPanel";

interface SessionSheetProps {
  open: boolean;
  session: TrainingSession | null;
  members: Member[];
  onClose: () => void;
  onSave: (data: {
    start_time: string;
    end_time: string | null;
    focus: string;
    notes: string;
    coordinatorIds: string[];
    stagedFiles?: File[];
  }) => Promise<void>;
  onMediaChanged?: () => Promise<void> | void;
}

export function SessionSheet({
  open,
  session,
  members,
  onClose,
  onSave,
  onMediaChanged,
}: SessionSheetProps) {
  const stagedInputRef = useRef<HTMLInputElement | null>(null);
  const [dateStr, setDateStr] = useState(new Date().toISOString().split("T")[0]);
  const [startTimeStr, setStartTimeStr] = useState("17:00");
  const [endTimeStr, setEndTimeStr] = useState("19:00");
  const [focus, setFocus] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedCoordinators, setSelectedCoordinators] = useState<string[]>([]);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(session?.id);

  useEffect(() => {
    if (session) {
      if (session.start_time) {
        const d = new Date(session.start_time);
        setDateStr(session.start_time.split("T")[0]);
        setStartTimeStr(d.toTimeString().slice(0, 5));
      }
      if (session.end_time) {
        const endD = new Date(session.end_time);
        setEndTimeStr(endD.toTimeString().slice(0, 5));
      }
      setFocus(session.focus || "");
      setNotes(session.notes || "");
      const existingCoordinators = session.coordinators?.map((c) => c.member_id) || [];
      setSelectedCoordinators(existingCoordinators);
    } else {
      setDateStr(new Date().toISOString().split("T")[0]);
      setStartTimeStr("17:00");
      setEndTimeStr("19:00");
      setFocus("Ukemi, Gripping & Randori");
      setNotes("");
      setSelectedCoordinators([]);
    }
    setStagedFiles([]);
    setError("");
  }, [session, open]);

  const toggleCoordinator = (memberId: string) => {
    setSelectedCoordinators((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId],
    );
  };

  const handleStagedFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const valid = Array.from(e.target.files).filter(
        (f) => f.type.startsWith("image/") || f.type.startsWith("video/"),
      );
      setStagedFiles((prev) => [...prev, ...valid]);
    }
  };

  const removeStagedFile = (idx: number) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fullStartTime = new Date(`${dateStr}T${startTimeStr}:00`).toISOString();
      const fullEndTime = endTimeStr ? new Date(`${dateStr}T${endTimeStr}:00`).toISOString() : null;

      await onSave({
        start_time: fullStartTime,
        end_time: fullEndTime,
        focus: focus.trim(),
        notes: notes.trim(),
        coordinatorIds: selectedCoordinators,
        stagedFiles: !isEditing ? stagedFiles : undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save session.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-card border-l border-ink/12 overflow-y-auto"
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <SheetHeader className="border-b border-ink/10 pb-5">
            <SheetTitle className="font-display text-xl tracking-[-0.02em]">
              {isEditing ? "Edit Training Session" : "Schedule Training Session"}
            </SheetTitle>
            <SheetDescription className="text-[13px] text-muted-foreground">
              Define the syllabus focus, session schedule, coordinators, and media.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-4 flex-1">
            {error && (
              <div className="rounded-md bg-destructive/15 border border-destructive/30 p-3 text-xs text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="session_date"
                className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
              >
                Session Date *
              </Label>
              <Input
                id="session_date"
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="bg-background font-mono text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="start_time"
                  className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
                >
                  Start Time *
                </Label>
                <Input
                  id="start_time"
                  type="time"
                  value={startTimeStr}
                  onChange={(e) => setStartTimeStr(e.target.value)}
                  className="bg-background font-mono text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="end_time"
                  className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
                >
                  End Time
                </Label>
                <Input
                  id="end_time"
                  type="time"
                  value={endTimeStr}
                  onChange={(e) => setEndTimeStr(e.target.value)}
                  className="bg-background font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="focus"
                className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
              >
                Syllabus & Focus
              </Label>
              <Input
                id="focus"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                placeholder="e.g. Osaekomi-waza, Morote-seoi-nage drills"
                className="bg-background text-xs"
              />
            </div>

            {/* Multi-coordinator selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Coordinators on Mat</span>
                <span className="text-[10px] text-primary">
                  {selectedCoordinators.length} selected
                </span>
              </Label>
              <div className="max-h-36 overflow-y-auto rounded-md border border-input bg-background p-2 space-y-1">
                {members.length === 0 && (
                  <p className="text-xs text-muted-foreground p-2 text-center">
                    No athletes registered yet.
                  </p>
                )}
                {members.map((m) => {
                  const isChecked = selectedCoordinators.includes(m.id);
                  return (
                    <label
                      key={m.id}
                      className="flex items-center gap-2 p-1.5 rounded hover:bg-secondary/50 cursor-pointer text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCoordinator(m.id)}
                        className="rounded border-ink/20 text-primary focus:ring-primary h-3.5 w-3.5"
                      />
                      <span className="font-medium flex-1">{m.full_name}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {m.belt_rank}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="session_notes"
                className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
              >
                Session Notes
              </Label>
              <textarea
                id="session_notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key technical points covered, injuries or announcements..."
                rows={2}
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            {/* Media Upload Section inside Sheet */}
            <div className="pt-2 border-t border-ink/10">
              {isEditing && session?.id ? (
                <SessionMediaPanel
                  sessionId={session.id}
                  media={session.media || []}
                  onMediaChanged={onMediaChanged}
                  compact={true}
                />
              ) : (
                <div className="space-y-2">
                  <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Session Media Upload
                  </Label>
                  <input
                    ref={stagedInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleStagedFiles}
                  />
                  <div
                    onClick={() => stagedInputRef.current?.click()}
                    className="cursor-pointer rounded-lg border border-dashed border-ink/15 bg-secondary/20 p-3.5 text-center hover:bg-secondary/30 transition-colors"
                  >
                    <UploadCloud className="mx-auto h-4 w-4 text-primary" />
                    <p className="mt-1 text-xs font-medium">Select media files to upload</p>
                    <p className="text-[10px] text-muted-foreground">
                      Photos and clips will automatically upload when session is scheduled
                    </p>
                  </div>
                  {stagedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {stagedFiles.map((f, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-[10px]"
                        >
                          <span className="truncate max-w-[120px]">{f.name}</span>
                          <button
                            type="button"
                            onClick={() => removeStagedFile(i)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <SheetFooter className="border-t border-ink/10 pt-4 flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              )}
              {isEditing ? "Update Session" : "Schedule Session"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
