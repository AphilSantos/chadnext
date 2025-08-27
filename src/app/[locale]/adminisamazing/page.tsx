import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Icons from "~/components/shared/icons";
import Link from "next/link";
import { prisma } from "~/lib/server/db";

async function getDashboardStats() {
  const [
    totalUsers,
    totalProjects,
    totalRevenue,
    pendingProjects,
    activeProjects,
    completedProjects,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.transaction.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    }),
    prisma.project.count({ where: { status: "SUBMITTED" } }),
    prisma.project.count({ where: { status: "IN_PROGRESS" } }),
    prisma.project.count({ where: { status: "DELIVERED" } }),
  ]);

  return {
    totalUsers,
    totalProjects,
    totalRevenue: totalRevenue._sum.amount || 0,
    pendingProjects,
    activeProjects,
    completedProjects,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const quickActions = [
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      href: "/en/adminisamazing/users",
      icon: Icons.users,
      color: "bg-blue-500",
    },
    {
      title: "Review Projects",
      description: "Check submitted projects",
      href: "/en/adminisamazing/projects",
      icon: Icons.folder,
      color: "bg-green-500",
    },
    {
      title: "Payment History",
      description: "View transaction records",
      href: "/en/adminisamazing/payments",
      icon: Icons.creditCard,
      color: "bg-purple-500",
    },
    {
      title: "Send Notifications",
      description: "Communicate with users",
      href: "/en/adminisamazing/notifications",
      icon: Icons.bell,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to the administrative control panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Icons.users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Icons.folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              All projects
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
              ${(stats.totalRevenue / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From completed transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Projects</CardTitle>
            <Icons.clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingProjects}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Submitted</span>
              <span className="font-semibold text-blue-600">{stats.pendingProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">In Progress</span>
              <span className="font-semibold text-orange-600">{stats.activeProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="font-semibold text-green-600">{stats.completedProjects}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/en/adminisamazing/users">
              <Button variant="outline" className="w-full justify-start">
                <Icons.users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </Link>
            <Link href="/en/adminisamazing/projects">
              <Button variant="outline" className="w-full justify-start">
                <Icons.folder className="mr-2 h-4 w-4" />
                Review Projects
              </Button>
            </Link>
            <Link href="/en/adminisamazing/notifications">
              <Button variant="outline" className="w-full justify-start">
                <Icons.bell className="mr-2 h-4 w-4" />
                Send Notifications
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Database: Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">API: Operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Email: Active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
