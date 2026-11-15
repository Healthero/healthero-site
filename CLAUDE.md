# Working in this repository

The owner is a designer, not a developer. Explain in plain words, show the change, and publish only when asked.

## What is here

| What | File | Live at |
|---|---|---|
| Practice site | `index.html` | healthero.io (GitHub Pages serves this repository's `main` branch) |
| Aurora site | `aurora/index.html` | healthero.ai (the `healthero-ai` repository copies it from here on a timer) |
| Aurora workshop app | `app/` | The "Aurora Team Workshop Dev" page on Claude |
| Design system | `design-system/tokens.css` | Read by all three |

## Rules

- Colors, fonts and radii change in `design-system/tokens.css` only. Never hardcode a color in a page when a token exists.
- `theme-practice` follows the Healthero 2 design system. `theme-aurora` follows the palette of the Aurora logo.
- Never use tokens, colors or fonts from a client's design system. If a supplied file names another organization's system, stop and ask.
- No placeholder text on the live sites. If a fact is missing, leave the line out and say what is needed. Never invent partner details or outcomes.
- No real patient data anywhere, including test files.
- Never edit the `healthero-ai` repository by hand. It is a copy.
- Site copy: plain words, active voice, no em dashes, no exclamation marks.

## How to make a change

1. Make the edit. For the two sites this is plain HTML and CSS with no build step.
2. Show the result before publishing: a screenshot or a preview.
3. When the owner says publish: commit to `main` and push. The practice site updates in a minute or two. The Aurora site follows within about half an hour.
4. To undo: revert the last commit and push.

## The app

- After any change in `app/` or in the tokens: `cd app && npm install && ./test/run.sh`. All checks should pass except the one marked as a known gap.
- Then build with `VITE_ENV=dev npx vite build --outDir dist-dev` and publish `dist-dev/index.html` and `dist-dev/assets/*` to the Dev page, replacing its files.
- The app only runs inside a Claude page. It cannot be hosted on GitHub Pages.
