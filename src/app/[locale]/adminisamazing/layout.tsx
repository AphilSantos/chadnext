import { requireAdminAuth } from "~/lib/server/auth/admin";
import AdminSidebar from "~/components/admin/admin-sidebar";
import AdminHeader from "~/components/admin/admin-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will redirect to login if not authenticated
  await requireAdminAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
