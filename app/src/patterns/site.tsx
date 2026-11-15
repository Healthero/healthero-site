// Reusable patterns for the app.
import * as React from "react";
import { Progress } from "@/components/ui/progress";

// A score always shows its inputs. A bare percentage invites more faith than it has earned.
export function ScoreMeter({ label, value, detail }: { label: string; value: number | null; detail: string }) {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span id={id} className="text-sm font-semibold uppercase tracking-wider">{label}</span>
        <span className="font-display text-xl font-bold tabular-nums">{value === null ? "Not yet" : value + "%"}</span>
      </div>
      <Progress value={value ?? 0} aria-labelledby={id} />
      <p className="text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}
