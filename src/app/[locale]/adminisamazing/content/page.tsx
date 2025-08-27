import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Icons from "~/components/shared/icons";

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-600 mt-2">
          Manage landing page content and banners
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Landing Page Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Icons.edit className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Content Editor</h3>
            <p className="mt-1 text-sm text-gray-500">
              Landing page banner and content management coming soon.
            </p>
            <Button className="mt-4">
              <Icons.edit className="mr-2 h-4 w-4" />
              Edit Content
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
