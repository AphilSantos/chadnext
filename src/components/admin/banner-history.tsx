"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Megaphone, Eye, EyeOff, Calendar, Trash2, Edit } from "lucide-react";
import { useToast } from "~/hooks/use-toast";

interface BannerHistoryItem {
  id: string;
  title: string;
  message: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export function BannerHistory() {
  const [banners, setBanners] = useState<BannerHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchBannerHistory = async () => {
    try {
      const response = await fetch("/api/admin/banner-content/history");
      if (response.ok) {
        const data = await response.json();
        setBanners(data.banners || []);
      }
    } catch (error) {
      console.error("Error fetching banner history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerHistory();
  }, []);

  const handleToggleActive = async (
    bannerId: string,
    currentStatus: boolean
  ) => {
    try {
      const response = await fetch("/api/admin/banner-content/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: bannerId,
          isActive: !currentStatus,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: `Banner ${!currentStatus ? "activated" : "deactivated"} successfully.`,
        });
        // Refresh the banner history
        fetchBannerHistory();
      } else {
        throw new Error("Failed to toggle banner status");
      }
    } catch (error) {
      console.error("Error toggling banner status:", error);
      toast({
        title: "Error",
        description: "Failed to update banner status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (bannerId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this banner? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/banner-content/${bannerId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Banner deleted",
          description: "The banner has been successfully deleted.",
        });
        // Refresh the banner history
        fetchBannerHistory();
      } else {
        throw new Error("Failed to delete banner");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast({
        title: "Error",
        description: "Failed to delete banner. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (
    isActive: boolean,
    startDate: string,
    endDate?: string
  ) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    if (!isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }

    if (now < start) {
      return <Badge variant="outline">Scheduled</Badge>;
    }

    if (end && now > end) {
      return <Badge variant="destructive">Expired</Badge>;
    }

    return <Badge variant="default">Active</Badge>;
  };

  const getDateRange = (startDate: string, endDate?: string) => {
    const start = new Date(startDate).toLocaleDateString();
    if (endDate) {
      const end = new Date(endDate).toLocaleDateString();
      return `${start} - ${end}`;
    }
    return `From ${start}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Banner History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="mt-2">Loading banner history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (banners.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Banner History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            <Megaphone className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p>No banners created yet.</p>
            <p className="text-sm">
              Your banner history will appear here once you create banners.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Banner History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h4 className="truncate text-sm font-semibold">
                      {banner.title}
                    </h4>
                    {getStatusBadge(
                      banner.isActive,
                      banner.startDate,
                      banner.endDate
                    )}
                  </div>

                  <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                    {banner.message}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {getDateRange(banner.startDate, banner.endDate)}
                      </span>
                    </div>
                    <span>•</span>
                    <span>
                      Created{" "}
                      {formatDistanceToNow(new Date(banner.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    {banner.updatedAt !== banner.createdAt && (
                      <>
                        <span>•</span>
                        <span>
                          Updated{" "}
                          {formatDistanceToNow(new Date(banner.updatedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleToggleActive(banner.id, banner.isActive)
                    }
                    className="h-8 w-8 p-0"
                    disabled={
                      !banner.isActive &&
                      new Date() < new Date(banner.startDate)
                    }
                  >
                    {banner.isActive ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(banner.id)}
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
