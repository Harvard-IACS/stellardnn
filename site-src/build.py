"""Render the StellarDNN pages with the standard library."""

import argparse
from dataclasses import dataclass
from hashlib import sha256
from html import escape
import json
import posixpath
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "site-src" / "content"
SITE_URL = "https://www.stellardnn.org/"
MAP_URL = "https://goo.gl/maps/GMKQnV4LsEbwrw2i8"
SCHOLAR_URL = "https://scholar.google.com/citations?user=hlFnwxwAAAAJ&hl=en"
ADS_URL = "https://ui.adsabs.harvard.edu/search/q=(%20author%3A%22protopapas%2C%20p%22%20AND%20year%3A1991-)&sort=date%20desc%2C%20bibcode%20desc&p_=0"


@dataclass(frozen=True)
class Page:
    title: str
    description: str
    active: str = ""
    source: str = ""
    parent: str = ""
    breadcrumb: str = ""


PAGES = {
    "index.html": Page("StellarDNN", "Machine learning for astronomy, physics, and cybersecurity at Harvard SEAS.", "Home"),
    "projects.html": Page("Research", "Research directions and projects at StellarDNN.", "Research"),
    "active_projects.html": Page("Research opportunities", "Explore StellarDNN research projects and opportunities to collaborate.", "Research", parent="projects.html"),
    "publications.html": Page("Publications", "Explore recent and earlier StellarDNN publications and download the bibliography.", "Publications"),
    "people.html": Page("People", "Meet the principal investigator, members, collaborators, and alumni of StellarDNN.", "People"),
    "CV.html": Page("Pavlos Protopapas", "Biography, education, appointments, and teaching of Pavlos Protopapas.", "People", parent="people.html"),
    "people copy.html": Page("Earlier people directory", "Biographical material from the earlier StellarDNN roster.", "People", "people-archive.html", parent="people.html"),
    "courses.html": Page("Education", "Teaching, courses, and educational outreach from StellarDNN.", "Education"),
    "contact_us.html": Page("Contact", "Contact StellarDNN at Harvard’s Science and Engineering Complex."),
    "work_with_us.html": Page("Work with us", "Explore research opportunities and contact the StellarDNN group.", "Research", parent="active_projects.html"),
    "newsroom.html": Page("Lab updates", "Recent publications and research updates from StellarDNN.", "Lab updates"),
    "projects/nneht.html": Page("Event Horizon Telescope imaging", "StellarDNN projects on black hole imaging and Event Horizon Telescope data.", "Research", parent="projects.html"),
    "projects/neurodiff.html": Page("NeuroDiffEq", "Neural network methods for solving differential equations.", "Research", parent="projects.html"),
    "projects/cosmology.html": Page("Cosmology-informed neural networks", "Neural network solvers for cosmic expansion and cosmological inference.", "Research", parent="projects.html", breadcrumb="Cosmology overview"),
    "projects/adsml.html": Page("Astrophysics Data System machine learning", "Language models for astronomy literature and observatory bibliographies.", "Research", parent="projects.html", breadcrumb="ADSML overview"),
    "NeuroDiffHub.html": Page("NeuroDiffHub archive", "Archived StellarDNN project for building and sharing neural-network solutions to differential equations.", "Research", parent="projects/neurodiff.html"),
    "projects/astromer/index.html": Page("ASTROMER", "A pretrained transformer model for astronomical light curves.", "Research", parent="projects.html", breadcrumb="ASTROMER overview"),
    "projects/astromer/about.html": Page("ASTROMER model and weights", "The ASTROMER architecture, pretrained weights, and contribution information.", "Research", parent="projects/astromer/index.html", breadcrumb="Model and weights"),
    "projects/astromer/data.html": Page("ASTROMER datasets", "Datasets and file formats for ASTROMER.", "Research", parent="projects/astromer/index.html", breadcrumb="Datasets"),
    "projects/astromer/team.html": Page("ASTROMER team", "Contributors to the ASTROMER project.", "Research", parent="projects/astromer/index.html", breadcrumb="Team"),
    "projects/astromer/tutorials.html": Page("ASTROMER tutorials", "Installation and introductory notebooks for ASTROMER.", "Research", parent="projects/astromer/index.html", breadcrumb="Tutorials"),
    "assets/OLD/index_sav.html": Page("StellarDNN archive", "Continue to the StellarDNN homepage.", source="archive-home.html"),
    "assets/OLD/projects_OLD.html": Page("Research archive", "Continue to the StellarDNN research index.", "Research", "archive-research.html"),
}

NAVIGATION = (
    ("Home", "/index.html"),
    ("Research", "/projects.html"),
    ("Publications", "/publications.html"),
    ("Lab updates", "/newsroom.html"),
    ("People", "/people.html"),
    ("Education", "/courses.html"),
)


@dataclass(frozen=True)
class SidebarLink:
    label: str
    section_id: str
    short_label: str = ""


SECTION_NAVIGATION = {
    "active_projects.html": (
        SidebarLink("NeuroDiffEq", "NeuroDiffEq"),
        SidebarLink("ASTROMER projects", "Astromer", "ASTROMER"),
        SidebarLink("Event Horizon Telescope", "NNEHT", "Black holes"),
        SidebarLink("Cosmology", "Cosmology"),
        SidebarLink("ADSML", "ADSML"),
        SidebarLink("Other projects", "Other"),
    ),
    "publications.html": (
        SidebarLink("Recent publications", "RecentPublications", "Recent"),
        SidebarLink("Earlier publications", "EarlierPublications", "Earlier"),
        SidebarLink("Research archive", "ResearchArchive", "Archive"),
    ),
    "people.html": (
        SidebarLink("Principal investigator", "Pavlos", "PI"),
        SidebarLink("Members", "Members"),
        SidebarLink("Collaborators", "Collaborators"),
        SidebarLink("Alumni", "Alumni"),
    ),
    "courses.html": (
        SidebarLink("Courses", "Courses"),
        SidebarLink("HarvardX", "HarvardX"),
        SidebarLink("Workshops and summer schools", "Workshops", "Workshops"),
        SidebarLink("Teaching portfolio", "TeachingPortfolio", "Portfolio"),
    ),
    "CV.html": (
        SidebarLink("Biography", "Biography"),
        SidebarLink("Education", "education-heading"),
        SidebarLink("Appointments", "appointments-heading"),
        SidebarLink("Teaching", "teaching-heading"),
        SidebarLink("Selected publication", "publication-heading", "Publication"),
    ),
    "people copy.html": (
        SidebarLink("Members", "archive-members-heading"),
        SidebarLink("Alumni", "archive-alumni-heading"),
    ),
    "contact_us.html": (
        SidebarLink("General inquiries", "GeneralInquiries"),
        SidebarLink("Visit", "map"),
    ),
    "work_with_us.html": (
        SidebarLink("Research opportunities", "openRolesSection"),
    ),
    "newsroom.html": (
        SidebarLink("Recent publications", "RecentLabPublications"),
    ),
    "projects/nneht.html": (
        SidebarLink("Physical parameters", "PhysicalParameters"),
        SidebarLink("Generative networks", "GenerativeNetworks"),
        SidebarLink("Diffusion models", "DiffusionModels"),
        SidebarLink("Visibility data", "VisibilityData"),
    ),
    "projects/neurodiff.html": (
        SidebarLink("Differential equations", "DifferentialEquations"),
        SidebarLink("Related research", "RelatedResearch"),
        SidebarLink("NeuroDiffHub archive", "NeuroDiffHub"),
    ),
    "projects/cosmology.html": (
        SidebarLink("Cosmic expansion", "CosmicExpansion"),
        SidebarLink("Related research", "RelatedResearch"),
    ),
    "projects/adsml.html": (
        SidebarLink("astroBERT", "AstroBERT"),
        SidebarLink("Bibliography curation", "BibliographyCuration"),
    ),
    "NeuroDiffHub.html": (
        SidebarLink("Project history", "HubHistory"),
        SidebarLink("Solver example", "SolverExample"),
    ),
    "projects/astromer/index.html": (
        SidebarLink("Light-curve embeddings", "LightCurveEmbeddings"),
        SidebarLink("Recent ASTROMER research", "RecentASTROMERResearch", "Recent research"),
    ),
    "projects/astromer/about.html": (
        SidebarLink("Model architecture", "ModelArchitecture", "Architecture"),
        SidebarLink("Pretrained weights", "accordionExample", "Weights"),
        SidebarLink("Papers and presentation", "Papers", "Papers"),
    ),
    "projects/astromer/data.html": (
        SidebarLink("Parquet files", "Parquet"),
        SidebarLink("Record files", "Record"),
    ),
    "projects/astromer/tutorials.html": (
        SidebarLink("Install ASTROMER", "Install"),
        SidebarLink("Colab notebooks", "ColabNotebooks"),
    ),
    "projects/astromer/team.html": (
        SidebarLink("Collaborators", "Collaborators"),
        SidebarLink("Partner institutions", "PartnerInstitutions"),
    ),
}

ASTROMER_ACTIONS = (
    ("Overview", "/projects/astromer/index.html"),
    ("Model and weights", "/projects/astromer/about.html"),
    ("Datasets", "/projects/astromer/data.html"),
    ("Tutorials", "/projects/astromer/tutorials.html"),
    ("Team", "/projects/astromer/team.html"),
    ("Documentation", "https://astromer.readthedocs.io/en/main/"),
    ("ASTROMER on GitHub", "https://github.com/astromer-science"),
)

# Fragments use site-root paths. Make them relative for a GitHub Pages project
# subpath and for links from nested project pages.
ROOT_PATH_ATTR = re.compile(r"""(\b(?:href|src)\s*=\s*["'])/(?!/)([^"'<>]*)""", re.IGNORECASE)


def relative_urls(markup, route):
    prefix = posixpath.relpath(".", posixpath.dirname(route) or ".")
    prefix = "" if prefix == "." else prefix + "/"
    return ROOT_PATH_ATTR.sub(lambda match: match[1] + (prefix + match[2] or "./"), markup)


def versioned_asset(path):
    revision = sha256((ROOT / path.lstrip("/")).read_bytes()).hexdigest()[:12]
    return f"{path}?v={revision}"


def nav_links(active, route, *, include_home=True):
    links = []
    for label, url in NAVIGATION:
        if label == "Home" and not include_home:
            continue
        current = "page" if url == "/" + route else "location"
        attributes = f' aria-current="{current}"' if label == active else ""
        item_class = ' class="nav-home"' if label == "Home" else ""
        links.append(f'<li{item_class}><a href="{url}"{attributes}>{label}</a></li>')
    return "\n".join(links)


def header(active, route):
    links = nav_links(active, route)
    mobile_links = nav_links(active, route, include_home=False)
    return f"""
<header class="site-header">
  <div class="site-container masthead">
    <span class="wordmark">
      <span class="wordmark-shield"><img src="/assets/site/seas-shield.png" width="400" height="300" alt=""></span>
      Harvard SEAS
    </span>
    <nav class="primary-nav" aria-label="Main navigation">
      <ul>{links}</ul>
    </nav>
    <details class="mobile-menu" data-mobile-menu>
      <summary>Menu <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
      <nav aria-label="More pages"><ul class="mobile-links">{mobile_links}</ul></nav>
    </details>
    <button type="button" class="theme-toggle" data-mode-toggle aria-label="Dark mode" aria-pressed="false" title="Toggle dark mode" hidden>
      <svg class="theme-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 13a8.7 8.7 0 0 1-10-10 9 9 0 1 0 10 10Z"/></svg>
      <svg class="theme-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>
    </button>
  </div>
</header>""".strip()


def footer():
    return f"""
<footer class="site-container colophon">
  <div>
    <a class="colophon-title" href="/index.html">StellarDNN</a>
    <p class="fine-print">Harvard John A. Paulson School of Engineering and Applied Sciences</p>
    <address><a href="{MAP_URL}">Science and Engineering Complex<br>150 Western Ave, Boston, MA 02134</a></address>
  </div>
  <nav aria-label="People and lab">
    <h2>Lab</h2>
    <ul>
      <li><a href="/people.html#Members">Members</a></li>
      <li><a href="/people.html#Collaborators">Collaborators</a></li>
      <li><a href="/people.html#Alumni">Alumni</a></li>
      <li><a href="/contact_us.html">Contact</a></li>
    </ul>
  </nav>
  <nav aria-label="Research resources">
    <h2>Resources</h2>
    <ul>
      <li><a href="/publications.html">Publications</a></li>
      <li><a href="{escape(SCHOLAR_URL, quote=True)}">Google Scholar</a></li>
      <li><a href="{escape(ADS_URL, quote=True)}">Astrophysics Data System</a></li>
    </ul>
  </nav>
</footer>""".strip()


def with_astromer_actions(fragment, route):
    heading, separator, content = fragment.partition("</header>")
    if not separator:
        raise ValueError(f"ASTROMER actions require a page header in {route}")

    is_overview = route == "projects/astromer/index.html"
    links = ASTROMER_ACTIONS
    if is_overview:
        links += (("Research opportunities", "/active_projects.html#Astromer"),)

    items = []
    for label, href in links:
        style = "button" if is_overview and href == "/projects/astromer/tutorials.html" else "quiet-button"
        current = ' aria-current="page"' if href == "/" + route else ""
        items.append(f'    <a class="{style}" href="{escape(href, quote=True)}"{current}>{escape(label)}</a>')
    actions = "\n".join(items)
    return f"""{heading}  <nav class="page-actions" id="navbarSupportedContent" aria-label="ASTROMER pages and resources">
{actions}
  </nav>
{separator}{content}"""


def with_sidebar(fragment, route, page):
    links = SECTION_NAVIGATION.get(route)
    if not links:
        return fragment

    heading, separator, content = fragment.partition("</header>")
    if not separator or not content.strip():
        raise ValueError(f"A sidebar requires a page header and content in {route}")

    items = []
    for link in links:
        text = escape(link.label)
        attributes = ""
        if link.short_label:
            short = escape(link.short_label)
            accessible_label = escape(f"{link.label} ({link.short_label})", quote=True)
            attributes = f' aria-label="{accessible_label}"'
            text = (
                f'<span class="section-nav-full-label">{text}</span>'
                f'<span class="section-nav-short-label">{short}</span>'
            )
        items.append(f'    <a href="#{escape(link.section_id, quote=True)}"{attributes}>{text}</a>')
    navigation = "\n".join(items)
    label = escape(f"{page.title} sections", quote=True)
    return f"""{heading}{separator}

<div class="section-layout">
  <nav class="section-nav" data-section-nav aria-label="{label}">
{navigation}
  </nav>
  <div class="section-content">
{content.strip()}
  </div>
</div>"""


def breadcrumbs(route):
    trail = [route]
    while PAGES[trail[-1]].parent:
        trail.append(PAGES[trail[-1]].parent)
    if len(trail) == 1:
        return ""

    crumbs = []
    for index, path in enumerate(reversed(trail)):
        page = PAGES[path]
        label = escape(page.breadcrumb or page.title)
        separator = '<span class="breadcrumb-separator" aria-hidden="true">/</span>' if index else ""
        if path == route:
            item = f'<span aria-current="page">{label}</span>'
        else:
            item = f'<a href="/{escape(path, quote=True)}">{label}</a>'
        crumbs.append(f"    <li>{separator}{item}</li>")
    items = "\n".join(crumbs)
    return f"""<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol role="list">
{items}
  </ol>
</nav>"""


def recent_entries(limit, include_citation=False):
    records = json.loads((ROOT / "data" / "recent-publications.json").read_text(encoding="utf-8"))
    entries = []
    for record in records[:limit]:
        title = escape(record["title"])
        link = escape(record["url"], quote=True)
        year = int(record["year"])
        if include_citation:
            authors = escape(", ".join(record["authors"]))
            kind = escape(record["type"])
            entries.append(
                f'<li class="index-row"><h3><a href="{link}">{title}</a></h3>'
                f'<p class="entry-meta">{authors}. {kind}, <time datetime="{year}">{year}</time>.</p></li>'
            )
        else:
            entries.append(f'<li class="index-row"><a href="{link}">{title}</a><time datetime="{year}">{year}</time></li>')
    return "\n".join(entries)


def render(route, page):
    fragment = (CONTENT / (page.source or route)).read_text(encoding="utf-8").strip()
    if route == "index.html":
        fragment = fragment.replace("<!-- latest-publications -->", recent_entries(2))
    if route == "newsroom.html":
        fragment = fragment.replace("<!-- latest-publications -->", recent_entries(5, include_citation=True))
    if route.startswith("projects/astromer/"):
        fragment = with_astromer_actions(fragment, route)
    fragment = with_sidebar(fragment, route, page)
    trail = breadcrumbs(route)
    if trail:
        fragment = f"{trail}\n\n{fragment}"

    title = escape(page.title if route == "index.html" else f"{page.title} | StellarDNN")
    description = escape(page.description, quote=True)
    canonical = SITE_URL + (route.replace(" ", "%20") if route != "index.html" else "")
    stylesheet = versioned_asset("/assets/site/site.css")
    site_script = versioned_asset("/assets/site/site.js")
    home_script = ""
    if route == "index.html":
        animation = versioned_asset("/assets/site/black-hole.js")
        home_script = f'\n  <script type="module" src="{animation}"></script>'
    citation_stamp = '\n  <style>/* Hallmark · copy: verbatim · Retain the published article titles in the research archive. */</style>' if route == "publications.html" else ""
    document = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:type" content="website">
  <link rel="canonical" href="{canonical}">
  <link rel="icon" href="/assets/site/mark.svg" type="image/svg+xml">
  <script src="/assets/site/mode.js"></script>
  <link rel="stylesheet" href="{stylesheet}">{citation_stamp}
  <script type="module" src="{site_script}"></script>{home_script}
</head>
<body>
  <div class="site-stars" aria-hidden="true"></div>
  <a class="button skip-link" href="#content">Skip to content</a>
  {header(page.active, route)}
  <main class="site-container" id="content">
{fragment}
  </main>
  {footer()}
</body>
</html>
"""
    return relative_urls(document, route)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="verify the generated pages without writing")
    parser.add_argument("--route", action="append", choices=PAGES, help="render only the named route")
    options = parser.parse_args()

    routes = options.route or PAGES
    output = {route: render(route, PAGES[route]) for route in routes}
    changed = []
    for route, html in output.items():
        target = ROOT / route
        if target.is_file() and target.read_text(encoding="utf-8") == html:
            continue
        if not options.check:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(html, encoding="utf-8")
        changed.append(route)
    if options.check and changed:
        parser.exit(1, "Regenerate these pages: " + ", ".join(changed) + "\n")
    action = "Checked" if options.check else "Rendered"
    print(f"{action} {len(output)} StellarDNN pages.")


if __name__ == "__main__":
    main()
