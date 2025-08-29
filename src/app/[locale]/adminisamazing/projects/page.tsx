import { prisma } from "~/lib/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import ProjectDetailModal from "~/components/admin/project-detail-modal";

async function getProjects() {
  const projects = await prisma.project.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects;
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  const drafts = projects.filter(p => p.status === "DRAFT");
  const submitted = projects.filter(p => p.status !== "DRAFT");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED": return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS": return "bg-orange-100 text-orange-800";
      case "DELIVERED": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const ProjectCard = ({ project }: { project: any }) => (
    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">P</span>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{project.name}</h3>
          <p className="text-sm text-gray-500">
            by {project.user.name || project.user.email}
          </p>
          <div className="flex items-center space-x-4 mt-1">
            <p className="text-xs text-gray-400">
              {project.packageType} • {new Date(project.createdAt).toLocaleDateString()}
            </p>
            <div className="flex items-center space-x-2">
              {project.voiceoverUrl && (
                <Badge variant="outline" className="text-xs">
                  🎤 Voiceover
                </Badge>
              )}
              {project.videoUrl && (
                <Badge variant="outline" className="text-xs">
                  🎥 Video
                </Badge>
              )}
            </div>
          </div>
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
        
        <ProjectDetailModal project={project} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
        <p className="text-gray-600 mt-2">Review and manage project submissions</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
            <p className="text-xs text-gray-500">Total Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{drafts.length}</div>
            <p className="text-xs text-gray-500">Drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{submitted.length}</div>
            <p className="text-xs text-gray-500">Submitted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {projects.filter(p => p.status === "DELIVERED").length}
            </div>
            <p className="text-xs text-gray-500">Delivered</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="submitted" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submitted" className="flex items-center space-x-2">
            <span>📤 Submitted & Paid</span>
            <Badge variant="secondary" className="ml-2">
              {submitted.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="drafts" className="flex items-center space-x-2">
            <span>📝 Drafts</span>
            <Badge variant="secondary" className="ml-2">
              {drafts.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submitted" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Submitted & Paid Projects</span>
                <Badge variant="outline">{submitted.length} projects</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitted.length > 0 ? (
                <div className="space-y-4">
                  {submitted.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📤</div>
                  <h3 className="text-lg font-medium text-gray-900">No submitted projects</h3>
                  <p className="text-sm text-gray-500">
                    Projects will appear here once users submit them for editing.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Draft Projects</span>
                <Badge variant="outline">{drafts.length} projects</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {drafts.length > 0 ? (
                <div className="space-y-4">
                  {drafts.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-lg font-medium text-gray-900">No draft projects</h3>
                  <p className="text-sm text-gray-500">
                    Draft projects will appear here once users start creating them.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
