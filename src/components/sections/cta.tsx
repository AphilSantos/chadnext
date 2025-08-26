import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import Icons from "../shared/icons";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 transform animate-pulse rounded-full bg-gradient-to-r from-green-400 to-blue-400 opacity-10 blur-3xl"></div>
        <div
          className="absolute bottom-0 left-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-10 blur-3xl"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container">
        <div className="animate-fade-in-up mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <Icons.sparkles className="mx-auto mb-6 h-16 w-16 animate-pulse text-primary" />
            <h2 className="mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              Ready to Transform Your Poker Content?
            </h2>
            <p className="mb-8 text-xl text-muted-foreground">
              Join hundreds of poker players and content creators who are
              already growing their audiences with professional video editing.
              Start your first project today and see the difference quality
              editing makes.
            </p>
          </div>

          <div
            className="animate-fade-in-up flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/dashboard/projects/new"
              className={cn(
                buttonVariants({ size: "lg" }),
                "px-8 py-4 text-lg shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl"
              )}
            >
              <Icons.add className="mr-2 h-5 w-5" />
              Start Your First Project
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "px-8 py-4 text-lg transition-transform duration-200 hover:scale-105"
              )}
            >
              Create Account
            </Link>
          </div>

          <div
            className="animate-fade-in-up mt-8 text-sm text-muted-foreground"
            style={{ animationDelay: "0.6s" }}
          >
            <p>
              ✨ No credit card required • 24-hour delivery • Unlimited
              revisions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
