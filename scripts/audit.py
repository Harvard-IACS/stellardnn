from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlsplit,unquote
import json
root=Path(__file__).resolve().parents[1]
pages=list(root.glob('*.html'))+list((root/'projects').rglob('*.html'))
report={}
for p in pages:
 s=BeautifulSoup(p.read_text(errors='replace'),'html.parser'); missing=[]; placeholder=[]
 for a in s.find_all(['a','img','script','link']):
  ref=a.get('href') or a.get('src')
  if not ref: continue
  u=urlsplit(ref)
  if u.scheme or u.netloc: continue
  if ref in ['#','javascript:;']: placeholder.append(ref);continue
  if not u.path: continue
  dest=(root/unquote(u.path.lstrip('/'))) if u.path.startswith('/') else p.parent/unquote(u.path)
  if not dest.exists(): missing.append(ref)
 report[str(p.relative_to(root))]={'title':s.title.get_text() if s.title else '', 'missing_local_targets':sorted(set(missing)), 'placeholder_links':len(placeholder),'h1_count':len(s.find_all('h1'))}
print(json.dumps(report,indent=2))
