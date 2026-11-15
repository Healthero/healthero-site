# Healthero

Three builds and one design system.

| What | Where | Goes to | How to change it |
|---|---|---|---|
| Practice site | `index.html` | healthero.io | Plain HTML and CSS, no build step. Preview it and edit it directly |
| Aurora site | `aurora/index.html` | healthero.ai (copied to the `healthero-ai` repository) | The same |
| Aurora workshop app | `app/` | The Dev page on Claude | React with accessible shadcn-style components. `cd app && npm install && npm run build` |
| Design system | `design-system/tokens.css` | All three | Colors, fonts and radii. Change a value once |

The practice site uses the Healthero 2 system (`theme-practice`). Aurora uses the palette from the Aurora logo (`theme-aurora`).
The two sites read the tokens on every page load. The app reads them when it is built.

## Publishing

Pushing to `main` publishes the practice site. The `healthero-ai` repository copies the Aurora site from here
every fifteen minutes, so nothing is copied by hand. See `CLAUDE.md` for the working rules.

## Testing the app

`app/test/run.sh` builds the dev version and runs two simulated testers against it in a headless browser.
It prints one line per check. One check is a known gap and is expected to fail.
