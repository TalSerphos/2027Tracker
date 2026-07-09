import * as THREE from "three";
import { onUtopia } from "../state";

// A full-viewport WebGL particle field. Thousands of points drift through a
// slow vortex; their color is driven by a single uniform that lerps between a
// dystopian red and a utopian gold/cyan as the probability changes.

const UTOPIA_A = new THREE.Color("#ffd36e"); // warm gold
const UTOPIA_B = new THREE.Color("#5ff0e0"); // cyan
const DYSTOPIA_A = new THREE.Color("#ff3b52"); // red
const DYSTOPIA_B = new THREE.Color("#7a1030"); // deep crimson

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aScale;
  attribute float aSeed;
  varying float vSeed;
  varying float vDepth;

  void main() {
    vSeed = aSeed;
    vec3 p = position;

    // Slow swirl around the Y axis, speed depends on radius.
    float r = length(p.xz);
    float ang = uTime * (0.04 + 0.05 / (r + 0.6)) + aSeed * 6.2831;
    float s = sin(ang);
    float c = cos(ang);
    vec3 pos = vec3(p.x * c - p.z * s, p.y, p.x * s + p.z * c);

    // Gentle vertical bob.
    pos.y += sin(uTime * 0.3 + aSeed * 10.0) * 0.35;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDepth = clamp(-mv.z / 22.0, 0.0, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * uPixelRatio * (140.0 / -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform vec3 uUtopiaA;
  uniform vec3 uUtopiaB;
  uniform vec3 uDystopiaA;
  uniform vec3 uDystopiaB;
  uniform float uMix; // 0 = dystopia, 1 = utopia
  varying float vSeed;
  varying float vDepth;

  void main() {
    // Round, soft particle.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d);

    vec3 dyst = mix(uDystopiaA, uDystopiaB, vSeed);
    vec3 utop = mix(uUtopiaA, uUtopiaB, vSeed);
    vec3 col = mix(dyst, utop, uMix);

    // Fade with depth and give a subtle core glow. Kept dim so text stays
    // legible over the field even where particles cluster (additive blending).
    float glow = pow(alpha, 1.8);
    col += glow * 0.18;
    float a = alpha * (0.16 + 0.34 * (1.0 - vDepth));
    gl_FragColor = vec4(col, a);
  }
`;

export function initBackground(canvas: HTMLCanvasElement): () => void {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  // Build the particle cloud.
  const COUNT = Math.min(
    5500,
    Math.max(2000, Math.floor(window.innerWidth * window.innerHeight * 0.0035)),
  );
  const positions = new Float32Array(COUNT * 3);
  const scales = new Float32Array(COUNT);
  const seeds = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    // Distribute in a flared disc for a "galaxy / possibility cloud" look.
    const radius = Math.pow(Math.random(), 0.6) * 12;
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * (2.4 + radius * 0.25);
    positions[i * 3] = Math.cos(theta) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * radius;
    scales[i] = 0.6 + Math.random() * 2.2;
    seeds[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

  const uniforms = {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uUtopiaA: { value: UTOPIA_A },
    uUtopiaB: { value: UTOPIA_B },
    uDystopiaA: { value: DYSTOPIA_A },
    uDystopiaB: { value: DYSTOPIA_B },
    uMix: { value: 0.38 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // React to probability changes (smoothed in the animation loop).
  let targetMix = 0.38;
  const unsubscribe = onUtopia((u) => {
    targetMix = u / 100;
  });

  // Subtle parallax from pointer + scroll.
  let pointerX = 0;
  let pointerY = 0;
  const onPointer = (e: PointerEvent) => {
    pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
    pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener("pointermove", onPointer);

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
  }
  resize();
  window.addEventListener("resize", resize);

  const clock = new THREE.Clock();
  let raf = 0;
  let running = true;

  function tick() {
    if (!running) return;
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    // Ease the color toward the target probability.
    uniforms.uMix.value += (targetMix - uniforms.uMix.value) * 0.05;

    const scroll = window.scrollY / Math.max(1, document.body.scrollHeight);
    camera.position.x += (pointerX * 1.6 - camera.position.x) * 0.03;
    camera.position.y += (-pointerY * 1.0 + scroll * 3.0 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }
  tick();

  // Pause when the tab is hidden.
  const onVisibility = () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!running) {
      running = true;
      clock.start();
      tick();
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    unsubscribe();
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onPointer);
    document.removeEventListener("visibilitychange", onVisibility);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
