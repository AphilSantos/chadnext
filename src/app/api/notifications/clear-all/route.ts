import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "~/lib/server/auth/session";
import { prisma } from "~/lib/server/db";

export async function POST(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mark all unread messages as read for user's projects
    await prisma.message.updateMany({
      where: {
        project: {
          userId: user.id,
        },
        isFromEditor: true,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    // Mark all unread broadcast notifications as read
    await prisma.userNotification.updateMany({
      where: {
        userId: user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing all notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
