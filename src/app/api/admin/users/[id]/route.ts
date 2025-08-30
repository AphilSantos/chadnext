import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "~/lib/server/auth/admin";
import { prisma } from "~/lib/server/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminAuth();

    const { id } = params;
    const { name, email, emailVerified, credits } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    if (typeof credits !== "number" || credits < 0) {
      return NextResponse.json(
        { error: "Credits must be a valid positive number" },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: id },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already taken by another user" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name.trim(),
        email: email.trim(),
        emailVerified: Boolean(emailVerified),
        credits,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        credits: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
