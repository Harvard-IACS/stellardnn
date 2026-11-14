"""Bounded public-link availability check; access refusals remain review items."""
from pathlib import Path
from bs4 import BeautifulSoup
import concurrent.futures,subprocess,json
root=Path(__file__).resolve().parents[1]
pages=list(root.glob('*.html'))+list((root/'projects').rglob('*.html'))
urls=set()
for p in pages:
 for a in BeautifulSoup(p.read_text(),'html.parser').find_all('a',href=True):
  u=a['href']
  if u.startswith(('http://','https://')):urls.add(u)
def check(u):
 r=subprocess.run(['curl','-sS','-L','-o','/dev/null','-w','%{http_code}','--max-time','12',u],capture_output=True,text=True)
 return {'url':u,'status':r.stdout,'result':'reachable' if r.stdout.startswith(('2','3')) else 'manual_review','detail':r.stderr[:180]}
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:results=list(pool.map(check,sorted(urls)))
(root/'docs/external-link-check.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps({'checked':len(results),'reachable':sum(x['result']=='reachable' for x in results),'review':[x for x in results if x['result']!='reachable']},indent=2))
