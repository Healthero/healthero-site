# Healthero web

One codebase, three pages, one component set.

| Page | File | Goes to |
|---|---|---|
| Aurora public page | `index.html` | healthero.ai |
| Practice page | `practice.html` | healthero.io |
| Aurora team workshop | `app.html` | the workshop app |

## How it is put together

- `src/components/ui/` holds accessible building blocks in the shadcn style, built on Radix: button, card, badge, tabs, select, toggle group, progress, input, textarea, label, alert. Pages never style a control from scratch.
- `src/patterns/site.tsx` holds the reusable page patterns: header, hero, section, step cards, agent table, score meter, footer.
- `src/content/` holds the words. `steps.ts` is the single source for the five steps, their agents, guardrails and the two scores. Change a step there and all three pages change.
- `src/index.css` holds two themes, `theme-aurora` and `theme-practice`. A brand change is a change to those variables.

## Scores

- Confidence: the share of a step's notes the team marked observed, not assumed.
- Trust: the share of Aurora's replies the team rated useful, shown once three are rated.

## Commands

`npm install`, then `npm run dev` to work on it or `npm run build` to produce `dist/`.
Set `VITE_ENV=dev` when building the workshop app for the dev page.
