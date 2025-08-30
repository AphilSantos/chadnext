import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { BannerContentForm } from "~/components/admin/banner-content-form";
import { BannerHistory } from "~/components/admin/banner-history";
import { prisma } from "~/lib/server/db";
import { requireAdminAuth } from "~/lib/server/auth/admin";

export default async function ContentPage() {
  // Verify admin authentication
  await requireAdminAuth();

  // Fetch current banner content
  const currentBanner = await prisma.bannerContent.findFirst({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-600 mt-2">
          Manage header banner content and visibility
        </p>
      </div>

      <BannerContentForm currentBanner={currentBanner || undefined} />

      <BannerHistory />
    </div>
  );
}
