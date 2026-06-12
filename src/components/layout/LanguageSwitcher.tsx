"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  pt: "PT",
  fr: "FR",
  de: "DE",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="sr-only">{t("language")}</span>
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => router.replace(pathname, { locale: l })}
          className={cn(
            "rounded-lg px-2.5 py-1 text-xs font-bold transition-colors",
            locale === l
              ? "bg-accent text-accent-foreground"
              : "text-muted hover:text-foreground hover:bg-surface-elevated",
          )}
        >
          {localeLabels[l]}
        </button>
      ))}
    </div>
  );
}
