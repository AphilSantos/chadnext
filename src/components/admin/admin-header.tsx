"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import Icons from "~/components/shared/icons";
import { NotificationBell } from "~/components/shared/notification-bell";
import { destroyAdminSession } from "~/lib/server/auth/admin";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await destroyAdminSession();
    router.push("/en/adminisamazing-login");
    router.refresh();
  };

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
            <Icons.settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Poker Project Management</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationBell isAdmin={true} />
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Administrator</p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <Icons.logout className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
