"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Bell, Users, Eye, Trash2 } from "lucide-react";
import { useToast } from "~/hooks/use-toast";

interface BroadcastHistoryProps {
  broadcasts: Array<{
    id: string;
    title: string;
    content: string;
    type: string;
    targetType: string;
    createdAt: Date;
    userNotifications: Array<{ id: string }>;
  }>;
}

export function BroadcastHistory({ broadcasts }: BroadcastHistoryProps) {
  const { toast } = useToast();

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ANNOUNCEMENT":
        return "bg-blue-100 text-blue-800";
      case "UPDATE":
        return "bg-green-100 text-green-800";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-800";
      case "FEATURE":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTargetTypeLabel = (targetType: string) => {
    switch (targetType) {
      case "ALL_USERS":
        return "All Users";
      case "SELECTED_USERS":
        return "Selected Users";
      case "ACTIVE_USERS":
        return "Active Users";
      default:
        return targetType;
    }
  };

  const handleViewDetails = (broadcast: any) => {
    // For now, just show a toast with the details
    toast({
      title: broadcast.title,
      description: broadcast.content,
    });
  };

  const handleDelete = async (broadcastId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this broadcast? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/broadcast-notification/${broadcastId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast({
          title: "Broadcast deleted",
          description: "The broadcast has been successfully deleted.",
        });
        // Refresh the page to update the list
        window.location.reload();
      } else {
        throw new Error("Failed to delete broadcast");
      }
    } catch (error) {
      console.error("Error deleting broadcast:", error);
      toast({
        title: "Error",
        description: "Failed to delete broadcast. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (broadcasts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Broadcasts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            <Bell className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p>No broadcasts sent yet.</p>
            <p className="text-sm">
              Your broadcast history will appear here once you send
              notifications.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Broadcasts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {broadcasts.map((broadcast) => (
            <div
              key={broadcast.id}
              className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h4 className="truncate text-sm font-semibold">
                      {broadcast.title}
                    </h4>
                    <Badge
                      className={`text-xs ${getTypeColor(broadcast.type)}`}
                    >
                      {broadcast.type}
                    </Badge>
                  </div>

                  <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                    {broadcast.content}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{getTargetTypeLabel(broadcast.targetType)}</span>
                    </div>
                    <span>•</span>
                    <span>{broadcast.userNotifications.length} recipients</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(broadcast.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(broadcast)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(broadcast.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
