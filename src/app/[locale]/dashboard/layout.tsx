import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import SidebarNav from "~/components/layout/sidebar-nav";
import { getCurrentSession } from "~/lib/server/auth/session";
import { prisma } from "~/lib/server/db";
import Icons from "~/components/shared/icons";
import { NotificationBell } from "~/components/shared/notification-bell";

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
      <div className="mb-8 rounded-lg border bg-card p-4">
        {/* Mobile Layout - Stacked vertically with notification bell */}
        <div className="md:hidden space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Poker Editing Dashboard</h1>
            <div className="flex items-center gap-2">
              <NotificationBell userId={user.id} />
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Icons.ellipsis className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-sm">
              {credits} Credits Remaining
            </Badge>
            <Link href="/dashboard/projects/new">
              <Button size="sm" className="gap-2">
                <Icons.add className="h-4 w-4" />
                New Project
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Desktop Layout - Side by side */}
        <div className="hidden md:flex items-center justify-between">
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
      </div>

      {/* Mobile: Sidebar on top, Desktop: Sidebar on left */}
      <div className="flex flex-col min-h-[calc(100vh-140px)] md:min-h-[calc(100vh-160px)]">
        {/* Desktop Layout - Side by side */}
        <div className="hidden md:flex min-h-[calc(100vh-140px)] md:min-h-[calc(100vh-160px)]">
          <SidebarNav />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
        
        {/* Mobile Main Content - with bottom padding for navigation bar */}
        <main className="md:hidden flex-1 p-6 pb-24">
          {children}
        </main>
      </div>
      
      {/* Mobile Navigation - Bottom Bar (rendered at root level for fixed positioning) */}
      <SidebarNav />
    </div>
  );
}
