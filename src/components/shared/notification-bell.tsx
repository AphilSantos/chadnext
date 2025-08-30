"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, MessageCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useToast } from "~/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface UnreadMessage {
  id: string;
  content: string;
  projectId: string;
  projectName: string;
  createdAt: Date;
  isFromEditor: boolean;
  type: "message" | "broadcast";
  broadcastId?: string;
}

interface NotificationBellProps {
  isAdmin?: boolean;
  userId?: string;
}

export function NotificationBell({
  isAdmin = false,
  userId,
}: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState<UnreadMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const fetchUnreadData = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const endpoint = isAdmin
        ? "/api/admin/notifications/unread"
        : "/api/notifications/unread";
      const response = await fetch(endpoint);

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count || 0);
        setUnreadMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching unread data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadData();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadData, 30000);

    return () => clearInterval(interval);
  }, [userId, isAdmin]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClearAll = async () => {
    try {
      const endpoint = isAdmin
        ? "/api/admin/notifications/clear-all"
        : "/api/notifications/clear-all";
      const response = await fetch(endpoint, {
        method: "POST",
      });

      if (response.ok) {
        setUnreadCount(0);
        setUnreadMessages([]);
        setIsDropdownOpen(false);
        toast({
          title: "Notifications cleared",
          description: "All notifications have been marked as read.",
        });
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast({
        title: "Error",
        description: "Failed to clear notifications.",
        variant: "destructive",
      });
    }
  };

  const handleMessageClick = async (message: UnreadMessage) => {
    // Mark this specific message as read
    try {
      const endpoint = isAdmin
        ? "/api/admin/notifications/mark-read"
        : "/api/notifications/mark-read";
      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: message.projectId,
          messageId: message.id,
          type: message.type,
          broadcastId: message.broadcastId,
        }),
      });

      // Update local state
      setUnreadMessages((prev) => prev.filter((m) => m.id !== message.id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const getNotificationLink = () => {
    if (isAdmin) {
      return "/adminisamazing/chat";
    } else {
      return "/dashboard/chat";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={isLoading}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isDropdownOpen && (
        <Card className="absolute right-[-50px] top-12 z-50 max-h-[calc(100vh-6rem)] w-80 max-w-[calc(100vw-2rem)] overflow-hidden shadow-lg sm:right-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-6 px-2 text-xs"
                >
                  <X className="mr-1 h-3 w-3" />
                  Clear all
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="max-h-[calc(100vh-12rem)] overflow-y-auto pt-0">
            {unreadCount === 0 ? (
              <div className="py-4 text-center text-muted-foreground">
                <MessageCircle className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p className="text-sm">No unread notifications</p>
              </div>
            ) : (
              <div className="space-y-2">
                {unreadMessages.map((message) => (
                  <div
                    key={message.id}
                    className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    onClick={() => handleMessageClick(message)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {message.projectName}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {message.content}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(message.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {unreadCount > 0 && (
              <div className="mt-3 border-t pt-3">
                <Link href={getNotificationLink()}>
                  <Button variant="outline" size="sm" className="w-full">
                    View all messages
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
