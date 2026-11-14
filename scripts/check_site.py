"""Validate the authored static website and its internal navigation."""
from pathlib import Path
from urllib.parse import urlsplit,unquote
from bs4 import BeautifulSoup
import json,re
root=Path(__file__).resolve().parents[1]
pages=list(root.glob('*.html'))+list((root/'projects').rglob('*.html'))
soups={p.resolve():BeautifulSoup(p.read_text(),'html.parser') for p in pages}
errors=[];links=0
for p,s in soups.items():
 if len(s.find_all('h1'))!=1:errors.append(f'{p.relative_to(root)}: expected one h1')
 if not s.title or not s.title.get_text(strip=True):errors.append(f'{p}: missing title')
 for el in s.find_all(['a','img','script','link']):
  attr='href' if el.name in ['a','link'] else 'src';ref=el.get(attr)
  if ref is None:continue
  if not ref or ref in ['#','javascript:;']:errors.append(f'{p.relative_to(root)}: empty/placeholder {attr}');continue
  u=urlsplit(ref)
  if u.scheme or u.netloc:continue
  dest=((root/unquote(u.path.lstrip('/'))) if u.path.startswith('/') else (p.parent/unquote(u.path))).resolve() if u.path else p
  links+=1
  if not dest.exists():errors.append(f'{p.relative_to(root)}: missing {ref}');continue
  if dest.is_dir() and el.name=='img':errors.append(f'{p.relative_to(root)}: image is directory {ref}')
  if u.fragment and dest in soups and not soups[dest].find(id=unquote(u.fragment)) and not soups[dest].find(attrs={'name':unquote(u.fragment)}):errors.append(f'{p.relative_to(root)}: missing fragment {ref}')
 for img in s.find_all('img'):
  if not img.has_attr('alt'):errors.append(f'{p.relative_to(root)}: missing image alt')
recent=json.loads((root/'data/recent-publications.json').read_text())
assert len({x['id'] for x in recent})==len(recent),'Duplicate publication IDs'
assert all(x['verified'] and x['url'].startswith('https://') for x in recent),'Unverified recent publication'
assert not re.search(r'400\+|76\+|25\s+people',soups[(root/'index.html').resolve()].get_text()),'Unsupported count'
result={'pages':len(pages),'internal_references_checked':links,'recent_verified_records':len(recent),'errors':errors}
(root/'docs/validation.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
raise SystemExit(bool(errors))
