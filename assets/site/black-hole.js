const TURN = 2 * Math.PI;
const FRAME_INTERVAL = 1000 / 30;
const DISK_TILT = -0.105;

const contourCount = 16;
const contours = Array.from({ length: contourCount }, (_, index) => {
  const fraction = index / (contourCount - 1);
  return { radius: 1.19 + 2.65 * fraction ** 1.31, fraction };
});

const highlights = [
  { contour: 1, phase: 4.23, length: 0.77 },
  { contour: 3, phase: 0.31, length: 0.56 },
  { contour: 4, phase: 2.56, length: 0.39 },
  { contour: 7, phase: 5.85, length: 0.69 },
  { contour: 9, phase: 1.69, length: 0.49 },
  { contour: 12, phase: 3.25, length: 0.36 },
  { contour: 15, phase: 5.08, length: 0.55 },
];

function orbitPoint(radius, angle) {
  const across = Math.cos(angle);
  const along = Math.sin(angle);
  const ripple = 0.017 * Math.sin(2 * angle + radius * 0.8) + 0.008 * Math.cos(3 * angle - 1);
  const x = (radius + ripple) * across;
  const y = (radius + ripple) * 0.24 * along;
  const distance = Math.hypot(x, y);

  // Map the projected orbit through a radial lens. Weaken the bend on the
  // foreground half so its filaments can cross in front of the shadow.
  const lens = 0.99 - 0.84 * Math.max(0, along) ** 2;
  const imageRadius = 0.5 * (distance + Math.hypot(distance, 2 * lens));
  const magnification = imageRadius / distance;
  return [x * magnification * (1 + across * 0.04), y * magnification];
}

function strokeOrbit(context, radius, from, to, segments) {
  context.beginPath();
  context.moveTo(...orbitPoint(radius, from));
  for (let step = 1; step <= segments; step++) {
    const angle = from + (to - from) * step / segments;
    context.lineTo(...orbitPoint(radius, angle));
  }
  context.stroke();
}

function readPalette(exhibit) {
  const style = getComputedStyle(exhibit);
  return {
    ink: style.getPropertyValue("--color-ink").trim(),
    accent: style.getPropertyValue("--color-accent").trim(),
  };
}

function makeLineArt(canvas) {
  const context = canvas.getContext("2d", { alpha: true });
  const contourCanvas = document.createElement("canvas");
  const linework = contourCanvas.getContext("2d", { alpha: true });
  if (!context || !linework) return null;

  let unit;
  let strokeUnit;
  let palette;

  function orient(drawing) {
    drawing.translate(canvas.width * 0.5, canvas.height * 0.54);
    drawing.rotate(DISK_TILT);
    drawing.scale(unit, unit);
    drawing.lineCap = "round";
    drawing.lineJoin = "round";
  }

  function drawContours(pixelRatio, colors) {
    palette = colors;
    contourCanvas.width = canvas.width;
    contourCanvas.height = canvas.height;
    unit = Math.min(canvas.width / 8.9, canvas.height / 3.65);
    strokeUnit = pixelRatio / unit;

    linework.save();
    orient(linework);

    // A faint lower counterimage and a sharper upper rim frame the empty center.
    for (let index = 3; index >= 0; index--) {
      const spread = index * 0.052;
      linework.globalAlpha = 0.67 - index * 0.15;
      linework.lineWidth = (index === 0 ? 1.02 : 0.72) * strokeUnit;
      linework.strokeStyle = index === 0 ? palette.accent : palette.ink;
      linework.beginPath();
      linework.ellipse(0.01, 0.027 + spread * 0.22, 0.986 + spread, 0.974 + spread,
        0, 0.17 + spread, Math.PI - 0.17 - spread);
      linework.stroke();
    }

    linework.globalAlpha = 0.93;
    linework.lineWidth = 1.35 * strokeUnit;
    linework.strokeStyle = palette.accent;
    linework.beginPath();
    linework.ellipse(0, 0, 1.004, 1.005, 0, Math.PI - 0.09, TURN + 0.085);
    linework.stroke();

    const ink = linework.createLinearGradient(-4.42, 0, 4.48, 0);
    ink.addColorStop(0, "transparent");
    ink.addColorStop(0.13, palette.ink);
    ink.addColorStop(0.39, palette.ink);
    ink.addColorStop(0.59, palette.accent);
    ink.addColorStop(0.86, palette.accent);
    ink.addColorStop(1, "transparent");
    linework.strokeStyle = ink;

    const compact = canvas.width / pixelRatio < 440;
    for (const [index, { radius, fraction }] of contours.entries()) {
      if (compact && index % 3 === 2) continue;
      const primary = index % 4 === 0;
      linework.globalAlpha = (0.75 - fraction * 0.33) * (primary ? 1 : 0.82);
      linework.lineWidth = (primary ? 1.05 : 0.76) * strokeUnit;
      strokeOrbit(linework, radius, 0, TURN, 144);
    }
    linework.restore();
  }

  function paint(elapsed) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(contourCanvas, 0, 0);
    context.save();
    orient(context);
    for (const { contour, phase, length } of highlights) {
      const { radius, fraction } = contours[contour];
      const end = phase + elapsed * (0.82 / radius ** 0.95);
      const start = end - length;
      const beam = context.createLinearGradient(...orbitPoint(radius, start), ...orbitPoint(radius, end));
      beam.addColorStop(0, "transparent");
      beam.addColorStop(0.53, palette.accent);
      beam.addColorStop(0.74, palette.accent);
      beam.addColorStop(1, "transparent");
      context.strokeStyle = beam;
      context.lineWidth = (1.55 - fraction * 0.48) * strokeUnit;
      context.globalAlpha = 0.87 - fraction * 0.32;
      strokeOrbit(context, radius, start, end, 18);
    }
    context.restore();
  }

  return { drawContours, paint };
}

function setupExhibit(exhibit) {
  const canvas = exhibit.querySelector("[data-black-hole]");
  const toggle = exhibit.querySelector("[data-black-hole-toggle]");
  const fallback = exhibit.querySelector("[data-black-hole-fallback]");
  const container = canvas.parentElement;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const systemTheme = matchMedia("(prefers-color-scheme: dark)");
  const art = makeLineArt(canvas);
  if (!art) return;

  let ratio = 1;
  let visible = false;
  let paused = false;
  let elapsed = 0;
  let lastFrame = 0;
  let frame = 0;

  function repaint() {
    art.drawContours(ratio, readPalette(exhibit));
    art.paint(elapsed);
  }

  function updateSize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    const nextRatio = Math.min(Math.max(devicePixelRatio || 1, 1.5), 2, 1440 / width);
    const pixelWidth = Math.ceil(width * nextRatio);
    const pixelHeight = Math.ceil(height * nextRatio);
    if (!canvas.hidden && ratio === nextRatio && canvas.width === pixelWidth && canvas.height === pixelHeight) return;
    ratio = nextRatio;
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    repaint();
    canvas.hidden = false;
    fallback.hidden = true;
  }

  function shouldPlay() {
    return visible && !paused && !reducedMotion.matches && !document.hidden;
  }

  function drawFrame(now) {
    frame = 0;
    if (!shouldPlay()) return;

    if (!lastFrame || now - lastFrame >= FRAME_INTERVAL - 0.7) {
      if (lastFrame) elapsed += Math.min((now - lastFrame) / 1000, 0.12);
      lastFrame = now;
      art.paint(elapsed);
    }
    frame = requestAnimationFrame(drawFrame);
  }

  function syncPlayback() {
    toggle.hidden = reducedMotion.matches;
    toggle.textContent = paused ? "Play animation" : "Pause animation";
    if (shouldPlay()) {
      if (!frame) frame = requestAnimationFrame(drawFrame);
    } else {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      frame = 0;
    }
  }

  toggle.addEventListener("click", () => {
    paused = !paused;
    syncPlayback();
  });
  reducedMotion.addEventListener("change", syncPlayback);
  systemTheme.addEventListener("change", repaint);
  document.addEventListener("visibilitychange", syncPlayback);
  new MutationObserver(repaint).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-mode"],
  });
  new ResizeObserver(updateSize).observe(container);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPlayback();
  }).observe(container);
  updateSize();
  syncPlayback();
}

const exhibit = document.querySelector(".black-hole-exhibit");
if (exhibit) setupExhibit(exhibit);
