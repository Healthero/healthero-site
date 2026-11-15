// Reusable page patterns. Pages compose these and never style from scratch.
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { STEPS, SCORES } from "@/content/steps";

export function SkipLink() {
  return <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Skip to content</a>;
}

export function SiteHeader({ brand, sub, links, cta }: { brand: string; sub?: string; links: [string, string][]; cta?: [string, string] }) {
  return (
    <header className="container flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-5">
      <a href="#top" className="font-display text-xl font-bold tracking-wide no-underline">{brand}{sub && <span className="font-light"> {sub}</span>}</a>
      <nav aria-label="Main" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm uppercase tracking-wider">
        {links.map(([label, href]) => <a key={href} href={href} className="py-2 no-underline hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">{label}</a>)}
        {cta && <Button asChild size="sm"><a href={cta[1]}>{cta[0]}</a></Button>}
      </nav>
    </header>
  );
}

export function Band() { return <div aria-hidden="true" className="h-1.5" style={{ background: "var(--band)" }} />; }

export function Section({ id, eyebrow, title, lead, children, className }: { id?: string; eyebrow?: string; title: string; lead?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={cn("container py-16 md:py-24", className)}>
      {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-primary">{eyebrow}</p>}
      <h2 className="max-w-4xl text-4xl font-light leading-[1.05] tracking-tight md:text-6xl">{title}</h2>
      {lead && <p className="mt-6 max-w-[65ch] text-lg md:text-xl">{lead}</p>}
      {children && <div className="mt-10">{children}</div>}
    </section>
  );
}

export function Hero({ eyebrow, title, lead, actions, aside }: { eyebrow: string; title: string; lead: React.ReactNode; actions: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section id="top" className="container flex flex-wrap items-center gap-x-16 gap-y-10 py-14 md:py-20">
      <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-6">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">{eyebrow}</p>
        <h1 className="text-5xl font-light leading-none tracking-tight md:text-8xl">{title}</h1>
        <p className="max-w-[40ch] text-2xl font-light leading-snug md:text-3xl">{lead}</p>
        <div className="flex flex-wrap gap-4 pt-2">{actions}</div>
      </div>
      {aside && <div className="flex flex-[1_1_260px] justify-center">{aside}</div>}
    </section>
  );
}

export function StepCards() {
  return (
    <ol className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-5">
      {STEPS.map((s, i) => (
        <li key={s.id}>
          <Card className="flex h-full flex-col border-t-4 border-primary">
            <CardHeader>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-display text-5xl font-light leading-none text-primary" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                {i === 0 && <Badge>Free</Badge>}
              </div>
              <CardTitle className="pt-2">{s.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <p>{s.summary}</p>
              <p className="mt-auto border-t pt-4 text-[15px]"><strong>You leave with:</strong> {s.leave}</p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ol>
  );
}

export function AgentTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <caption className="sr-only">Agents and guardrails by step</caption>
        <thead>
          <tr className="text-sm uppercase tracking-wider text-primary">
            <th scope="col" className="border-b py-3 pr-6 font-semibold">Step</th>
            <th scope="col" className="border-b py-3 pr-6 font-semibold">Agents on this step</th>
            <th scope="col" className="border-b py-3 font-semibold">Guardrail</th>
          </tr>
        </thead>
        <tbody>
          {STEPS.map((s) => (
            <tr key={s.id} className="align-top">
              <th scope="row" className="border-b py-4 pr-6 font-display text-2xl font-bold">{s.name}</th>
              <td className="border-b py-4 pr-6">{s.agents.join(", ")}</td>
              <td className="border-b py-4">{s.guardrail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ScoreExplainers() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {[SCORES.confidence, SCORES.trust].map((s) => (
        <Card key={s.name} className="border bg-transparent">
          <CardHeader>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">{s.name} score</p>
            <CardTitle>{s.headline}</CardTitle>
          </CardHeader>
          <CardContent><p>{s.body}</p></CardContent>
        </Card>
      ))}
    </div>
  );
}

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

export function SiteFooter({ line, cta, trail }: { line: React.ReactNode; cta?: [string, string]; trail: string }) {
  return (
    <footer style={{ background: "var(--band)" }} className="text-[#231f20]">
      <div className="container flex flex-col gap-10 py-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-[28ch] font-display text-3xl font-light leading-snug md:text-4xl">{line}</p>
          {cta && <a href={cta[1]} className="inline-flex min-h-14 items-center bg-[#231f20] px-8 text-lg font-bold text-white no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f20]">{cta[0]}</a>}
        </div>
        <div className="flex flex-wrap justify-between gap-x-10 gap-y-2 border-t border-[#231f20] pt-4 text-sm uppercase tracking-wide">
          <span>{trail}</span>
          <span className="text-xs">© 2026 Healthero LLC. All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
