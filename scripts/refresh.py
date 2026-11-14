"""Build static pages from reviewed content and the preserved upstream snapshot."""
from pathlib import Path
from bs4 import BeautifulSoup
from html import escape as e
import subprocess,json,re,collections
ROOT=Path(__file__).resolve().parents[1]
BASE='0c1924c'
def old(name):
 return BeautifulSoup(subprocess.check_output(['git','show',f'{BASE}:{name}'],cwd=ROOT,text=True),'html.parser')
NAV=[('projects.html','Research'),('publications.html','Publications'),('people.html','People'),('courses.html','Education'),('contact_us.html','Contact')]
def page(name,title,body,desc=None):
 desc=desc or f'{title} at StellarDNN, the research group led by Pavlos Protopapas working across machine learning, physics, astronomy and cybersecurity.'
 nav=''.join(f'<a href="{url}"'+(' aria-current="page"' if name==url else '')+f'>{label}</a>' for url,label in NAV)
 out=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(title)} | StellarDNN</title><meta name="description" content="{e(desc)}"><link rel="canonical" href="https://www.stellardnn.org/{'' if name=='index.html' else name}"><meta property="og:title" content="{e(title)} | StellarDNN"><meta property="og:description" content="{e(desc)}"><meta property="og:type" content="website"><link rel="icon" href="assets/general/img/mark.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/refresh.css"><script defer src="assets/refresh.js"></script></head><body><a class="skip" href="#content">Skip to content</a><header class="site-header"><a class="brand" href="index.html" aria-label="StellarDNN home"><span class="brand-mark" aria-hidden="true">✳</span>Stellar<span>DNN</span></a><button class="menu-toggle" aria-expanded="false" aria-controls="main-nav">Menu <span aria-hidden="true">☰</span></button><nav id="main-nav" aria-label="Main navigation">{nav}</nav></header><main id="content">{body}</main><footer class="site-footer"><div><a class="brand" href="index.html">StellarDNN</a><p>Machine learning for scientific discovery.</p><p>Research led by Pavlos Protopapas<br>Harvard John A. Paulson School of Engineering and Applied Sciences</p></div><div><h2>Explore</h2>{nav}</div><div><h2>Connect</h2><a href="mailto:pavlos@seas.harvard.edu">pavlos@seas.harvard.edu</a><a href="https://seas.harvard.edu/person/pavlos-protopapas">Harvard profile ↗</a><a href="https://github.com/Harvard-IACS/stellardnn">Website source ↗</a><p>150 Western Avenue<br>Boston, MA 02134</p></div><div class="footer-bottom">StellarDNN · Research, software & education<span>Content reviewed November 2026</span></div></footer></body></html>'''
 (ROOT/name).write_text(BeautifulSoup(out,'html.parser').prettify())
def intro(kicker,title,text):return f'<section class="page-intro wrap"><p class="eyebrow">{kicker}</p><h1>{title}</h1><p class="lede">{text}</p></section>'
def button(url,label,secondary=False):return f'<a class="button'+(' secondary' if secondary else '')+f'" href="{url}">{label} <span aria-hidden="true">↗</span></a>'
projects=[
 ('NeuroDiffEq','01 / Scientific machine learning','Physics in the learning loop','Neural networks that solve differential equations, encode physical structure and quantify uncertainty. Work spans transfer learning, solution families and efficient training.','assets/general/img/home/neurodiffeq_logo.png'),
 ('Astromer','02 / Astronomy & time series','Learning the language of starlight','Transformer representations of astronomical light curves, with work on transfer between surveys, limited-label classification and multiband time series.','assets/general/img/home/astromer_logo.png'),
 ('Cybersecurity','03 / Cybersecurity','Learning the patterns of malicious behavior','Language models and contrastive learning for behavioral malware detection, system-call analysis and security in IoT networks.',''),
 ('ADSML','04 / Scientific information','Making research more discoverable','Language models and retrieval methods for scientific literature, including work with the SAO/NASA Astrophysics Data System.','')]
recent=[]
p=ROOT/'data/recent-publications.json'
if p.exists():
 d=json.loads(p.read_text()); recent=d if isinstance(d,list) else d.get('publications',[])
recent.sort(key=lambda p:(p['year'],p.get('publicationDate') or p.get('date','')),reverse=True)
def pubrow(p):
 title=p['title']; url=p.get('url') or p.get('source_url') or p.get('primary_url');authors=p.get('authors',[])
 if isinstance(authors,list):
  allauthors=', '.join(authors)
  shortauthors=', '.join(authors[:5])+('; et al.' if len(authors)>5 else '')
 else:allauthors=shortauthors=authors
 year=p.get('year',str(p.get('date',''))[:4]);kind=p.get('type',p.get('status','Research paper'));topic=p.get('topic','Other')
 authorhtml=f'<p>{e(shortauthors)}</p>'
 if allauthors!=shortauthors:authorhtml+=f'<details class="author-list"><summary>Full author list</summary><p>{e(allauthors)}</p></details>'
 venue=p.get('venue','');metadata=f'<p class="pub-venue">{e(venue)}</p>' if venue else ''
 if p.get('firstOnlineDate'):metadata+=f'<p class="pub-note">First online: {e(p["firstOnlineDate"])} · Bibliographic year: {year}</p>'
 versions=[]
 arxiv=p.get('arxiv');doi=p.get('doi')
 if arxiv and arxiv!=url:versions.append(f'<a href="{e(arxiv)}">Preprint ↗</a>')
 if doi:
  du=doi if doi.startswith('https://') else 'https://doi.org/'+doi
  if du!=url:versions.append(f'<a href="{e(du)}">DOI ↗</a>')
 versionhtml=' '.join(versions)
 return f'<article class="publication" data-year="{year}" data-topic="{e(topic)}" data-type="{e(kind)}"><div class="pub-year">{e(str(year))}<span>{e(str(kind))}</span><span class="pub-topic">{e(topic)}</span></div><div><h3><a href="{e(url or "https://arxiv.org/search/?searchtype=author&query=Protopapas%2C+P")}">{e(title)} <span aria-hidden="true">↗</span></a></h3>{authorhtml}{metadata}<div class="version-links">{versionhtml}</div></div></article>'
# Machine-readable reviewed inventory and a portable bibliographic export.
historical=[]
if (ROOT/'data/historical-verified.json').exists():
 d=json.loads((ROOT/'data/historical-verified.json').read_text())
 historical=d if isinstance(d,list) else d.get('publications',[])
reviewed=recent+historical
(ROOT/'data/publication-inventory.json').write_text(json.dumps(reviewed,ensure_ascii=False,indent=2)+'\n')
stats={str(year):{'records':sum(p['year']==year for p in reviewed),'papers':sum(p['year']==year and p.get('type','').lower()!='book' for p in reviewed),'types':dict(collections.Counter(p.get('type','Unknown') for p in reviewed if p['year']==year))} for year in sorted({p['year'] for p in reviewed},reverse=True)}
(ROOT/'data/publication-counts.json').write_text(json.dumps(stats,indent=2)+'\n')
bib=[]
for p in reviewed:
 kind='book' if p.get('type','').lower()=='book' else 'article'
 clean=lambda v:str(v).replace('{','').replace('}','')
 fields={'title':p['title'],'author':' and '.join(p.get('authors',[])),'year':p['year'],'url':p['url']}
 if p.get('doi'):fields['doi']=p['doi']
 if p.get('venue'):fields['note']=p['venue']
 bib.append('@'+kind+'{stellar'+re.sub(r'[^a-zA-Z0-9]','',p['id'])+',\n'+',\n'.join('  '+k+' = {'+clean(v)+'}' for k,v in fields.items())+'\n}')
(ROOT/'publications.bib').write_text('\n\n'.join(bib)+'\n')
# The diagram is an original abstract illustration, not a scientific result.
visual='''<div class="hero-art" role="img" aria-label="Abstract illustration connecting observations, neural networks and physical models"><svg viewBox="0 0 600 560" aria-hidden="true"><defs><radialGradient id="halo"><stop stop-color="#3caca5" stop-opacity=".25"/><stop offset="1" stop-color="#3caca5" stop-opacity="0"/></radialGradient><pattern id="grid" width="35" height="35" patternUnits="userSpaceOnUse"><path d="M35 0H0V35" fill="none" stroke="#35505e" stroke-width=".6"/></pattern></defs><rect width="600" height="560" fill="url(#grid)"/><circle cx="300" cy="280" r="245" fill="url(#halo)"/><g stroke="#617e88" fill="none"><ellipse cx="300" cy="280" rx="205" ry="105" transform="rotate(-30 300 280)"/><ellipse cx="300" cy="280" rx="205" ry="105" transform="rotate(30 300 280)"/><circle cx="300" cy="280" r="150" stroke-dasharray="3 9"/></g><g fill="none" stroke="#70c8c1" stroke-width="1.3">'''+''.join(f'<path d="M{100+i*14} 370 Q{200+i*5} {70+i*13} {490-i*12} 190" opacity=".6"/>' for i in range(19))+'''</g><g fill="#e7b188"><circle cx="130" cy="216" r="6"/><circle cx="430" cy="351" r="6"/><circle cx="300" cy="131" r="5"/><circle cx="221" cy="374" r="5"/></g><circle cx="300" cy="280" r="35" fill="#0d2634" stroke="#a7ddd4"/><path d="M278 280h44m-22-22v44" stroke="#e7b188"/><g font-family="monospace" font-size="11" letter-spacing="2" fill="#acc4cb"><text x="30" y="47">OBSERVATION → REPRESENTATION</text><text x="315" y="515">STRUCTURE → DISCOVERY</text></g></svg><span class="art-caption">Astronomy × Physics × Cybersecurity</span></div>'''
home='''<section class="hero"><div class="hero-inner"><div><p class="eyebrow">StellarDNN / Harvard SEAS</p><h1>Learning from data.<br><em>Across disciplines.</em></h1><p class="hero-lede">We develop machine learning methods across astronomy, physics and cybersecurity—from scientific time series and neural differential equations to behavioral malware detection.</p><div class="actions">'''+button('projects.html','Explore our research')+button('publications.html','Read our publications',True)+'''</div><p class="hero-note">The research group of <a href="people.html#Pavlos">Pavlos Protopapas ↗</a></p></div>'''+visual+'''</div></section><section class="statement wrap"><p class="eyebrow">Our approach</p><h2>At the intersection of<br>computation and discovery.</h2><p>We bring machine learning and statistics into astronomy, physics and cybersecurity. Our work connects new methods with domain knowledge, reusable software and practical education.</p></section><section class="wrap section"><div class="section-heading"><div><p class="eyebrow">Research directions</p><h2>Methods built around science.</h2></div><a class="text-link" href="projects.html">All research ↗</a></div><div class="research-grid">'''+''.join(f'<a class="research-card" href="projects.html#{id}"><span class="eyebrow">{k}</span><h3>{t}</h3><p>{d}</p><span class="card-end">Explore this direction <span>↗</span></span></a>' for id,k,t,d,img in projects)+'''</div></section><section class="publications-section"><div class="wrap section"><div class="section-heading"><div><p class="eyebrow">Selected recent work</p><h2>New questions. New results.</h2></div><a class="text-link" href="publications.html">Publication inventory ↗</a></div>'''+(''.join(pubrow(x) for x in recent[:4]) if recent else '<p>Explore our <a href="publications.html">publications and research archive</a>.</p>')+'''</div></section><section class="wrap join section"><div><p class="eyebrow">Research & education</p><h2>Ideas become stronger<br>when they are shared.</h2></div><div><p>Explore our teaching materials, open software and research directions. For collaboration or student research enquiries, contact Pavlos directly.</p><div class="actions">'''+button('courses.html','Explore education')+button('contact_us.html','Get in touch',True)+'''</div></div></section>'''
page('index.html','Machine learning for scientific discovery',home)
# Research: preserve established directions, distinguish descriptions from vacancies.
b= intro('Research','Scientific questions.<br>Computational methods.','Our research connects learning algorithms with physical structure, astronomical observations, cybersecurity and scientific information. Explore the directions and software below.')
b+='<div class="wrap anchor-nav">'+''.join(f'<a href="#{i}">{i}</a>' for i in ['NeuroDiffEq','Astromer','NNEHT','Cybersecurity','RCTorch','Cosmology','ADSML'])+'</div>'
research=[('NeuroDiffEq','Physics-informed neural networks','We study neural approaches to differential equations, including transfer learning, uncertainty quantification and learned representations of solution families. NeuroDiffEq provides an open-source Python foundation for this work.','https://github.com/NeuroDiffGym/neurodiffeq','NeuroDiffEq software'),('NeuroDiffHUB','Sharing neural solutions','NeuroDiffHub was developed as a platform for storing and sharing neural solutions of differential equations. The original project description is retained in the research archive.','projects/neurodiff.html','NeuroDiffEq research'),('Astromer','Representations for astronomical time series','ASTROMER learns embeddings of astronomical light curves using transformer models. Subsequent work explores adaptation across surveys, few-shot classification and multivariate light curves.','projects/astromer/index.html','ASTROMER resources'),('NNEHT','Neural methods for black-hole observations','Research explores computer vision and deep learning for characterizing black-hole images and estimating physical parameters from Event Horizon Telescope observations.','projects/nneht.html','Project archive'),('RCTorch','Reservoir computing','RcTorch is a PyTorch reservoir-computing package with automated hyperparameter optimization. Related work explores unsupervised reservoir methods for ordinary differential equations.','https://github.com/blindedjoy/RcTorch','RcTorch software'),('Cosmology','Learning cosmological dynamics','Neural solutions of the equations governing cosmological models support parameter inference. Related research investigates gravitational duals and physically informed representations.','publications.html','Related publications'),('Cybersecurity','Machine learning for cybersecurity','Collaborative work with John Carter, Spiros Mancoridis and colleagues investigates behavioral malware detection using system-call representations, BERT-based models and contrastive learning. Studies examine security in routers and IoT networks, including sysBERT, contrastBERT and calBERT.','publications.html?topic=Cybersecurity','Cybersecurity publications'),('ADSML','Machine learning for scientific literature','Work with the SAO/NASA Astrophysics Data System applies language models and retrieval methods to scientific text, including named entities, concept discovery and local citation recommendation.','publications.html','Related publications'),('Other','Other research directions','The group’s research archive also includes quantum eigenvalue problems, galaxy-image representations, scientific time series and other applications of machine learning.','publications.html#archive','Browse the research record')]
for idx,(id,t,d,url,label) in enumerate(research):
 if url.startswith('projects/') and not (ROOT/url).exists():url='publications.html'
 details=''
 if id=='Cybersecurity':
  details='<h3>Selected research</h3><ul>'+''.join(f'<li><a href="{e(p["url"])}">{e(p["title"])}</a> <span>({p["year"]})</span></li>' for p in recent if p.get('topic')=='Cybersecurity' and p.get('doi'))+'</ul>'
 b+=f'<section id="{id}" class="wrap research-detail"><span class="eyebrow">{idx+1:02d} / {id}</span><div><h2>{t}</h2><p>{d}</p>{details}{button(url,label,True)}</div></section>'
b+='<section class="wrap callout"><h2>Interested in a research project?</h2><p>Our project descriptions outline research ideas and prior work. Contact us to discuss current availability, supervision and fit.</p>'+button('active_projects.html','Research ideas')+'</section>'
page('projects.html','Research',b)
# Historical project proposals remain useful, without unsupported claims of active recruitment.
s=old('active_projects.html');main=s.find('main')
for x in main.select('script,style'):x.decompose()
# retain paragraphs, headings and references while dropping legacy layout and images
proposal=[]
for x in main.find_all(['h2','h3','h4','p','ul','ol']):
 if x.find_parent(['ul','ol']):continue
 if x.name=='p' and ('On this page' in x.get_text()):continue
 if x.name=='h2' and x.get_text(strip=True)=='Project descriptions':continue
 proposal.append(str(x))
b=intro('Research opportunities','Start with a question.','These project ideas come from the lab’s research archive. They describe directions for discussion; availability and scope should be confirmed with Pavlos.')+'<div class="wrap prose archive-content">'+''.join(proposal)+'</div><section class="wrap callout">'+button('mailto:pavlos@seas.harvard.edu','Discuss a research idea')+'</section>'
page('active_projects.html','Research ideas',b)
# People: retain names and useful links, avoid asserting that old student appointments remain current.
s=old('people.html');people=[]
for card in s.select('.card'):
 h=card.find(['h3','h4']);img=card.find('img')
 if not h:continue
 name=h.get_text(' ',strip=True)
 if 'Wanna' in name or name=='Researcher':continue
 links=[]
 for a in card.select('a[href]'):
  u=a['href'].strip()
  if u.startswith('https://') and not any(x in u for x in ['arya-mohan.com','memoir.icrea','sathvik-b-15b54b136','chris-gumb-28856875']):links.append(u)
 people.append({'name':name,'image':img.get('src') if img else '', 'links':list(dict.fromkeys(links))})
(ROOT/'data/people-archive.json').write_text(json.dumps(people,indent=2))
b=intro('People','A shared curiosity.','A research community spanning machine learning, physics, astronomy and scientific computing.')+'''<section id="Pavlos" class="wrap pi"><img src="assets/general/img/team/pavlos_protopapas_0.jpeg" alt="Pavlos Protopapas"><div><p class="eyebrow">Principal investigator</p><h2>Pavlos Protopapas</h2><p class="lede">Scientific Program Director and Lecturer<br>Harvard SEAS</p><p>Pavlos works across machine learning, statistics, astronomy, physics and cybersecurity. His educational work spans data science, machine learning operations and scientific computing.</p><div class="actions">'''+button('https://seas.harvard.edu/person/pavlos-protopapas','Harvard profile')+button('CV.html','Profile & CV',True)+'''</div></div></section><section id="Members" class="wrap section"><span id="Collaborators"></span><span id="Alumni"></span><div class="section-heading"><div><p class="eyebrow">Research community archive</p><h2>People behind the work.</h2></div></div><p class="notice">These profiles preserve the lab’s earlier member, collaborator and alumni directory. They do not establish current appointments or student status.</p><div class="people-grid">'''
for p in people:
 img=p['image'];img=img if img and (ROOT/img).exists() else 'assets/general/img/team/generalperson.png'
 b+=f'<article class="person"><img loading="lazy" src="{img}" alt=""><h3>{e(p["name"])}</h3>'+(f'<a href="{e(p["links"][0])}">Research profile ↗</a>' if p['links'] else '')+'</article>'
b+='</div></section>'
page('people.html','People',b)
# Education content is historical teaching context, with enduring course links.
b=intro('Education','From understanding<br>to implementation.','Teaching connects mathematical foundations, hands-on data science and the engineering of useful machine learning systems.')+'<section class="wrap section"><div class="section-heading"><h2>Courses & learning resources</h2></div><div class="research-grid">'
courses=[('CS109A','Introduction to Data Science','Data collection, exploratory analysis, statistical learning and clear communication of results.','https://harvard-iacs.github.io/CS109/'),('CS109B','Advanced Topics in Data Science','Advanced statistical modeling, deep learning, generative models and Bayesian methods.','https://harvard-iacs.github.io/CS109/'),('AC215','Productionizing AI','Practical machine learning operations: data pipelines, containers, cloud infrastructure and deployment of AI applications.','https://github.com/Harvard-IACS/2026-AC215'),('PINNS','Physics-Informed Neural Networks','Differential equations, neural solvers, optimization, error characterization and transfer learning. Materials from the January 2024 course.','https://harvard-iacs.github.io/PINNS_course/'),('HarvardX','Introduction to Data Science with Python','Regression, classification, model evaluation and the Python data science ecosystem.','https://www.edx.org/learn/data-science/harvard-university-introduction-to-data-science-with-python'),('MLAI','Machine Learning and AI with Python','Decision trees, ensemble methods and practical prediction with machine learning.','https://www.edx.org/learn/machine-learning/harvard-university-machine-learning-and-ai-with-python')]
for id,t,d,u in courses:b+=f'<article id="{id}" class="research-card"><p class="eyebrow">{id}</p><h3>{t}</h3><p>{d}</p><a href="{u}" class="text-link">Course resources ↗</a></article>'
b+='</div><p class="notice">These resources document teaching activities. Consult each provider for current offerings and registration.</p></section><section class="wrap research-detail"><p class="eyebrow">Beyond the classroom</p><div><h2>Learning across communities.</h2><p>Teaching activities have included the La Serena School for Data Science, workshops for industry and the Rwanda Data Science School. The archived portfolio documents these activities and the educational approach behind them.</p><div class="actions">'+button('courses.html','Teaching activities',True)+button('assets/general/JA/TeachingPhilosophy.pdf','Teaching philosophy',True)+'</div></div></section>'
page('courses.html','Education',b)
b=intro('Contact','Let’s discuss<br>the next question.','For research collaborations, student projects or questions about the group, contact Pavlos Protopapas directly.')+'<section class="wrap contact-grid"><article><p class="eyebrow">Email</p><h2>Pavlos Protopapas</h2><a class="contact-email" href="mailto:pavlos@seas.harvard.edu">pavlos@seas.harvard.edu ↗</a><p>For student research, include your background, interests and the research direction you would like to explore.</p></article><article><p class="eyebrow">Location</p><h2>Science and Engineering Complex</h2><p>Harvard John A. Paulson School of Engineering and Applied Sciences<br>150 Western Avenue<br>Boston, MA 02134</p><a class="text-link" href="https://seas.harvard.edu/person/pavlos-protopapas">Harvard contact directory ↗</a></article></section>'
page('contact_us.html','Contact',b)
b=intro('Pavlos Protopapas','Research. Teaching.<br>Scientific computing.','Scientific Program Director and Lecturer at Harvard SEAS. Research across machine learning, statistics, astronomy, physics and cybersecurity.')+'<section class="wrap contact-grid"><article><h2>Academic profile</h2><p>The Harvard directory provides the institutional appointment and contact information. The archived CV is dated and should be read as a historical document.</p><div class="actions">'+button('https://seas.harvard.edu/person/pavlos-protopapas','Harvard profile')+button('assets/general/JA/CV_Protopapas.pdf','Archived CV (2024)',True)+'</div></article><article><h2>Research & education</h2><p>Explore the reviewed publication inventory, research directions and teaching portfolio.</p><div class="actions">'+button('publications.html','Publications',True)+button('courses.html','Teaching',True)+'</div></article></section>'
page('CV.html','Pavlos Protopapas',b)
def archiveyear(text):
 return (re.findall(r'(?:19|20)\d{2}',text) or ['Unknown'])[-1]
# Deduplicate older citations and flag records whose visible author list omits Protopapas.
s=old('publications.html');seen=set();archive=[];archive_links=[];excluded=[]
for li in (s.find('main') or s).find_all('li'):
 text=' '.join(li.get_text(' ',strip=True).replace('\u200b','').split())
 if len(text)<70:continue
 titlematch=re.search(r'"([^"]+)"',text)
 em=li.find('em')
 title=titlematch.group(1) if titlematch else (em.get_text(' ',strip=True) if em else text)
 norm=re.sub(r'[^a-z0-9]','',title.lower())
 for alias in ['streamingclassificationofvariablestars','robustperiodestimationusingmutualinformationformultibandlightcurvesinthesynopticsurveyera','efficientoptimizationofechostatenetworksfortimeseriesdatasets']:
  if alias in norm:norm=alias
 if 'hamiltonianneuralnetworksforsolving' in norm:norm='hamiltonianneuralnetworks200111107'
 text=text.replace('21014','2014').replace('2105','2015').replace('2103','2013')
 if 'Mishra, B.P.' in text:
  excluded.append(text);continue
 if norm in seen:
  for idx,existing in enumerate(archive):
   exnorm=re.sub(r'[^a-z0-9]','',existing.lower())
   if norm in exnorm:
    for a in li.select('a[href]'):
     u=a['href']
     if (u.startswith('http') or (ROOT/u).is_file()) and u not in archive_links[idx]:archive_links[idx].append(u)
    break
  continue
 seen.add(norm)
 if 'protopapas' not in text.lower():excluded.append(text);continue
 links=[]
 for a in li.select('a[href]'):
  u=a['href']
  if u.startswith('http') or (ROOT/u).is_file():links.append(u)
 archive.append(re.sub(r'\[\s*(pdf|html)\s*\]','',text).strip())
 archive_links.append(list(dict.fromkeys(links)))
(ROOT/'data/publications-archive.json').write_text(json.dumps({'citations':archive,'source_links':archive_links,'excluded_author_not_visible':excluded},indent=2))
b=intro('Publications','A research record<br>that keeps growing.','An expanding inventory across astronomy, physics, cybersecurity and scientific machine learning. Verified records link to their sources; preprints, published papers and books are distinguished.')+'<section class="wrap section"><div class="publication-controls"><label for="pub-search">Search publications</label><input id="pub-search" type="search" placeholder="Search title, author or year" aria-describedby="pub-count"><div class="filter-grid"><div><label for="pub-year">Year</label><select id="pub-year"><option value="">All years</option></select></div><div><label for="pub-topic">Research area</label><select id="pub-topic"><option value="">All research areas</option></select></div><div><label for="pub-type">Publication type</label><select id="pub-type"><option value="">All types</option></select></div></div><button class="filter-reset" type="button">Clear filters</button><p id="pub-count" role="status" aria-live="polite"></p></div><div id="pub-list">'
b+='<div class="actions">'+button('publications.bib','Download BibTeX',True)+button('data/publication-inventory.json','Reviewed records (JSON)',True)+'</div><h2>Recent research · 2025–2026</h2>'+''.join(pubrow(x) for x in recent)
if historical:b+='<section class="section"><p class="eyebrow">Verified earlier work</p><h2>Research through 2024</h2>'+''.join(pubrow(x) for x in historical)+'</section>'
b+='<section id="archive" class="section"><p class="eyebrow">Historical record</p><h2>Publication archive</h2><p class="notice">Preserved citations from the earlier website. Older metadata has not been individually reverified; use the linked author indexes to confirm the version of record.</p><ol class="archive-list">'+''.join(f'<li class="publication archive-entry" data-year="{archiveyear(x)}" data-topic="Historical archive" data-type="Historical citation">{e(x)} '+''.join(f'<a href="{e(u)}" class="text-link">Source ↗</a> ' for u in links)+'</li>' for x,links in zip(archive,archive_links))+'</ol></section></div><p id="no-results" hidden>No matching publications. Try another title, author or year.</p></section><section class="wrap callout"><h2>Explore the author indexes</h2><p>Publication databases differ in coverage. This inventory is not a claim of a complete publication count.</p><div class="actions">'+button('https://orcid.org/0000-0002-8178-8463','ORCID',True)+button('https://scholar.google.com/citations?user=hlFnwxwAAAAJ&hl=en','Google Scholar',True)+button('https://ui.adsabs.harvard.edu/search/q=author%3A%22Protopapas%2C%20Pavlos%22&sort=date%20desc','NASA ADS',True)+'</div></section>'
page('publications.html','Publications',b)
# Replace unrelated template pages and duplicate directory with useful destinations.
for name,title,target,description in [('work_with_us.html','Work with us','active_projects.html','Explore research ideas and contact us to discuss current availability.'),('newsroom.html','Research updates','publications.html','The publication inventory is the source for recent research updates.'),('people copy.html','People directory','people.html','The people directory brings together the lab’s research community.'),('NeuroDiffHub.html','NeuroDiffHub','projects.html#NeuroDiffHUB','Explore the NeuroDiffHub research direction and archived project materials.')]:
 page(name,title,intro('StellarDNN',title,description)+'<section class="wrap section">'+button(target,'Continue')+'</section>')
print(f'Generated root pages; preserved {len(people)} people and {len(archive)} historical citations; {len(recent)} recent records.')
# Retained research detail URLs share the refreshed shell and safe relative links.
def nested(name,title,body):
 page(name,title,body)
 p=ROOT/name;s=BeautifulSoup(p.read_text(),'html.parser')
 for el in s.find_all(['a','link','script','img']):
  attr='href' if el.name in ['a','link'] else 'src';u=el.get(attr)
  if u and not re.match(r'^(https?:|mailto:|#|/)',u):el[attr]='../'+u
 p.write_text(str(s))
nested('projects/neurodiff.html','NeuroDiffEq',intro('Scientific machine learning','Neural solutions.<br>Physical structure.','NeuroDiffEq is an open-source Python package for solving differential equations with neural networks.')+'<section class="wrap research-detail"><p class="eyebrow">Research & software</p><div><h2>From individual solutions to solution families.</h2><p>Related research explores transfer learning, residual-based error bounds, uncertainty quantification and physics-informed representations. The publication inventory provides primary references for recent work.</p><div class="actions">'+button('https://github.com/NeuroDiffGym/neurodiffeq','Open-source library')+button('publications.html','Recent publications',True)+'</div></div></section>')
s=old('projects/nneht.html');cards=[]
for c in s.select('.image-description-container'):
 title=c.select_one('.proj-title');desc=c.select_one('.description');img=c.find('img')
 if not title or not desc:continue
 paragraphs=desc.find_all('p');texts=[x.get_text(' ',strip=True) for x in paragraphs]
 text=' '.join(x for x in texts[1:] if len(x)>100)
 text=re.sub(r'Paper\s*Code.*$','',text).strip()
 links=[a['href'] for a in c.select('a[href]') if a['href'].startswith('https://') and 'stellardnn.org' not in a['href'] and 'arya-mohan.com' not in a['href']]
 cards.append((title.get_text(' ',strip=True),text,links))
b=intro('Computational astrophysics','Neural methods for<br>black-hole observations.','Archived project descriptions from the lab’s work on Event Horizon Telescope observations and simulations. These summaries describe research directions; see the publications for results.')
for title,text,links in cards:
 if 'Parameterization' in title:text='This project explores neural models trained on general relativistic magnetohydrodynamic simulations to estimate physical parameters of M87*. Methods investigated include multi-task learning, attention mechanisms and super-resolution.'
 b+='<section class="wrap research-detail"><p class="eyebrow">EHT / Research archive</p><div><h2>'+e(title)+'</h2><p>'+e(text)+'</p>'+''.join(button(u,'Research source',True) for u in dict.fromkeys(links))+'</div></section>'
b+='<section class="wrap callout">'+button('publications.html','Related publications')+'</section>'
nested('projects/nneht.html','Black-hole imaging research',b)
# ASTROMER has its own useful documentation/data site. Preserve all downloads,
# tutorials and project identity; repair template faults and add current context.
for path in (ROOT/'projects/astromer').glob('*.html'):
 raw=subprocess.check_output(['git','show',f'{BASE}:projects/astromer/{path.name}'],cwd=ROOT,text=True)
 raw=raw.replace('</sc\n','</script>\n').replace('</sc>','</script>')
 s=BeautifulSoup(raw,'html.parser')
 titles={'index.html':'ASTROMER research & resources','about.html':'About ASTROMER & legacy weights','data.html':'ASTROMER datasets','tutorials.html':'ASTROMER tutorials','team.html':'ASTROMER collaborator archive'}
 s.title.string=titles[path.name]+' | StellarDNN'
 style=s.new_tag('link',href='static/css/refresh.css',rel='stylesheet');s.head.append(style)
 back=s.new_tag('a',href='../../projects.html#Astromer');back['class']='stellar-return';back.string='← StellarDNN / Research';s.body.insert(0,back)
 nav=s.select_one('.navbar-nav')
 if nav and not any(a.get_text(strip=True)=='Data' for a in nav.find_all('a')):
  li=s.new_tag('li');li['class']='nav-item';a=s.new_tag('a',href='data.html');a['class']='nav-link';a.string='Data';li.append(a);nav.append(li)
 for a in s.find_all('a'):
  if a.get_text(strip=True)=='Our Team':a['href']='team.html'
 for img in s.find_all('img'):
  alt=img.get('alt','')
  if alt in ['', '...']:
   src=img.get('src','');img['alt']='ASTROMER' if 'logo' in src.lower() or 'ASTROMER' in src else ''
 for el in s.find_all(string=True):
  if 'Best performance up-to-date' in el:el.replace_with(str(el).replace('Best performance up-to-date','Legacy trained weights'))
 notice=s.new_tag('section');notice['class']='research-update'
 if path.name=='team.html':notice.append(BeautifulSoup('<h1>ASTROMER collaborator archive</h1><p>This page preserves the project’s earlier collaborator profiles. It does not establish current appointments.</p>','html.parser'))
 elif path.name=='index.html':notice.append(BeautifulSoup('<h1>ASTROMER</h1><p>Transformer representations for astronomical light curves.</p><p>These resources include the original model, datasets and tutorials. For Astromer 2, contrastive learning and recent light-curve research, <a href="../../publications.html">explore the updated publication inventory ↗</a>.</p>','html.parser'))
 else:notice.append(BeautifulSoup('<p>These pages preserve the original ASTROMER resources. See <a href="../../publications.html">recent publications</a> for subsequent research, including Astromer 2.</p>','html.parser'))
 header=s.find('header');header.insert_after(notice) if header else s.body.insert(1,notice)
 # Existing pages may have an h1 inside a legacy image banner; keep one primary title.
 h1s=s.find_all('h1')
 for h in h1s[1:]:h.name='h2'
 path.write_text(str(s))

# Keep generated HTML free of whitespace inherited from archived source snippets.
for generated in list(ROOT.glob('*.html'))+list((ROOT/'projects').rglob('*.html')):
 text=generated.read_text()
 generated.write_text('\n'.join(line.rstrip() for line in text.splitlines())+'\n')
