// One source for the five steps. The public page, the practice page and the app all read from here,
// so a wording change is made once.
export type Field = { id: string; label: string };
export type Step = {
  id: string; name: string; question: string; summary: string; leave: string;
  fields: Field[]; skill: string; cards: number[];
  agents: string[]; uxSkills: string[]; guardrail: string;
};

export const STEPS: Step[] = [
  { id: "sense", name: "Sense",
    question: "What did we see, who does it touch, and what does it cost them?",
    summary: "Chat with Aurora to find the real problem. It asks what a good colleague would: who is affected, what you have seen, what you are assuming.",
    leave: "a problem statement specific to healthcare, and a strategic assessment of your idea.",
    fields: [
      { id: "seen", label: "What did we see? Describe what happened, not the fix" },
      { id: "who", label: "Who is affected most?" },
      { id: "cost", label: "What does it cost them?" },
      { id: "touch", label: "Who and what else touches this: people, systems, rules, earlier attempts" },
      { id: "out", label: "Our problem in one sentence" },
    ],
    skill: "Goal: a one-sentence problem in the team's own words. Useful moves: ask what was observed, not the solution; ask why up to five times toward a root cause; who is affected most and what it costs them; who decides, who influences, who is missing; what was tried before and why it fell short. Done when the problem names who, what happens, and the cost.",
    cards: [4, 1, 7, 5],
    agents: ["Researcher", "Synthetic persona"], uxSkills: ["ux-researcher", "synthetic-persona"],
    guardrail: "No patient details. A synthetic persona never counts as evidence." },
  { id: "shape", name: "Shape",
    question: "What needs to change, where is the leverage, and what would we try first?",
    summary: "Name what has to change and where the leverage is. Build the worst-day scenario your idea must survive. Those scenarios become the requirements.",
    leave: "one idea written as a test: if we do this, that happens, for these people.",
    fields: [
      { id: "change", label: "What needs to change?" },
      { id: "lever", label: "Who can change it, and where is the leverage?" },
      { id: "worst", label: "The worst-day scenario our idea must survive" },
      { id: "out", label: "Our idea as a test: if we do X, then Y happens for Z" },
    ],
    skill: "Goal: one testable idea. Useful moves: reframe as How might we; is the barrier capability, opportunity or motivation; what pushes and what holds the status quo; the worst day before the good day; the person with the least slack; what if we removed a step instead of adding one. Done when the idea reads If we do X then Y for Z.",
    cards: [2, 3, 10, 0],
    agents: ["Ideation facilitator", "Scenario writer", "Jobs catalog"], uxSkills: ["ideation-facilitator", "scenario-generator", "jtbd-catalog-generator"],
    guardrail: "You answer first. Every idea carries its worst day." },
  { id: "build", name: "Build",
    question: "What is the smallest version we can put in front of real people, and what did they do with it?",
    summary: "Make the smallest version people can try, and put it in front of the first people who need it most. Record what they do, then what they say.",
    leave: "a prototype, feedback on record, and a call to keep, change or stop.",
    fields: [
      { id: "small", label: "The smallest version we can make this week" },
      { id: "first", label: "Who tries it first: who needs it most and is hardest to reach?" },
      { id: "did", label: "What people did with it, then what they said" },
      { id: "out", label: "Our decision: keep, change or stop, and why" },
    ],
    skill: "Goal: evidence and a decision. Useful moves: prove it low-tech first; choose a first audience that needs it most; record what people did before what they said; premortem: it failed, why; the team decides keep, change or stop, never Aurora. Done when the team has written its decision and its reason.",
    cards: [8, 11, 9],
    agents: ["Experience designer", "Visual designer", "Interface developer"], uxSkills: ["ux-designer", "visual-designer", "ui-developer"],
    guardrail: "Accessible components and made-up records only. A person approves before anything is shared." },
  { id: "guide", name: "Guide",
    question: "Who has to do something differently, and what helps them do it?",
    summary: "Work out whose day changes, what they need to do it, and the case in the decision-maker's own words.",
    leave: "a 90-day plan with one goal, three actions and one owner.",
    fields: [
      { id: "who", label: "Who has to change what they do, and what do they give up?" },
      { id: "help", label: "What they need: skill, time, permission or proof" },
      { id: "case", label: "Who decides, and the case in their words" },
      { id: "out", label: "Our 90-day plan: one goal, three actions, one owner" },
    ],
    skill: "Goal: a plan people can follow. Useful moves: name each person whose day changes and what it costs them; is the gap skill, time, permission or proof; say the case in the decision-maker's words with one piece of evidence and one story; whose voice is missing; one 90-day goal, three actions, one owner. Done when the plan has an owner and a first action.",
    cards: [6, 0, 1],
    agents: ["Usability reviewer", "Manual writer"], uxSkills: ["usability-expert", "manual-writer"],
    guardrail: "Plain language, tried by one real person before it is called ready." },
  { id: "govern", name: "Govern",
    question: "Who owns this, what could go wrong, and how will we know?",
    summary: "Decide who owns it, who can say stop, what could go wrong and how you will know.",
    leave: "guardrails, two measures and a review date.",
    fields: [
      { id: "owner", label: "Who owns it after us, and who can say stop?" },
      { id: "harm", label: "What could go wrong, and who would carry it?" },
      { id: "measure", label: "What we measure, and how often we look" },
      { id: "out", label: "Our guardrails: the rules we keep and the date we review" },
    ],
    skill: "Goal: guardrails the team will keep. Useful moves: who owns it and who can stop it; who benefits and who carries the burden; privacy, safety and fairness risks in plain words; one measure of benefit and one measure of harm; when sunk cost should not keep it alive; a review date. Done when there is an owner, a stop rule, two measures and a date.",
    cards: [9, 8, 10, 11],
    agents: ["Evaluator", "Decision ledger"], uxSkills: ["scenario-generator", "usability-expert"],
    guardrail: "A named owner, a stop rule and a review date, or it does not ship." },
];

export const LENSES: Record<string, [string, string]> = {
  product: ["Product team", "a team building a health product or service"],
  practice: ["Practice", "an independent clinical or wellness practice"],
  course: ["Course", "students or trainees working on a course project"],
  unit: ["Hospital unit", "a hospital unit or department"],
  global: ["Global health", "a global or public health initiative"],
};

export const DECK: [string, string, string][] = [
  ["Echo Chamber Syndrome", "Your team hears only similar opinions.", "How might we disrupt the comfort of agreement to unlock hidden ideas?"],
  ["First Impressions Trap", "You stick with your first idea even when new information points elsewhere.", "How might we systematically challenge our first impressions?"],
  ["Quick Fix Dilemma", "A fast fix works for a while, then the core problem returns stronger.", "How might we address the root cause instead of patching?"],
  ["Band-Aid Problem", "Temporary solutions are repeated and the core issue stays.", "How might we target the underlying problem?"],
  ["Roots and Branches", "Surface issues are clear, deeper causes are hidden.", "How might we dig beneath the symptoms to the real drivers?"],
  ["Interconnected Canopy", "Stakeholder relationships are scattered and unmapped.", "How might we treat every connection as a bridge to insight?"],
  ["Silent Majority", "Quick consensus is hiding disagreement.", "How might we make sure every voice is heard, including dissent?"],
  ["Vivid Case Trap", "One dramatic case is overshadowing common, important evidence.", "How might we balance the memorable example with everyday evidence?"],
  ["Looking Good Syndrome", "Feedback is too positive because people want to please.", "How might we welcome honest, unfiltered input?"],
  ["Investment Trap", "You keep going because of what you've already put in.", "How might we judge when to change course, whatever it cost so far?"],
  ["Tunnel Vision Trap", "Today's problems are hiding longer-term shifts.", "How might we look further ahead?"],
  ["Cracks in the Foundation", "A promising prototype shows weak points under real pressure.", "How might we build something that bends without breaking?"],
];

// Scores. Both are plain arithmetic on what the team did, shown with their inputs so nobody has to take them on faith.
export const SCORES = {
  confidence: { name: "Confidence", headline: "How much is seen, how much is guessed", body: "Every note is marked observed or assumed. A step's confidence is the share your team observed. A plan resting on guesses says so on its face." },
  trust: { name: "Trust", headline: "How often the agents earned their keep", body: "Your team rates each reply useful or off. The share rated useful is the trust score. It sets how much the agents may draft, and they never act without your approval." },
};
export function confidence(observed: number, filled: number) { return filled ? Math.round((observed / filled) * 100) : null; }
export function trust(up: number, down: number) { return up + down >= 3 ? Math.round((up / (up + down)) * 100) : null; }
export function trustRung(score: number | null) {
  if (score === null) return "Ask only: Aurora asks questions until three replies are rated";
  if (score < 50) return "Ask only: Aurora asks questions and offers no drafts";
  if (score < 80) return "Suggest: Aurora may offer hints and examples";
  return "Draft with approval: Aurora may draft, and a person approves every line";
}
