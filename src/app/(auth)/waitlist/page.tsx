"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Step = "name" | "email" | "phone" | "reason" | "verify" | "done";

const STEPS: {
  key: Step;
  question: string;
  hint?: string;
  number?: number;
}[] = [
  { key: "name", question: "What's your name?", hint: "We'll use this to personalize your experience.", number: 1 },
  { key: "email", question: "What's your email?", hint: "We'll send a verification code to confirm it.", number: 2 },
  { key: "phone", question: "What's your phone number?", hint: "So we can reach you when your spot opens.", number: 3 },
  { key: "reason", question: "Why are you interested in RoboTax?", hint: "Optional — feel free to skip this.", number: 4 },
];

const TOTAL_QUESTIONS = STEPS.length;

export default function WaitlistPage() {
  const [step, setStep] = useState<Step>("name");
  const [form, setForm] = useState({ name: "", email: "", phone: "", reason: "" });
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [visible, setVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      if (step === "reason") textareaRef.current?.focus();
      else inputRef.current?.focus();
    }, 60);
    return () => clearTimeout(t);
  }, [step, visible]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  function transition(next: Step) {
    setVisible(false);
    setTimeout(() => {
      setStep(next);
      setVisible(true);
    }, 200);
  }

  async function save(opts?: { sendVerification?: boolean }) {
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sendVerification: opts?.sendVerification }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    return data;
  }

  async function handleNext() {
    if (loading) return;

    switch (step) {
      case "name":
        if (!form.name.trim()) return toast.error("Please enter your name");
        transition("email");
        break;

      case "email": {
        const email = form.email.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
          return toast.error("Please enter a valid email");
        save().catch(() => {});
        transition("phone");
        break;
      }

      case "phone":
        if (!form.phone.trim()) return toast.error("Please enter your phone number");
        transition("reason");
        break;

      case "reason": {
        setLoading(true);
        try {
          await save({ sendVerification: true });
          setCooldown(60);
          toast.success("Verification code sent to your email");
          transition("verify");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Something went wrong");
        } finally {
          setLoading(false);
        }
        break;
      }

      case "verify": {
        if (!code || code.length < 6) return toast.error("Enter the full 6-digit code");
        setLoading(true);
        try {
          const res = await fetch("/api/waitlist/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.email, code }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Verification failed");
          toast.success("Email confirmed!");
          transition("done");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Verification failed");
        } finally {
          setLoading(false);
        }
        break;
      }
    }
  }

  async function handleResend() {
    setResending(true);
    try {
      await save({ sendVerification: true });
      setCooldown(60);
      toast.success("Code resent!");
    } catch {
      toast.error("Failed to resend code");
    } finally {
      setResending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNext();
    }
  }

  const meta = STEPS.find((s) => s.key === step);
  const inputClasses =
    "w-full bg-transparent border border-border rounded-lg px-4 py-3 text-lg placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground/20 transition-colors";

  return (
    <div className="w-full">
      <div
        className={cn(
          "transition-all duration-200 ease-out",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}
      >
        {/* Step counter */}
        {meta?.number && (
          <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span>{meta.number}</span>
            <span className="text-muted-foreground/30">/</span>
            <span>{TOTAL_QUESTIONS}</span>
          </div>
        )}

        {/* Question */}
        {step !== "done" && (
          <h2 className="text-xl font-medium tracking-tight mb-1.5">
            {meta?.question ?? (step === "verify" ? "Check your inbox" : "")}
          </h2>
        )}
        {meta?.hint && (
          <p className="text-muted-foreground text-sm mb-6">{meta.hint}</p>
        )}

        {/* Inputs per step */}
        {step === "name" && (
          <input
            ref={inputRef}
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            onKeyDown={handleKeyDown}
            className={inputClasses}
          />
        )}

        {step === "email" && (
          <input
            ref={inputRef}
            type="email"
            autoComplete="email"
            placeholder="jane@company.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            onKeyDown={handleKeyDown}
            className={inputClasses}
          />
        )}

        {step === "phone" && (
          <input
            ref={inputRef}
            type="tel"
            autoComplete="tel"
            placeholder="+1 (555) 123-4567"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            onKeyDown={handleKeyDown}
            className={inputClasses}
          />
        )}

        {step === "reason" && (
          <textarea
            ref={textareaRef}
            placeholder="Tell us about your tax situation..."
            rows={4}
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleNext();
              }
            }}
            className={cn(inputClasses, "resize-none")}
          />
        )}

        {step === "verify" && (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm mb-6">
              We sent a 6-digit code to{" "}
              <span className="text-foreground">{form.email}</span>
            </p>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={6}
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              onKeyDown={handleKeyDown}
              className={cn(
                inputClasses,
                "text-2xl tracking-[0.3em] text-center font-mono"
              )}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Check your spam folder if you don&apos;t see it.</span>
              <button
                onClick={handleResend}
                disabled={cooldown > 0 || resending}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors disabled:opacity-50"
              >
                {resending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RotateCw className="h-3 w-3" />
                )}
                {cooldown > 0 ? `${cooldown}s` : "Resend"}
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border">
              <Check className="h-5 w-5 text-foreground" />
            </div>
            <h2 className="text-xl font-medium tracking-tight">
              You&apos;re on the list!
            </h2>
            <p className="text-muted-foreground text-sm">
              Thanks, {form.name.split(" ")[0]}! We&apos;ll notify you at{" "}
              <span className="text-foreground">{form.email}</span> when
              it&apos;s your turn.
            </p>
          </div>
        )}

        {/* Action row */}
        {step !== "done" && (
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={handleNext}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : step === "verify" ? (
                "Verify"
              ) : step === "reason" ? (
                form.reason.trim() ? "Continue" : "Skip"
              ) : (
                "OK"
              )}
              {!loading && <Check className="h-3.5 w-3.5" />}
            </button>
            <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
              press{" "}
              <kbd className="px-1.5 py-0.5 rounded border border-border font-mono text-[10px]">
                Enter
              </kbd>
              {step === "reason" && " or ⌘+Enter"}
            </span>
          </div>
        )}

        {/* Progress bar */}
        {meta?.number && (
          <div className="mt-8 flex gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                className={cn(
                  "h-0.5 flex-1 rounded-full transition-colors duration-300",
                  i < (meta.number ?? 0)
                    ? "bg-foreground/30"
                    : "bg-border"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
