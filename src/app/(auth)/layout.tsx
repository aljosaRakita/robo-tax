import { Bot } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.22_0.01_260)_0%,oklch(0.14_0.01_260)_100%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
      
      <div className="relative z-10 flex w-full max-w-[440px] flex-col items-center animate-fade-in">
        <div className="mb-10 flex flex-col items-center text-center animate-slide-up">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <Bot className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            RoboTax
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Unlock your tax savings with AI-powered strategies.
          </p>
        </div>
        <div className="w-full animate-slide-up" style={{ animationDelay: "100ms" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
