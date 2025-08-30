import Link from "next/link";
import { Suspense } from "react";
import LocaleToggler from "../shared/locale-toggler";
import ThemeToggle from "../shared/theme-toggle";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Poker Edit Pro</h3>
            <p className="text-sm text-muted-foreground">
              Professional video editing services for poker players and content
              creators. Transform your raw footage into viral-worthy content.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#packages"
                  className="transition-colors hover:text-foreground"
                >
                  Short Clips
                </Link>
              </li>
              <li>
                <Link
                  href="#packages"
                  className="transition-colors hover:text-foreground"
                >
                  Full Projects
                </Link>
              </li>
              <li>
                <Link
                  href="#packages"
                  className="transition-colors hover:text-foreground"
                >
                  Live Sessions
                </Link>
              </li>
              <li>
                <Link
                  href="#packages"
                  className="transition-colors hover:text-foreground"
                >
                  Branding
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#faq"
                  className="transition-colors hover:text-foreground"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/chat"
                  className="transition-colors hover:text-foreground"
                >
                  Live Chat
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/projects/new"
                  className="transition-colors hover:text-foreground"
                >
                  Start Project
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-foreground"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>24/7 Support</li>
              <li>support@pokereditpro.com</li>
              <li>Discord Community</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Poker Edit Pro. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Suspense>
              <LocaleToggler />
            </Suspense>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
