import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "~/lib/server/auth/admin";
import { prisma } from "~/lib/server/db";

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    await requireAdminAuth();

    const { title, content, type, targetType, targetUserIds } =
      await request.json();

    // Validate required fields
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Determine target users based on targetType
    let targetUsers: string[] = [];

    switch (targetType) {
      case "ALL_USERS":
        const allUsers = await prisma.user.findMany({
          select: { id: true },
        });
        targetUsers = allUsers.map((user) => user.id);
        break;

      case "SELECTED_USERS":
        if (
          !targetUserIds ||
          !Array.isArray(targetUserIds) ||
          targetUserIds.length === 0
        ) {
          return NextResponse.json(
            { error: "Selected users are required" },
            { status: 400 }
          );
        }
        targetUsers = targetUserIds;
        break;

      case "ACTIVE_USERS":
        // Get users with recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const activeUsers = await prisma.user.findMany({
          where: {
            OR: [
              { projects: { some: { updatedAt: { gte: thirtyDaysAgo } } } },
              { sessions: { some: { expiresAt: { gte: new Date() } } } },
            ],
          },
          select: { id: true },
        });
        targetUsers = activeUsers.map((user) => user.id);
        break;

      default:
        return NextResponse.json(
          { error: "Invalid target type" },
          { status: 400 }
        );
    }

    if (targetUsers.length === 0) {
      return NextResponse.json(
        { error: "No users found for the specified target" },
        { status: 400 }
      );
    }

    // Create broadcast notification record
    const broadcastNotification = await prisma.broadcastNotification.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        type,
        targetType,
        targetUserIds: targetType === "SELECTED_USERS" ? targetUserIds : null,
      },
    });

    // Create individual user notification records for each target user
    const userNotificationPromises = targetUsers.map((userId) =>
      prisma.userNotification.create({
        data: {
          userId,
          broadcastNotificationId: broadcastNotification.id,
          isRead: false,
        },
      })
    );

    await prisma.$transaction(userNotificationPromises);

    return NextResponse.json({
      success: true,
      recipientCount: targetUsers.length,
      notificationId: broadcastNotification.id,
    });
  } catch (error) {
    console.error("Error sending broadcast notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
