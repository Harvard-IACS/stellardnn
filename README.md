# StellarDNN website

Static research-lab website at https://www.stellardnn.org/.

## Source and hosting

- Source: https://github.com/Harvard-IACS/stellardnn
- Production branch: `main`.
- Azure Static Web Apps: `purple-hill-0b0983b10.azurestaticapps.net`.
- `www.stellardnn.org` CNAME points to that Azure hostname (verified 14 November 2026).
- The live homepage was byte-for-byte identical to upstream commit `0c1924c` before this refresh.
- The purple-hill GitHub Actions workflow is active; lively-cliff is disabled. Existing secret values were neither read nor changed.
- Domain account: Squarespace, established from the owner's domain notices. Azure resource subscription ownership was not independently inspected.

## Local preview

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765/ . No JavaScript bundler or server backend is needed. Publication search and mobile navigation use `assets/refresh.js`.

## Updating and checking content

Python 3.9+ and Beautiful Soup are needed only for authoring and validation:

```sh
python3 -m pip install -r scripts/requirements.txt
python3 scripts/refresh.py
python3 scripts/check_site.py
node --check assets/refresh.js
```

`refresh.py` generates the root pages and reviewed research details. It deliberately reads historical material from Git commit `0c1924c`, preserving the original content as an auditable source. Make content changes in the generator or the reviewed JSON inventory, then regenerate. Do not overwrite the upstream snapshot.

- `data/recent-publications.json`: verified selected recent works; source URLs, type and provenance.
- `data/publications-archive.json`: deduplicated earlier citations, available original source links and excluded citations requiring review.
- `data/people-archive.json`: retained names and profile links; current appointments are not inferred.
- `docs/publication-review.md`: evidence, uncertain matches and publication-version corrections.
- `docs/baseline-audit.json`, `docs/refresh-audit.json`, `docs/validation.json`: internal checks.
- `python3 scripts/check_external.py`: bounded live external-link checks; access refusals require interpretation.

The legacy ASTROMER data, pretrained resources and tutorials remain available under `projects/astromer/`. They are distinguished from subsequent research.

## Deployment and rollback

Changes on a pull request targeting `main` are handled by the existing active Azure workflow as a preview. A push or merge to `main` triggers production deployment. Confirm the returned Azure workflow result before treating a release as deployed.

All original files remain in Git at `0c1924c`. The refresh was prepared on `codex/website-refresh-2026` and is published through `main`. For production rollback after a merge, revert the refresh merge commit with `git revert -m 1 <merge-sha>` and push the revert through the same deployment path. For a fast-forward or squash merge, revert its refresh commit without `-m`. This creates a new, reviewable commit and preserves history. Do not reset or force-push production.

People's current status remains an editorial discussion with the owner. The refresh labels the preserved directory as historical rather than guessing appointments. The existing 2024 public CV is clearly labeled as archived; the private current CV and reference details were not uploaded.
