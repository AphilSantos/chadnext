import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "~/lib/server/auth/admin";
import { prisma } from "~/lib/server/db";

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    await requireAdminAuth();

    // Get unread messages for all projects (messages from users)
    const unreadMessages = await prisma.message.findMany({
      where: {
        isFromEditor: false, // Only count messages from users
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

    const unreadCount = unreadMessages.length;

    return NextResponse.json({
      count: unreadCount,
      messages: unreadMessages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        projectId: msg.projectId,
        projectName: msg.project.name,
        createdAt: msg.createdAt,
        isFromEditor: msg.isFromEditor,
      })),
    });
  } catch (error) {
    console.error("Error fetching admin unread count:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
