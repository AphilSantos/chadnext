import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "~/lib/server/auth/admin";
import { prisma } from "~/lib/server/db";

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    await requireAdminAuth();

    // Mark all unread messages as read
    await prisma.message.updateMany({
      where: {
        isFromEditor: false,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing all admin notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
