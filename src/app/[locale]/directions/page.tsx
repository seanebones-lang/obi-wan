import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { DirectionsClient } from "@/components/directions/DirectionsClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DirectionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("directions");

  return (
    <div>
      <div className="px-4 pt-4">
        <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
      </div>
      <Suspense fallback={<div className="p-4 text-muted">{t("loading")}</div>}>
        <DirectionsClient />
      </Suspense>
    </div>
  );
}
