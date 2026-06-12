import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground font-display text-sm font-bold">
            FC
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            DFW Fan Compass
          </span>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
