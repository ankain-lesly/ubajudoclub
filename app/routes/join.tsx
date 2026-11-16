import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { Check, Loader2, ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api/client";
import { VENUE, WEEK } from "@/lib/data/club";
import Aura from "@/components/visual/Aura";

const EXPERIENCE = ["Never trained", "A little", "Trained elsewhere"];

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  program: "",
  experience: EXPERIENCE[0],
  message: "",
};

const Join = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const set = (key: keyof typeof initialForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setStatus("sending");
    try {
      await api.entities.JoinRequest.create({ ...form, status: "new" });
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error
          ? err.message
          : "Could not send your details. Try again.",
      );
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Aura />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1fr_1fr] lg:px-8 lg:py-24">
        <div>
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Join the mat
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.3rem,5vw,3.8rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-balance">
            Send your name. We'll meet you at the door.
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            A coach reads every message and replies before the next session. You
            do not need experience, a gi, or a partner.
          </p>

          <div className="mt-10 space-y-3 border-t border-ink/10 pt-8">
            {WEEK.map((session) => (
              <div
                key={session.day}
                className="flex items-baseline justify-between gap-4 text-[13px]">
                <span className="font-medium">{session.day}</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {session.time}
                </span>
              </div>
            ))}
            <p className="pt-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground">
              {VENUE.name} · {VENUE.campus}
            </p>
          </div>
        </div>

        {status === "done" ? (
          <div className="flex h-fit flex-col justify-center rounded-lg border border-ink/12 bg-card p-9">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-accent-foreground">
              <Check className="h-5 w-5" />
            </span>
            <h2 className="mt-6 font-display text-2xl font-semibold tracking-[-0.02em]">
              You're on the list.
            </h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
              A coach will be in touch before the next session. Come in a
              t-shirt — the mats are already down.
            </p>
            <Link
              to="/schedule"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              See the training week
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="rounded-lg border border-ink/12 bg-card p-7 sm:p-9">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  Full name
                </span>
                <input
                  required
                  value={form.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                  className="mt-2 w-full rounded-md border border-ink/15 bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="Your name"
                />
              </label>
              <label>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  Email
                </span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="mt-2 w-full rounded-md border border-ink/15 bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="you@uba.cm"
                />
              </label>
              <label>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  Phone
                </span>
                <input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className="mt-2 w-full rounded-md border border-ink/15 bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="6XX XXX XXX"
                />
              </label>
              <label>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  Programme
                </span>
                <input
                  value={form.program}
                  onChange={(e) => set("program", e.target.value)}
                  className="mt-2 w-full rounded-md border border-ink/15 bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="Year 1 Computer Science"
                />
              </label>
              <label>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  Experience
                </span>
                <select
                  value={form.experience}
                  onChange={(e) => set("experience", e.target.value)}
                  className="mt-2 w-full rounded-md border border-ink/15 bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15">
                  {EXPERIENCE.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="sm:col-span-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  Anything a coach should know
                </span>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  className="mt-2 w-full resize-none rounded-md border border-ink/15 bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="Injuries, kit size, which session you can make"
                />
              </label>
            </div>

            {error && (
              <p className="mt-4 rounded-md bg-destructive/10 px-3.5 py-2.5 text-[12.5px] text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60">
              {status === "sending" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              {status === "sending" ? "Sending" : "Request a first session"}
            </button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Your details go only to the coaching team. Nothing is published.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Join;
