"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Badge } from "~/components/ui/badge";
import { useToast } from "~/hooks/use-toast";
import { Megaphone, Save, Eye, EyeOff, Calendar, Loader2 } from "lucide-react";

interface BannerContent {
  id: string;
  title: string;
  message: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface BannerContentFormProps {
  currentBanner?: BannerContent;
}

export function BannerContentForm({ currentBanner }: BannerContentFormProps) {
  const [title, setTitle] = useState(currentBanner?.title || "");
  const [message, setMessage] = useState(currentBanner?.message || "");
  const [isActive, setIsActive] = useState(currentBanner?.isActive ?? true);
  const [startDate, setStartDate] = useState(
    currentBanner?.startDate
      ? new Date(currentBanner.startDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    currentBanner?.endDate
      ? new Date(currentBanner.endDate).toISOString().split("T")[0]
      : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and message.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/banner-content", {
        method: currentBanner ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: currentBanner?.id,
          title: title.trim(),
          message: message.trim(),
          isActive,
          startDate: new Date(startDate).toISOString(),
          endDate: endDate ? new Date(endDate).toISOString() : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save banner content");
      }

      const result = await response.json();

      toast({
        title: "Success!",
        description: currentBanner
          ? "Banner content updated successfully."
          : "Banner content created successfully.",
      });

      // If this was a new banner, reset the form
      if (!currentBanner) {
        setTitle("");
        setMessage("");
        setIsActive(true);
        setStartDate(new Date().toISOString().split("T")[0]);
        setEndDate("");
      }
    } catch (error) {
      console.error("Error saving banner content:", error);
      toast({
        title: "Error",
        description: "Failed to save banner content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (!currentBanner) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/banner-content/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: currentBanner.id,
          isActive: !isActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle banner status");
      }

      setIsActive(!isActive);
      toast({
        title: "Success!",
        description: `Banner ${!isActive ? "activated" : "deactivated"} successfully.`,
      });
    } catch (error) {
      console.error("Error toggling banner status:", error);
      toast({
        title: "Error",
        description: "Failed to update banner status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!currentBanner) return null;

    return (
      <Badge variant={isActive ? "default" : "secondary"} className="ml-2">
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Header Banner Content
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Banner Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Banner Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter banner title..."
                maxLength={50}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {title.length}/50 characters
              </p>
            </div>

            <div>
              <Label htmlFor="message">Banner Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter banner message..."
                rows={3}
                maxLength={200}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {message.length}/200 characters
              </p>
            </div>
          </div>

          {/* Schedule Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Schedule</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Date Range
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Leave empty for no end date
                </p>
              </div>
            </div>
          </div>

          {/* Status Control */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Banner Status</Label>
              <div className="flex items-center gap-2">
                {isActive ? (
                  <Eye className="h-4 w-4 text-green-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  disabled={isLoading}
                />
              </div>
            </div>

            {currentBanner && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleToggleActive}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : isActive ? (
                    <EyeOff className="mr-2 h-4 w-4" />
                  ) : (
                    <Eye className="mr-2 h-4 w-4" />
                  )}
                  {isActive ? "Deactivate" : "Activate"} Banner
                </Button>
              </div>
            )}
          </div>

          {/* Preview */}
          {(title || message) && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-blue-900">
                      {title || "Banner Title"}
                    </span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <span className="text-lg">×</span>
                  </button>
                </div>
                <p className="mt-1 text-sm text-blue-800">
                  {message || "Banner message will appear here..."}
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSaving || !title.trim() || !message.trim()}
            className="w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {currentBanner ? "Update Banner" : "Create Banner"}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
