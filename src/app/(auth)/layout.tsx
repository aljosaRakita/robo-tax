import { Bot } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-8">
      <div className="relative z-10 flex w-full max-w-[480px] flex-col items-center animate-fade-in">
        <div className="mb-10 flex flex-col items-center text-center animate-slide-up">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border">
            <Bot className="h-6 w-6 text-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            RoboTax
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            AI-powered tax savings.
          </p>
        </div>
        <div className="w-full animate-slide-up" style={{ animationDelay: "100ms" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
