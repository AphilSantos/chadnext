import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "~/lib/server/auth/session";
import { prisma } from "~/lib/server/db";

export async function POST(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, content, attachments } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Check if user has access to this project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user can send messages (only if project is submitted or in progress)
    const canSend =
      project.status === "SUBMITTED" ||
      project.status === "IN_PROGRESS" ||
      project.status === "DELIVERED";

    if (!canSend) {
      return NextResponse.json(
        { error: "You can only send messages after submitting your project" },
        { status: 403 }
      );
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content: content || "",
        projectId,
        isFromEditor: false, // User messages
        attachments: attachments && attachments.length > 0 ? attachments : null,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Check if user has access to this project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get messages for this project
    const messages = await prisma.message.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
