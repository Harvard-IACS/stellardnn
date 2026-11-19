# StellarDNN design

## System

The editorial research-journal direction uses the approved StellarDNN homepage concept. The homepage pairs a large serif masthead and a short lab introduction with a ruled publication index. Research detail pages can lead with a real figure and a caption.

- The light surface is a cool gray. Dark mode uses near-black with cool charcoal layers. Oxblood carries actions and interactive emphasis.
- Use `--font-display` for headings and `--font-body` for navigation, captions, metadata, and copy. Use the mono face for code.
- Use the shared Hallmark scale from [tokens.css](assets/site/tokens.css). Display titles are fluid. Body text starts at 16 pixels.
- Cap the site at 100rem. The masthead and publication spread grow at desktop sizes, and long-form text uses a 68ch reading measure.
- Use a single rule below the page introduction and above the colophon. Separate sections with whitespace and use thin rules between visible entries in publication lists.
- Keep the old route names, anchors, attribution, and verified research material. Limit new visitor-facing copy to the navigation or an action that the new interface needs.

## Page structure

Templates supply a shared masthead and colophon. A page fragment starts with `<header class="page-heading">`, an `h1`, and an optional `p.lede`. The homepage has its own masthead.

- The top-left branding pairs the engineering shield with the short Harvard SEAS label. Home stays visible in the masthead at every width. The shield artwork comes from [Harvard’s official school shield gallery](https://www.harvard.edu/about/history/shields/).
- Keep the masthead order the same at all sizes. The order is Home, Research, Publications, Lab updates, People, and Education. Show the current page as underlined text and keep its parent tab linked on detail pages.
- Put the Research opportunities directory under Research. From the Research grid, link project names to their overviews. Give each project overview with opportunities the same “Research opportunities” action.
- Use `.section` between major sections and `.section-head` when a heading shares a row with an action.
- Use `.prose` or `.measure` for long continuous reading, `.columns` for two related columns, and `.media-split` for text and a large figure.
- Use `.index-list` and `.index-row` for repeated entries and `.entry-meta` for secondary information.
- Use `.index-grid` for two-column research, roster, and course lists at 76rem and above. Each roster entry has a portrait or initials, a name, a title, a biography, and a row for verified profile links.
- Use semantic `figure`, `figcaption`, `details`, `table`, and `time` elements where they describe the material.
- In source fragments, internal routes begin with `/`. The renderer writes relative paths so the same output works at a domain root or a project subpath.

## Navigation order

1. Put breadcrumbs above detail page titles. Link each ancestor and show the current page as plain text.
2. Put sibling pages below the title and introduction in `.project-nav`. Keep their order across every page in the group and mark the current page with the crimson underline. ASTROMER uses Overview, Model and weights, Datasets, Tutorials, then Team.
3. Put on-site actions in `.page-actions` after the project navigation. Put the primary action first, followed by related pages or named local downloads. A cross-page link can include the target section in its URL.
4. Put off-site resources after on-site actions. Use outlined buttons for heading actions and mark off-site resources, course sites, profiles, and directions with `rel="external"`. The renderer adds the outward arrow and the screen reader description. Use the current browser tab by default. Keep bibliographic citations as text links with the content they support.
5. Put `.section-nav` with the page content. It uses same-page fragments in reading order and scrolls to the selected section. The crimson highlight follows the section in view. The sidebar sits on the left at desktop sizes and across the top on narrower screens. The Research overview uses the full width for its project grid.

## Motion

Motion uses Hallmark's 120, 220, and 420 millisecond durations and shared easing. Navigation and state changes use short transitions. Focus appears instantly. Reduced-motion mode shows each final state immediately.

The same starfield sits behind every page and fades at the edges of the viewport. Stars keep their positions during scrolling and their pulse timing across page changes. The black hole uses transparent line art with moving highlights that follow the disk and the lensing arcs. The highlights use stronger ink on the light surface. Visitors can pause the black hole, and both animations start still with reduced motion enabled. Published figures remain part of the research record in their original form.

## Source

The shared design tokens live in `assets/site/tokens.css`. Editable page bodies live in `site-src/content/`. Set heading actions and project navigation in `site-src/build.py`, which generates the published static HTML.
