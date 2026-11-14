"""Check content updates while requiring the original site's styling and scripts."""
from pathlib import Path
from bs4 import BeautifulSoup
import subprocess,json
root=Path(__file__).resolve().parents[1]
base='0c1924c'
updated={'index.html','people.html','CV.html','projects.html','publications.html','courses.html'}
original=subprocess.check_output(['git','ls-tree','-r','--name-only',base],cwd=root,text=True).splitlines()
checked=0
for name in original:
 if name.endswith(('.css','.js')) or name.endswith('.html'):
  before=subprocess.check_output(['git','show',f'{base}:{name}'],cwd=root)
  after=(root/name).read_bytes()
  if name not in updated:assert before==after,f'Original design asset changed: {name}'
  else:
   b=BeautifulSoup(before,'html.parser');a=BeautifulSoup(after,'html.parser')
   for selector,attribute in [('link[rel="stylesheet"]','href'),('script[src]','src')]:
    assert [x.get(attribute) for x in b.select(selector)]==[x.get(attribute) for x in a.select(selector)],f'Styling/scripts changed: {name}'
   for component in ['header-component','footer-component']:
    assert len(b.select(component))==len(a.select(component)),f'Original components changed: {name}'
  checked+=1
for name in ['people.html','CV.html']:
 text=BeautifulSoup((root/name).read_text(),'html.parser').get_text(' ',strip=True)
 for expected in ['600,000','since 2009','CS1090A/B','World Scientific, 2026']:assert expected in text,(name,expected)
research=BeautifulSoup((root/'projects.html').read_text(),'html.parser').find(id='Cybersecurity')
assert research and len(research.select('a[href^="https://doi.org/"]'))==3
pubs=BeautifulSoup((root/'publications.html').read_text(),'html.parser')
assert pubs.find(id='RecentPublications')
assert len(pubs.find(id='RecentPublications').find_next('ul').find_all('li',recursive=False))==27
assert 'assets/refresh.css' not in (root/'index.html').read_text()
print(json.dumps({'original_templates_and_assets_checked':checked,'updated_pages':len(updated),'recent_publications':27,'cybersecurity_paper_links':3,'errors':[]},indent=2))
