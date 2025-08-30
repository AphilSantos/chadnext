import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "~/lib/server/auth/session";
import { prisma } from "~/lib/server/db";

export async function GET(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get unread messages for user's projects
    const unreadMessages = await prisma.message.findMany({
      where: {
        project: {
          userId: user.id,
        },
        isFromEditor: true, // Only count messages from editors/admins
        isRead: false,
      },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Limit to 10 most recent
    });

    // Get unread broadcast notifications for the user
    const unreadBroadcasts = await prisma.userNotification.findMany({
      where: {
        userId: user.id,
        isRead: false,
      },
      include: {
        broadcastNotification: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Limit to 10 most recent
    });

    const totalUnreadCount = unreadMessages.length + unreadBroadcasts.length;

    // Combine and sort all notifications by creation date
    const allNotifications = [
      ...unreadMessages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        projectId: msg.projectId,
        projectName: msg.project.name,
        createdAt: msg.createdAt,
        isFromEditor: msg.isFromEditor,
        type: "message" as const,
      })),
      ...unreadBroadcasts.map((broadcast) => ({
        id: broadcast.id,
        content: `[${broadcast.broadcastNotification.type}] ${broadcast.broadcastNotification.title}\n\n${broadcast.broadcastNotification.content}`,
        projectId: "broadcast",
        projectName: "System Notification",
        createdAt: broadcast.createdAt,
        isFromEditor: true,
        type: "broadcast" as const,
        broadcastId: broadcast.broadcastNotificationId,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10);

    return NextResponse.json({
      count: totalUnreadCount,
      messages: allNotifications,
    });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
