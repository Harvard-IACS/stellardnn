# StellarDNN website

Production is served at [stellardnn.org](https://www.stellardnn.org/). This branch contains the static research-journal redesign. [Design notes](design.md)

## Edit and build

- Edit the page bodies in `site-src/content/` and the shared templates in `site-src/build.py`.
- The homepage and Lab updates use `data/recent-publications.json`. The full catalogue and BibTeX are in `site-src/content/publications.html` and `publications.bib`.
- Edit the shared styles and browser code in `assets/site/`.

```sh
python3 -I -B site-src/build.py
python3 -I -B site-src/build.py --check
python3 -I -B -m http.server 8768 --bind 127.0.0.1
```

Open [the local preview](http://127.0.0.1:8768/) from the branch checkout. The generated HTML is checked in so a static host can serve it directly. Build the pages again after editing their sources and include the regenerated HTML in the change.

The original site and maintenance utilities are retained in repository history. The redesigned pages load the browser code in `assets/site/`.

## Hosting

The output uses relative URLs for a domain root or a project subpath. A GitHub Pages preview can serve this branch from its root when enabled. The existing Azure Static Web Apps workflow targets `main`.
