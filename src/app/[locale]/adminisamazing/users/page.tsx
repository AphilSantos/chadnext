import { prisma } from "~/lib/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import Icons from "~/components/shared/icons";
import UserManagementTable from "~/components/admin/user-management-table";
import CreditManagementModal from "~/components/admin/credit-management-modal";

async function getUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      credits: true,
      emailVerified: true,
      createdAt: true,
      projects: {
        select: {
          id: true,
          status: true,
        },
      },
      transactions: {
        select: {
          id: true,
          amount: true,
          status: true,
          type: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users.map(user => ({
    ...user,
    projectCount: user.projects.length,
    completedProjects: user.projects.filter(p => p.status === "DELIVERED").length,
    totalSpent: user.transactions
      .filter(t => t.status === "COMPLETED" && t.type === "PROJECT_PAYMENT")
      .reduce((sum, t) => sum + t.amount, 0),
  }));
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage user accounts, credits, and view user statistics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Icons.download className="mr-2 h-4 w-4" />
            Export Users
          </Button>
          <Button>
            <Icons.users className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Icons.users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Icons.user className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.projects.length > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Users with projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <Icons.creditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.reduce((sum, u) => sum + u.credits, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available credits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Icons.dollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(users.reduce((sum, u) => sum + u.totalSpent, 0) / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From user payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search users by name or email..."
                className="max-w-md"
              />
            </div>
            <Button variant="outline">
              <Icons.filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline">
              <Icons.refresh className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <UserManagementTable users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
