import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "~/lib/server/auth/admin";
import { prisma } from "~/lib/server/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    await requireAdminAuth();

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Broadcast ID is required" },
        { status: 400 }
      );
    }

    // Delete the broadcast notification and all associated user notifications
    // This will cascade delete due to the foreign key relationship
    await prisma.broadcastNotification.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting broadcast notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
