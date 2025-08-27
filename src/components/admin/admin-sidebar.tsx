"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import Icons from "~/components/shared/icons";

const navigation = [
  {
    name: "Dashboard",
    href: "/en/adminisamazing",
    icon: Icons.dashboard,
  },
  {
    name: "Users",
    href: "/en/adminisamazing/users",
    icon: Icons.users,
  },
  {
    name: "Projects",
    href: "/en/adminisamazing/projects",
    icon: Icons.folder,
  },
  {
    name: "Payments",
    href: "/en/adminisamazing/payments",
    icon: Icons.creditCard,
  },
  {
    name: "Chat",
    href: "/en/adminisamazing/chat",
    icon: Icons.messageCircle,
  },
  {
    name: "Notifications",
    href: "/en/adminisamazing/notifications",
    icon: Icons.bell,
  },
  {
    name: "Content",
    href: "/en/adminisamazing/content",
    icon: Icons.edit,
  },
  {
    name: "Analytics",
    href: "/en/adminisamazing/analytics",
    icon: Icons.barChart,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-full w-64 border-r border-gray-200 bg-white pt-20 shadow-lg">
      <nav className="px-4 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "border-r-2 border-purple-600 bg-purple-50 text-purple-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
