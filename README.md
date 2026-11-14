# StellarDNN website

Source: https://github.com/Harvard-IACS/stellardnn
Production: https://www.stellardnn.org/

The site retains its original Front/Bootstrap templates, images, shared header
and footer, CSS and JavaScript. The owner requested information updates only.

## Editing and validation

`python scripts/update_content.py` restores the original HTML templates from
`0c1924c` and applies the content updates: cybersecurity research, reviewed
2025–2026 publications, the owner-supplied biography and current course links.
`data/pavlos-bio.json` stores the supplied biography; publication records and
provenance are in `data/recent-publications.json` and `docs/publication-review.md`.

Run `python scripts/check_content.py` before publication. Preview with
`python -m http.server 8768 --bind 127.0.0.1`.

## Publication

A push to `main` triggers the active purple-hill Azure Static Web Apps workflow.
The lively-cliff workflow is disabled. Verify deployment and the live site.
No hosting settings or credentials were changed. Use ordinary revert commits
to roll back; do not force-push.

The visual refresh was superseded by the owner's instruction to preserve the
original design. Its assets and generator have been removed.
