"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import {
  User,
  Mail,
  Calendar,
  CreditCard,
  Folder,
  DollarSign,
  Loader2,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
  credits: number;
  createdAt: string;
  updatedAt: string;
  projects: Array<{
    id: string;
    name: string;
    status: string;
    packageType: string;
    createdAt: string;
  }>;
  transactions: Array<{
    id: string;
    amount: number;
    type: string;
    status: string;
    createdAt: string;
  }>;
}

interface UserProfileDialogProps {
  userId: string;
  trigger: React.ReactNode;
}

export function UserProfileDialog({ userId, trigger }: UserProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserProfile = async () => {
    if (!isOpen) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/profile`);
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen, userId]);

  const getStatusBadge = (status: string) => {
    const statusColors = {
      DRAFT: "bg-gray-100 text-gray-800",
      SUBMITTED: "bg-blue-100 text-blue-800",
      IN_PROGRESS: "bg-yellow-100 text-yellow-800",
      DELIVERED: "bg-green-100 text-green-800",
    };

    return (
      <Badge
        className={
          statusColors[status as keyof typeof statusColors] ||
          "bg-gray-100 text-gray-800"
        }
      >
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getTransactionStatusBadge = (status: string) => {
    const statusColors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      COMPLETED: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
      REFUNDED: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge
        className={
          statusColors[status as keyof typeof statusColors] ||
          "bg-gray-100 text-gray-800"
        }
      >
        {status}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100); // Convert cents to dollars
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : userProfile ? (
          <div className="space-y-6">
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={userProfile.picture || undefined} />
                    <AvatarFallback className="text-lg">
                      {getInitials(userProfile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {userProfile.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {userProfile.email}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Credits:</span>
                    <Badge
                      variant={
                        userProfile.credits > 0 ? "default" : "destructive"
                      }
                    >
                      {userProfile.credits} credits
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Joined:</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(userProfile.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  Projects ({userProfile.projects.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userProfile.projects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No projects found.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {userProfile.projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">
                            {project.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {project.packageType} •{" "}
                            {formatDistanceToNow(new Date(project.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        {getStatusBadge(project.status)}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transactions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Transactions ({userProfile.transactions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userProfile.transactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No transactions found.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {userProfile.transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">
                            {transaction.type.replace("_", " ")}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(transaction.createdAt),
                              { addSuffix: true }
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatCurrency(transaction.amount)}
                          </p>
                          {getTransactionStatusBadge(transaction.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>Failed to load user profile.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
