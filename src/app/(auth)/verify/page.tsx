"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Circle } from "lucide-react";
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

export default function VerifyPage() {
  const router = useRouter();
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [loading, setLoading] = useState<"email" | "phone" | null>(null);

  async function verify(type: "email" | "phone") {
    const code = type === "email" ? emailCode : phoneCode;
    if (!code) {
      toast.error(`Please enter your ${type} verification code`);
      return;
    }

    setLoading(type);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, code }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Verification failed");
        return;
      }

      if (type === "email") setEmailVerified(true);
      if (type === "phone") setPhoneVerified(true);

      toast.success(
        `${type === "email" ? "Email" : "Phone"} verified successfully!`
      );

      if (data.fullyVerified) {
        toast.success("All verified! Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <Card className="glass-panel border-0 bg-card/40 p-2 sm:p-4">
      <CardHeader className="space-y-3 pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">Verify your identity</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Enter the 6-digit codes sent to your email and phone.
          <span className="mt-3 flex items-center rounded-md bg-primary/10 px-3 py-2 text-xs font-medium text-primary border border-primary/20">
            Hint: Use code 123456 for both
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {emailVerified ? (
              <CheckCircle2 className="h-6 w-6 text-primary animate-fade-in" />
            ) : (
              <Circle className="h-6 w-6 text-muted-foreground/50" />
            )}
            <Label className="text-base font-medium text-foreground/90">Email verification</Label>
          </div>
          {!emailVerified && (
            <div className="flex gap-3 pl-9">
              <Input
                placeholder="123456"
                maxLength={6}
                value={emailCode}
                onChange={(e) =>
                  setEmailCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="h-11 bg-background/50 border-border focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all duration-200 text-center tracking-widest text-lg"
              />
              <Button
                onClick={() => verify("email")}
                disabled={loading === "email"}
                className="shrink-0 h-11 px-6 shadow-md transition-all duration-300"
              >
                {loading === "email" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Verify
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {phoneVerified ? (
              <CheckCircle2 className="h-6 w-6 text-primary animate-fade-in" />
            ) : (
              <Circle className="h-6 w-6 text-muted-foreground/50" />
            )}
            <Label className="text-base font-medium text-foreground/90">Phone verification</Label>
          </div>
          {!phoneVerified && (
            <div className="flex gap-3 pl-9">
              <Input
                placeholder="123456"
                maxLength={6}
                value={phoneCode}
                onChange={(e) =>
                  setPhoneCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="h-11 bg-background/50 border-border focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all duration-200 text-center tracking-widest text-lg"
              />
              <Button
                onClick={() => verify("phone")}
                disabled={loading === "phone"}
                className="shrink-0 h-11 px-6 shadow-md transition-all duration-300"
              >
                {loading === "phone" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Verify
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {emailVerified && phoneVerified && (
          <Button
            className="w-full h-11 text-base font-medium shadow-md transition-all duration-300 animate-slide-up"
            onClick={() => {
              router.push("/dashboard");
              router.refresh();
            }}
          >
            Continue to Dashboard
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
