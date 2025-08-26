import { redirect } from "next/navigation";
import { getCurrentSession } from "~/lib/server/auth/session";
import { pokerPackages } from "~/config/subscription";
import NewProjectForm from "./new-project-form";

export default async function NewProjectPage() {
  const { user } = await getCurrentSession();
  
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground">
          Submit your poker hand details and files for professional editing.
        </p>
      </div>
      
      <NewProjectForm packages={pokerPackages} />
    </div>
  );
}
