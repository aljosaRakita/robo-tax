"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Circle, RotateCw, Lock } from "lucide-react";
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
import { toast } from "sonner";

const RESEND_COOLDOWN = 60; // seconds

export default function VerifyPage() {
  const router = useRouter();
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneSkipped, setPhoneSkipped] = useState(false);
  const [loading, setLoading] = useState<"email" | "phone" | null>(null);
  const [resending, setResending] = useState<"email" | "phone" | null>(null);
  const [emailCooldown, setEmailCooldown] = useState(0);
  const [phoneCooldown, setPhoneCooldown] = useState(0);

  // Read persisted email/phone from registration
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const initialSendDone = useRef(false);

  // Load email/phone from sessionStorage on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("robotax-verify");
      if (raw) {
        const { email, phone } = JSON.parse(raw);
        if (email) setUserEmail(email);
        if (phone) setUserPhone(phone);
      }
    } catch {
      // ignore
    }
  }, []);

  // Cooldown timers
  useEffect(() => {
    if (emailCooldown <= 0) return;
    const t = setTimeout(() => setEmailCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [emailCooldown]);

  useEffect(() => {
    if (phoneCooldown <= 0) return;
    const t = setTimeout(() => setPhoneCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phoneCooldown]);

  // ── Send / Resend OTP ──
  const sendOtp = useCallback(
    async (type: "email" | "phone", isResend = false) => {
      if (isResend) setResending(type);

      try {
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            email: userEmail || undefined,
            phone: userPhone || undefined,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          if (isResend) toast.error(data.error || "Failed to resend code");
          return;
        }

        if (type === "email") setEmailCooldown(RESEND_COOLDOWN);
        else setPhoneCooldown(RESEND_COOLDOWN);

        if (isResend) {
          toast.success(`Verification code resent to your ${type === "email" ? "email" : "phone"}`);
        }
      } catch {
        if (isResend) toast.error("Something went wrong. Please try again.");
      } finally {
        setResending(null);
      }
    },
    [userEmail, userPhone]
  );

  // Auto-send email OTP once we have the email
  useEffect(() => {
    if (!userEmail || initialSendDone.current) return;
    initialSendDone.current = true;
    sendOtp("email");
  }, [userEmail, sendOtp]);

  // ── Verify OTP ──
  async function verify(type: "email" | "phone") {
    const code = type === "email" ? emailCode : phoneCode;
    if (!code || code.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    setLoading(type);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          code,
          email: userEmail || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Verification failed");
        return;
      }

      if (type === "email") {
        setEmailVerified(true);
        toast.success("Email verified!");
      }
      if (type === "phone") {
        setPhoneVerified(true);
        toast.success("Phone verified!");

        if (data.fullyVerified) {
          sessionStorage.removeItem("robotax-verify");
          toast.success("All verified! Redirecting...");
          setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 1000);
        }
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  function goToDashboard() {
    sessionStorage.removeItem("robotax-verify");
    router.push("/dashboard");
    router.refresh();
  }

  const showPhoneStep = emailVerified && !phoneSkipped;

  return (
    <Card className="border border-border bg-card p-2 sm:p-4 rounded-xl">
      <CardHeader className="space-y-3 pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">Verify your identity</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {!emailVerified
            ? "We sent a 6-digit code to your email. Enter it below."
            : phoneSkipped || phoneVerified
              ? "You're all set."
              : "Email verified! Optionally verify your phone number."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pb-6">
        {/* ── Email step ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {emailVerified ? (
                <CheckCircle2 className="h-5 w-5 text-primary animate-fade-in" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/50" />
              )}
              <Label className="text-sm font-medium text-foreground/90">Email verification</Label>
            </div>
            {!emailVerified && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                disabled={emailCooldown > 0 || resending === "email"}
                onClick={() => sendOtp("email", true)}
              >
                {resending === "email" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RotateCw className="h-3 w-3" />
                )}
                {emailCooldown > 0 ? `${emailCooldown}s` : "Resend"}
              </Button>
            )}
          </div>
          {!emailVerified && (
            <>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  value={emailCode}
                  onChange={(e) =>
                    setEmailCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="h-10 text-center tracking-widest text-lg"
                />
                <Button
                  onClick={() => verify("email")}
                  disabled={loading === "email" || emailCode.length < 6}
                  className="shrink-0 h-10 px-5"
                >
                  {loading === "email" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Verify
                </Button>
              </div>
              {userEmail && (
                <p className="text-xs text-muted-foreground">
                  Sent to {userEmail}. Check your spam folder if you don&apos;t see it.
                </p>
              )}
            </>
          )}
          {emailVerified && (
            <p className="text-xs text-muted-foreground pl-8">
              {userEmail || "Your email"} has been verified.
            </p>
          )}
        </div>

        {/* ── Phone step (optional, shown after email verified) ── */}
        {showPhoneStep && !phoneVerified && (
          <div className="space-y-3 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Circle className="h-5 w-5 text-muted-foreground/50" />
                <Label className="text-sm font-medium text-foreground/90">
                  Phone verification
                  <span className="ml-1.5 text-xs font-normal text-muted-foreground">(optional)</span>
                </Label>
              </div>
              {phoneCooldown > 0 ? (
                <span className="text-xs text-muted-foreground tabular-nums">{phoneCooldown}s</span>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                  disabled={resending === "phone"}
                  onClick={() => sendOtp("phone", true)}
                >
                  {resending === "phone" ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <RotateCw className="h-3 w-3" />
                  )}
                  Send code
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="Enter 6-digit code"
                maxLength={6}
                value={phoneCode}
                onChange={(e) =>
                  setPhoneCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="h-10 text-center tracking-widest text-lg"
              />
              <Button
                onClick={() => verify("phone")}
                disabled={loading === "phone" || phoneCode.length < 6}
                className="shrink-0 h-10 px-5"
              >
                {loading === "phone" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Verify
              </Button>
            </div>
            {userPhone && (
              <p className="text-xs text-muted-foreground">
                Click &quot;Send code&quot; to receive a code at {userPhone}.
              </p>
            )}
          </div>
        )}

        {phoneVerified && (
          <div className="flex items-center gap-3 pl-0">
            <CheckCircle2 className="h-5 w-5 text-primary animate-fade-in" />
            <Label className="text-sm font-medium text-foreground/90">Phone verified</Label>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-2">
        {emailVerified && (
          <Button
            className="w-full h-10 animate-slide-up"
            onClick={goToDashboard}
          >
            Continue to Dashboard
          </Button>
        )}
        {showPhoneStep && !phoneVerified && (
          <Button
            variant="ghost"
            className="w-full h-9 text-sm text-muted-foreground"
            onClick={() => {
              setPhoneSkipped(true);
              goToDashboard();
            }}
          >
            Skip phone verification for now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
