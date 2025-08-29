"use server";

import { prisma } from "~/lib/server/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProjectStatusSchema = z.object({
  projectId: z.string(),
  status: z.enum(["DRAFT", "SUBMITTED", "IN_PROGRESS", "DELIVERED"]),
  adminNotes: z.string().optional(),
});

export async function updateProjectStatus(data: z.infer<typeof updateProjectStatusSchema>) {
  try {
    const { projectId, status, adminNotes } = updateProjectStatusSchema.parse(data);

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        status,
        adminNotes: adminNotes || null,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/en/adminisamazing/projects");
    revalidatePath("/en/adminisamazing");

    return { success: true, project: updatedProject };
  } catch (error) {
    console.error("Error updating project status:", error);
    return { success: false, error: "Failed to update project status" };
  }
}

const sendNotificationSchema = z.object({
  userId: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.enum(["INFO", "WARNING", "SUCCESS", "ERROR"]).default("INFO"),
});

export async function sendUserNotification(data: z.infer<typeof sendNotificationSchema>) {
  try {
    const { userId, title, message, type } = sendNotificationSchema.parse(data);

    // TODO: Implement actual notification system
    // For now, we'll just log it
    console.log(`Sending ${type} notification to user ${userId}:`, { title, message });

    // You could integrate with:
    // - Email service
    // - Push notifications
    // - In-app notifications
    // - SMS

    return { success: true, message: "Notification sent successfully" };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}

export async function getProjectAnalytics() {
  try {
    const [
      totalProjects,
      projectsByStatus,
      projectsByPackage,
      projectsWithFiles,
      recentActivity,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.project.groupBy({
        by: ["packageType"],
        _count: { packageType: true },
      }),
      prisma.project.count({
        where: {
          OR: [
            { voiceoverUrl: { not: null } },
            { videoUrl: { not: null } }
          ]
        }
      }),
      prisma.project.findMany({
        take: 10,
        orderBy: { updatedAt: "desc" },
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      })
    ]);

    return {
      success: true,
      data: {
        totalProjects,
        projectsByStatus,
        projectsByPackage,
        projectsWithFiles,
        recentActivity,
      }
    };
  } catch (error) {
    console.error("Error fetching project analytics:", error);
    return { success: false, error: "Failed to fetch analytics" };
  }
}

export async function exportProjectsData() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            credits: true,
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Convert to CSV format
    const csvData = projects.map(project => ({
      "Project ID": project.id,
      "Project Name": project.name,
      "Status": project.status,
      "Package Type": project.packageType,
      "User Name": project.user.name || "N/A",
      "User Email": project.user.email,
      "User Credits": project.user.credits,
      "Voiceover File": project.voiceoverUrl ? "Yes" : "No",
      "Video File": project.videoUrl ? "Yes" : "No",
      "Created": project.createdAt.toISOString(),
      "Updated": project.updatedAt.toISOString(),
      "Where Played": project.wherePlayed || "N/A",
      "Stakes": project.stakes || "N/A",
      "Your Hand": project.yourHand,
      "Opponent Hand": project.opponentHand,
      "Flop": project.flop,
      "Turn": project.turn || "N/A",
      "River": project.river || "N/A",
    }));

    return { success: true, data: csvData };
  } catch (error) {
    console.error("Error exporting projects data:", error);
    return { success: false, error: "Failed to export data" };
  }
}
