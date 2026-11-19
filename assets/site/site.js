const root = document.documentElement;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const systemTheme = matchMedia("(prefers-color-scheme: dark)");

function setupTheme() {
  const button = document.querySelector("[data-mode-toggle]");
  if (!button) return;

  let selected = root.dataset.mode;
  let currentTransition;
  let fallbackTimer;

  const effectiveMode = () => selected || (systemTheme.matches ? "dark" : "light");
  const updateControl = () => {
    const dark = effectiveMode() === "dark";
    button.setAttribute("aria-pressed", String(dark));
    button.title = dark ? "Switch to light mode" : "Switch to dark mode";
  };

  button.hidden = false;
  updateControl();
  systemTheme.addEventListener("change", updateControl);

  button.addEventListener("click", () => {
    selected = effectiveMode() === "dark" ? "light" : "dark";
    const mode = selected;
    const apply = () => {
      root.dataset.mode = mode;
      updateControl();
    };
    try {
      localStorage.setItem("stellardnn-mode", mode);
    } catch {
      // Mode can still change for this page.
    }

    if (reducedMotion.matches) {
      apply();
      return;
    }

    if (typeof document.startViewTransition === "function") {
      root.dataset.transition = "theme";
      const transition = document.startViewTransition(apply);
      currentTransition = transition;
      const clear = () => {
        if (currentTransition === transition) {
          delete root.dataset.transition;
          currentTransition = null;
        }
      };
      transition.finished.then(clear, clear);
      return;
    }

    root.dataset.transition = "fallback";
    apply();
    clearTimeout(fallbackTimer);
    fallbackTimer = setTimeout(() => delete root.dataset.transition, 250);
  });
}

function setupNavigation() {
  const menu = document.querySelector("[data-mobile-menu]");
  if (menu) {
    document.addEventListener("click", (event) => {
      if (menu.open && !menu.contains(event.target)) menu.open = false;
    });
    menu.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.open) {
        menu.open = false;
        menu.querySelector("summary").focus();
      }
    });
  }

  // The stylesheet provides native cross-document transitions when available.
  if ("onpageswap" in window && "CSSViewTransitionRule" in window) return;

  root.dataset.navigation = "fade";
  window.addEventListener("pageshow", () => { root.dataset.navigation = "fade"; });
  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented || reducedMotion.matches || event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
      root.dataset.navigation === "leaving"
    ) return;

    const anchor = event.target instanceof Element && event.target.closest("a[href]");
    if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;

    const url = new URL(anchor.href);
    const samePage = url.pathname === location.pathname && url.search === location.search;
    if (url.origin !== location.origin || samePage || !/\/(?:[^/]*\.html)?$/.test(url.pathname)) return;

    event.preventDefault();
    root.dataset.navigation = "leaving";
    setTimeout(() => location.assign(url.href), 120);
  });
}

function setupSectionNav() {
  const nav = document.querySelector(".section-nav");
  if (!nav) return;

  function positionHighlight(link, scrollBehavior = "auto") {
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = link;
    nav.style.setProperty("--indicator-x", `${offsetLeft}px`);
    nav.style.setProperty("--indicator-y", `${offsetTop}px`);
    nav.style.setProperty("--indicator-width", offsetWidth);
    nav.style.setProperty("--indicator-height", offsetHeight);

    const left = Math.min(offsetLeft, Math.max(nav.scrollLeft, offsetLeft + offsetWidth - nav.clientWidth));
    const top = Math.min(offsetTop, Math.max(nav.scrollTop, offsetTop + offsetHeight - nav.clientHeight));
    if (left !== nav.scrollLeft || top !== nav.scrollTop) {
      nav.scrollTo({ left, top, behavior: reducedMotion.matches ? "auto" : scrollBehavior });
    }
  }

  const currentPage = nav.querySelector('[aria-current="page"]');
  if (currentPage) {
    positionHighlight(currentPage);
    window.addEventListener("resize", () => positionHighlight(currentPage));
    return;
  }
  if (!nav.hasAttribute("data-section-nav")) return;

  const entries = [...nav.querySelectorAll('a[href^="#"]')].map((link) => ({
    link,
    section: document.getElementById(link.getAttribute("href").slice(1)),
  })).filter(({ section }) => section);
  if (!entries.length) return;

  let active;
  let available;
  let frame;

  function setActive(entry, scrollBehavior = "auto") {
    if (active !== entry) {
      active?.link.removeAttribute("aria-current");
      active = entry;
      active?.link.setAttribute("aria-current", "location");
    }

    if (!entry) {
      delete nav.dataset.active;
      return;
    }
    positionHighlight(entry.link, scrollBehavior);
    nav.dataset.active = entry.section.id;
  }

  function linkedSection() {
    const target = document.getElementById(location.hash.slice(1));
    if (target) return available.find(({ section }) => section.contains(target));
  }

  function sectionInView() {
    const linked = linkedSection();
    const atEnd = window.scrollY + window.innerHeight >= root.scrollHeight - 2;
    if (atEnd) {
      const top = linked?.section.getBoundingClientRect().top;
      if (top >= 0 && top < window.innerHeight) return linked;
      if (window.scrollY > 0) return available.at(-1);
    }

    const readingLine = Math.min(160, window.innerHeight * 0.25);
    let current = available[0];
    let currentTop = -Infinity;
    for (const entry of available) {
      const top = entry.section.getBoundingClientRect().top;
      if (top > readingLine) continue;
      // Two projects can start on the same row in the wide Research grid.
      if (top > currentTop || (top === currentTop && entry === linked)) {
        current = entry;
        currentTop = top;
      }
    }
    return current;
  }

  function refresh() {
    available = entries.filter(({ link, section }) => {
      link.hidden = Boolean(section.closest("[hidden]"));
      return !link.hidden;
    });
    nav.hidden = !available.length;
    setActive(sectionInView());
  }

  function scheduleUpdate() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = undefined;
      const entry = sectionInView();
      if (entry !== active) setActive(entry, "smooth");
    });
  }

  refresh();
  const linked = linkedSection();
  if (linked) setActive(linked);
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("hashchange", scheduleUpdate);
  window.addEventListener("pageshow", scheduleUpdate);
  window.addEventListener("resize", () => setActive(sectionInView()));
  return refresh;
}

function searchText(value) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase();
}

function setupPublicationSearch(refreshSectionNav) {
  const form = document.querySelector("[data-publication-search]");
  if (!form) return;

  const input = form.querySelector('input[type="search"]');
  const status = form.querySelector("[data-publication-status]");
  const sections = [...document.querySelectorAll("[data-publication-section]")].map((section) => ({
    section,
    entries: [...section.querySelectorAll("[data-publication-entry]")].map((item) => ({
      item,
      text: searchText(item.textContent.replace(/\s+/g, " ")),
    })),
  }));

  if (!input || !status || !sections.length) return;

  let filterFrame;
  function filter() {
    const tokens = searchText(input.value.trim()).split(/\s+/).filter(Boolean);
    let count = 0;
    for (const { section, entries } of sections) {
      let matching = 0;
      let changed = false;
      const firstResults = [];
      for (const { item, text } of entries) {
        const matches = tokens.every((token) => text.includes(token));
        const shouldHide = !matches;
        changed ||= item.hidden !== shouldHide;
        item.hidden = shouldHide;
        matching += Number(matches);
        if (matches && firstResults.length < 3) firstResults.push(item);
      }
      section.hidden = matching === 0;
      count += matching;
      if (changed && !reducedMotion.matches) {
        for (const item of firstResults) {
          item.animate?.(
            [{ opacity: 0.7, transform: "translateY(4px)" }, { opacity: 1, transform: "translateY(0)" }],
            { duration: 220, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
          );
        }
      }
    }
    status.textContent = tokens.length
      ? `${count} matching ${count === 1 ? "entry" : "entries"}`
      : "";
    refreshSectionNav?.();
  }

  form.hidden = false;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    filter();
  });
  input.addEventListener("input", () => {
    cancelAnimationFrame(filterFrame);
    filterFrame = requestAnimationFrame(filter);
  });
}

setupTheme();
setupNavigation();
setupPublicationSearch(setupSectionNav());
