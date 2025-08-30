import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "~/lib/server/auth/admin";
import { prisma } from "~/lib/server/db";

// GET - Fetch current banner content
export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth();

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

// POST - Create new banner content
export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth();

    const { title, message, isActive, startDate, endDate } =
      await request.json();

    if (!title?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }

    // If creating an active banner, deactivate any existing active banners
    if (isActive) {
      await prisma.bannerContent.updateMany({
        where: {
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });
    }

    const banner = await prisma.bannerContent.create({
      data: {
        title: title.trim(),
        message: message.trim(),
        isActive,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json({ banner });
  } catch (error) {
    console.error("Error creating banner content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update existing banner content
export async function PUT(request: NextRequest) {
  try {
    await requireAdminAuth();

    const { id, title, message, isActive, startDate, endDate } =
      await request.json();

    if (!id || !title?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "ID, title, and message are required" },
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
      data: {
        title: title.trim(),
        message: message.trim(),
        isActive,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json({ banner });
  } catch (error) {
    console.error("Error updating banner content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
