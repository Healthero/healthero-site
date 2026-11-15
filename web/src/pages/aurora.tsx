import * as React from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkipLink, SiteHeader, Band, Hero, Section, StepCards, AgentTable, ScoreExplainers, SiteFooter } from "@/patterns/site";

const START = "https://workshop.healthero.ai";
const LAYERS = [
  ["What you can see", "Signal", "Delays, errors, burnout, tools nobody uses. The friction and outcomes on the surface."],
  ["How people work together", "Social", "Workflows, trust, incentives, workarounds. This is where a prototype belongs first."],
  ["What makes it the default", "Code", "Policies, data, rules, automation. The hardest layer to change, so it changes last."],
];
const WHY = [["Judgment.", "Aurora asks about bias, ethics, culture and who pays before anyone builds."], ["Trust.", "Every claim shows its source or is marked as an assumption."], ["Skill.", "You answer first, then Aurora responds. You should need it less each time."]];
const WONT = [["Use real patient data.", "Prototypes run on made-up records only."], ["Call a prototype a product.", "It proves the idea, not the build."], ["Promise funding.", "We promise evidence, including a clear stop."]];

function Pairs({ title, items }: { title: string; items: string[][] }) {
  return (
    <div>
      <h3 className="mb-2 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-primary">{title}</h3>
      <ul className="list-none p-0">{items.map(([a, b]) => <li key={a} className="border-b py-4"><strong>{a}</strong> {b}</li>)}</ul>
    </div>
  );
}

function Page() {
  return (
    <>
      <SkipLink />
      <SiteHeader brand="Aurora" sub="by Healthero" links={[["The line", "#line"], ["The team", "#team"], ["How Aurora thinks", "#thinking"], ["Case", "#case"]]} cta={["Talk to Aurora", START]} />
      <main id="main">
        <Hero eyebrow="Aurora Line" title="Idea to evidence"
          lead={<>You have an idea for better care and no first step. Aurora walks you from a hunch to a prototype <strong className="font-bold">real people have reacted to</strong>, and sharpens your own thinking on the way.</>}
          actions={<><Button asChild size="lg"><a href={START}>Start free with Aurora</a></Button><Button asChild size="lg" variant="outline"><a href="mailto:info@healthero.io?subject=Aurora%20Line%20fit%20call">Book a 20-minute fit call</a></Button></>}
          aside={<div aria-hidden="true" className="size-56 rounded-full md:size-72" style={{ background: "conic-gradient(from 200deg, #16e7ce, #7e7cfe, #ce28c1, #262261, #16e7ce)", WebkitMask: "radial-gradient(circle, transparent 46%, #000 47%)", mask: "radial-gradient(circle, transparent 46%, #000 47%)" }} />} />
        <Band />
        <Section id="line" eyebrow="The line" title="Five steps. The first is free." lead="You run Sense, Shape and Build yourself with Aurora. Guide and Govern are an engagement with Healthero, for teams ready to put what they built to work."><StepCards /></Section>
        <Section id="team" eyebrow="The team behind each step" title="Agents do the legwork. You sign every step." lead="Each step has its own specialist agents and one rule they cannot break. Nothing moves to the next step until a person on your team has reviewed it." className="pt-0 md:pt-0">
          <div className="flex flex-col gap-10"><AgentTable /><ScoreExplainers /></div>
        </Section>
        <section className="container grid gap-10 pb-16 md:grid-cols-2 md:pb-24"><Pairs title="Why Aurora" items={WHY} /><Pairs title="We won't" items={WONT} /></section>
        <div className="bg-card">
          <Section id="thinking" eyebrow="How Aurora thinks" title="Signal. Social. Code." lead={<>Most problems show up in one place and start in another. Aurora looks at three layers before it suggests anything. <strong>Don't automate confusion.</strong></>}>
            <div className="grid gap-x-10 md:grid-cols-3">{LAYERS.map(([k, t, b]) => (
              <div key={t} className="border-t py-6"><p className="mb-2 text-sm uppercase tracking-wider text-primary">{k}</p><h3 className="mb-2 text-3xl font-bold">{t}</h3><p>{b}</p></div>))}
            </div>
          </Section>
        </div>
        <Section id="case" eyebrow="Case 01" title="An advisor that teaches">
          <div className="grid gap-6 md:grid-cols-2">
            <p className="text-lg">Aurora began as an AI innovation advisor for nurse-led teams. It has run in innovation workshops in two languages, all of it pro bono. That is where we learned a good advisor leaves people asking sharper questions.</p>
            <Card className="border bg-transparent"><CardHeader><CardTitle className="font-sans text-sm uppercase tracking-wider">To add, with each partner's consent</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-2"><p>[PARTNER NAMES]</p><p>[WORKSHOPS: HOW MANY, WHEN, WHERE]</p><p>[WHAT PARTICIPANTS DID OR SAID, WITH A SOURCE]</p></CardContent></Card>
          </div>
          <p className="mt-8"><a className="font-bold underline underline-offset-4" href="https://healthero.io">See the practice and its collaborations at healthero.io</a></p>
        </Section>
      </main>
      <SiteFooter line={<>Bring the idea. <strong className="font-bold">Leave with evidence.</strong></>} cta={["Start free with Aurora", START]} trail="Aurora Line / Sense / Shape / Build / Guide / Govern" />
    </>
  );
}
createRoot(document.getElementById("root")!).render(<Page />);
