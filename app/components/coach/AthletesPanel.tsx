import { useMemo, useState } from "react";
import { Search, Plus, ArrowUpCircle, Edit3, User } from "lucide-react";
import type { Member, MemberStatus } from "@/lib/types";
import BeltBar from "@/components/visual/BeltBar";
import { nextRank, sessionsNeeded, shortDate } from "@/lib/data/coach";
import { cn } from "@/lib/utils";

interface AthletesPanelProps {
  members: Member[];
  onPromote: (member: Member) => void;
  onAdd: () => void;
  onEdit?: (member: Member) => void;
}

const statusTone: Record<string, string> = {
  active: "border-accent/40 bg-accent/15 text-accent dark:text-accent-foreground",
  paused: "border-gold/40 bg-gold/15 text-gold",
  inactive: "border-ink/20 bg-muted text-muted-foreground",
};

export default function AthletesPanel({ members, onPromote, onAdd, onEdit }: AthletesPanelProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | MemberStatus>("all");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      const matchesQuery =
        !q ||
        m.full_name.toLowerCase().includes(q) ||
        (m.matricule ?? "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || m.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [members, query, statusFilter]);

  return (
    <div className="rounded-lg border border-ink/12 bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 p-5">
        <div>
          <p className="font-display text-lg font-semibold tracking-[-0.015em]">
            Athlete Register & Ledger
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            {members.length} registered judokas · real-time attendance ledger
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filters */}
          <div className="flex rounded-md border border-ink/15 p-0.5 bg-background text-[11px] font-mono">
            {(["all", "active", "paused", "inactive"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-2.5 py-1 rounded capitalize transition-colors",
                  statusFilter === s
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search athletes..."
              className="w-44 rounded-md border border-ink/15 bg-background py-1.5 pl-8 pr-3 text-[12px] outline-none transition-colors focus:border-primary"
            />
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary hover:bg-primary/90 px-4 py-2 text-[11px] font-semibold text-primary-foreground transition-opacity"
          >
            <Plus className="h-3 w-3" />
            Add Athlete
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-ink/10 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              <th className="px-5 py-3 font-normal">Athlete</th>
              <th className="px-5 py-3 font-normal">Belt</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal">Total Sessions</th>
              <th className="px-5 py-3 font-normal">In Current Rank</th>
              <th className="px-5 py-3 font-normal">Last On Mat</th>
              <th className="px-5 py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                  No athlete matches that filter.
                </td>
              </tr>
            )}
            {rows.map((member) => {
              const target = sessionsNeeded(member);
              const done = member.sessions_since_promotion ?? 0;
              const pct = Math.min(Math.round((done / target) * 100), 100);
              const canPromote = Boolean(nextRank(member.belt_rank));
              return (
                <tr
                  key={member.id}
                  onClick={() => onEdit?.(member)}
                  className="transition-colors hover:bg-secondary/40 cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium hover:text-primary transition-colors">{member.full_name}</p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                      {member.matricule || "no matricule"} · {member.program || "UBa"}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2">
                      <BeltBar rank={member.belt_rank} className="h-4.5 w-auto" />
                      <span className="text-[11.5px] text-muted-foreground">{member.belt_rank}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={cn(
                        "inline-block rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                        statusTone[member.status] || statusTone.active,
                      )}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono tabular-nums font-semibold">
                    {member.sessions_total ?? 0}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-ink/10">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                        {done}/{target}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-[10px] text-muted-foreground">
                    {shortDate(member.last_attended)}
                  </td>
                  <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit?.(member)}
                        className="inline-flex items-center gap-1 rounded-full border border-ink/20 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-ink/40 transition-colors"
                      >
                        <Edit3 className="h-2.5 w-2.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onPromote(member)}
                        disabled={!canPromote}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors",
                          canPromote
                            ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                            : "cursor-not-allowed border-ink/10 text-muted-foreground/40",
                        )}
                      >
                        <ArrowUpCircle className="h-2.5 w-2.5" />
                        {canPromote ? "Promote" : "Dan"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
