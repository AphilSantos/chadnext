import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { getProjects } from "./action";
import { formatDistanceToNow } from "date-fns";
import Icons from "~/components/shared/icons";

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-800",
  SUBMITTED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  DELIVERED: "bg-green-100 text-green-800",
};

const packageColors = {
  SHORT: "bg-purple-100 text-purple-800",
  FULL: "bg-orange-100 text-orange-800",
  CREDITS: "bg-indigo-100 text-indigo-800",
};

export default async function Projects() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">My Projects</h2>
        <Link href="/dashboard/projects/new" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Icons.add className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="p-8 text-center">
          <Icons.folder className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first poker editing project.
          </p>
          <Link href="/dashboard/projects/new" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Icons.add className="h-4 w-4" />
            Create Project
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                    {project.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={packageColors[project.packageType as keyof typeof packageColors]}>
                    {project.packageType}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  {project.wherePlayed && (
                    <div className="flex items-center gap-2">
                      <Icons.mapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{project.wherePlayed}</span>
                    </div>
                  )}
                  {project.stakes && (
                    <div className="flex items-center gap-2">
                      <Icons.dollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{project.stakes}</span>
                    </div>
                  )}
                </div>
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  View Details
                  <Icons.arrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
