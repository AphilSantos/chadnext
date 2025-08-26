import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import SidebarNav from "~/components/layout/sidebar-nav";
import { getCurrentSession } from "~/lib/server/auth/session";
import { prisma } from "~/lib/server/db";
import Icons from "~/components/shared/icons";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");

  // Get user's current credits
  const userWithCredits = await prisma.user.findUnique({
    where: { id: user.id },
    select: { credits: true }
  });

  const credits = userWithCredits?.credits || 0;

  return (
    <div className="container">
      {/* Dashboard Header */}
      <div className="mb-8 flex items-center justify-between rounded-lg border bg-card p-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Poker Editing Dashboard</h1>
          <Badge variant="secondary" className="text-sm">
            {credits} Credits Remaining
          </Badge>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="gap-2">
            <Icons.add className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="flex min-h-[calc(100vh-140px)] md:min-h-[calc(100vh-160px)]">
        <SidebarNav />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
