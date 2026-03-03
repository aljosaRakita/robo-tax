"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
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

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      toast.success("Account created! Please verify your email and phone.");
      router.push("/verify");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="glass-panel border-0 bg-card/40 p-2 sm:p-4">
      <CardHeader className="space-y-3 pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">Create an account</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Enter your details to get started with RoboTax
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5 pb-6">
          <div className="space-y-2.5">
            <Label htmlFor="name" className="text-sm font-medium text-foreground/90">Full name</Label>
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
            <Label htmlFor="email" className="text-sm font-medium text-foreground/90">Email</Label>
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
            <Label htmlFor="phone" className="text-sm font-medium text-foreground/90">Phone number</Label>
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
            <Label htmlFor="password" className="text-sm font-medium text-foreground/90">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              required
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="h-11 bg-background/50 border-border focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all duration-200"
            />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground/90">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              required
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
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
            Create account
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
