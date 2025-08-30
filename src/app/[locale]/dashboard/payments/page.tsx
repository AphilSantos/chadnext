import { redirect } from "next/navigation";
import { getCurrentSession } from "~/lib/server/auth/session";
import { prisma } from "~/lib/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Icons from "~/components/shared/icons";

export default async function PaymentsPage() {
  const { user } = await getCurrentSession();
  
  if (!user) {
    redirect("/login");
  }

  // Get user's transactions and credits
  const userWithData = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const credits = userWithData?.credits || 0;
  const transactions = userWithData?.transactions || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments & Credits</h1>
        <p className="text-muted-foreground">
          View your transaction history and manage your credits.
        </p>
      </div>

      {/* Credits Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.creditCard className="h-5 w-5" />
            Credit Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold">{credits}</div>
            <div className="text-muted-foreground">credits remaining</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Each credit can be used for one editing project.
          </p>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Icons.creditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
              <p className="text-muted-foreground">
                Your payment history will appear here once you make your first purchase.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg"
                >
                  {/* Left side - Transaction details */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">
                      {transaction.type === "PURCHASE" && "Package Purchase"}
                      {transaction.type === "CREDIT_PURCHASE" && "Credit Purchase"}
                      {transaction.type === "PROJECT_PAYMENT" && "Project Payment"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  
                  {/* Right side - Amount, credits, and status */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="text-right">
                      <div className="font-medium">
                        ${(transaction.amount / 100).toFixed(2)}
                      </div>
                      {transaction.creditsPurchased && (
                        <div className="text-sm text-muted-foreground">
                          {transaction.creditsPurchased} credits
                        </div>
                      )}
                    </div>
                    <Badge
                      variant={
                        transaction.status === "COMPLETED"
                          ? "default"
                          : transaction.status === "PENDING"
                          ? "secondary"
                          : "destructive"
                      }
                      className="self-start sm:self-auto"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
