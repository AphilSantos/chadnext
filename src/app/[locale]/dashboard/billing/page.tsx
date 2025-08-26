import { AlertTriangleIcon } from "lucide-react";
import { BillingForm } from "~/components/billing-form";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { getCurrentSession } from "~/lib/server/auth/session";
import { getUserSubscriptionPlan, stripe } from "~/lib/server/payment";

export default async function Billing() {
  const { user } = await getCurrentSession();

  const subscriptionPlan = await getUserSubscriptionPlan(user?.id as string);

  // For poker platform, we'll use a simplified billing system
  // Stripe functionality is temporarily disabled
  const isCanceled = false;
  
  return (
    <div className="space-y-8">
      <Alert>
        <div className="flex items-center gap-2">
          <AlertTriangleIcon className="h-5 w-5 shrink-0" />
          <div>
            <AlertDescription>
              <strong>Poker Edit Pro</strong> payment system is currently in development. 
              For now, all payments are processed through our secure payment partners.
            </AlertDescription>
          </div>
        </div>
      </Alert>
      <BillingForm
        subscriptionPlan={{
          ...subscriptionPlan,
          isCanceled,
        }}
      />
    </div>
  );
}
