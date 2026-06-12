import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface-elevated p-5 shadow-xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
