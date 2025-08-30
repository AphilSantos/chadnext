import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "~/lib/server/auth/admin";
import { prisma } from "~/lib/server/db";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth();

    const banners = await prisma.bannerContent.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ banners });
  } catch (error) {
    console.error("Error fetching banner history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
