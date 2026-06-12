"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Map,
  Trophy,
  Navigation,
  BookOpen,
} from "lucide-react";

const navItems = [
  { href: "/", icon: Home, labelKey: "nav.home" as const },
  { href: "/explore", icon: Map, labelKey: "nav.explore" as const },
  { href: "/match-day", icon: Trophy, labelKey: "nav.matchDay" as const },
  { href: "/directions", icon: Navigation, labelKey: "nav.directions" as const },
  { href: "/essentials", icon: BookOpen, labelKey: "nav.essentials" as const },
];

export function BottomNav() {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <nav className="border-t border-border bg-background/95 backdrop-blur-lg pb-safe">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {navItems.map(({ href, icon: Icon, labelKey }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-semibold transition-colors min-w-[56px]",
                isActive
                  ? "text-accent"
                  : "text-muted hover:text-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
              <span>{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
