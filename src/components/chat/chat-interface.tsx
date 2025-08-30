"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import Icons from "~/components/shared/icons";
import { formatDistanceToNow } from "date-fns";
import { useUploadThing } from "~/lib/client/uploadthing";
import { cn } from "~/lib/utils";

interface Message {
  id: string;
  content: string;
  isFromEditor: boolean;
  attachments?: string[] | null;
  createdAt: Date;
}

interface ChatInterfaceProps {
  projectId: string;
  initialMessages: Message[];
  isAdmin: boolean;
  userCanSend: boolean;
}

export function ChatInterface({
  projectId,
  initialMessages,
  isAdmin,
  userCanSend,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { startUpload, isUploading } = useUploadThing("messageAttachments", {
    onClientUploadComplete: (res) => {
      if (res) {
        const urls = res.map((file) => file.url);
        sendMessage(urls);
      }
    },
    onUploadError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();

    // Mark messages as read when chat is opened
    if (messages.length > 0) {
      const markAsRead = async () => {
        try {
          const endpoint = isAdmin
            ? "/api/admin/notifications/mark-read"
            : "/api/notifications/mark-read";
          await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ projectId }),
          });
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      };

      markAsRead();
    }
  }, [messages, projectId, isAdmin]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== files.length) {
      toast({
        title: "Invalid file type",
        description: "Only image files are allowed for attachments.",
        variant: "destructive",
      });
      return;
    }

    if (imageFiles.length > 5) {
      toast({
        title: "Too many files",
        description: "You can only upload up to 5 images at once.",
        variant: "destructive",
      });
      return;
    }

    setAttachments(imageFiles);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async (attachmentUrls?: string[]) => {
    if (
      !newMessage.trim() &&
      (!attachmentUrls || attachmentUrls.length === 0)
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const apiEndpoint = isAdmin
        ? "/api/admin/chat/messages"
        : "/api/chat/messages";

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          content: newMessage.trim(),
          attachments: attachmentUrls || [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const newMsg = await response.json();
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
      setAttachments([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userCanSend) {
      toast({
        title: "Cannot send message",
        description:
          "You can only send messages after submitting your project.",
        variant: "destructive",
      });
      return;
    }

    if (attachments.length > 0) {
      await startUpload(attachments);
    } else {
      await sendMessage();
    }
  };

  return (
    <Card className="flex h-[600px] flex-col">
      <CardContent className="flex flex-1 flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Icons.messageCircle className="mx-auto mb-2 h-8 w-8" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.isFromEditor ? "justify-start" : "justify-end"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] space-y-2",
                    message.isFromEditor ? "order-1" : "order-2"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2",
                      message.isFromEditor
                        ? "bg-muted text-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <p className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </p>
                  </div>

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {message.attachments.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Attachment ${index + 1}`}
                            className="h-auto max-w-full cursor-pointer rounded-lg hover:opacity-90"
                            onClick={() => window.open(url, "_blank")}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {message.isFromEditor
                        ? isAdmin
                          ? "You"
                          : "Editor"
                        : isAdmin
                          ? "User"
                          : "You"}
                    </span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(message.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Attachment Preview */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <div className="flex-1">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={
                    userCanSend
                      ? "Type your message..."
                      : "You can only send messages after submitting your project"
                  }
                  disabled={!userCanSend || isLoading || isUploading}
                  className="min-h-[60px] resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={
                    !userCanSend ||
                    isLoading ||
                    isUploading ||
                    attachments.length >= 5
                  }
                  title="Attach image"
                >
                  <Icons.image className="h-4 w-4" />
                </Button>

                <Button
                  type="submit"
                  disabled={
                    (!newMessage.trim() && attachments.length === 0) ||
                    !userCanSend ||
                    isLoading ||
                    isUploading
                  }
                  className="min-w-[60px]"
                >
                  {isLoading || isUploading ? (
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
