import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { essentialTopics } from "@/data/essentials";
import { Link } from "@/i18n/navigation";
import {
  Train,
  Info,
  Flame,
  Music,
  Landmark,
  Link as LinkIcon,
  ChevronRight,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  train: Train,
  info: Info,
  flame: Flame,
  music: Music,
  horse: Landmark,
  link: LinkIcon,
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function EssentialsIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="p-4 pb-24 space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold">{t("essentials.title")}</h1>
        <p className="text-sm text-muted mt-1">{t("essentials.subtitle")}</p>
      </div>

      <div className="space-y-2">
        {essentialTopics.map((topic) => {
          const Icon = iconMap[topic.icon] ?? Info;
          return (
            <Link
              key={topic.slug}
              href={`/essentials/${topic.slug}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-surface-elevated p-4 hover:border-accent/30 transition-colors"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{t(topic.titleKey)}</p>
                <p className="text-xs text-muted truncate">{t(topic.descriptionKey)}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
