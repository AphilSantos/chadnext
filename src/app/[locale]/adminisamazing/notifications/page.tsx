import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { BroadcastNotificationForm } from "~/components/admin/broadcast-notification-form";
import { BroadcastHistory } from "~/components/admin/broadcast-history";
import { prisma } from "~/lib/server/db";
import { requireAdminAuth } from "~/lib/server/auth/admin";

export default async function NotificationsPage() {
  // Verify admin authentication
  await requireAdminAuth();

  // Fetch all users for the form
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Fetch recent broadcast notifications
  const recentBroadcasts = await prisma.broadcastNotification.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    include: {
      userNotifications: {
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-2">
          Send notifications to all users or selected users
        </p>
      </div>

      <BroadcastNotificationForm users={users} />

      <BroadcastHistory broadcasts={recentBroadcasts} />
    </div>
  );
}
