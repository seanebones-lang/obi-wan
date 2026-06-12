"use client";

import { useTranslations } from "next-intl";
import { categoryTypes } from "@/data/anchors";
import { cn } from "@/lib/utils";
import {
  Utensils,
  Beer,
  Coffee,
  ParkingCircle,
  Bed,
  Pill,
  Banknote,
  ShoppingBag,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  utensils: Utensils,
  beer: Beer,
  coffee: Coffee,
  parking: ParkingCircle,
  bed: Bed,
  pill: Pill,
  banknote: Banknote,
  "shopping-bag": ShoppingBag,
};

type CategoryFiltersProps = {
  active: string;
  onChange: (category: string) => void;
  categories?: string[];
};

export function CategoryFilters({
  active,
  onChange,
  categories = Object.keys(categoryTypes),
}: CategoryFiltersProps) {
  const t = useTranslations();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((key) => {
        const cat = categoryTypes[key];
        if (!cat) return null;
        const Icon = iconMap[cat.icon] ?? Utensils;
        const isActive = active === key;

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all",
              isActive
                ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                : "bg-surface-elevated text-muted border border-border hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {t(cat.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
