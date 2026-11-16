import { useCallback, useEffect, useState } from "react";
import { Inbox, Loader2 } from "lucide-react";
import { api } from "@/lib/api/client";
import type { JoinRequest } from "@/lib/types";
import { shortDate } from "@/lib/data/coach";
import { cn } from "@/lib/utils";

type Row = JoinRequest & { id: string; created_date?: string };

const STATUSES = ["new", "contacted", "joined", "declined"] as const;

const tone: Record<string, string> = {
  new: "bg-primary/10 text-primary",
  contacted: "bg-gold/15 text-gold",
  joined: "bg-accent/12 text-accent",
  declined: "bg-muted text-muted-foreground",
};

const RequestsPanel = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const page = await api.entities.JoinRequest.filter(
      {},
      { sort: "-created_date", limit: 60 },
    );
    setRows((page.items ?? []) as Row[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (row: Row, status: string) => {
    setBusyId(row.id);
    try {
      await api.entities.JoinRequest.update(row.id, { status });
      await load();
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-ink/12 bg-card px-6 py-16 text-[13px] text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading requests…
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-ink/12 bg-card px-6 py-16 text-center">
        <Inbox className="mx-auto h-5 w-5 text-muted-foreground" />
        <p className="mt-3 text-[13px] text-muted-foreground">
          No enquiries yet. Requests from the public join form land here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div
          key={row.id}
          className="rounded-lg border border-ink/12 bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-base font-semibold tracking-[-0.01em]">
                {row.full_name}
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                {row.email} {row.phone ? `· ${row.phone}` : ""} ·{" "}
                {shortDate(row.created_date)}
              </p>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.14em]",
                tone[row.status ?? "new"],
              )}>
              {row.status ?? "new"}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            <span>{row.program || "programme not given"}</span>
            <span>{row.experience || "experience not given"}</span>
          </div>

          {row.message && (
            <p className="mt-3 text-[13px] leading-relaxed text-foreground/75">
              “{row.message}”
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {STATUSES.filter((s) => s !== row.status).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatus(row, status)}
                disabled={busyId === row.id}
                className="rounded-full border border-ink/15 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50">
                Mark {status}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestsPanel;
