"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const RESEND_COOLDOWN = 60;

export default function WaitlistPage() {
  const [step, setStep] = useState<"form" | "verify" | "done">("form");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
  });

  // Verify step state
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }

      toast.success("Verification code sent to your email!");
      setCooldown(RESEND_COOLDOWN);
      setStep("verify");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!code || code.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/waitlist/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Verification failed");
        return;
      }

      setStep("done");
      toast.success("Email confirmed!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to resend code");
        return;
      }

      setCooldown(RESEND_COOLDOWN);
      toast.success("Verification code resent!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
  }

  // ── Done state ──
  if (step === "done") {
    return (
      <Card className="glass-panel border-0 bg-card/40 p-2 sm:p-4">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <CheckCircle2 className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            You&apos;re on the list!
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Thanks, {form.name.split(" ")[0]}! We&apos;ll notify you at{" "}
            <span className="font-medium text-foreground/80">{form.email}</span>{" "}
            when it&apos;s your turn.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // ── Verify step ──
  if (step === "verify") {
    return (
      <Card className="glass-panel border-0 bg-card/40 p-2 sm:p-4">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Confirm your email
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground/80">{form.email}</span>.
            Enter it below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pb-6">
          <div className="space-y-2.5">
            <Label htmlFor="code" className="text-sm font-medium text-foreground/90">
              Verification code
            </Label>
            <div className="flex gap-3">
              <Input
                id="code"
                placeholder="Enter 6-digit code"
                maxLength={6}
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="h-11 bg-background/50 border-border focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all duration-200 text-center tracking-widest text-lg"
              />
              <Button
                onClick={handleVerify}
                disabled={loading || code.length < 6}
                className="shrink-0 h-11 px-5 shadow-md transition-all duration-300"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Check your spam folder if you don&apos;t see it.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              disabled={cooldown > 0 || resending}
              onClick={handleResend}
            >
              {resending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RotateCw className="h-3 w-3" />
              )}
              {cooldown > 0 ? `${cooldown}s` : "Resend"}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            className="w-full h-9 text-sm text-muted-foreground"
            onClick={() => {
              setStep("form");
              setCode("");
            }}
          >
            Back to form
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // ── Form step ──
  return (
    <Card className="glass-panel border-0 bg-card/40 p-2 sm:p-4">
      <CardHeader className="space-y-3 pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Join the waitlist
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Be the first to know when RoboTax launches. We&apos;ll send you early
          access.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5 pb-6">
          <div className="space-y-2.5">
            <Label htmlFor="name" className="text-sm font-medium text-foreground/90">
              Full name
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="h-11 bg-background/50 border-border focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all duration-200"
            />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-sm font-medium text-foreground/90">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="h-11 bg-background/50 border-border focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all duration-200"
            />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="phone" className="text-sm font-medium text-foreground/90">
              Phone number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="h-11 bg-background/50 border-border focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all duration-200"
            />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="reason" className="text-sm font-medium text-foreground/90">
              Why are you interested?{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Tell us about your tax situation or what features you're most excited about..."
              rows={3}
              value={form.reason}
              onChange={(e) => update("reason", e.target.value)}
              className="bg-background/50 border-border focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all duration-200 resize-none"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full h-11 text-base font-medium shadow-md transition-all duration-300"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Join the waitlist
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
