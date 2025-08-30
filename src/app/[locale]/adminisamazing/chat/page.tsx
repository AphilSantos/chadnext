"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import Icons from "~/components/shared/icons";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChatInterface } from "~/components/chat/chat-interface";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  projects: Project[];
}

interface Project {
  id: string;
  name: string;
  status: string;
  messages: Message[];
}

interface Message {
  id: string;
  content: string;
  isFromEditor: boolean;
  attachments?: any;
  createdAt: Date;
}

export default function ChatPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedUser = users.find(user => user.id === selectedUserId);
  const selectedProject = selectedUser?.projects.find(project => project.id === selectedProjectId);

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    setSelectedProjectId(""); // Reset project selection when user changes
  };

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const recentConversations = users
    .flatMap(user => 
      user.projects
        .filter(project => project.messages.length > 0)
        .map(project => ({ ...project, user }))
    )
    .sort((a, b) => {
      const aLatest = a.messages[0]?.createdAt || new Date(0);
      const bLatest = b.messages[0]?.createdAt || new Date(0);
      return new Date(bLatest).getTime() - new Date(aLatest).getTime();
    })
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Chat</h1>
          <p className="text-gray-600 mt-2">
            Communicate with users through the chat system
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Chat</h1>
        <p className="text-gray-600 mt-2">
          Communicate with users through the chat system
        </p>
      </div>

      {selectedProject ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Chat with {selectedUser?.name || selectedUser?.email}
              </h2>
              <p className="text-sm text-gray-600">
                Project: {selectedProject.name} • Status: {selectedProject.status.replace('_', ' ')}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedProjectId("");
                setSelectedUserId("");
              }}
            >
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back to Selection
            </Button>
          </div>
          
          <ChatInterface 
            projectId={selectedProject.id}
            initialMessages={selectedProject.messages}
            isAdmin={true}
            userCanSend={true}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.users className="h-5 w-5" />
                  Select User
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Choose a user to chat with:</label>
                  <Select value={selectedUserId} onValueChange={handleUserChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user..." />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <span>{user.name || user.email}</span>
                            <Badge variant="outline" className="text-xs">
                              {user.projects.length} projects
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Project Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.folder className="h-5 w-5" />
                  Select Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Choose a project:</label>
                  <Select value={selectedProjectId} onValueChange={handleProjectChange} disabled={!selectedUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedUserId ? "Select a project..." : "Select a user first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedUser?.projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          <div className="flex items-center gap-2">
                            <span>{project.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {project.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.messageCircle className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  disabled={!selectedProjectId}
                  onClick={() => selectedProjectId && setSelectedProjectId(selectedProjectId)}
                >
                  <Icons.messageCircle className="mr-2 h-4 w-4" />
                  Start Chat
                </Button>
                <Button variant="outline" className="w-full" disabled={!selectedProjectId}>
                  <Icons.file className="mr-2 h-4 w-4" />
                  View Project Details
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Conversations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentConversations.map((project) => {
                  const latestMessage = project.messages[0];
                  
                  return (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                          <Icons.messageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{project.name}</h4>
                          <p className="text-sm text-gray-500">
                            with {project.user.name || project.user.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {project.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(latestMessage.createdAt), { addSuffix: true })}
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedUserId(project.user.id);
                            setSelectedProjectId(project.id);
                          }}
                        >
                          <Icons.messageCircle className="mr-1 h-3 w-3" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  );
                })}
                
                {recentConversations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Icons.messageCircle className="mx-auto h-8 w-8 mb-2" />
                    <p>No recent conversations</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
