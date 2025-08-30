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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { CreditCard, Plus, Minus, Loader2 } from "lucide-react";

interface ManageCreditsDialogProps {
  userId: string;
  userName: string;
  currentCredits: number;
  trigger: React.ReactNode;
}

export function ManageCreditsDialog({
  userId,
  userName,
  currentCredits,
  trigger,
}: ManageCreditsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState<"add" | "deduct">("add");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !reason.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both amount and reason.",
        variant: "destructive",
      });
      return;
    }

    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid positive number for amount.",
        variant: "destructive",
      });
      return;
    }

    if (action === "deduct" && numAmount > currentCredits) {
      toast({
        title: "Validation Error",
        description: "Cannot deduct more credits than the user currently has.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/users/manage-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          action,
          amount: numAmount,
          reason: reason.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update credits");
      }

      const result = await response.json();

      toast({
        title: "Success!",
        description: `Successfully ${action === "add" ? "added" : "deducted"} ${numAmount} credits. New balance: ${result.newBalance} credits.`,
      });

      // Reset form and close dialog
      setAmount("");
      setReason("");
      setIsOpen(false);

      // Refresh the page to update the credits display
      window.location.reload();
    } catch (error) {
      console.error("Error managing credits:", error);
      toast({
        title: "Error",
        description: "Failed to update credits. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = () => {
    return action === "add" ? (
      <Plus className="h-4 w-4" />
    ) : (
      <Minus className="h-4 w-4" />
    );
  };

  const getActionColor = () => {
    return action === "add" ? "text-green-600" : "text-red-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Manage Credits - {userName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Current Balance</p>
            <p className="text-2xl font-bold">{currentCredits} credits</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="action">Action</Label>
              <Select
                value={action}
                onValueChange={(value: "add" | "deduct") => setAction(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Credits</SelectItem>
                  <SelectItem value="deduct">Deduct Credits</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount..."
                min="1"
                max={action === "deduct" ? currentCredits : undefined}
              />
            </div>

            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for credit adjustment..."
                rows={3}
                maxLength={200}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {reason.length}/200 characters
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
            <div className={`rounded-full bg-muted p-2 ${getActionColor()}`}>
              {getActionIcon()}
            </div>
            <div>
              <p className="text-sm font-medium">
                {action === "add" ? "Adding" : "Deducting"} {amount || "0"}{" "}
                credits
              </p>
              <p className="text-xs text-muted-foreground">
                New balance will be:{" "}
                {currentCredits +
                  (action === "add"
                    ? parseInt(amount) || 0
                    : -(parseInt(amount) || 0))}{" "}
                credits
              </p>
            </div>
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
              disabled={isLoading || !amount || !reason.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  {getActionIcon()}
                  {action === "add" ? "Add" : "Deduct"} Credits
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
