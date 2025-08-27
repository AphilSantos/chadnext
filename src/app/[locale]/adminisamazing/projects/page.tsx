import { prisma } from "~/lib/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import Icons from "~/components/shared/icons";
import Link from "next/link";

async function getProjects() {
  const projects = await prisma.project.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects;
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  const statusCounts = {
    DRAFT: projects.filter(p => p.status === "DRAFT").length,
    SUBMITTED: projects.filter(p => p.status === "SUBMITTED").length,
    IN_PROGRESS: projects.filter(p => p.status === "IN_PROGRESS").length,
    DELIVERED: projects.filter(p => p.status === "DELIVERED").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600 mt-2">
            Review and manage project submissions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Icons.download className="mr-2 h-4 w-4" />
            Export Projects
          </Button>
          <Button>
            <Icons.folder className="mr-2 h-4 w-4" />
            View All
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Icons.edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{statusCounts.DRAFT}</div>
            <p className="text-xs text-muted-foreground">
              Incomplete projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <Icons.clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statusCounts.SUBMITTED}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Icons.spinner className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{statusCounts.IN_PROGRESS}</div>
            <p className="text-xs text-muted-foreground">
              Currently editing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <Icons.check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.DELIVERED}</div>
            <p className="text-xs text-muted-foreground">
              Completed projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.slice(0, 10).map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Icons.folder className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500">
                      by {project.user.name || project.user.email}
                    </p>
                    <p className="text-xs text-gray-400">
                      {project.packageType} • {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      project.status === "DELIVERED"
                        ? "default"
                        : project.status === "IN_PROGRESS"
                        ? "secondary"
                        : project.status === "SUBMITTED"
                        ? "outline"
                        : "destructive"
                    }
                  >
                    {project.status.replace("_", " ")}
                  </Badge>
                  
                  <Button variant="outline" size="sm">
                    <Icons.edit className="mr-2 h-4 w-4" />
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {projects.length === 0 && (
            <div className="text-center py-12">
              <Icons.folder className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Projects will appear here once users start creating them.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
