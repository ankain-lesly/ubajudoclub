import { useEffect, useRef, useState, useMemo } from "react";
import {
  Loader2,
  Calendar,
  Clock,
  Users,
  BookOpen,
  CheckCircle2,
  UploadCloud,
  X,
  Search,
  Check,
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
import BeltBar from "@/components/visual/BeltBar";
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
  const [coordinatorSearchQuery, setCoordinatorSearchQuery] = useState("");
  const [coordinatorDropdownOpen, setCoordinatorDropdownOpen] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(session?.id);

  const selectedMembers = useMemo(() => {
    return members.filter((m) => selectedCoordinators.includes(m.id));
  }, [members, selectedCoordinators]);

  const filteredMembers = useMemo(() => {
    if (!coordinatorSearchQuery.trim()) return members;
    const q = coordinatorSearchQuery.toLowerCase();
    return members.filter(
      (m) =>
        m.full_name?.toLowerCase().includes(q) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.matricule && m.matricule.toLowerCase().includes(q)) ||
        (m.belt_rank && m.belt_rank.toLowerCase().includes(q)),
    );
  }, [members, coordinatorSearchQuery]);

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
    setCoordinatorSearchQuery("");
    setCoordinatorDropdownOpen(false);
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
        className="w-full sm:max-w-md bg-card border-l border-ink/12 overflow-y-auto px-5"
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <SheetHeader className="border-b border-ink/10 pb-5 px-0">
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

            {/* Searchable Multi-coordinator selection */}
            <div className="space-y-2">
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Coordinators on Mat</span>
                <span className="text-[10px] text-primary">
                  {selectedCoordinators.length} selected
                </span>
              </Label>

              {/* Selected Coordinator Tags */}
              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-2 rounded-lg border border-ink/10 bg-secondary/20">
                  {selectedMembers.map((m) => (
                    <span
                      key={m.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-background py-1 pl-2.5 pr-1.5 text-xs shadow-xs"
                    >
                      <BeltBar rank={m.belt_rank} className="h-3 w-auto" />
                      <span className="font-medium text-foreground">{m.full_name}</span>
                      <button
                        type="button"
                        onClick={() => toggleCoordinator(m.id)}
                        className="rounded-full p-0.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                        title={`Remove ${m.full_name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Searchable Combobox Input & Dropdown */}
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    value={coordinatorSearchQuery}
                    onChange={(e) => {
                      setCoordinatorSearchQuery(e.target.value);
                      setCoordinatorDropdownOpen(true);
                    }}
                    onFocus={() => setCoordinatorDropdownOpen(true)}
                    placeholder="Search athletes by name, belt, or matricule..."
                    className="bg-background pl-8 pr-8 text-xs"
                  />
                  {coordinatorSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setCoordinatorSearchQuery("")}
                      className="absolute right-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {coordinatorDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setCoordinatorDropdownOpen(false)}
                    />
                    <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-52 overflow-y-auto rounded-lg border border-ink/15 bg-card shadow-lg divide-y divide-ink/8">
                      {filteredMembers.length === 0 ? (
                        <div className="px-3 py-3 text-center text-xs text-muted-foreground">
                          {members.length === 0
                            ? "No athletes registered in the club yet."
                            : `No athletes match "${coordinatorSearchQuery}"`}
                        </div>
                      ) : (
                        filteredMembers.map((member) => {
                          const isSelected = selectedCoordinators.includes(member.id);
                          return (
                            <button
                              key={member.id}
                              type="button"
                              onClick={() => {
                                toggleCoordinator(member.id);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                                isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 pr-2">
                                <div
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                    isSelected
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-input bg-background"
                                  }`}
                                >
                                  {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                </div>
                                <div className="min-w-0">
                                  <p
                                    className={`font-medium truncate ${
                                      isSelected ? "text-primary" : "text-foreground"
                                    }`}
                                  >
                                    {member.full_name}
                                  </p>
                                  {member.email && (
                                    <p className="text-[10px] text-muted-foreground truncate">
                                      {member.email}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="inline-flex items-center gap-1.5 rounded bg-secondary px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                                  <BeltBar rank={member.belt_rank} className="h-3 w-auto" />
                                  {member.belt_rank}
                                </span>
                                {member.matricule && (
                                  <span className="font-mono text-[9px] text-muted-foreground/75">
                                    #{member.matricule}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </>
                )}
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
