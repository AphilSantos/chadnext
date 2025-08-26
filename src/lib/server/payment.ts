// import Stripe from "stripe";
import { freePlan, proPlan } from "~/config/subscription";
import { prisma } from "~/lib/server/db";
import { type UserSubscriptionPlan } from "~/types";

// Mock Stripe object to prevent errors
export const stripe = {
  billingPortal: {
    sessions: {
      create: async () => ({ url: "/dashboard/billing" }),
    },
  },
  checkout: {
    sessions: {
      create: async () => ({ url: "/dashboard/billing" }),
    },
  },
  subscriptions: {
    retrieve: async () => ({ cancel_at_period_end: false }),
  },
  webhooks: {
    constructEvent: () => ({}),
  },
} as any;

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Temporarily disable pro plan check to avoid Stripe issues
  // const isPro = Boolean(
  //   user.stripePriceId &&
  //     user.stripeCurrentPeriodEnd?.getTime()! + 86_400_000 > Date.now()
  // );

  // Always return free plan for now
  const isPro = false;

  const plan = isPro ? proPlan : freePlan;

  return {
    ...plan,
    ...user,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime() || 0,
    isPro,
    stripePriceId: user.stripePriceId || "",
  };
}
