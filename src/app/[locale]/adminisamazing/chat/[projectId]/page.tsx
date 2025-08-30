import { notFound } from "next/navigation";
import { prisma } from "~/lib/server/db";
import { ChatInterface } from "~/components/chat/chat-interface";

interface ChatPageProps {
  params: Promise<{ projectId: string }>;
}

async function getProjectWithMessages(projectId: string) {
  return await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { projectId } = await params;
  const project = await getProjectWithMessages(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chat with {project.user.name || project.user.email}</h1>
        <p className="text-gray-600 mt-2">
          Project: {project.name} • Status: {project.status.replace('_', ' ')}
        </p>
      </div>

      <ChatInterface 
        projectId={project.id}
        initialMessages={project.messages}
        isAdmin={true}
        userCanSend={true} // Admin can always send messages
      />
    </div>
  );
}
