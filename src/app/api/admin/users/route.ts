import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "~/lib/server/auth/admin";
import { prisma } from "~/lib/server/db";

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    await requireAdminAuth();

    // Get all users with their projects and latest messages
    const users = await prisma.user.findMany({
      include: {
        projects: {
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1, // Get latest message
            },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
