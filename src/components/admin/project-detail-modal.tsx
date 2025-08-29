"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import Icons from "~/components/shared/icons";
import { CardDisplay, CardListDisplay } from "~/components/ui/card-display";
import { type Project, type User } from "@prisma/client";
import { updateProjectStatus } from "~/app/[locale]/adminisamazing/actions";
import { toast } from "~/hooks/use-toast";

interface ProjectDetailModalProps {
  project: Project & {
    user: User;
  };
  trigger?: React.ReactNode;
}

export default function ProjectDetailModal({
  project,
  trigger,
}: ProjectDetailModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<string>(project.status);
  const [adminNotes, setAdminNotes] = useState(project.adminNotes || "");

  const formatCardString = (cardString: string | null) => {
    if (!cardString) return [];
    return cardString.split(" ").map((card) => {
      const value = card.slice(0, -1);
      const symbol = card.slice(-1);
      // Create a simple display object for the card
      return { 
        id: card,
        value, 
        symbol,
        displayName: card,
        color: symbol === '♥' || symbol === '♦' ? 'red' : 'black',
        suit: symbol
      };
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-orange-100 text-orange-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPackageInfo = (packageType: string) => {
    switch (packageType) {
      case "SHORT":
        return {
          name: "Short Clip",
          price: "$100",
          description: "30-60 second edited clip",
        };
      case "FULL":
        return {
          name: "Full Project + Shorts",
          price: "$500",
          description:
            "Complete hand analysis with multiple social media clips",
        };
      case "CREDITS":
        return {
          name: "Credits Package",
          price: "$2000",
          description: "25 credits for any package type",
        };
      default:
        return {
          name: packageType,
          price: "N/A",
          description: "Unknown package",
        };
    }
  };

  const packageInfo = getPackageInfo(project.packageType);

  const handleStatusUpdate = async () => {
    if (newStatus === project.status) return;

    setIsUpdatingStatus(true);
    try {
      const result = await updateProjectStatus({
        projectId: project.id,
        status: newStatus,
        adminNotes: adminNotes || undefined,
      });

      if (result.success) {
        toast({
          title: "Status Updated",
          description: `Project status changed to ${newStatus}`,
        });
        // Update the local project object
        project.status = newStatus;
        project.adminNotes = adminNotes;
      } else {
        toast({
          title: "Update Failed",
          description: result.error || "Failed to update status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "An error occurred while updating status",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Icons.edit className="mr-2 h-4 w-4" />
            View Details
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Project: {project.name}</span>
            <Badge className={getStatusColor(project.status)}>
              {project.status.replace("_", " ")}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Project Name
                  </label>
                  <p className="text-sm">{project.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Package
                  </label>
                  <p className="text-sm">
                    {packageInfo.name} - {packageInfo.price}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Where Played
                  </label>
                  <p className="text-sm">
                    {project.wherePlayed || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Stakes
                  </label>
                  <p className="text-sm">{project.stakes || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Created
                  </label>
                  <p className="text-sm">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Last Updated
                  </label>
                  <p className="text-sm">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {project.adminNotes && (
                <div className="border-t pt-2">
                  <label className="text-sm font-medium text-gray-500">
                    Admin Notes:
                  </label>
                  <p className="mt-1 rounded bg-gray-50 p-2 text-sm">
                    {project.adminNotes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p className="text-sm">
                    {project.user.name || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-sm">{project.user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    User ID
                  </label>
                  <p className="font-mono text-sm text-xs">{project.user.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Credits
                  </label>
                  <p className="text-sm">{project.user.credits || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Poker Hand Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-500">
                    Your Hand
                  </label>
                  <CardListDisplay cards={formatCardString(project.yourHand)} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-500">
                    Opponent&apos;s Hand
                  </label>
                  <CardListDisplay
                    cards={formatCardString(project.opponentHand)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-500">
                    Flop
                  </label>
                  <CardListDisplay cards={formatCardString(project.flop)} />
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-500">
                      Turn
                    </label>
                    {project.turn ? (
                      <CardDisplay card={formatCardString(project.turn)[0]} />
                    ) : (
                      <p className="text-sm text-gray-400">Not specified</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-500">
                      River
                    </label>
                    {project.river ? (
                      <CardDisplay card={formatCardString(project.river)[0]} />
                    ) : (
                      <p className="text-sm text-gray-400">Not specified</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Uploads */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Uploaded Files</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="voiceover" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="voiceover">Voiceover</TabsTrigger>
                  <TabsTrigger value="video">Raw Video</TabsTrigger>
                </TabsList>

                <TabsContent value="voiceover" className="space-y-4">
                  {project.voiceoverUrl ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Voiceover File
                        </span>
                        <Badge variant="secondary">Audio</Badge>
                      </div>
                      <div className="rounded-lg border bg-gray-50 p-4">
                        {project.voiceoverUrl.startsWith("http") ? (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              File uploaded to external service
                            </p>
                            <a
                              href={project.voiceoverUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-all text-sm text-blue-600 hover:text-blue-800"
                            >
                              {project.voiceoverUrl}
                            </a>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              File uploaded directly to server
                            </p>
                            <audio controls className="w-full">
                              <source
                                src={project.voiceoverUrl}
                                type="audio/*"
                              />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      <Icons.file className="mx-auto mb-2 h-8 w-8" />
                      <p>No voiceover file uploaded</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="video" className="space-y-4">
                  {project.videoUrl ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Raw Video File
                        </span>
                        <Badge variant="secondary">Video</Badge>
                      </div>
                      <div className="rounded-lg border bg-gray-50 p-4">
                        {project.videoUrl.startsWith("http") ? (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              File uploaded to external service
                            </p>
                            <a
                              href={project.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-all text-sm text-blue-600 hover:text-blue-800"
                            >
                              {project.videoUrl}
                            </a>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              File uploaded directly to server
                            </p>
                            <video controls className="max-h-64 w-full">
                              <source src={project.videoUrl} type="video/*" />
                              Your browser does not support the video element.
                            </video>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      <Icons.file className="mx-auto mb-2 h-8 w-8" />
                      <p>No video file uploaded</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Change */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-500">
                    Change Status:
                  </label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="SUBMITTED">Submitted</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={isUpdatingStatus || newStatus === project.status}
                    size="sm"
                  >
                    {isUpdatingStatus ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Icons.check className="mr-2 h-4 w-4" />
                        Update
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Admin Notes:
                  </label>
                  <Textarea
                    placeholder="Add notes about this project..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Other Actions */}
              <div className="flex space-x-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: Implement download files
                    console.log("Download files for project:", project.id);
                  }}
                >
                  <Icons.download className="mr-2 h-4 w-4" />
                  Download Files
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: Implement contact user
                    console.log("Contact user for project:", project.id);
                  }}
                >
                  <Icons.messageCircle className="mr-2 h-4 w-4" />
                  Contact User
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
