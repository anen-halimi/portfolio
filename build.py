"""Build an offline, self-contained portfolio using only the Python standard library."""
from pathlib import Path
import base64
import json

ROOT = Path(__file__).resolve().parent
source = ROOT / 'src'
html = (source / 'index.html').read_text()
data = json.loads((source / 'content.json').read_text())
for key, filename in [('source', 'rail-source.png'), ('style', 'rail-style.png'), ('incrustation', 'incrustation-result.png')]:
    data.setdefault('images', {})[key] = 'data:image/png;base64,' + base64.b64encode((ROOT / 'assets' / filename).read_bytes()).decode()
html = html.replace('/* INLINE_STYLES */', (source / 'styles.css').read_text())
html = html.replace('/* INLINE_SCRIPT */', (source / 'app.js').read_text())
html = html.replace('/* INLINE_DATA */', json.dumps(data, ensure_ascii=False).replace('<', '\\u003c'))
(ROOT / 'index.html').write_text(html)
print(f'Built {ROOT / "index.html"} ({len(html.encode()):,} bytes)')
