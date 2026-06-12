import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { QuickLaunchCard } from "@/components/explore/ExploreClient";
import { anchors } from "@/data/anchors";
import { anchorTranslationKeys } from "@/data/anchor-keys";
import { Link } from "@/i18n/navigation";
import { Trophy, PartyPopper, Plane, Map, Calendar } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const ta = await getTranslations();
  const tNav = await getTranslations("nav");

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden px-4 pt-8 pb-10">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
            FIFA World Cup 2026™
          </p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="text-muted mt-2 text-base leading-relaxed">
            {t("heroSubtitle")}
          </p>
          <div className="mt-4 flex items-center gap-3 text-sm">
            <span className="rounded-full bg-accent/20 px-3 py-1 font-bold text-accent">
              {t("matchesHosted")}
            </span>
            <span className="text-muted">{t("semiFinal")}</span>
          </div>
        </div>
      </section>

      <section className="px-4 space-y-3">
        <QuickLaunchCard
          href="/match-day"
          title={t("goingToMatch")}
          description={t("goingToMatchDesc")}
          icon={<Trophy className="h-6 w-6 text-accent" />}
          accent
        />
        <QuickLaunchCard
          href="/explore?zone=fan-festival"
          title={t("fanFestival")}
          description={t("fanFestivalDesc")}
          icon={<PartyPopper className="h-6 w-6" />}
        />
        <QuickLaunchCard
          href="/directions?dest=stadium"
          title={t("justArrived")}
          description={t("justArrivedDesc")}
          icon={<Plane className="h-6 w-6" />}
        />
        <QuickLaunchCard
          href="/explore"
          title={t("exploreDFW")}
          description={t("exploreDFWDesc")}
          icon={<Map className="h-6 w-6" />}
        />
      </section>

      <section className="px-4 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-lg">{t("featuredZones")}</h2>
          <Link
            href="/schedule"
            className="flex items-center gap-1 text-xs font-semibold text-accent"
          >
            <Calendar className="h-3.5 w-3.5" />
            {tNav("schedule")}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {anchors.slice(0, 6).map((anchor) => {
            const keys = anchorTranslationKeys[anchor.id];
            return (
              <Link
                key={anchor.id}
                href={`/explore?zone=${anchor.id}`}
                className="rounded-xl border border-border bg-surface-elevated p-3 hover:border-accent/30 transition-colors"
              >
                <p className="font-semibold text-sm">
                  {keys ? ta(keys.name) : anchor.id}
                </p>
                <p className="text-xs text-muted mt-0.5 line-clamp-2">
                  {keys ? ta(keys.description) : ""}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
