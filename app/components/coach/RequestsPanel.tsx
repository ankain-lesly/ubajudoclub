import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Inbox,
  Loader2,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  CheckCircle2,
  UserPlus,
  Trash2,
  Search,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";
import { api } from "@/lib/api/client";
import type { JoinRequest, Member, Rank } from "@/lib/types";
import { shortDate, todayISO } from "@/lib/data/coach";
import { BELTS, beltFor } from "@/lib/data/club";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Row = JoinRequest & { id: string; created_date?: string };

interface RequestsPanelProps {
  onMemberAdded?: () => void;
}

const STATUS_FILTERS = [
  { key: "all", label: "All Requests" },
  { key: "new", label: "New / Pending" },
  { key: "contacted", label: "Contacted" },
  { key: "joined", label: "Joined / Rostered" },
  { key: "declined", label: "Declined" },
] as const;

export default function RequestsPanel({ onMemberAdded }: RequestsPanelProps) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Convert to Member dialog state
  const [convertingRow, setConvertingRow] = useState<Row | null>(null);
  const [convertBelt, setConvertBelt] = useState<Rank>("White");
  const [convertMatricule, setConvertMatricule] = useState("");
  const [converting, setConverting] = useState(false);

  const load = useCallback(async () => {
    try {
      const page = await api.entities.JoinRequest.filter(
        {},
        { sort: "-created_date", limit: 100 },
      );
      setRows((page.items ?? []) as Row[]);
    } catch (err) {
      console.error("Failed to load join requests:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (row: Row, newStatus: string) => {
    setBusyId(row.id);
    try {
      await api.entities.JoinRequest.update(row.id, { status: newStatus });
      await load();
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setBusyId(null);
    }
  };

  const deleteRequest = async (row: Row) => {
    if (!confirm(`Delete join request from ${row.full_name}?`)) return;
    setBusyId(row.id);
    try {
      await api.entities.JoinRequest.delete(row.id);
      await load();
    } catch (err) {
      console.error("Delete request error:", err);
    } finally {
      setBusyId(null);
    }
  };

  const handleStartConvert = (row: Row) => {
    setConvertingRow(row);
    setConvertBelt("White");
    setConvertMatricule("");
  };

  const handleConfirmConvert = async () => {
    if (!convertingRow) return;
    setConverting(true);
    try {
      // 1. Create a member record in public.members
      const newMember = (await api.entities.Member.create({
        full_name: convertingRow.full_name.trim(),
        email: convertingRow.email.trim(),
        phone: convertingRow.phone || null,
        program: convertingRow.program || null,
        matricule: convertMatricule.trim() || null,
        belt_rank: convertBelt,
        current_belt: convertBelt.toUpperCase(),
        belt_awarded_date: todayISO(),
        status: "active",
        joined_on: todayISO(),
      })) as Member;

      // 2. Update join request status to 'joined' and store converted_member_id
      await api.entities.JoinRequest.update(convertingRow.id, {
        status: "joined",
        converted_member_id: newMember.id,
      });

      // 3. Reload requests and notify parent
      setConvertingRow(null);
      await load();
      if (onMemberAdded) {
        onMemberAdded();
      }
    } catch (err: any) {
      console.error("Failed to convert request to member:", err);
      alert(`Error converting member: ${err?.message || "Unknown error"}`);
    } finally {
      setConverting(false);
    }
  };

  const counts = useMemo(() => {
    return {
      all: rows.length,
      new: rows.filter((r) => r.status === "new" || !r.status).length,
      contacted: rows.filter((r) => r.status === "contacted").length,
      joined: rows.filter((r) => r.status === "joined").length,
      declined: rows.filter((r) => r.status === "declined").length,
    };
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return rows
      .filter((r) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "new") return r.status === "new" || !r.status;
        return r.status === statusFilter;
      })
      .filter((r) => {
        if (!q) return true;
        return (
          r.full_name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          (r.phone || "").toLowerCase().includes(q) ||
          (r.program || "").toLowerCase().includes(q) ||
          (r.message || "").toLowerCase().includes(q)
        );
      });
  }, [rows, statusFilter, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-xl border border-ink/10 bg-card py-20 text-xs text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span>Loading join requests…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Summary Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-foreground">
            Join Requests ({rows.length})
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Prospective university judoka and community members who registered through the public portal.
          </p>
        </div>

        {counts.new > 0 && (
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span>{counts.new} new enquiry awaiting response</span>
          </div>
        )}
      </div>

      {/* Filter Tabs and Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, program..."
            className="h-8.5 pl-8 text-xs bg-card"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-ink/10 bg-card p-1">
          {STATUS_FILTERS.map((f) => {
            const count = counts[f.key as keyof typeof counts];
            const isActive = statusFilter === f.key;

            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setStatusFilter(f.key)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Convert to Member Modal / Drawer Card */}
      {convertingRow && (
        <div className="rounded-xl border border-primary/30 bg-primary/[0.03] p-5 shadow-xs space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between border-b border-primary/10 pb-3">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              <h4 className="font-display text-sm font-semibold text-foreground">
                Accept to Dojo Roster: {convertingRow.full_name}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setConvertingRow(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            This will provision an official athlete profile in the club ledger. They will immediately
            appear on the mat check-in roster and athletes registry.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Starting Belt Grade *
              </Label>
              <select
                value={convertBelt}
                onChange={(e) => setConvertBelt(e.target.value as Rank)}
                className="w-full h-8.5 rounded-md border border-ink/15 bg-background px-2.5 text-xs font-medium"
              >
                {BELTS.map((b) => (
                  <option key={b.rank} value={b.rank}>
                    {b.rank} Belt ({b.kyu})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Student Matricule (Optional)
              </Label>
              <Input
                value={convertMatricule}
                onChange={(e) => setConvertMatricule(e.target.value)}
                placeholder="e.g. UBa24E0198"
                className="h-8.5 text-xs bg-background"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setConvertingRow(null)}
              disabled={converting}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={converting}
              onClick={handleConfirmConvert}
              className="h-8 gap-1.5 bg-primary px-3.5 text-xs text-white"
            >
              {converting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Adding to Roster...</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Confirm & Add to Ledger</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Requests List */}
      {filteredRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink/15 bg-card py-16 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground/30" />
          <h3 className="mt-3 font-display text-sm font-semibold text-foreground">
            No join requests found
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {searchQuery
              ? "No enquiries match your search query."
              : "Submissions from the public join portal will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3.5">
          {filteredRows.map((row) => {
            const isNew = row.status === "new" || !row.status;
            const isJoined = row.status === "joined";
            const isContacted = row.status === "contacted";
            const isDeclined = row.status === "declined";
            const isBusy = busyId === row.id;

            return (
              <div
                key={row.id}
                className={`flex flex-col justify-between gap-4 rounded-xl border bg-card p-5 transition-all sm:flex-row sm:items-start ${
                  isNew
                    ? "border-primary/40 bg-primary/[0.015]"
                    : isJoined
                      ? "border-emerald-500/20 bg-emerald-500/[0.01]"
                      : "border-ink/10"
                }`}
              >
                {/* Left Section: Prospect Info */}
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {row.full_name}
                    </h3>

                    {/* Status Badge */}
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[8.5px] font-semibold uppercase tracking-wider ${
                        isNew
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : isContacted
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                            : isJoined
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {row.status || "new"}
                    </span>

                    {/* Converted to Member indicator */}
                    {isJoined && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9.5px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Rostered Member</span>
                      </span>
                    )}

                    <span className="font-mono text-[10px] text-muted-foreground ml-auto sm:ml-0">
                      {shortDate(row.created_date)}
                    </span>
                  </div>

                  {/* Contact Badges */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <a
                      href={`mailto:${row.email}`}
                      className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors"
                      title="Send email"
                    >
                      <Mail className="h-3 w-3 text-primary" />
                      <span>{row.email}</span>
                    </a>

                    {row.phone && (
                      <>
                        <span className="text-ink/15">•</span>
                        <a
                          href={`tel:${row.phone}`}
                          className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors"
                          title="Call or message"
                        >
                          <Phone className="h-3 w-3 text-primary" />
                          <span>{row.phone}</span>
                        </a>
                      </>
                    )}

                    {row.program && (
                      <>
                        <span className="text-ink/15">•</span>
                        <span className="inline-flex items-center gap-1">
                          <GraduationCap className="h-3 w-3 text-muted-foreground" />
                          <span>{row.program}</span>
                        </span>
                      </>
                    )}
                  </div>

                  {/* Experience Badge */}
                  {row.experience && (
                    <div className="inline-block rounded-md bg-secondary/50 px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                      <span className="text-foreground font-medium">Experience:</span> {row.experience}
                    </div>
                  )}

                  {/* Message Note */}
                  {row.message && (
                    <div className="rounded-lg border border-ink/8 bg-secondary/20 p-3 text-xs text-foreground/80 leading-relaxed italic">
                      “{row.message}”
                    </div>
                  )}
                </div>

                {/* Right Section: Action Controls */}
                <div className="flex flex-wrap sm:flex-col items-end gap-2 border-t border-ink/8 pt-3 sm:border-t-0 sm:pt-0 shrink-0">
                  {/* Primary Convert / Accept to Roster Button */}
                  {!isJoined ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleStartConvert(row)}
                      className="h-8 gap-1.5 bg-primary px-3 text-xs text-white shadow-xs hover:bg-primary/90"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>Accept to Roster</span>
                    </Button>
                  ) : null}

                  {/* Status Toggle Actions */}
                  <div className="flex items-center gap-1.5">
                    {!isContacted && !isJoined && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isBusy}
                        onClick={() => updateStatus(row, "contacted")}
                        className="h-7 text-[11px] px-2.5 border-ink/15"
                      >
                        Mark Contacted
                      </Button>
                    )}

                    {!isDeclined && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={isBusy}
                        onClick={() => updateStatus(row, "declined")}
                        className="h-7 text-[11px] px-2 text-muted-foreground hover:text-foreground"
                      >
                        Decline
                      </Button>
                    )}

                    {isDeclined && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isBusy}
                        onClick={() => updateStatus(row, "new")}
                        className="h-7 text-[11px] px-2 border-ink/15"
                      >
                        Re-open
                      </Button>
                    )}

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={isBusy}
                      onClick={() => deleteRequest(row)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      title="Delete request"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
