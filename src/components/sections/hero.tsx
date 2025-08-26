import { StarIcon } from "lucide-react";
import Link from "next/link";
import { BrandIcons } from "~/components/shared/brand-icons";
import Icons from "~/components/shared/icons";
import { buttonVariants } from "~/components/ui/button";
import { nFormatter } from "~/lib/utils";
import { getScopedI18n } from "~/locales/server";

export default async function Hero() {
  const scopedT = await getScopedI18n("hero");

  return (
    <section className="relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-4 top-0 h-72 w-72 animate-pulse rounded-full bg-purple-300 opacity-20 blur-2xl"></div>
        <div
          className="absolute -right-4 top-0 h-72 w-72 animate-pulse rounded-full bg-yellow-300 opacity-20 blur-2xl"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute -bottom-8 left-20 h-72 w-72 animate-pulse rounded-full bg-pink-300 opacity-20 blur-2xl"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Shimmer Effect */}
      <div className="-z-5 animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

      <div className="container flex w-full flex-col items-center justify-center space-y-20 py-16 md:py-20 lg:py-24 xl:py-28">
        <div className="mx-auto w-full max-w-2xl">
          <a
            href="#packages"
            title="View Packages"
            className="group mx-auto mb-5 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full bg-gradient-to-r from-green-100 to-emerald-100 px-7 py-2 shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-200 hover:to-emerald-200 hover:shadow-xl"
          >
            <Icons.sparkles className="h-5 w-5 text-green-700 group-hover:animate-spin" />
            <p className="text-sm font-semibold text-green-700">
              Professional Poker Video Editing
            </p>
          </a>

          <h1 className="animate-fade-in text-balance bg-gradient-to-br from-gray-900 via-gray-800 to-gray-400 bg-clip-text text-center font-heading text-[40px] font-bold leading-tight tracking-[-0.02em] text-transparent drop-shadow-sm duration-300 ease-linear [word-spacing:theme(spacing.1)] dark:bg-gradient-to-br dark:from-gray-100 dark:to-gray-900 md:text-7xl md:leading-[5rem]">
            Turn Your Poker Hands Into
            <br />
            <span className="animate-gradient bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pro Videos
            </span>
          </h1>

          <p
            className="animate-fade-in-up mt-6 text-balance text-center text-muted-foreground md:text-xl"
            style={{ animationDelay: "0.3s" }}
          >
            Submit your raw footage and hand details. Our professional editors
            will create stunning videos perfect for social media, analysis, and
            sharing your best plays.
          </p>

          <div
            className="animate-fade-in-up mx-auto mt-6 flex items-center justify-center space-x-5"
            style={{ animationDelay: "0.6s" }}
          >
            <Link
              className={
                buttonVariants() +
                " gap-x-2 shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl"
              }
              href="/login"
            >
              Get Started
            </Link>
            <Link
              className={
                buttonVariants({ variant: "outline" }) +
                " gap-x-2 transition-transform duration-200 hover:scale-105"
              }
              href="#packages"
            >
              View Packages
            </Link>
          </div>
        </div>

        <div
          className="animate-fade-in-up w-full"
          style={{ animationDelay: "0.9s" }}
        >
          <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight transition-colors">
            Trusted by Professional Players
          </h2>
          <div className="flex w-full flex-wrap items-center justify-center gap-x-20 gap-y-10">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group flex flex-col items-center text-center transition-all duration-300 hover:scale-110"
                style={{ animationDelay: `${1.2 + i * 0.1}s` }}
              >
                <div className="relative">
                  <feature.icon className="mb-2 h-12 w-12 text-green-600 transition-colors duration-300 group-hover:text-purple-600" />
                  <div className="absolute inset-0 h-12 w-12 rounded-full bg-green-100 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"></div>
                </div>
                <p className="text-sm font-medium transition-colors duration-300 group-hover:text-purple-600">
                  {feature.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    name: "Fast Delivery",
    icon: Icons.zap,
  },
  {
    name: "Professional Quality",
    icon: Icons.award,
  },
  {
    name: "Easy Upload",
    icon: Icons.upload,
  },
  {
    name: "24/7 Support",
    icon: Icons.messageCircle,
  },
];
