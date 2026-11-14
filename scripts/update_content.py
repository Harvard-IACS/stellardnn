from pathlib import Path
import subprocess,json,re
from html import escape
root=Path(__file__).resolve().parents[1]
base='0c1924c'
# Restore every original HTML template; retain existing theme assets and components.
paths=subprocess.check_output(['git','diff','--name-only',base,'HEAD','--','*.html'],cwd=root,text=True).splitlines()
for name in paths:(root/name).write_bytes(subprocess.check_output(['git','show',f'{base}:{name}'],cwd=root))
bio=json.loads((root/'data/pavlos-bio.json').read_text())
bio_html=''.join('<p>'+escape(p).replace('Productionizing Large Language Models','<em>Productionizing Large Language Models</em>').replace('Solving Differential Equations and Inverse Problems with AI','<em>Solving Differential Equations and Inverse Problems with AI</em>')+'</p>' for p in bio['paragraphs'])
recent=json.loads((root/'data/recent-publications.json').read_text());recent.sort(key=lambda p:(p['year'],p.get('date','')),reverse=True)
cyber=[p for p in recent if p.get('topic')=='Cybersecurity' and p.get('doi')]
p=root/'people.html';s=p.read_text();pattern=r'(<blockquote class="h3 font-weight-normal text-lh-lg">).*?(</blockquote>)';s,n=re.subn(pattern,lambda m:m[1]+bio_html+'<p><a href="CV.html">Profile and CV</a> · <a href="https://seas.harvard.edu/person/pavlos-protopapas">Harvard profile</a></p>'+m[2],s,count=1,flags=re.S);assert n==1;p.write_text(s)
p=root/'CV.html';s=p.read_text();needle='<!-- Education -->';assert needle in s;s=s.replace(needle,'<section class="mb-5" id="Biography"><h2 class="border-bottom pb-2">BIOGRAPHY</h2>'+bio_html+'</section>\n'+needle,1).replace('<em>CS109A</em>, Introduction to Data Science','<em>CS1090A/B</em>, Harvard’s core data science sequence').replace('2016-2024','2016–2026');p.write_text(s)
p=root/'index.html';s=p.read_text();needle='<!-- Content -->';assert needle in s;s=s.replace(needle,'<div class="w-lg-80 text-center mx-lg-auto mb-5"><p class="lead">Our research also develops language models and contrastive learning methods for <a href="projects.html#Cybersecurity">cybersecurity</a>, including behavioral malware detection and security for routers and IoT networks.</p></div>\n'+needle,1).replace('machine learning applications in astronomy and physics.','machine learning applications in astronomy, physics and cybersecurity.')
start=s.index('<h2>Latest Publications</h2>')
end=s.index('</div>',start)
latest='<h2>Latest Publications</h2>'+''.join('<p><b><a href="'+escape(item['url'],quote=True)+'">'+escape(item['title'])+'</a></b><br>'+escape(', '.join(item['authors']))+' ('+str(item['year'])+'). '+escape(item.get('type',''))+'.</p>' for item in recent[:5])+'<p><a href="publications.html#RecentPublications">All recent publications</a></p>'
s=s[:start]+latest+s[end:]
p.write_text(s)
p=root/'projects.html';s=p.read_text();needle='<article class="card mb-3 mb-sm-5 " id="Other">';assert needle in s
card='''<article class="card mb-3 mb-sm-5" id="Cybersecurity"><div class="card-body"><a class="d-block small font-weight-bold text-cap mb-2" href="#Cybersecurity">Cybersecurity</a><h2 class="h3">Machine Learning for Cybersecurity</h2><p>Collaborative work with John Carter, Spiros Mancoridis and colleagues investigates behavioral malware detection using system-call representations, BERT-based models and contrastive learning. Studies examine security in routers and IoT networks.</p><ul>'''+''.join('<li><a href="'+escape(p['url'],quote=True)+'">'+escape(p['title'])+'</a> ('+str(p['year'])+')</li>' for p in cyber)+'''</ul><p><a href="publications.html#RecentPublications">Recent publications</a></p></div></article>\n'''
s=s.replace(needle,card+needle,1);p.write_text(s)
p=root/'publications.html';s=p.read_text();needle='<ul class="list-pointer list-pointer-sm list-pointer-primary">';assert needle in s
listing='<h2 class="h3" id="RecentPublications">Recent Publications · 2025–2026</h2><ul class="list-pointer list-pointer-sm list-pointer-primary">'+''.join('<li>'+escape(', '.join(p['authors']))+'. <a href="'+escape(p['url'],quote=True)+'">'+escape(p['title'])+'</a>. '+escape(p.get('venue',''))+' ('+str(p['year'])+'). '+escape(p.get('type',''))+'.</li>' for p in recent)+'</ul><p><a href="publications.bib">Download reviewed bibliography (BibTeX)</a></p><h2 class="h3">Earlier Publications</h2>\n'
s=s.replace(needle,listing+needle,1);p.write_text(s)
p=root/'courses.html';s=p.read_text().replace('https://harvard-iacs.github.io/CS109/','https://cs109.org/').replace('https://harvard-iacs.github.io/2024-AC215/','https://harvard-iacs.github.io/AC215-new-site/')
needle='<h2 class="display-5">Courses</h2>';assert needle in s
s=s.replace(needle,needle+'<p>Harvard now lists CS109A/B as CS1090A/B. <a href="https://cs109.org/">Current course information</a>.</p>',1)
# Add the third HarvardX course using the original page typography and container.
needle='<!-- End Hero Section -->';assert needle in s
s=s.replace(needle,needle+'<div class="container mb-5"><div class="w-lg-80 mx-lg-auto"><h3 class="h4">HarvardX Online Courses</h3><ul><li><a href="https://pll.harvard.edu/course/introduction-data-science-python">Introduction to Data Science with Python</a></li><li><a href="https://pll.harvard.edu/course/machine-learning-and-ai-python">Machine Learning and AI with Python</a></li><li><a href="https://pll.harvard.edu/course/introduction-neural-networks-and-deep-learning-python">Introduction to Neural Networks and Deep Learning with Python</a></li></ul></div></div>',1);p.write_text(s)
print('Restored original HTML design; updated six pages with content only.')
