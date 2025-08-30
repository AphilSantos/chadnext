"use server";

import { type Project, type PackageType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentSession } from "~/lib/server/auth/session";
import { prisma } from "~/lib/server/db";
import { pokerPackages } from "~/config/subscription";

interface CreateProjectPayload {
  name: string;
  packageType: PackageType;
  wherePlayed?: string | null;
  stakes?: string | null;
  numPlayers: number;
  playerHands?: any; // { "player1Hand": "A♠ K♥", "player2Hand": "Q♦ J♣", ... }
  flop?: string | null;
  turn?: string | null;
  river?: string | null;
  voiceoverUrls?: any; // Array of voiceover URLs
  videoUrls?: any; // Array of video URLs
  notes?: string | null; // Notes for editors
}

export async function checkIfFreePlanLimitReached() {
  const { user } = await getCurrentSession();
  
  // For poker platform, we'll use a simple limit check
  // You can adjust this logic based on your requirements
  const projectCount = await prisma.project.count({
    where: {
      userId: user?.id,
    },
  });
  
  // Allow up to 3 projects for free users
  return projectCount >= 3;
}

export async function createProject(payload: CreateProjectPayload) {
  const { user } = await getCurrentSession();

  // Set expiration for drafts (24 hours from now)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.project.create({
    data: {
      ...payload,
      status: "DRAFT",
      expiresAt,
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });

  revalidatePath(`/dashboard/projects`);
}

export async function getProjects() {
  const { user } = await getCurrentSession();
  const projects = await prisma.project.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return projects as Project[];
}

export async function getProjectById(id: string) {
  const { user } = await getCurrentSession();
  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: user?.id,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
      transaction: true,
    },
  });
  return project;
}

export async function updateProjectById(id: string, payload: Partial<CreateProjectPayload>) {
  const { user } = await getCurrentSession();
  await prisma.project.update({
    where: {
      id,
      userId: user?.id,
    },
    data: payload,
  });
  revalidatePath(`/dashboard/projects`);
}

export async function deleteProjectById(id: string) {
  const { user } = await getCurrentSession();
  await prisma.project.delete({
    where: {
      id,
      userId: user?.id,
    },
  });
  revalidatePath(`/dashboard/projects`);
  redirect("/dashboard/projects");
}

export async function submitProject(id: string) {
  const { user } = await getCurrentSession();
  
  // Get the project with current package type
  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: user?.id,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // Get the package details
  const selectedPackage = pokerPackages.find(pkg => pkg.id === project.packageType);
  if (!selectedPackage) {
    throw new Error("Invalid package type");
  }

  // Check if user has enough credits
  const userWithCredits = await prisma.user.findUnique({
    where: { id: user?.id },
    select: { credits: true },
  });

  if (!userWithCredits || userWithCredits.credits < selectedPackage.credits) {
    throw new Error(`Insufficient credits. You need ${selectedPackage.credits} credits for the ${selectedPackage.name} package.`);
  }

  // Deduct credits from user
  await prisma.user.update({
    where: { id: user?.id },
    data: {
      credits: {
        decrement: selectedPackage.credits,
      },
    },
  });

  // Create transaction record
  await prisma.transaction.create({
    data: {
      amount: selectedPackage.price,
      type: "PROJECT_PAYMENT",
      status: "COMPLETED",
      userId: user?.id!,
      projectId: id,
      packageType: project.packageType,
    },
  });

  // Update project status
  await prisma.project.update({
    where: {
      id,
      userId: user?.id,
    },
    data: {
      status: "SUBMITTED",
      expiresAt: null, // Remove expiration once submitted
    },
  });

  revalidatePath(`/dashboard/projects`);
  revalidatePath(`/dashboard/projects/${id}`);
}

export async function getUserCredits() {
  const { user } = await getCurrentSession();
  const userWithCredits = await prisma.user.findUnique({
    where: { id: user?.id },
    select: { credits: true },
  });
  return userWithCredits?.credits || 0;
}

export async function validateProjectSubmission(id: string) {
  const { user } = await getCurrentSession();
  
  // Get the project with current package type
  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: user?.id,
    },
  });

  if (!project) {
    return { canSubmit: false, error: "Project not found" };
  }

  // Get the package details
  const selectedPackage = pokerPackages.find(pkg => pkg.id === project.packageType);
  if (!selectedPackage) {
    return { canSubmit: false, error: "Invalid package type" };
  }

  // Check if user has enough credits
  const userWithCredits = await prisma.user.findUnique({
    where: { id: user?.id },
    select: { credits: true },
  });

  if (!userWithCredits || userWithCredits.credits < selectedPackage.credits) {
    return {
      canSubmit: false,
      error: `Insufficient credits. You need ${selectedPackage.credits} credits for the ${selectedPackage.name} package.`,
      requiredCredits: selectedPackage.credits,
      availableCredits: userWithCredits?.credits || 0,
      missingCredits: selectedPackage.credits - (userWithCredits?.credits || 0),
    };
  }

  return {
    canSubmit: true,
    requiredCredits: selectedPackage.credits,
    availableCredits: userWithCredits.credits,
    packageName: selectedPackage.name,
  };
}
