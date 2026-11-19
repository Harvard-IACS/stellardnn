// Set an explicit preference before the stylesheet is evaluated.
try {
  const mode = localStorage.getItem("stellardnn-mode");
  if (mode === "light" || mode === "dark") document.documentElement.dataset.mode = mode;
} catch {
  // The stylesheet follows the system preference when storage is unavailable.
}
