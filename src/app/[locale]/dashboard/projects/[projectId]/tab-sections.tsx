import { type Project, type Message, type Transaction } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import DeleteCard from "./delete-card";
import EditableDetails from "./editable-details";

// Extended project type that includes related data
type ProjectWithRelations = Project & {
  messages: Message[];
  transaction: Transaction | null;
};

export default function TabSections({ project }: { project: ProjectWithRelations }) {
  return (
    <Tabs defaultValue="details">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <EditableDetails initialValues={project} />
      </TabsContent>
      <TabsContent value="settings">
        <DeleteCard id={project.id} />
      </TabsContent>
    </Tabs>
  );
}
