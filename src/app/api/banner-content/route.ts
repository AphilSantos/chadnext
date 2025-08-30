import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/server/db";

export async function GET(request: NextRequest) {
  try {
    const currentBanner = await prisma.bannerContent.findFirst({
      where: {
        isActive: true,
        startDate: {
          lte: new Date(),
        },
        OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ banner: currentBanner });
  } catch (error) {
    console.error("Error fetching banner content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
