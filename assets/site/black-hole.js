const VERTEX = `#version 300 es
void main() {
  vec2 vertex = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(vertex * 2.0 - 1.0, 0.0, 1.0);
}
`;

const FRAGMENT = `#version 300 es
precision highp float;

uniform vec2 resolution;
uniform float time;
out vec4 outputColor;

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

float noise(vec2 p) {
  vec2 cell = floor(p);
  vec2 f = fract(p);
  vec2 s = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(cell), hash(cell + vec2(1.0, 0.0)), s.x),
    mix(hash(cell + vec2(0.0, 1.0)), hash(cell + 1.0), s.x),
    s.y
  );
}

float turbulence(vec2 p) {
  return 0.53 * noise(p) + 0.27 * noise(p * 2.09 + 9.3)
    + 0.14 * noise(p * 4.18 + 4.7) + 0.06 * noise(p * 8.51);
}

vec3 diskEmission(vec3 hit, vec3 ray, float radius) {
  // Gas at smaller radii completes a turn faster. The winding texture
  // follows the rotation, with a bright inner rim and cooler outer filaments.
  float logRadius = log(radius);
  float angle = atan(hit.z, hit.x) - 1.28 * time / pow(radius, 1.5);
  vec2 coil = vec2(cos(angle + 2.8 * logRadius), sin(angle + 2.8 * logRadius));
  vec2 flow = vec2(radius * 3.8 + 6.2 * coil.x, 6.7 * coil.y);
  float grain = turbulence(flow);
  float strand = 0.5 + 0.5 * sin(46.0 * logRadius + 4.0 * coil.x + 2.1 * grain);
  float detail = (0.22 + 1.12 * grain * grain) * (0.48 + 0.90 * strand);
  float edge = smoothstep(2.96, 3.35, radius) * (1.0 - smoothstep(11.0, 16.0, radius));
  float rimDistance = (radius - 3.62) / 0.58;
  float rim = exp(-rimDistance * rimDistance);
  float emissivity = edge * (0.44 + 0.40 * rim) * exp(-(radius - 3.4) * 0.26);

  // Doppler and gravitational shifts brighten and redden different regions.
  vec3 tangent = normalize(vec3(-hit.z, 0.0, hit.x));
  float speed = sqrt(0.5 / max(radius - 1.0, 1.0));
  float shift = sqrt((1.0 - speed * speed) * (1.0 - 1.0 / radius))
    / (1.0 - speed * dot(tangent, -normalize(ray)));
  float heat = clamp(0.92 - (radius - 3.0) * 0.105 + 0.48 * (shift - 0.9), 0.0, 1.0);
  vec3 amber = mix(vec3(1.0, 0.075, 0.007), vec3(1.0, 0.81, 0.51), pow(heat, 1.5));
  return 4.6 * emissivity * detail * pow(shift, 2.7) * amber;
}

// In horizon-radius units, the Cartesian null geodesic acceleration is
// -3 L² r_vec / (2 r^5). Integrate with velocity Verlet and smaller
// steps near the hole so bent rays can intersect the disk more than once.
vec3 acceleration(vec3 position, float radius, float momentumSquared) {
  float inverseRadius = 1.0 / max(radius, 0.75);
  float inverseSquare = inverseRadius * inverseRadius;
  return (-1.5 * momentumSquared * inverseSquare * inverseSquare * inverseRadius) * position;
}

void main() {
  vec2 screen = (gl_FragCoord.xy - resolution * 0.5) / resolution.y;
  vec3 origin = vec3(0.0, 4.15, 18.6);
  vec3 forward = -normalize(origin);
  vec3 side = vec3(1.0, 0.0, 0.0);
  vec3 up = normalize(cross(side, forward));
  vec3 ray = normalize(forward + 0.61 * (side * screen.x + up * screen.y));
  vec3 position = origin;
  vec3 momentum = cross(position, ray);
  float momentumSquared = dot(momentum, momentum);
  float radius = length(position);
  float closest = radius;
  vec3 gravity = acceleration(position, radius, momentumSquared);
  vec3 light = vec3(0.0);
  float transmission = 1.0;
  bool captured = false;

  for (int step = 0; step < 128; step++) {
    float delta = clamp(radius * 0.092, 0.075, 1.8);
    vec3 next = position + ray * delta + gravity * (0.5 * delta * delta);
    float nextRadius = length(next);
    closest = min(closest, nextRadius);
    if (nextRadius < 1.025) {
      captured = true;
      break;
    }

    if ((position.y > 0.0) != (next.y > 0.0)) {
      vec3 hit = mix(position, next, position.y / (position.y - next.y));
      float diskRadius = length(hit.xz);
      if (diskRadius > 2.96 && diskRadius < 16.0) {
        light += transmission * diskEmission(hit, ray, diskRadius);
        transmission *= mix(0.38, 0.86, smoothstep(3.2, 13.0, diskRadius));
      }
    }

    if (nextRadius > 24.0 && dot(next, ray) > 0.0) break;
    vec3 nextGravity = acceleration(next, nextRadius, momentumSquared);
    ray += 0.5 * (gravity + nextGravity) * delta;
    gravity = nextGravity;
    position = next;
    radius = nextRadius;
  }

  // The thin photon orbit can scatter a little light from the disk.
  float orbitDistance = (closest - 1.51) / 0.097;
  float orbit = exp(-orbitDistance * orbitDistance);
  float haze = exp(-3.8 * dot(screen * vec2(0.83, 1.48), screen * vec2(0.83, 1.48)));
  vec3 background = vec3(0.0018, 0.0021, 0.0031);
  if (!captured) light += haze * vec3(0.0075, 0.0033, 0.0015) + orbit * vec3(0.24, 0.065, 0.011);
  light += background;
  vec3 mapped = pow(vec3(1.0) - exp(-light), vec3(0.58));
  outputColor = vec4(mapped, 1.0);
}
`;

function compile(gl, kind, text) {
  const shader = gl.createShader(kind);
  gl.shaderSource(shader, text);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(error || "The black hole shader could not compile.");
  }
  return shader;
}

function makeWebGL(canvas) {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    preserveDrawingBuffer: true,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  gl.useProgram(program);
  const resolution = gl.getUniformLocation(program, "resolution");
  const time = gl.getUniformLocation(program, "time");
  return (elapsed) => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(resolution, canvas.width, canvas.height);
    gl.uniform1f(time, elapsed);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
}

function makeCanvas2D(canvas) {
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return null;

  const fractional = (value) => value - Math.floor(value);
  const rings = Array.from({ length: 88 }, (_, index) => ({
    fraction: index / 87,
    phase: 2 * Math.PI * fractional(Math.sin(index * 49.47) * 14061.97),
  }));

  // The lightweight renderer still draws orbital ribbons and a lensed
  // back arc on every frame. Devices without WebGL need no image download.
  return (elapsed) => {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height * 0.49;
    const radius = height * 0.228;
    const center = (x, y) => [centerX + x * radius, centerY + y * radius];

    const darkness = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * 0.57);
    darkness.addColorStop(0, "#24140e");
    darkness.addColorStop(0.52, "#111013");
    darkness.addColorStop(1, "#090a0e");
    context.fillStyle = darkness;
    context.fillRect(0, 0, width, height);
    context.lineCap = "round";

    function strokeOrbit(ring, side) {
      const { fraction, phase } = ring;
      const spin = phase + elapsed * (0.09 + 0.20 * (1 - fraction));
      const x = 1.04 + 2.70 * fraction;
      const y = side === "lens" ? 0.99 + fraction * 0.42 : 0.28 + fraction * 0.70;
      const shift = side === "lens" ? 0.16 : 0.37;
      const [originX, originY] = center(0, shift);
      const illumination = (0.62 + 0.38 * Math.sin(spin)) * Math.exp(-2.7 * fraction);
      const gradient = context.createLinearGradient(originX - x * radius, originY, originX + x * radius, originY);
      gradient.addColorStop(0, `rgba(255, 72, 11, ${illumination * 0.04})`);
      gradient.addColorStop(0.34, `rgba(255, 116, 40, ${illumination * 0.40})`);
      gradient.addColorStop(0.59, `rgba(255, 190, 104, ${illumination * 0.59})`);
      gradient.addColorStop(0.83, `rgba(255, 133, 49, ${illumination * 0.44})`);
      gradient.addColorStop(1, `rgba(255, 61, 10, ${illumination * 0.05})`);
      context.strokeStyle = gradient;
      context.lineWidth = radius * (0.005 + fraction * 0.009);
      context.beginPath();
      context.ellipse(originX, originY, x * radius, y * radius, -0.045,
        side === "lens" ? Math.PI : 0, side === "lens" ? 2 * Math.PI : Math.PI);
      context.stroke();
    }

    for (const ring of rings) strokeOrbit(ring, "lens");
    context.fillStyle = "#08080a";
    context.beginPath();
    context.ellipse(centerX, centerY, radius, radius * 0.98, 0, 0, 2 * Math.PI);
    context.fill();
    for (const ring of rings) strokeOrbit(ring, "near");
  };
}

function setupExhibit(exhibit) {
  let canvas = exhibit.querySelector("[data-black-hole]");
  const toggle = exhibit.querySelector("[data-black-hole-toggle]");
  const fallback = exhibit.querySelector("[data-black-hole-fallback]");
  const container = canvas.parentElement;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let paint;
  let visible = false;
  let paused = false;
  let elapsed = 0;
  let lastFrame = 0;
  let frame = 0;

  try {
    paint = makeWebGL(canvas);
  } catch {
    // Some devices advertise WebGL but cannot compile this shader.
  }

  function useCanvas2D() {
    const replacement = canvas.cloneNode(false);
    canvas.replaceWith(replacement);
    canvas = replacement;
    paint = makeCanvas2D(canvas);
  }

  if (paint) {
    canvas.addEventListener("webglcontextlost", () => {
      useCanvas2D();
      updateSize();
      syncPlayback();
    }, { once: true });
  } else {
    useCanvas2D();
  }
  if (!paint) return;

  function updateSize() {
    if (!paint) {
      canvas.hidden = true;
      fallback.hidden = false;
      return;
    }
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    const scale = Math.min(devicePixelRatio || 1, 1.6, 832 / width);
    const pixelWidth = Math.ceil(width * scale);
    const pixelHeight = Math.ceil(height * scale);
    if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
    if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
    paint(elapsed);
    canvas.hidden = false;
    fallback.hidden = true;
  }

  function shouldPlay() {
    return paint && visible && !paused && !reducedMotion.matches && !document.hidden;
  }

  function drawFrame(now) {
    frame = 0;
    if (!shouldPlay()) return;

    if (!lastFrame || now - lastFrame >= 1000 / 26) {
      if (lastFrame) elapsed += Math.min((now - lastFrame) / 1000, 0.12);
      lastFrame = now;
      paint(elapsed);
    }
    frame = requestAnimationFrame(drawFrame);
  }

  function syncPlayback() {
    toggle.hidden = reducedMotion.matches || !paint;
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
  document.addEventListener("visibilitychange", syncPlayback);
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
