"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { useToast } from "~/hooks/use-toast";
import { User, Edit, Loader2, AlertTriangle } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  credits: number;
}

interface EditUserDialogProps {
  user: UserData;
  trigger: React.ReactNode;
}

export function EditUserDialog({ user, trigger }: EditUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    emailVerified: user.emailVerified || false,
    credits: user.credits.toString(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        emailVerified: user.emailVerified || false,
        credits: user.credits.toString(),
      });
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }

    const credits = parseInt(formData.credits);
    if (isNaN(credits) || credits < 0) {
      toast({
        title: "Validation Error",
        description: "Credits must be a valid positive number.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          emailVerified: formData.emailVerified,
          credits,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      toast({
        title: "Success!",
        description: "User information updated successfully.",
      });

      setIsOpen(false);

      // Refresh the page to update the user list
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    return (
      formData.name !== (user.name || "") ||
      formData.email !== (user.email || "") ||
      formData.emailVerified !== (user.emailVerified || false) ||
      parseInt(formData.credits) !== user.credits
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit User - {user.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter user name..."
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter user email..."
              />
            </div>

            <div>
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                value={formData.credits}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, credits: e.target.value }))
                }
                placeholder="Enter credits..."
                min="0"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="emailVerified">Email Verified</Label>
              <Switch
                id="emailVerified"
                checked={formData.emailVerified}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, emailVerified: checked }))
                }
              />
            </div>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm font-medium text-yellow-800">Warning</p>
            </div>
            <p className="mt-1 text-xs text-yellow-700">
              This action will directly modify user data. Please ensure all
              information is correct before saving.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !hasChanges()}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
