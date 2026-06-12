export type Match = {
  id: string;
  matchNumber: number;
  date: string;
  time: string;
  timezone: string;
  stage: "group" | "round32" | "round16" | "semi";
  group: string | null;
  teamA: string;
  teamB: string;
  venue: string;
  venueId: string;
};

import matchesData from "./matches.json";

export const matches: Match[] = matchesData as Match[];

export function getMatch(id: string): Match | undefined {
  return matches.find((m) => m.id === id);
}

export function formatMatchDateTime(match: Match, locale: string): string {
  const dt = new Date(`${match.date}T${match.time}:00`);
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: match.timezone,
  }).format(dt);
}

export function getStageLabelKey(stage: Match["stage"]): string {
  const keys: Record<Match["stage"], string> = {
    group: "schedule.stageGroup",
    round32: "schedule.stageRound32",
    round16: "schedule.stageRound16",
    semi: "schedule.stageSemi",
  };
  return keys[stage];
}
