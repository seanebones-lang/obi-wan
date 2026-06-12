import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getEssentialTopic } from "@/data/essentials";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Map } from "lucide-react";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return [
    { slug: "getting-around" },
    { slug: "know-before-you-go" },
    { slug: "bbq-trail" },
    { slug: "deep-ellum" },
    { slug: "fort-worth-stockyards" },
    { slug: "official-links" },
  ];
}

export default async function EssentialDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const topic = getEssentialTopic(slug);
  if (!topic) notFound();

  const t = await getTranslations();

  return (
    <div className="p-4 pb-24 space-y-6">
      <Link
        href="/essentials"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("common.back")}
      </Link>

      <div>
        <h1 className="font-display text-2xl font-bold">{t(topic.titleKey)}</h1>
        <p className="text-muted mt-1">{t(topic.descriptionKey)}</p>
      </div>

      <div className="space-y-6">
        {topic.sections.map((section, i) => (
          <section key={i}>
            <h2 className="font-display font-bold text-lg mb-2">
              {t(section.headingKey)}
            </h2>
            <p className="text-sm text-muted leading-relaxed">{t(section.bodyKey)}</p>
          </section>
        ))}
      </div>

      {topic.mapAnchorId && (
        <Button asChild className="w-full">
          <Link href={`/explore?zone=${topic.mapAnchorId}`}>
            <Map className="h-4 w-4" />
            {t("essentials.exploreOnMap")}
          </Link>
        </Button>
      )}

      {topic.externalLinks && topic.externalLinks.length > 0 && (
        <div className="space-y-2">
          {topic.externalLinks.map((link) => (
            <Button key={link.url} variant="outline" asChild className="w-full">
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {t(link.labelKey)}
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
