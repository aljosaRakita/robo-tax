"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
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
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast.error(error.message || "Failed to reset password");
        return;
      }

      setDone(true);
      toast.success("Password updated successfully!");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <Card className="glass-panel border-0 bg-card/40 p-2 sm:p-4">
        <CardHeader className="space-y-3 pb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <CheckCircle2 className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-center text-2xl font-semibold tracking-tight">
            Password updated
          </CardTitle>
          <CardDescription className="text-center text-sm text-muted-foreground">
            Your password has been reset. Redirecting you to the dashboard...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border-0 bg-card/40 p-2 sm:p-4">
      <CardHeader className="space-y-3 pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">Set new password</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Choose a new password for your account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5 pb-6">
          <div className="space-y-2.5">
            <Label htmlFor="password" className="text-sm font-medium text-foreground/90">New password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-background/50 border-border focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all duration-200"
            />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground/90">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            Reset password
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
