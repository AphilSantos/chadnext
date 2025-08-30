import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentSession } from "~/lib/server/auth/session";
import { prisma } from "~/lib/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Icons from "~/components/shared/icons";

export default async function ChatPage() {
  const { user } = await getCurrentSession();
  
  if (!user) {
    redirect("/login");
  }

  // Get user's projects with messages
  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1, // Get latest message
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Project Chat</h1>
        <p className="text-muted-foreground">
          Communicate with editors about your projects.
        </p>
      </div>

      {projects.length === 0 ? (
        <Card className="p-8 text-center">
          <Icons.messageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">
            Create a project to start chatting with editors.
          </p>
                      <Link href="/dashboard/projects/new" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Icons.add className="h-4 w-4" />
              Create Project
            </Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const latestMessage = project.messages[0];
            const messageCount = project.messages.length;

            return (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge variant="outline">
                      {messageCount} {messageCount === 1 ? 'message' : 'messages'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      {project.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {latestMessage ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {latestMessage.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{latestMessage.isFromEditor ? 'Editor' : 'You'}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(latestMessage.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No messages yet
                    </p>
                  )}
                  <Link
                    href={`/dashboard/projects/${project.id}/chat`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    View Chat
                    <Icons.chevronRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
