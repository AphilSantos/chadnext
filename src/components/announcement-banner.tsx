"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-50 border-b bg-primary">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center text-sm font-medium text-primary-foreground">
            <span className="mr-2">🎬</span>
            <strong>New!</strong> Get 20% off your first poker video edit.
            Professional quality in 24 hours -{" "}
            <Link
              href="/dashboard/projects/new"
              className="font-semibold underline-offset-4 transition-all hover:underline"
            >
              start your project now!
            </Link>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-4 rounded-full p-1.5 transition-colors hover:bg-primary-foreground/20"
            aria-label="Dismiss announcement"
          >
            <X className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
