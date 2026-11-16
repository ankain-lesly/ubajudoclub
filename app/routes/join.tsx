import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import {
  Check,
  Loader2,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { api } from "@/lib/api/client";
import { VENUE, WEEK } from "@/lib/data/club";
import Aura from "@/components/visual/Aura";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import type { Route } from "./+types/join";

export function meta(): Route.MetaDescriptors {
  const description =
    "Register your interest to join UBa Judo Club in Bambili. Beginners, university students, and visiting judoka welcome.";

  return [
    { title: "Join the Mat — UBa Judo Club" },
    { name: "description", content: description },
    { property: "og:site_name", content: "UBa Judo Club" },
    { property: "og:title", content: "Join the Mat — UBa Judo Club" },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Join the Mat — UBa Judo Club" },
    { name: "twitter:description", content: description },
  ];
}

const EXPERIENCE_OPTIONS = [
  { value: "Never trained", label: "Complete beginner (Never trained before)" },
  { value: "A little", label: "Some experience (Trained casually or other martial arts)" },
  { value: "Trained elsewhere", label: "Graded judoka (Trained at another dojo / graded)" },
];

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  program: "",
  experience: EXPERIENCE_OPTIONS[0].value,
  message: "",
};

export default function Join() {
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
      await api.entities.JoinRequest.create({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        program: form.program.trim() || null,
        experience: form.experience,
        message: form.message.trim() || null,
        status: "new",
      });
      setStatus("done");
    } catch (err: any) {
      console.error("Join request failed:", err);
      setStatus("idle");
      setError(
        err?.message || "Could not submit your request. Please verify your connection and try again.",
      );
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setStatus("idle");
    setError("");
  };

  return (
    <div className="relative overflow-hidden">
      <SectionBackdrop variant="dots" />
      <Aura grid={false} />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
        {/* Left Column: Dojo Invitation & Schedule */}
        <div className="space-y-8">
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Join the Mat
            </p>
            <h1 className="mt-6 font-display text-[clamp(2.3rem,5vw,3.8rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-balance">
              Step onto the tatami. We'll meet you at the door.
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              A club coordinator reviews every submission and reaches out before the next training
              session. No previous experience, uniform (judogi), or partner required to begin.
            </p>
          </div>

          {/* Training Schedule Box */}
          <div className="rounded-xl border border-ink/10 bg-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-ink/8 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-display text-sm font-semibold text-foreground">
                  Weekly Training Sessions
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                All Ranks Welcome
              </span>
            </div>

            <div className="space-y-2.5">
              {WEEK.map((session) => (
                <div
                  key={session.day}
                  className="flex items-baseline justify-between text-xs"
                >
                  <span className="font-medium text-foreground">{session.day}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {session.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-ink/8 text-[11px] text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>
                {VENUE.name} · {VENUE.campus}
              </span>
            </div>
          </div>

          {/* What to bring note */}
          <div className="rounded-xl border border-ink/10 bg-secondary/30 p-5 space-y-2 text-xs">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              What to bring for your first session
            </p>
            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
              <li>Clean workout clothes (t-shirt and sweatpants or tracksuit bottoms)</li>
              <li>Water bottle and flip-flops/slippers (for stepping off the mat)</li>
              <li>Trimmed fingernails and toenails for safety on the tatami</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Submission Form or Confirmation */}
        <div>
          {status === "done" ? (
            <div className="flex flex-col justify-center rounded-2xl border border-ink/12 bg-card p-8 sm:p-10 shadow-sm animate-in fade-in-50 zoom-in-95 duration-300">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground shadow-xs">
                <Check className="h-6 w-6" />
              </span>
              <h2 className="mt-6 font-display text-2xl font-semibold tracking-[-0.02em] text-foreground">
                You're on the dojo roster list.
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                Thank you, <strong className="text-foreground">{form.full_name}</strong>. A coach
                will review your request and get in touch with you at{" "}
                <span className="font-mono text-foreground font-medium">{form.email}</span>{" "}
                {form.phone ? `or via WhatsApp (${form.phone})` : ""} before the next session.
              </p>

              <div className="mt-8 rounded-lg border border-ink/8 bg-secondary/30 p-4 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Next Step:</p>
                <p>
                  Check your inbox for a confirmation. You can also drop by UBa Campus Amphi 100
                  during regular training sessions to watch and meet the team.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/schedule"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-primary/90 transition-colors"
                >
                  <span>View Training Schedule</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-background px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-ink/30 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Submit Another Request</span>
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="rounded-2xl border border-ink/12 bg-card p-7 sm:p-9 shadow-xs space-y-4.5"
            >
              <div>
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground">
                  Request a First Session
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Fill in your details below and a coach will reserve your spot on the tatami.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground">
                    Full Name *
                  </label>
                  <input
                    required
                    value={form.full_name}
                    onChange={(e) => set("full_name", e.target.value)}
                    className="w-full rounded-md border border-ink/15 bg-background px-3.5 py-2 text-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Fongoh Danielle"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className="w-full rounded-md border border-ink/15 bg-background px-3.5 py-2 text-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="you@univ-bambili.cm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground">
                    Phone / WhatsApp
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className="w-full rounded-md border border-ink/15 bg-background px-3.5 py-2 text-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="6XX XXX XXX"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground">
                    Faculty / Academic Programme
                  </label>
                  <input
                    value={form.program}
                    onChange={(e) => set("program", e.target.value)}
                    className="w-full rounded-md border border-ink/15 bg-background px-3.5 py-2 text-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Computer Science Level 200, Nursing, Law"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground">
                    Judo / Martial Arts Background
                  </label>
                  <select
                    value={form.experience}
                    onChange={(e) => set("experience", e.target.value)}
                    className="w-full rounded-md border border-ink/15 bg-background px-3 py-2 text-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground">
                    Message / Anything a coach should know
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    className="w-full resize-none rounded-md border border-ink/15 bg-background p-3 text-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Injuries, kit size, specific session you'd like to attend..."
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-md bg-destructive/10 border border-destructive/20 px-3.5 py-2 text-xs text-destructive">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold text-white shadow-xs transition-all hover:bg-primary/90 disabled:opacity-60"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <span>Send Join Request</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-center text-[10.5px] text-muted-foreground pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>Submitted directly to the coaching team. Never published publicly.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
