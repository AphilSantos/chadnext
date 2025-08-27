"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import Icons from "~/components/shared/icons";

interface CreditManagementModalProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    credits: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreditManagementModal({
  user,
  isOpen,
  onClose,
}: CreditManagementModalProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Credits - {user.name || user.email}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-2 text-sm text-gray-600">Current Credits</div>
            <div className="text-2xl font-bold text-blue-600">
              {user.credits}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="addCredits">Add Credits</Label>
              <div className="mt-1 flex space-x-2">
                <Input id="addCredits" type="number" placeholder="0" min="0" />
                <Button>
                  <Icons.add className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="removeCredits">Remove Credits</Label>
              <div className="mt-1 flex space-x-2">
                <Input
                  id="removeCredits"
                  type="number"
                  placeholder="0"
                  min="0"
                  max={user.credits}
                />
                <Button variant="destructive">
                  <Icons.minus className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="setCredits">Set Credits</Label>
              <div className="mt-1 flex space-x-2">
                <Input id="setCredits" type="number" placeholder="0" min="0" />
                <Button variant="outline">
                  <Icons.edit className="mr-2 h-4 w-4" />
                  Set
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
