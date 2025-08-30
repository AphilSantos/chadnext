import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "~/lib/server/auth/admin";
import { prisma } from "~/lib/server/db";

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    await requireAdminAuth();

    const { projectId, messageId } = await request.json();

    // Mark specific message or all messages in project as read
    const whereClause = messageId
      ? {
          id: messageId,
          isFromEditor: false,
          isRead: false,
        }
      : {
          projectId,
          isFromEditor: false,
          isRead: false,
        };

    await prisma.message.updateMany({
      where: whereClause,
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking admin messages as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
