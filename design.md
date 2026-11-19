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
- Put Lab updates in the main navigation. Use breadcrumbs above detail headings to show their parent pages. Link project names to their overviews and label links to research opportunities by purpose.
- Use `.section` between major sections and `.section-head` when a heading shares a row with an action.
- Use `.prose` or `.measure` for long continuous reading, `.columns` for two related columns, and `.media-split` for text and a large figure.
- Use `.index-list` and `.index-row` for repeated entries and `.entry-meta` for secondary information.
- Use `.index-grid` for two-column research, roster, and course lists at 76rem and above. Each roster entry has a portrait or initials, a name, a title, a biography, and a row for verified profile links.
- Use the shared sidebar for links to sections on the same page. It sits on the left at desktop sizes and across the top of the content on narrower screens. The crimson highlight follows the section in view. The Research overview gives its project grid the full content width.
- Put page-level links to related pages and resources in the heading below the title and introduction. Use `.page-actions` to group them, `.button` for the primary action, and `.quiet-button` for secondary actions. Keep references and other links with their content.
- Use semantic `figure`, `figcaption`, `details`, `table`, and `time` elements where they describe the material.
- In source fragments, internal routes begin with `/`. The renderer writes relative paths so the same output works at a domain root or a project subpath.

## Motion

Motion uses Hallmark's 120, 220, and 420 millisecond durations and shared easing. Navigation and state changes use short transitions. Focus appears instantly. Reduced-motion mode shows each final state immediately.

The same starfield sits behind every page and fades at the edges of the viewport. Stars keep their positions during scrolling and their pulse timing across page changes. The black hole uses transparent line art with moving highlights that follow the disk and the lensing arcs. The highlights use stronger ink on the light surface. Visitors can pause the black hole, and both animations start still with reduced motion enabled. Published figures remain part of the research record in their original form.

## Source

The shared design tokens live in `assets/site/tokens.css`. Editable page bodies live in `site-src/content/`. The renderer generates the published static HTML from those sources.
