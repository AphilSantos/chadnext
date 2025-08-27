"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import Icons from "~/components/shared/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  credits: number;
  createdAt: Date;
  projectCount: number;
  completedProjects: number;
  totalSpent: number;
}

interface UserManagementTableProps {
  users: User[];
}

export default function UserManagementTable({
  users,
}: UserManagementTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleManageCredits = (user: User) => {
    setSelectedUser(user);
    // TODO: Open credit management modal
  };

  const handleViewProfile = (userId: string) => {
    // TODO: Navigate to user profile
    console.log("View profile for user:", userId);
  };

  const handleSendMessage = (userId: string) => {
    // TODO: Open chat with user
    console.log("Send message to user:", userId);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Projects</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600">
                    <span className="text-sm font-semibold text-white">
                      {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {user.name || "Unnamed User"}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Badge variant={user.credits > 0 ? "default" : "destructive"}>
                    {user.credits} credits
                  </Badge>
                  {user.credits === 0 && (
                    <Icons.alertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium">{user.projectCount} total</div>
                  <div className="text-gray-500">
                    {user.completedProjects} completed
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-green-600">
                  ${(user.totalSpent / 100).toFixed(2)}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(user.createdAt, { addSuffix: true })}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <Icons.ellipsis className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleManageCredits(user)}>
                      <Icons.creditCard className="mr-2 h-4 w-4" />
                      Manage Credits
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleViewProfile(user.id)}
                    >
                      <Icons.user className="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSendMessage(user.id)}
                    >
                      <Icons.messageCircle className="mr-2 h-4 w-4" />
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Icons.edit className="mr-2 h-4 w-4" />
                      Edit User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {users.length === 0 && (
        <div className="py-12 text-center">
          <Icons.users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No users found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new user account.
          </p>
        </div>
      )}
    </div>
  );
}
