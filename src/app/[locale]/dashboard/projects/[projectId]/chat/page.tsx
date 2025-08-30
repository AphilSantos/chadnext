import { notFound, redirect } from "next/navigation";
import { getCurrentSession } from "~/lib/server/auth/session";
import { prisma } from "~/lib/server/db";
import { ChatInterface } from "~/components/chat/chat-interface";

interface ChatPageProps {
  params: Promise<{ projectId: string }>;
}

async function getProjectWithMessages(projectId: string, userId: string) {
  return await prisma.project.findFirst({
    where: { 
      id: projectId,
      userId: userId,
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { user } = await getCurrentSession();
  
  if (!user) {
    redirect("/login");
  }

  const { projectId } = await params;
  const project = await getProjectWithMessages(projectId, user.id);

  if (!project) {
    notFound();
  }

  // Users can only send messages if they have submitted projects (paid users)
  const userCanSend = project.status === "SUBMITTED" || project.status === "IN_PROGRESS" || project.status === "DELIVERED";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Project Chat</h1>
        <p className="text-muted-foreground">
          Communicate with editors about your project: {project.name}
        </p>
        {!userCanSend && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> You can only send messages after submitting your project for review.
            </p>
          </div>
        )}
      </div>

      <ChatInterface 
        projectId={project.id}
        initialMessages={project.messages}
        isAdmin={false}
        userCanSend={userCanSend}
      />
    </div>
  );
}
