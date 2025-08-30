import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "~/lib/server/auth/admin";
import { prisma } from "~/lib/server/db";

export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth();

    const { userId, action, amount, reason } = await request.json();

    if (!userId || !action || !amount || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (action !== "add" && action !== "deduct") {
      return NextResponse.json(
        { error: "Invalid action. Must be 'add' or 'deduct'" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be positive" },
        { status: 400 }
      );
    }

    // Get current user credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if deducting more than available
    if (action === "deduct" && amount > user.credits) {
      return NextResponse.json(
        { error: "Cannot deduct more credits than user has" },
        { status: 400 }
      );
    }

    // Calculate new balance
    const newBalance =
      action === "add" ? user.credits + amount : user.credits - amount;

    // Update user credits
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { credits: newBalance },
      select: { credits: true },
    });

    // Create a transaction record for audit trail
    await prisma.transaction.create({
      data: {
        userId,
        amount: action === "add" ? amount * 100 : -(amount * 100), // Store in cents
        type: "CREDIT_PURCHASE",
        status: "COMPLETED",
        packageType: "CREDITS",
        creditsPurchased: amount,
      },
    });

    return NextResponse.json({
      success: true,
      newBalance: updatedUser.credits,
      action,
      amount,
      reason,
    });
  } catch (error) {
    console.error("Error managing user credits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
