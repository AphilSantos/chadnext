import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "~/lib/server/auth/admin";
import { prisma } from "~/lib/server/db";

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    await requireAdminAuth();

    const { projectId, content, attachments } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Create the message as admin/editor
    const message = await prisma.message.create({
      data: {
        content: content || "",
        projectId,
        isFromEditor: true, // Admin/Editor messages
        attachments: attachments && attachments.length > 0 ? attachments : null,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error creating admin message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    await requireAdminAuth();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
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
    console.error("Error fetching admin messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
