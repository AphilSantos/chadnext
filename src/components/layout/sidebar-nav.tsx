"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import Icons from "../shared/icons";
import LogoutButton from "../shared/logout-button";

const navItems = [
  {
    title: "My Projects",
    href: "/dashboard/projects",
    icon: Icons.folder,
  },
  {
    title: "Chat",
    href: "/dashboard/chat",
    icon: Icons.messageCircle,
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: Icons.billing,
  },
  {
    title: "Profile",
    href: "/dashboard/settings",
    icon: Icons.user,
  },
];

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export default function SidebarNav({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  return (
    <nav
      className={cn(
        "flex h-full min-w-[240px] flex-col border-r bg-card p-4",
        className
      )}
      {...props}
    >
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-muted-foreground">
          Navigation
        </h2>
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t pt-4">
        <LogoutButton className="w-full justify-start" />
      </div>
    </nav>
  );
}
