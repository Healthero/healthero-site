import * as React from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScoreMeter } from "@/patterns/site";
import { STEPS, LENSES, DECK, confidence, trust, trustRung } from "@/content/steps";
import { ENV, buildPrompt, clip, slug, screen, useCap, type Cap } from "@/lib/aurora";

type Msg = { who: string; by?: string; text: string; rate?: number };
type FieldDoc = { text?: string; basis?: string; by?: string };

const HELP = "Your team answers first. Hints open once you've written something in this step. Examples open once the last field is filled.";

function Join({ cap, onOpen }: { cap: Cap; onOpen: (code: string) => void }) {
  const [name, setName] = React.useState("");
  const [lens, setLens] = React.useState("product");
  const [code, setCode] = React.useState("");
  const [msg, setMsg] = React.useState("");
  const [teams, setTeams] = React.useState<{ id: string; name: string; done: number }[]>([]);
  React.useEffect(() => cap.db.collection("teams").limit(60).onSnapshot((snap: any) => {
    setTeams(snap.docs.map((d: any) => { const t = d.data() || {}; return { id: d.id, name: t.name || d.id, done: Object.keys(t.reviewed || {}).length }; }));
  }, () => {}), [cap]);

  async function create() {
    const n = name.trim();
    if (!n) return setMsg("Give the team a name first.");
    const why = screen(n);
    if (why) return setMsg("That name looks like it contains " + why + ". Choose another.");
    if (!cap.canWrite) return setMsg("You can't create a team with view-only access.");
    const c = (slug(n) || "team") + "-" + Math.floor(1000 + Math.random() * 9000);
    setMsg("Creating the team.");
    try { await cap.db.doc("teams/" + c).set({ name: clip(n, 40), lens, reviewed: {}, persona: "", cards: {}, aiCalls: 0, aiTokens: 0, by: cap.uid || "" }); setMsg(""); onOpen(c); }
    catch { setMsg("The team couldn't be created. You may not have permission to edit this workshop."); }
  }
  async function join() {
    const c = slug(code);
    if (!c) return setMsg("Enter the team's code.");
    setMsg("Looking for that team.");
    try { const s = await cap.db.doc("teams/" + c).get(); if (!s.exists) return setMsg("No team has that code. Check the spelling, including the number at the end."); setMsg(""); onOpen(c); }
    catch { setMsg("That team couldn't be opened. Try again."); }
  }
  return (
    <section className="flex max-w-2xl flex-col gap-6 py-8">
      <h1 className="text-4xl font-light leading-tight md:text-6xl">Work one idea through, together.</h1>
      <p className="text-muted-foreground">Aurora coaches your team from a problem you noticed to a decision you can defend, in three steps you run yourselves: Sense, Shape and Build. Guide and Govern follow as an engagement. Everyone on the team edits the same canvas at once. Never enter a patient's name or details.</p>
      <form className="flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); create(); }}>
        <Label htmlFor="newName">Start a team</Label>
        <div className="flex flex-wrap gap-2">
          <Input id="newName" className="flex-[1_1_200px]" maxLength={40} placeholder="Team name" value={name} onChange={(e) => setName(e.target.value)} />
          <Select value={lens} onValueChange={setLens}>
            <SelectTrigger aria-label="Lens" className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>{Object.entries(LENSES).map(([k, v]) => <SelectItem key={k} value={k}>{v[0]}</SelectItem>)}</SelectContent>
          </Select>
          <Button type="submit">Create team</Button>
        </div>
      </form>
      <form className="flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); join(); }}>
        <Label htmlFor="code">Join a team with its code</Label>
        <div className="flex flex-wrap gap-2">
          <Input id="code" className="flex-[1_1_200px]" maxLength={40} placeholder="for example night-shift-4821" value={code} onChange={(e) => setCode(e.target.value)} />
          <Button type="submit" variant="outline">Join</Button>
        </div>
      </form>
      {msg && <Alert variant="warning">{msg}</Alert>}
      {teams.length > 0 && (
        <div>
          <h2 className="font-sans text-[15px] font-semibold">Teams in this workshop</h2>
          <ul className="list-none p-0">{teams.map((t) => (
            <li key={t.id} className="border-t"><button type="button" onClick={() => onOpen(t.id)} className="flex min-h-11 w-full items-center justify-between gap-3 py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"><span>{t.name}</span><span className="text-sm text-muted-foreground">{t.done} of 3 self-serve steps reviewed</span></button></li>))}
          </ul>
        </div>
      )}
    </section>
  );
}

// One field: local text while typing, saved on a pause, marked observed or assumed.
function FieldEditor({ cap, path, label, remote, highlight }: { cap: Cap; path: string; label: string; remote: FieldDoc; highlight: boolean }) {
  const id = React.useId();
  const [value, setValue] = React.useState(remote.text || "");
  const [state, setState] = React.useState<{ text: string; bad?: boolean }>({ text: "" });
  const focused = React.useRef(false);
  const timer = React.useRef<any>(null);
  const saving = React.useRef(false);
  const queued = React.useRef<FieldDoc | null>(null);
  const basis = remote.basis || "assumed";
  React.useEffect(() => { if (!focused.current && !saving.current && !timer.current) setValue(remote.text || ""); }, [remote.text]);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  async function save(doc: FieldDoc) {
    if (saving.current) { queued.current = doc; return; }
    saving.current = true;
    try { await cap.db.doc(path).set({ text: doc.text || "", basis: doc.basis || "assumed", by: cap.uid || "" }); setState({ text: "Saved for the team" }); }
    catch { setState({ text: "Not saved. Check your connection, then type again.", bad: true }); }
    saving.current = false;
    if (queued.current) { const n = queued.current; queued.current = null; save(n); }
  }
  function onText(v: string) {
    setValue(v);
    clearTimeout(timer.current); timer.current = null;
    const why = screen(v);
    if (why) return setState({ text: "Not saved: this looks like it contains " + why + ". Remove it and it will save.", bad: true });
    setState({ text: "Saving" });
    timer.current = setTimeout(() => { timer.current = null; save({ text: v, basis }); }, 900);
  }
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} maxLength={1200} disabled={!cap.canWrite} value={value} aria-describedby={id + "s"} className={highlight ? "border-l-[6px] border-l-primary" : ""}
        onFocus={() => (focused.current = true)} onBlur={() => (focused.current = false)} onChange={(e) => onText(e.target.value)} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ToggleGroup type="single" value={basis} aria-label={"Basis for: " + label} disabled={!cap.canWrite || screen(value) !== ""}
          onValueChange={(b: string) => { if (b) save({ text: value, basis: b }); }}>
          <ToggleGroupItem value="observed">Observed</ToggleGroupItem>
          <ToggleGroupItem value="assumed">Assumed</ToggleGroupItem>
        </ToggleGroup>
        <p id={id + "s"} role="status" className={"min-h-5 text-sm " + (state.bad ? "text-destructive" : "text-muted-foreground")}>{state.text}</p>
      </div>
    </div>
  );
}

function Team({ cap, code, onLeave }: { cap: Cap; code: string; onLeave: () => void }) {
  const [team, setTeam] = React.useState<any>(null);
  const [missing, setMissing] = React.useState(false);
  const [fields, setFields] = React.useState<Record<string, FieldDoc>>({});
  const [chat, setChat] = React.useState<Msg[]>([]);
  const [cur, setCur] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [note, setNote] = React.useState(HELP);
  const [live, setLive] = React.useState<Msg[] | null>(null);
  const [said, setSaid] = React.useState("");
  const box = React.useRef<HTMLDivElement>(null);
  const step = STEPS[cur];
  const base = "teams/" + code;

  React.useEffect(() => {
    const a = cap.db.doc(base).onSnapshot((s: any) => { if (!s.exists) return setMissing(true); setTeam(s.data() || {}); }, () => setMissing(true));
    const b = cap.db.collection(base + "/fields").onSnapshot((snap: any) => { const f: Record<string, FieldDoc> = {}; snap.docs.forEach((d: any) => (f[d.id] = d.data() || {})); setFields(f); }, () => {});
    return () => { a(); b(); };
  }, [cap, base]);
  React.useEffect(() => {
    setChat([]); setLive(null);
    return cap.db.doc(base + "/chat/" + step.id).onSnapshot((s: any) => { const d = s.exists ? s.data() || {} : {}; setChat(Array.isArray(d.msgs) ? d.msgs : []); }, () => {});
  }, [cap, base, step.id]);
  React.useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [chat, live]);

  const text = (sid: string, fid: string) => (fields[sid + "_" + fid]?.text || "").trim();
  const reviewed = (team && team.reviewed) || {};
  const unlocked = (i: number) => i === 0 || (STEPS[i].tier === "engagement" ? !!reviewed.build : !!reviewed[STEPS[i - 1].id]);
  const filled = step.fields.filter((f) => text(step.id, f.id).length >= 3);
  const observed = filled.filter((f) => fields[step.id + "_" + f.id]?.basis === "observed").length;
  const conf = confidence(observed, filled.length);
  const up = chat.filter((m) => m.rate === 1).length, down = chat.filter((m) => m.rate === -1).length;
  const tr = trust(up, down);
  const allFilled = filled.length === step.fields.length;
  const some = step.fields.some((f) => text(step.id, f.id).length >= 20);
  const out = text(step.id, "out").length >= 3;
  const persona: string = (team && team.persona) || "";
  const ci = team && team.cards ? team.cards[step.id] : undefined;
  const card = typeof ci === "number" ? DECK[ci] : null;
  const can = !!cap.sample && cap.canWrite && !busy && !!team;

  function prompt(level: string, last: string) {
    return buildPrompt({ step, sense: STEPS[0], level, last, persona, card, chat,
      earlier: STEPS.slice(0, cur).filter((x) => x.tier === "self").map((x) => ({ name: x.name, out: text(x.id, "out") })),
      lens: team && LENSES[team.lens] ? LENSES[team.lens][1] : undefined,
      field: (sid, fid) => ({ text: text(sid, fid), basis: fields[sid + "_" + fid]?.basis || "assumed" }) });
  }
  async function writeChat(change: (msgs: Msg[]) => Msg[]) {
    const ref = cap.db.doc(base + "/chat/" + step.id);
    const s = await ref.get(); const d = s.exists ? s.data() || {} : {};
    let msgs: Msg[] = change(Array.isArray(d.msgs) ? d.msgs.slice() : []);
    if (msgs.length > 40) msgs = msgs.slice(msgs.length - 40);
    await ref.set({ msgs });
  }
  async function ask(level: string, last: string) {
    if (!can) return;
    if (last) { const why = screen(last); if (why) return setNote("Not sent: your message looks like it contains " + why + ". Remove it and send again."); }
    setBusy(true); setNote("Aurora is thinking.");
    try {
      const lock = await cap.db.doc(base + "/locks/aurora").acquire({ holder: cap.uid || "tab-" + Math.random().toString(36).slice(2), ttlMs: 30000 });
      if (!lock || !lock.acquired) throw { code: "busy" };
      const p = prompt(level, last);
      const who = level === "voice" ? "persona" : "aurora";
      const pre: Msg[] = last ? [{ who: "user", by: cap.uid || "", text: clip(last, 400) }] : [];
      setLive(pre.concat([{ who, text: "..." }]));
      const res = await cap.sample(p, { modelTier: "quick", onText: (ev: any) => setLive(pre.concat([{ who, text: (typeof ev === "string" ? ev : ev && ev.text) || "..." }])) });
      let reply = clip((res && res.text) || "", 900);
      if (!reply) throw { code: "empty" };
      const leak = screen(reply);
      if (leak) reply = "Aurora's reply was held back because it looked like it contained " + leak + ". Ask again.";
      const tokens = Math.ceil((p.length + reply.length) / 4);
      if (level === "persona") await cap.db.doc(base).update({ persona: reply });
      else await writeChat((m) => m.concat(pre, [{ who, text: reply }]));
      await cap.db.doc(base).update({ aiCalls: ((team && team.aiCalls) || 0) + 1, aiTokens: ((team && team.aiTokens) || 0) + tokens });
      setNote(HELP);
    } catch (e: any) {
      const c = e && e.code;
      setNote(c === "busy" ? "A teammate is already talking with Aurora. Try again in a moment." : c === "rate_limited" ? "Aurora is at its limit for now. Keep working on the canvas and try again in a few minutes." : c === "not_granted" ? "Aurora needs your permission to answer in this view. The canvas still works without it." : "Aurora couldn't answer just now. Your canvas is unaffected. Try again.");
    }
    setLive(null); setBusy(false);
  }
  function rate(i: number, r: number) { if (cap.canWrite) writeChat((m) => m.map((x, k) => (k === i ? { ...x, rate: x.rate === r ? 0 : r } : x))).catch(() => {}); }
  function draw() {
    const pool = step.cards; let pick = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1) while (pick === ci) pick = pool[Math.floor(Math.random() * pool.length)];
    cap.db.doc(base).update({ cards: { [step.id]: pick } }).catch(() => {});
  }

  if (missing) return <div className="flex flex-col items-start gap-4 py-8"><Alert variant="warning">That team doesn't exist, or it can't be reached.</Alert><Button onClick={onLeave}>Pick another team</Button></div>;
  const shown = live ? chat.concat(live) : chat;
  return (
    <section className="flex flex-col gap-4 pt-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p><strong>{team ? team.name : "Loading"}</strong> <span className="text-sm text-muted-foreground">code: {code}{team && LENSES[team.lens] ? " / " + LENSES[team.lens][0] + " lens" : ""}</span></p>
        <Button size="sm" variant="outline" onClick={onLeave}>Switch team</Button>
      </div>
      <Tabs value={String(cur)} onValueChange={(v) => setCur(Number(v))}>
        <TabsList aria-label="Steps">{STEPS.map((s, i) => (
          <TabsTrigger key={s.id} value={String(i)} disabled={!unlocked(i)} className="min-w-[92px]">
            <span className="block font-display text-2xl leading-none">{i + 1}{reviewed[s.id] && <span className="text-base text-primary"> ✓<span className="sr-only"> reviewed</span></span>}</span>
            <span className="text-[13px] text-muted-foreground">{s.name}{s.tier === "engagement" && <span className="sr-only"> (engagement)</span>}</span>
          </TabsTrigger>))}
        </TabsList>
      </Tabs>
      {step.tier === "engagement" ? (
        <div className="flex max-w-3xl flex-col gap-4">
          <p className="flex flex-wrap items-center gap-2 text-sm uppercase tracking-[0.1em] text-primary">Step {cur + 1} of 5 <Badge variant="accent">Engagement with Healthero</Badge></p>
          <h1 className="text-3xl font-light leading-tight md:text-4xl">{step.name}</h1>
          <p className="max-w-[65ch] text-lg">{step.summary}</p>
          <Card>
            <CardHeader><CardTitle className="font-sans text-sm uppercase tracking-wider text-accent">What this step involves</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
              <ul className="list-disc pl-5">{(step.brings || []).map((b) => <li key={b}>{b}</li>)}</ul>
              <p><strong>You leave with:</strong> {step.leave}</p>
              <p className="text-sm"><strong>Guardrail:</strong> {step.guardrail} <span className="text-muted-foreground">Specialists on this step: {step.agents.join(", ")}.</span></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="font-sans text-sm uppercase tracking-wider text-accent">What your team carries in</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-2">
              {STEPS.filter((x) => x.tier === "self").map((x) => <p key={x.id}><strong>{x.name}:</strong> {text(x.id, "out") || "Not written yet."}</p>)}
            </CardContent>
          </Card>
          <p>This step runs with Healthero alongside your team. To talk it through, write to info@healthero.io.</p>
        </div>
      ) : (
      <div className="flex flex-wrap items-start gap-5">
        <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-4">
          <p className="text-sm uppercase tracking-[0.1em] text-primary">Step {cur + 1} of 5</p>
          <h1 className="text-3xl font-light leading-tight md:text-4xl">{step.name}</h1>
          <p className="max-w-[65ch] text-muted-foreground">{step.question}</p>
          {step.fields.map((f) => <FieldEditor key={step.id + f.id} cap={cap} path={base + "/fields/" + step.id + "_" + f.id} label={f.label} remote={fields[step.id + "_" + f.id] || {}} highlight={f.id === "out"} />)}
          <Card>
            <CardHeader><CardTitle className="font-sans text-sm uppercase tracking-wider text-accent">Scores for this step</CardTitle></CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <ScoreMeter label="Confidence" value={conf} detail={filled.length ? observed + " of " + filled.length + " notes marked observed. The rest are guesses to check." : "Write a note and mark it observed or assumed."} />
              <ScoreMeter label="Trust" value={tr} detail={(up + down) + " replies rated, " + up + " useful. " + trustRung(tr) + "."} />
              <p className="text-sm sm:col-span-2"><strong>Guardrail:</strong> {step.guardrail} <span className="text-muted-foreground">Agents on this step: {step.agents.join(", ")}.</span></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="font-sans text-sm uppercase tracking-wider text-accent">Card</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-start gap-3"><p className={card ? "" : "text-muted-foreground"}>{card ? card[0] + ". " + card[1] + " " + card[2] : "No card drawn for this step yet."}</p><Button size="sm" variant="outline" disabled={!cap.canWrite || !team} onClick={draw}>Draw a card</Button></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex flex-wrap items-center gap-2 font-sans text-sm uppercase tracking-wider text-accent">Persona <Badge variant="outline">Synthetic, not research</Badge></CardTitle></CardHeader>
            <CardContent className="flex flex-col items-start gap-3">
              <p className={"whitespace-pre-wrap text-[15px] " + (persona ? "" : "text-muted-foreground")}>{persona || "Fill in who is affected in Sense, then ask Aurora to draft a persona your team can correct."}</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" disabled={!can || text("sense", "who").length < 3} onClick={() => ask("persona", "")}>Draft the persona</Button>
                <Button size="sm" variant="outline" disabled={!can || !persona} onClick={() => ask("voice", "")}>Hear from the persona</Button>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled={!cap.canWrite || !allFilled || !!reviewed[step.id]} onClick={() => cap.db.doc(base).update({ reviewed: { [step.id]: true } }).catch(() => {})}>{reviewed[step.id] ? "Step reviewed" : "We reviewed this step"}</Button>
            <p role="status" className="text-sm text-muted-foreground">{reviewed[step.id] ? (step.id === "build" ? "Guide and Govern are open to read. They run as an engagement." : "The next step is open.") : allFilled ? "" : "Fill in every field in this step first."}</p>
          </div>
        </div>
        <Card role="complementary" aria-label="Aurora" className="flex min-w-0 flex-[1_1_340px] flex-col">
          <CardHeader><CardTitle className="font-light">Talk with Aurora</CardTitle><p className="text-sm text-muted-foreground">Working as the {step.lead} on this step.</p></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {!cap.sample && <Alert variant="warning">Aurora isn't available in this view. The canvas still works.</Alert>}
            <div ref={box} role="log" aria-live="polite" aria-label="Conversation" tabIndex={0} className="flex max-h-[420px] flex-col gap-2 overflow-y-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">
              {shown.length === 0 && <p className="text-sm text-muted-foreground">No conversation on this step yet. Start with a question from Aurora.</p>}
              {shown.map((m, i) => {
                const mine = m.who === "user";
                return (
                  <div key={i} className={"max-w-[92%] whitespace-pre-wrap break-words px-3 py-2 " + (mine ? "self-end bg-field text-field-foreground" : "self-start bg-background" + (m.who === "persona" ? " border-l-4 border-accent" : ""))}>
                    <span className={"block text-xs font-bold " + (mine ? "" : m.who === "persona" ? "text-accent" : "text-primary")}>{m.who === "aurora" ? "Aurora" : m.who === "persona" ? "Persona (synthetic)" : m.by === cap.uid ? cap.name : "A teammate"}</span>
                    {m.text}
                    {!mine && i < chat.length && (
                      <span className="mt-1 flex gap-1">
                        <Button size="icon" variant="ghost" className="size-9" aria-label="Rate this reply useful" aria-pressed={m.rate === 1} disabled={!cap.canWrite} onClick={() => rate(i, 1)}><ThumbsUp className={m.rate === 1 ? "text-primary" : ""} /></Button>
                        <Button size="icon" variant="ghost" className="size-9" aria-label="Rate this reply off" aria-pressed={m.rate === -1} disabled={!cap.canWrite} onClick={() => rate(i, -1)}><ThumbsDown className={m.rate === -1 ? "text-destructive" : ""} /></Button>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" disabled={!can} onClick={() => ask("question", "")}>Ask me a question</Button>
              <Button size="sm" variant="outline" disabled={!can || !some} onClick={() => ask("hint", "")}>Give us a hint</Button>
              <Button size="sm" variant="outline" disabled={!can || !out} onClick={() => ask("example", "")}>Show an example</Button>
            </div>
            <p role="status" className="text-sm text-muted-foreground">{note}</p>
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); const v = said.trim(); if (!v) return; setSaid(""); ask("chat", v); }}>
              <Input aria-label="Message to Aurora" maxLength={400} placeholder="Say something to Aurora" value={said} disabled={!can} onChange={(e) => setSaid(e.target.value)} />
              <Button type="submit" disabled={!can}>Send</Button>
            </form>
            <p className="text-[13px] tabular-nums text-muted-foreground">{team ? "Aurora replies for this team: " + (team.aiCalls || 0) + " / about " + (team.aiTokens || 0) + " tokens" : ""}</p>
          </CardContent>
        </Card>
      </div>
      )}
    </section>
  );
}

function App() {
  const { cap, status } = useCap();
  const read = () => slug((location.hash || "").replace(/^#/, ""));
  const [code, setCode] = React.useState(read());
  React.useEffect(() => { const h = () => setCode(read()); window.addEventListener("hashchange", h); return () => window.removeEventListener("hashchange", h); }, []);
  const open = (c: string) => { location.hash = c; setCode(c); };
  return (
    <div className="container py-4">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b pb-3">
        <p className="font-display text-lg font-bold tracking-wide">Aurora <span className="font-light">by Healthero</span></p>
        <p className="text-sm text-muted-foreground">{cap ? cap.name + (cap.canWrite ? "" : " (view only)") : "Connecting"}</p>
      </header>
      <main className="flex flex-col gap-3 pt-3">
        {ENV === "dev" && <Alert variant="warning">Dev environment. Test data only. Nothing here reaches a real workshop.</Alert>}
        {status && <Alert variant={status.warn ? "warning" : "default"}>{status.text}</Alert>}
        {cap && !cap.canWrite && <Alert variant="warning">You can read this workshop but not edit it. Ask the owner to invite you as an editor.</Alert>}
        {cap && (code ? <Team key={code} cap={cap} code={code} onLeave={() => open("")} /> : <Join cap={cap} onOpen={open} />)}
      </main>
      <footer className="mt-6 border-t pt-3 text-[13px] text-muted-foreground">Aurora coaches innovation. It doesn't give clinical advice and it isn't a record system. Anything it marks [Assumed] is a guess for your team to check. Prototype for rehearsal with invited teammates.</footer>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
