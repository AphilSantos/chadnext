"use server";

import { type Project, type PackageType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentSession } from "~/lib/server/auth/session";
import { prisma } from "~/lib/server/db";

interface CreateProjectPayload {
  name: string;
  packageType: PackageType;
  wherePlayed?: string | null;
  stakes?: string | null;
  yourHand?: string | null;
  opponentHand?: string | null;
  flop?: string | null;
  turn?: string | null;
  river?: string | null;
  voiceoverUrl?: string | null;
  videoUrl?: string | null;
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
