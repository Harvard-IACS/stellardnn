# Website refresh review — 14 November 2026

## Source evidence

The local saved project was initially empty apart from Git metadata. The actual site source was found in Harvard-IACS/stellardnn and cloned into `source/`, retaining its complete Git history. Before editing, live index.html and the repository file had the same SHA-256: `9a2d67b57feaeaea695b3a33372c7f18a6697f97f7d22faffca2cda1ccce0c1c`.

Public DNS resolves www.stellardnn.org to purple-hill-0b0983b10.azurestaticapps.net. The matching Azure workflow is active; the other Azure workflow is disabled. GitHub reports ADMIN permission for the authenticated owner. Squarespace domain notices establish the domain account, but Azure subscription ownership was not inspected. No DNS or credential changes were made.

## Implemented

- Responsive visual system: navy, warm white, teal and restrained copper; original abstract scientific SVG, clear hierarchy and shared navigation.
- Rewritten home, research, education, contact and profile pages; no unsupported numerical impact claims.
- 24 verified selected recent works: 18 papers and one book for 2026; five works for 2025. Nine of the 2026 papers are preprints. This is not an exhaustive bibliography.
- Searchable publication inventory with explicit document types; deduplicated historical citations and preserved available PDF links. Seven original citations lacking visible Protopapas authorship remain in review data rather than being asserted as his publications.
- Earlier people directory preserved as historical, pending discussion with the owner. Placeholder descriptions and obviously copied profile links removed. No inferred current appointments.
- Contact form with no working delivery route and incorrect California map replaced with direct email and institutional contact information.
- Unrelated Front template jobs/news replaced by concise useful routes. Existing URLs continue to resolve.
- Unfinished NeuroDiff page replaced by a software/research overview. EHT descriptions preserved as an archive; placeholder paper links removed.
- ASTROMER datasets, tutorials and model resources preserved; malformed script tag and navigation corrected, latest-research context added, old weight-performance claim relabeled.
- Old public CV explicitly dated as an archive. The current private CV was used only for research discovery; it and its reference list were not published.

## Validation

`python3 scripts/check_site.py`: 19 authored pages, 454 internal references, no errors. Headings, image alternatives, file targets and internal fragments checked. Verified inventory IDs are unique. JavaScript passes `node --check`.

Browser QA: desktop homepage visually inspected in Chrome. Navigation loads the publication page. Searching `Black Hole Love` shows exactly one matching record. Mobile layout has responsive CSS but was not separately browser-tested. External link checks are recorded separately; robots restrictions and publisher refusals do not establish a broken link.

## Remaining editorial decisions

Current people roster, current student/collaborator status and any recruitment availability must be discussed with the owner. Older bibliography metadata is visibly labeled historical and has not all been reverified. Initial-only and incomplete new publication matches are documented in publication-review.md rather than silently included.

## Rollback

Original upstream commit: `0c1924c`. Refresh branch: `codex/website-refresh-2026`. Retain the upstream snapshot; use an ordinary revert commit to roll back a published merge. See README.md for merge/squash distinctions.

## Publication follow-up

The owner authorized production publication and requested cybersecurity research. Added primary-source links for calBERT, contrastBERT and sysBERT, plus their verified publication records; corrected the router-security preprint topic to Cybersecurity. The recent inventory now has 27 verified records. Site validation checks 19 pages and 457 internal references with no errors; JavaScript syntax and whitespace checks pass. Browser verification confirmed the research section and seven-record Cybersecurity filter.
