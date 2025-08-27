import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Icons from "~/components/shared/icons";

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Chat</h1>
        <p className="text-gray-600 mt-2">
          Communicate with users through the chat system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chat System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Icons.messageCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Chat Interface</h3>
            <p className="mt-1 text-sm text-gray-500">
              Direct messaging system with users coming soon.
            </p>
            <Button className="mt-4">
              <Icons.messageCircle className="mr-2 h-4 w-4" />
              Start Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
