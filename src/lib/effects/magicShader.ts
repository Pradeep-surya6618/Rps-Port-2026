/**
 * The "green magic" screen wipe from the Loki intro, ported to plain WebGL
 * so the site does not ship three.js for a single full-screen quad.
 *
 * progress 0 → 0.5 : noise-warped wipe rises and covers the screen
 * progress 0.5 → 0 : the same wipe recedes, uncovering what is beneath
 */

const vertex = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const fragment = `
precision highp float;
uniform float uProgress;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uGlow;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.05 + vec2(13.7, 9.1);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float t = uProgress * 6.2831;
  float pNorm = clamp(uProgress / 0.5, 0.0, 1.0);

  vec2 p = uv * 3.5;
  vec2 warp = vec2(fbm(p + vec2(0.0, t * 0.1)), fbm(p + vec2(5.2, 1.3) - vec2(t * 0.08, 0.0)));
  float w = fbm(p + 1.1 * warp);

  float waves = sin(uv.x * 5.0 + t * 0.5) * 0.035 + sin(uv.x * 10.0 - t * 0.5) * 0.015;
  float wipe = uv.y + (w - 0.5) * 0.35 + waves;

  float alpha = smoothstep(wipe - 0.15, wipe + 0.15, pNorm * 1.4 - 0.2);

  float tint = clamp((w - 0.5) * 0.5 + 0.5, 0.0, 1.0);
  vec3 color = mix(uColorA, uColorB, tint);
  color = mix(color, uColorC, sin(w * 6.28 + t * 0.5) * 0.5 + 0.5);

  float glow = 1.0 - smoothstep(0.0, 0.25, abs(pNorm - wipe));
  color += glow * uGlow;

  gl_FragColor = vec4(color * alpha, alpha);
}`;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed: ${log}`);
  }
  return shader;
}

export type MagicWipe = {
  render(progress: number): void;
  resize(): void;
  destroy(): void;
};

/** Returns null when WebGL is unavailable; callers fall back to a CSS fade. */
export function createMagicWipe(
  canvas: HTMLCanvasElement,
  colors: { a: string; b: string; c: string; glow?: readonly [number, number, number] } = { a: "#022e1b", b: "#00ff99", c: "#044d2d" },
): MagicWipe | null {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return null;

  let program: WebGLProgram;
  try {
    program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  } catch {
    return null;
  }
  gl.useProgram(program);

  // One oversized triangle covers the whole clip space.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uProgress = gl.getUniformLocation(program, "uProgress");
  gl.uniform3fv(gl.getUniformLocation(program, "uColorA"), hexToRgb(colors.a));
  gl.uniform3fv(gl.getUniformLocation(program, "uColorB"), hexToRgb(colors.b));
  gl.uniform3fv(gl.getUniformLocation(program, "uColorC"), hexToRgb(colors.c));
  gl.uniform3fv(gl.getUniformLocation(program, "uGlow"), colors.glow ?? [0.05, 0.95, 0.45]);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const resize = () => {
    // The wipe is soft noise; rendering below device resolution is invisible
    // and keeps the fill-rate cost low on high-DPI screens.
    const scale = Math.min(window.devicePixelRatio || 1, 1.25);
    canvas.width = Math.round(window.innerWidth * scale);
    canvas.height = Math.round(window.innerHeight * scale);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();

  return {
    render(progress) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uProgress, progress);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    resize,
    destroy() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
