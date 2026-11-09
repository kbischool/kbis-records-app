"""Fails the build with a readable message if the installable-app files are broken."""
import json, pathlib, re, sys

root = pathlib.Path(sys.argv[1])
errs = []
try:
    m = json.loads((root / "manifest.json").read_text(encoding="utf-8"))
except Exception as e:
    print(f"::error::manifest.json is not valid JSON: {e}")
    sys.exit(1)
for k in ("name", "short_name", "start_url", "scope", "display", "icons"):
    if k not in m:
        errs.append(f"manifest.json is missing '{k}'")
for i in m.get("icons", []):
    if not (root / i["src"]).exists():
        errs.append(f"manifest icon not found: {i['src']}")
for f in ("index.html", "service-worker.js", "offline.html", "404.html"):
    if not (root / f).exists():
        errs.append(f"missing file: {f}")
sw = root / "service-worker.js"
if sw.exists():
    for p in re.findall(r"'\./([^']+)'", sw.read_text(encoding="utf-8")):
        if not (root / p).exists():
            errs.append(f"service-worker.js lists a file that does not exist: {p}")
if errs:
    print("::error::" + "; ".join(errs))
    sys.exit(1)
print("PWA files OK")
