"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import { useToast } from "~/hooks/use-toast";
import { Bell, Users, UserCheck, Send, Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

interface BroadcastNotificationFormProps {
  users: User[];
}

export function BroadcastNotificationForm({
  users,
}: BroadcastNotificationFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<
    "ANNOUNCEMENT" | "UPDATE" | "MAINTENANCE" | "FEATURE"
  >("ANNOUNCEMENT");
  const [targetType, setTargetType] = useState<
    "ALL_USERS" | "SELECTED_USERS" | "ACTIVE_USERS"
  >("ALL_USERS");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(users.map((user) => user.id));
  };

  const handleDeselectAll = () => {
    setSelectedUsers([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    if (targetType === "SELECTED_USERS" && selectedUsers.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one user.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/broadcast-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          type,
          targetType,
          targetUserIds: targetType === "SELECTED_USERS" ? selectedUsers : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }

      const result = await response.json();

      toast({
        title: "Success!",
        description: `Notification sent to ${result.recipientCount} users.`,
      });

      // Reset form
      setTitle("");
      setContent("");
      setType("ANNOUNCEMENT");
      setTargetType("ALL_USERS");
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Error",
        description: "Failed to send notification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTargetDescription = () => {
    switch (targetType) {
      case "ALL_USERS":
        return `All ${users.length} users`;
      case "SELECTED_USERS":
        return `${selectedUsers.length} selected users`;
      case "ACTIVE_USERS":
        return "Users with recent activity";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Send Broadcast Notification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Notification Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Notification Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notification title..."
                maxLength={100}
              />
            </div>

            <div>
              <Label htmlFor="content">Notification Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter notification content..."
                rows={4}
                maxLength={500}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {content.length}/500 characters
              </p>
            </div>

            <div>
              <Label htmlFor="type">Notification Type</Label>
              <Select
                value={type}
                onValueChange={(value: any) => setType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                  <SelectItem value="UPDATE">Update</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="FEATURE">Feature</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Target Selection */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="target">Target Audience</Label>
              <Select
                value={targetType}
                onValueChange={(value: any) => setTargetType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_USERS">All Users</SelectItem>
                  <SelectItem value="SELECTED_USERS">Selected Users</SelectItem>
                  <SelectItem value="ACTIVE_USERS">Active Users</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-sm text-muted-foreground">
                {getTargetDescription()}
              </p>
            </div>

            {/* User Selection */}
            {targetType === "SELECTED_USERS" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Select Users</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectAll}
                    >
                      Deselect All
                    </Button>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto rounded-lg border p-4">
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3 rounded p-2 hover:bg-muted/50"
                      >
                        <Checkbox
                          id={user.id}
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => handleUserToggle(user.id)}
                        />
                        <Label
                          htmlFor={user.id}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {user.name || "Unnamed User"}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedUsers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">
                      {selectedUsers.length} user
                      {selectedUsers.length !== 1 ? "s" : ""} selected
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preview */}
          {(title || content) && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="secondary">{type}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {getTargetDescription()}
                  </span>
                </div>
                {title && (
                  <h4 className="mb-1 text-sm font-semibold">{title}</h4>
                )}
                {content && (
                  <p className="text-sm text-muted-foreground">{content}</p>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={
              isLoading ||
              !title.trim() ||
              !content.trim() ||
              (targetType === "SELECTED_USERS" && selectedUsers.length === 0)
            }
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Notification
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
