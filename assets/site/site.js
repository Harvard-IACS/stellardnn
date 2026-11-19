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

function searchText(value) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase();
}

function setupPublicationSearch() {
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
setupPublicationSearch();
