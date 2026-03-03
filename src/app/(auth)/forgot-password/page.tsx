"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
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

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to send reset email");
        return;
      }

      setSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <Card className="glass-panel border-0 bg-card/40 p-2 sm:p-4">
        <CardHeader className="space-y-3 pb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-center text-2xl font-semibold tracking-tight">
            Check your email
          </CardTitle>
          <CardDescription className="text-center text-sm text-muted-foreground">
            We sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
            Click the link in the email to reset your password.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button
            variant="outline"
            className="w-full h-11"
            onClick={() => setSent(false)}
          >
            Try a different email
          </Button>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border-0 bg-card/40 p-2 sm:p-4">
      <CardHeader className="space-y-3 pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">Reset your password</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5 pb-6">
          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-sm font-medium text-foreground/90">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-background/50 border-border focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all duration-200"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-6">
          <Button
            type="submit"
            className="w-full h-11 text-base font-medium shadow-md transition-all duration-300"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Send reset link
          </Button>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
