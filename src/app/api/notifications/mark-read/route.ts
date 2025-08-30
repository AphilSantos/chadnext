import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "~/lib/server/auth/session";
import { prisma } from "~/lib/server/db";

export async function POST(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, messageId, type, broadcastId } = await request.json();

    if (type === "broadcast") {
      // Mark broadcast notification as read
      const whereClause = messageId
        ? {
            id: messageId,
            userId: user.id,
            isRead: false,
          }
        : {
            userId: user.id,
            isRead: false,
          };

      await prisma.userNotification.updateMany({
        where: whereClause,
        data: {
          isRead: true,
        },
      });
    } else {
      // Mark project message as read
      const whereClause = messageId
        ? {
            id: messageId,
            project: {
              userId: user.id,
            },
            isFromEditor: true,
            isRead: false,
          }
        : {
            projectId,
            project: {
              userId: user.id,
            },
            isFromEditor: true,
            isRead: false,
          };

      await prisma.message.updateMany({
        where: whereClause,
        data: {
          isRead: true,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
