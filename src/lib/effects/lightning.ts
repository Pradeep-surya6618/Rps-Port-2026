/**
 * Recursive midpoint-displacement lightning, as used by the Loki intro:
 * split the bolt at a jittered midpoint until segments are short, and
 * occasionally spawn a weaker side branch.
 */
export function drawBolt(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  displace: number,
  branchProb: number,
) {
  if (displace < 2.5) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    return;
  }

  const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displace;
  const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displace;

  drawBolt(ctx, x1, y1, midX, midY, displace / 2, branchProb);
  drawBolt(ctx, midX, midY, x2, y2, displace / 2, branchProb);

  if (Math.random() < branchProb) {
    const angle = (Math.random() - 0.5) * Math.PI * 0.5;
    const length = displace * (0.8 + Math.random() * 0.6);
    drawBolt(
      ctx,
      midX,
      midY,
      midX + Math.cos(angle) * length,
      midY + Math.sin(angle) * length,
      displace / 2.2,
      branchProb * 0.4,
    );
  }
}

type BoltStyle = { displace: number; branchProb: number; alpha?: number; width?: number };

/** Bolt colours: outer glow as "r, g, b", its shadow colour, and the hot inner core. */
export type BoltColors = { rgb: string; glow: string; core: string };

const GREEN_BOLT: BoltColors = { rgb: "0, 255, 170", glow: "#00ffaa", core: "209, 250, 229" };

/** Glowing outer stroke plus a white-hot inner pass: the two-stroke look of each strike. */
export function drawGlowingBolt(
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  { displace, branchProb, alpha = 1, width = 2.5 }: BoltStyle,
  colors: BoltColors = GREEN_BOLT,
) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.strokeStyle = `rgba(${colors.rgb}, ${alpha * 0.85})`;
  ctx.shadowColor = colors.glow;
  ctx.shadowBlur = width > 2 ? 12 : 8;
  ctx.lineWidth = width;
  drawBolt(ctx, from.x, from.y, to.x, to.y, displace, branchProb);

  ctx.strokeStyle = `rgba(${colors.core}, ${alpha})`;
  ctx.lineWidth = Math.max(0.8, width * 0.48);
  ctx.shadowBlur = 2;
  drawBolt(ctx, from.x, from.y, to.x, to.y, displace, branchProb * 0.4);
  ctx.restore();
}

/** Sizes a canvas to the viewport at device pixel ratio (capped at 2). */
export function fitCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
