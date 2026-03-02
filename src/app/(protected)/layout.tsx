import { redirect } from "next/navigation";
import { getSession } from "@/lib/mock-auth";
import { NavBar } from "@/components/layout/nav-bar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <NavBar email={session.email} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
