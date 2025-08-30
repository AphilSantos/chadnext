"use client";

import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react";

interface BannerData {
  id: string;
  title: string;
  message: string;
}

export function DynamicBanner() {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch("/api/banner-content");
        if (response.ok) {
          const data = await response.json();
          if (data.banner) {
            setBanner(data.banner);
          }
        }
      } catch (error) {
        console.error("Error fetching banner:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanner();
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Store dismissal in localStorage to prevent showing again in this session
    localStorage.setItem("banner-dismissed", "true");
  };

  // Check if banner was dismissed in this session
  useEffect(() => {
    const dismissed = localStorage.getItem("banner-dismissed");
    if (dismissed === "true") {
      setIsVisible(false);
    }
  }, []);

  // Don't render if loading, no banner, or dismissed
  if (isLoading || !banner || !isVisible) {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <Gift className="h-5 w-5 flex-shrink-0" />
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            {banner.title && (
              <span className="text-sm font-semibold sm:text-base">
                {banner.title}
              </span>
            )}
            <span className="text-sm sm:text-base">{banner.message}</span>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="ml-4 flex-shrink-0 text-white transition-colors hover:text-gray-200"
          aria-label="Dismiss banner"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
