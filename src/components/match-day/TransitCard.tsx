"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Train, Bus, Footprints, Smartphone, ExternalLink } from "lucide-react";

export function TransitCard() {
  const t = useTranslations("matchDay");

  const steps = [
    { icon: Train, text: t("transitStep1") },
    { icon: Bus, text: t("transitStep2") },
    { icon: Footprints, text: t("transitStep3") },
    { icon: Smartphone, text: t("transitStep4") },
  ];

  return (
    <Card className="space-y-4">
      <h3 className="font-display font-bold text-lg">{t("transitTitle")}</h3>
      <ol className="space-y-4">
        {steps.map(({ icon: Icon, text }, i) => (
          <li key={i} className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-sm text-muted leading-relaxed pt-1">{text}</p>
          </li>
        ))}
      </ol>
      <Button variant="outline" asChild className="w-full">
        <a
          href="https://pass.dart.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("gopassLink")}
          <ExternalLink className="h-4 w-4" />
        </a>
      </Button>
      <p className="text-xs text-muted text-center">{t("parkingTip")}</p>
    </Card>
  );
}
