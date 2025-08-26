import { Check } from "lucide-react";
import Link from "next/link";
import { getCurrentSession } from "~/lib/server/auth/session";
import { pokerPackages } from "~/config/subscription";
import { cn } from "~/lib/utils";
import { Badge } from "../ui/badge";
import { buttonVariants } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default async function Pricing() {
  const { user } = await getCurrentSession();

  return (
    <section id="packages" className="relative overflow-hidden py-24">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-0 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-10 blur-3xl"></div>
        <div
          className="absolute bottom-0 left-0 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-10 blur-3xl"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="container space-y-8">
        <div className="animate-fade-in-up mx-auto flex max-w-2xl flex-col items-center space-y-4 text-center">
          <h2 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text font-heading text-4xl font-bold text-transparent md:text-5xl">
            Choose Your Package
          </h2>
          <p className="max-w-md text-balance leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Professional poker video editing packages to showcase your best
            hands.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:mx-auto lg:max-w-6xl">
          {pokerPackages.map((pkg, index) => {
            const isPopular = pkg.id === "FULL";
            const price = pkg.price / 100; // Convert cents to dollars

            return (
              <Card
                key={pkg.id}
                className={cn(
                  "animate-fade-in-up group relative flex flex-col transition-all duration-500 ease-in-out hover:-translate-y-2",
                  {
                    "scale-105 border-2 border-primary bg-gradient-to-br from-white to-gray-50/50 shadow-2xl dark:from-gray-900 dark:to-gray-800/50":
                      isPopular,
                    "border bg-gradient-to-br from-white to-gray-50/30 shadow-lg hover:shadow-2xl dark:from-gray-900 dark:to-gray-800/30":
                      !isPopular,
                  }
                )}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>

                {isPopular && (
                  <Badge
                    variant="default"
                    className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 transform animate-pulse bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="relative z-10">
                  <CardTitle className="text-xl transition-colors duration-300 group-hover:text-green-600">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                    {pkg.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10 flex-1">
                  <p className="mb-6 mt-2 flex items-baseline justify-center gap-x-2">
                    <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                      ${price}
                    </span>
                    {pkg.id === "CREDITS" && (
                      <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                        (${((price * 25) / 20).toFixed(0)} value)
                      </span>
                    )}
                  </p>
                  <ul className="space-y-3 text-sm">
                    {pkg.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-2 transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 transition-transform duration-300 group-hover:scale-110" />
                        <span className="transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="relative z-10 justify-center pt-6">
                  <Link
                    href={user ? "/dashboard/projects/new" : "/login"}
                    className={cn(
                      buttonVariants({
                        size: "lg",
                        variant: isPopular ? "default" : "outline",
                      }),
                      "w-full shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl"
                    )}
                  >
                    {user ? "Get Started" : "Sign Up to Order"}
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div
          className="animate-fade-in-up text-center"
          style={{ animationDelay: "0.8s" }}
        >
          <p className="text-sm text-muted-foreground">
            All packages include professional editing, custom graphics, and fast
            delivery.
            <br />
            Need a custom package?{" "}
            <Link
              href="/contact"
              className="text-primary transition-colors duration-300 hover:text-green-600 hover:underline"
            >
              Contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
