import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "~/lib/server/auth/admin";
import { prisma } from "~/lib/server/db";

export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth();

    const { id, isActive } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Banner ID is required" },
        { status: 400 }
      );
    }

    // If activating this banner, deactivate any other active banners
    if (isActive) {
      await prisma.bannerContent.updateMany({
        where: {
          isActive: true,
          id: { not: id },
        },
        data: {
          isActive: false,
        },
      });
    }

    const banner = await prisma.bannerContent.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({ banner });
  } catch (error) {
    console.error("Error toggling banner status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
