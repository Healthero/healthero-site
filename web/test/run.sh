#!/bin/sh
# Builds the dev bundle, serves it, and runs the stress harness in headless Chrome. Prints one line per check.
set -e
cd "$(dirname "$0")/.."
VITE_ENV=dev npx vite build --outDir dist-dev >/dev/null 2>&1
cp test/harness.html dist-dev/harness.html
sed 's|<div id="root"></div>|<div id="root"></div><script>window.claude = parent.makeClaude(new URLSearchParams(location.search).get("u"));</script>|' dist-dev/app.html > dist-dev/harness-app.html
npx vite preview --outDir dist-dev --port 4174 >/dev/null 2>&1 &
PID=$!
sleep 3
google-chrome --headless=new --no-sandbox --disable-gpu --window-size=1000,900 --virtual-time-budget=90000 --dump-dom http://localhost:4174/harness.html 2>/dev/null > /tmp/harness-dom.html || true
kill $PID 2>/dev/null || true
python3 - <<'P'
import re,json,html
s=open('/tmp/harness-dom.html').read()
m=re.search(r'<pre id="out">RESULTS(.*?)END</pre>',s,re.S)
if not m: print("NO RESULTS", s[:400]); raise SystemExit(1)
r=json.loads(html.unescape(m.group(1)))
for x in r: print(("PASS" if x["pass"] else "FAIL"), x["id"].ljust(5), x["name"], ("| "+x["saw"]) if x["saw"] else "")
print(sum(x["pass"] for x in r),"of",len(r),"passed")
P
