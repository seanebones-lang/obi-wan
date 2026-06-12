import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { matches, formatMatchDateTime, getStageLabelKey } from "@/data/matches";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SchedulePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("schedule");
  const tAll = await getTranslations();

  return (
    <div className="p-4 pb-24 space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
        <p className="text-sm text-muted mt-1">{t("subtitle")}</p>
      </div>

      <div className="space-y-3">
        {matches.map((match) => (
          <div
            key={match.id}
            className={cn(
              "rounded-xl border p-4",
              match.stage === "semi"
                ? "border-amber-500/40 bg-amber-500/5"
                : "border-border bg-surface-elevated",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                {tAll(getStageLabelKey(match.stage))}
                {match.group && ` · ${match.group}`}
              </span>
              <span className="text-xs text-muted">#{match.matchNumber}</span>
            </div>
            <p className="font-display font-bold text-lg mt-1">
              {match.teamA} vs {match.teamB}
            </p>
            <p className="text-sm text-muted">
              {formatMatchDateTime(match, locale)}
            </p>
            <Link
              href={`/match-day?match=${match.id}`}
              className="inline-block mt-3 text-xs font-bold text-accent hover:underline"
            >
              {t("viewMatchDay")} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
