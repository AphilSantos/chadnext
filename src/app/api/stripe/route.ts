import { revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";
import { z } from "zod";
import { siteConfig } from "~/config/site";
import { getCurrentSession } from "~/lib/server/auth/session";
import { getUserSubscriptionPlan, stripe } from "~/lib/server/payment";

export async function GET(req: NextRequest) {
  const locale = req.cookies.get("Next-Locale")?.value || "en";

  const billingUrl = siteConfig(locale).url + "/dashboard/billing/";
  try {
    const { user, session } = await getCurrentSession();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const subscriptionPlan = await getUserSubscriptionPlan(user.id);

    // For poker platform, we'll redirect to billing page
    // Stripe functionality is temporarily disabled
    revalidatePath(`/dashboard/billing`);
    return new Response(JSON.stringify({ url: billingUrl }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
