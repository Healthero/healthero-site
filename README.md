# Healthero

Two builds and one design system.

| What | Where | How to change it |
|---|---|---|
| Practice site (healthero.io) | `index.html` | Plain HTML and CSS, no build step. Open it in a preview and edit it directly |
| Aurora workshop app | `app/` | React with accessible shadcn-style components. `cd app && npm install && npm run build` |
| Design system | `design-system/tokens.css` | Colors, fonts and spacing for both. Change a value once and both builds follow |

The practice site reads the tokens on every page load. The app reads them when it is built.

## Testing the app

`app/test/run.sh` builds the dev version and runs two simulated testers against it in a headless browser.
It prints one line per check. One check is a known gap and is expected to fail.

## Before the practice site goes public

Bracketed text in `index.html` is still to fill. Partner names need each partner's consent.
