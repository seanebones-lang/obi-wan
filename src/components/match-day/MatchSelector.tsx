"use client";

import { useTranslations, useLocale } from "next-intl";
import { matches, formatMatchDateTime, getStageLabelKey, type Match } from "@/data/matches";
import { cn } from "@/lib/utils";

type MatchSelectorProps = {
  selectedId: string | null;
  onSelect: (match: Match) => void;
};

export function MatchSelector({ selectedId, onSelect }: MatchSelectorProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="space-y-2">
      {matches.map((match) => {
        const isSelected = match.id === selectedId;
        const isSemi = match.stage === "semi";

        return (
          <button
            key={match.id}
            onClick={() => onSelect(match)}
            className={cn(
              "w-full rounded-xl border p-4 text-left transition-all",
              isSelected
                ? "border-accent bg-accent/10 shadow-lg shadow-accent/10"
                : "border-border bg-surface-elevated hover:border-accent/30",
              isSemi && !isSelected && "border-amber-500/30",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                {t(getStageLabelKey(match.stage))}
                {match.group && ` · ${match.group}`}
              </span>
              {isSemi && (
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                  ★
                </span>
              )}
            </div>
            <p className="font-display font-bold text-lg mt-1">
              {match.teamA} vs {match.teamB}
            </p>
            <p className="text-sm text-muted mt-0.5">
              {formatMatchDateTime(match, locale)}
            </p>
          </button>
        );
      })}
    </div>
  );
}
