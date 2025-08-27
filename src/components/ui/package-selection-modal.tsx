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
import { Check, CreditCard, AlertCircle } from "lucide-react";
import { type PackageType } from "@prisma/client";
import { pokerPackages, type PokerPackage } from "~/config/subscription";
import { cn } from "~/lib/utils";

interface PackageSelectionModalProps {
  currentPackage: PackageType;
  userCredits: number;
  onPackageChange: (packageType: PackageType) => void;
  trigger?: React.ReactNode;
}

export function PackageSelectionModal({
  currentPackage,
  userCredits,
  onPackageChange,
  trigger,
}: PackageSelectionModalProps) {
  const [selectedPackage, setSelectedPackage] =
    useState<PackageType>(currentPackage);
  const [isOpen, setIsOpen] = useState(false);

  const handlePackageSelect = (packageType: PackageType) => {
    setSelectedPackage(packageType);
  };

  const handleConfirm = () => {
    onPackageChange(selectedPackage);
    setIsOpen(false);
  };

  const selectedPkg = pokerPackages.find((pkg) => pkg.id === selectedPackage);
  const hasEnoughCredits = selectedPkg
    ? userCredits >= selectedPkg.credits
    : false;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full">
            <CreditCard className="mr-2 h-4 w-4" />
            Change Package
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Package</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Package Display */}
          <div className="rounded-lg bg-muted p-4">
            <h3 className="mb-2 font-medium">Current Package</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {pokerPackages.find((pkg) => pkg.id === currentPackage)?.name}
              </Badge>
              <span className="text-sm text-muted-foreground">
                (
                {
                  pokerPackages.find((pkg) => pkg.id === currentPackage)
                    ?.credits
                }{" "}
                credits)
              </span>
            </div>
          </div>

          {/* Credit Status */}
          <div className="rounded-lg bg-muted p-4">
            <h3 className="mb-2 font-medium">Your Credits</h3>
            <div className="flex items-center gap-2">
              <Badge variant={userCredits > 0 ? "default" : "destructive"}>
                {userCredits} credits available
              </Badge>
              {userCredits === 0 && (
                <span className="flex items-center gap-1 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  No credits available
                </span>
              )}
            </div>
          </div>

          {/* Package Options */}
          <div className="grid gap-4 md:grid-cols-3">
            {pokerPackages.map((pkg) => {
              const isSelected = selectedPackage === pkg.id;
              const canAfford = userCredits >= pkg.credits;

              return (
                <Card
                  key={pkg.id}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary",
                    isSelected && "border-primary bg-primary/5",
                    !canAfford && "cursor-not-allowed opacity-60"
                  )}
                  onClick={() => canAfford && handlePackageSelect(pkg.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="mb-2 flex items-center justify-between">
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      <Badge variant="outline">${pkg.price / 100}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {pkg.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{pkg.credits} credits</Badge>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <ul className="space-y-1 text-xs">
                      {pkg.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {!canAfford && (
                      <div className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        Need {pkg.credits - userCredits} more credits
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="text-sm text-muted-foreground">
              {selectedPkg && (
                <>
                  {hasEnoughCredits ? (
                    <span className="text-green-600">
                      ✓ You have enough credits for this package
                    </span>
                  ) : (
                    <span className="text-destructive">
                      ✗ You need {selectedPkg.credits - userCredits} more
                      credits
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={
                  !hasEnoughCredits || selectedPackage === currentPackage
                }
              >
                {selectedPackage === currentPackage
                  ? "No Changes"
                  : "Update Package"}
              </Button>
            </div>
          </div>

          {/* Top Up CTA */}
          {!hasEnoughCredits && selectedPkg && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <h4 className="font-medium text-amber-800">
                  Need More Credits?
                </h4>
              </div>
              <p className="mb-3 text-sm text-amber-700">
                You need {selectedPkg.credits - userCredits} more credits to
                select the {selectedPkg.name} package.
              </p>
              <a href="/dashboard/payments">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-300 text-amber-700"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Top Up Credits
                </Button>
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
