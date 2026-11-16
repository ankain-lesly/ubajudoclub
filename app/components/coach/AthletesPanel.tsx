import { useMemo, useState } from "react";
import { Search, Plus, ArrowUpCircle } from "lucide-react";
import type { Member } from "@/lib/types";
import BeltBar from "@/components/visual/BeltBar";
import { nextRank, sessionsNeeded, shortDate } from "@/lib/data/coach";
import { cn } from "@/lib/utils";

interface AthletesPanelProps {
  members: Member[];
  onPromote: (member: Member) => void;
  onAdd: () => void;
}

const statusTone: Record<string, string> = {
  active: "bg-accent/12 text-accent",
  paused: "bg-gold/15 text-gold",
  inactive: "bg-muted text-muted-foreground",
};

const AthletesPanel = ({ members, onPromote, onAdd }: AthletesPanelProps) => {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter(
      (m) =>
        !q ||
        m.full_name.toLowerCase().includes(q) ||
        (m.matricule ?? "").toLowerCase().includes(q),
    );
  }, [members, query]);

  return (
    <div className="rounded-lg border border-ink/12 bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 p-5">
        <div>
          <p className="font-display text-lg font-semibold tracking-[-0.015em]">
            Athlete register
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            {members.length} athletes · visible to coaches only
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search athletes"
              className="w-44 rounded-md border border-ink/15 bg-background py-2 pl-8 pr-3 text-[12.5px] outline-none transition-colors focus:border-primary"
            />
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[11px] font-semibold text-paper transition-opacity hover:opacity-90">
            <Plus className="h-3 w-3" />
            Add athlete
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-ink/10 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              <th className="px-5 py-3 font-normal">Athlete</th>
              <th className="px-5 py-3 font-normal">Belt</th>
              <th className="px-5 py-3 font-normal">Sessions</th>
              <th className="px-5 py-3 font-normal">Towards next belt</th>
              <th className="px-5 py-3 font-normal">Last seen</th>
              <th className="px-5 py-3 font-normal" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-muted-foreground">
                  No athlete matches that search.
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
                  className="transition-colors hover:bg-secondary/40">
                  <td className="px-5 py-4">
                    <p className="font-medium">{member.full_name}</p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                      {member.matricule || "no matricule"} ·{" "}
                      {member.program || "UBa"}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <BeltBar rank={member.belt_rank} className="mr-2" />
                    <span className="text-[11.5px] text-muted-foreground">
                      {member.belt_rank}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono tabular-nums">
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
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onPromote(member)}
                      disabled={!canPromote}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors",
                        canPromote
                          ? "border-ink/20 text-foreground hover:border-primary hover:text-primary"
                          : "cursor-not-allowed border-ink/10 text-muted-foreground/50",
                      )}>
                      <ArrowUpCircle className="h-3 w-3" />
                      {canPromote ? "Promote" : "Dan grade"}
                    </button>
                    <span
                      className={cn(
                        "ml-2 rounded-full px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em]",
                        statusTone[member.status] ?? statusTone.active,
                      )}>
                      {member.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AthletesPanel;
