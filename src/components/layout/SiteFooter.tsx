import { getTranslations } from "next-intl/server";
import { Coffee } from "lucide-react";

export async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-border/50 bg-background/95 px-4 py-2 text-center backdrop-blur-lg">
      <p className="text-[11px] leading-relaxed text-muted">
        {t("welcome")}{" "}
        <a
          href="https://mothership-ai.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-accent hover:underline"
        >
          {t("company")}
        </a>
      </p>
      <a
        href="https://square.link/u/jVbXEVOc"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-muted hover:text-accent transition-colors"
      >
        <Coffee className="h-3 w-3" />
        {t("coffee")}
      </a>
    </footer>
  );
}
