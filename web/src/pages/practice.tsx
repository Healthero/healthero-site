import * as React from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkipLink, SiteHeader, Band, Hero, Section, AgentTable, ScoreExplainers, SiteFooter } from "@/patterns/site";
import { OFFERS, CASES } from "@/content/practice";
import { STEPS } from "@/content/steps";

function Page() {
  const [tab, setTab] = React.useState("0");
  return (
    <>
      <SkipLink />
      <SiteHeader brand="HEALTHERO" links={[["Practice", "#practice"], ["Method", "#method"], ["Collaborations", "#work"], ["Contact", "#contact"]]} cta={["Aurora at healthero.ai", "https://healthero.ai"]} />
      <main id="main">
        <Hero eyebrow="Healthcare innovation practice" title="Sense. Shape. Build. Guide. Govern."
          lead={<>Healthero works alongside nurses, schools and health systems to turn care problems into things people can use. <strong className="font-bold">We do the work with you.</strong></>}
          actions={<><Button asChild size="lg"><a href="#contact">Work with us</a></Button><Button asChild size="lg" variant="outline"><a href="https://healthero.ai">Try Aurora yourself</a></Button></>} />
        <Band />
        <Section id="practice" eyebrow="The practice" title="Three ways to work together">
          <div className="grid gap-5 md:grid-cols-3">{OFFERS.map((o) => (
            <Card key={o.title} className="flex flex-col border">
              <CardHeader><CardDescription className="uppercase tracking-wider">{o.who}</CardDescription><CardTitle>{o.title}</CardTitle></CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4"><p>{o.body}</p><p className="mt-auto border-t pt-4 text-[15px]"><strong>You leave with:</strong> {o.leave}</p></CardContent>
            </Card>))}
          </div>
        </Section>
        <Section id="method" eyebrow="One method" title="Five steps, the same ones Aurora uses" lead="Aurora takes a team through Sense, Shape and Build. An engagement goes further: Guide aligns the work to a living blueprint, and Govern keeps live decision protocols running in the background with your people." className="pt-0 md:pt-0">
          <div className="flex flex-col gap-10">
            <ol className="grid list-none gap-x-8 gap-y-4 p-0 sm:grid-cols-2 lg:grid-cols-5">{STEPS.map((s, i) => (
              <li key={s.id} className="border-t-4 border-foreground pt-3"><p className="font-display text-2xl font-bold">{i + 1}. {s.name}</p><p className="text-[15px]">{s.question}</p></li>))}
            </ol>
            <AgentTable /><ScoreExplainers />
          </div>
        </Section>
        <Section id="work" eyebrow="Proof" title="Collaborations" className="pt-0 md:pt-0">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList aria-label="Collaborations" className="flex-wrap">{CASES.map((c, i) => <TabsTrigger key={c.title} value={String(i)} className="flex-none border bg-transparent text-foreground data-[state=active]:bg-foreground data-[state=active]:text-background">{c.title}</TabsTrigger>)}</TabsList>
            {CASES.map((c, i) => (
              <TabsContent key={c.title} value={String(i)}>
                <Card className="border"><CardHeader><CardDescription className="uppercase tracking-wider">{String(i + 1).padStart(2, "0")} / 06 · {c.partner}</CardDescription><CardTitle className="text-3xl">{c.title}</CardTitle></CardHeader>
                  <CardContent className="grid gap-6 md:grid-cols-3">
                    <p className="md:col-span-3 max-w-[65ch]">{c.summary}</p>
                    <div><h4 className="mb-1 text-sm font-semibold uppercase tracking-wider">Healthero's part</h4><p>{c.role}</p></div>
                    <div><h4 className="mb-1 text-sm font-semibold uppercase tracking-wider">What changed</h4><p>{c.outcome}</p></div>
                    <div className="flex items-end gap-3 md:justify-end">
                      <Button variant="outline" onClick={() => setTab(String((i + CASES.length - 1) % CASES.length))}>Previous</Button>
                      <Button onClick={() => setTab(String((i + 1) % CASES.length))}>Next collaboration</Button>
                    </div>
                  </CardContent></Card>
              </TabsContent>))}
          </Tabs>
        </Section>
        <Section id="contact" eyebrow="Contact" title="Rachael Acker" lead="Founder, Healthero. For engagements, workshops and collaborations, write to [YOUR CONTACT EMAIL]." className="pt-0 md:pt-0" />
      </main>
      <SiteFooter line={<>Bring the problem. <strong className="font-bold">We do the work with you.</strong></>} trail="Practice / Method / Collaborations / Contact" />
    </>
  );
}
createRoot(document.getElementById("root")!).render(<Page />);
