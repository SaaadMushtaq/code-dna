import { useEffect, useRef } from "react";

export default function DnaBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const N_TURNS = 5; // full rotations along the diagonal
    const N_SAMPLES = 280; // backbone smoothness
    const N_RUNGS = 46; // rung + node count

    const render = (ts: number) => {
      const t = ts / 1000; // seconds — frame-rate independent
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      const L = Math.sqrt(W * W + H * H);
      const R = Math.min(W, H) * 0.078; // helix radius

      // Spine goes top-right (W,0) → bottom-left (0,H)
      // Perpendicular to spine (CW 90° rotation of spine direction vector)
      const nx = H / L;
      const ny = W / L;

      // Slow rotation (one full turn ≈ 21 s) + slow color cycle (≈ 24 s)
      const phi = t * 0.3;
      const baseHue = (t * 15) % 360;

      // ── 1. Rungs — drawn behind strands ──────────────────────────────
      for (let r = 0; r < N_RUNGS; r++) {
        const u = r / (N_RUNGS - 1);
        const sx = W * (1 - u);
        const sy = H * u;
        const theta = 2 * Math.PI * N_TURNS * u + phi;
        const lat = R * Math.cos(theta);

        const x1 = sx + lat * nx;
        const y1 = sy + lat * ny;
        const x2 = sx - lat * nx;
        const y2 = sy - lat * ny;

        // Rung is most visible face-on (|sin| → 1) and hides edge-on (|sin| → 0)
        const face = Math.abs(Math.sin(theta));
        const hue = (baseHue + u * 90) % 360;
        const alpha = 0.08 + 0.28 * face;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsla(${hue}, 70%, 65%, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.8 + face * 1.2;
        ctx.stroke();
      }

      // ── 2. Backbone strands — per segment for depth-varying width/color ──
      for (let strand = 0; strand < 2; strand++) {
        const sign = strand === 0 ? 1 : -1;
        const hueShift = strand === 0 ? 0 : 150;

        for (let i = 0; i < N_SAMPLES; i++) {
          const u = i / N_SAMPLES;
          const un = (i + 1) / N_SAMPLES;
          const theta = 2 * Math.PI * N_TURNS * u + phi;
          const thetan = 2 * Math.PI * N_TURNS * un + phi;
          const lat = R * Math.cos(theta);
          const latn = R * Math.cos(thetan);

          // depth: +1 = closest to viewer, -1 = furthest
          const depth = strand === 0 ? Math.sin(theta) : -Math.sin(theta);

          const x1 = W * (1 - u) + sign * lat * nx;
          const y1 = H * u + sign * lat * ny;
          const x2 = W * (1 - un) + sign * latn * nx;
          const y2 = H * un + sign * latn * ny;

          const d01 = (depth + 1) / 2; // normalised 0 (back) → 1 (front)
          const hue = (baseHue + u * 90 + hueShift) % 360;
          const alpha = 0.18 + 0.68 * d01;
          const lw = 0.8 + 3.0 * d01;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `hsla(${hue}, 85%, 62%, ${alpha.toFixed(3)})`;
          ctx.lineWidth = lw;
          ctx.stroke();
        }
      }

      // ── 3. Nodes — drawn on top, size/alpha reflect depth ────────────
      for (let r = 0; r < N_RUNGS; r++) {
        const u = r / (N_RUNGS - 1);
        const sx = W * (1 - u);
        const sy = H * u;
        const theta = 2 * Math.PI * N_TURNS * u + phi;
        const lat = R * Math.cos(theta);
        const depth = Math.sin(theta); // +1 front, -1 back for strand 1

        const x1 = sx + lat * nx;
        const y1 = sy + lat * ny;
        const x2 = sx - lat * nx;
        const y2 = sy - lat * ny;

        const hue1 = (baseHue + u * 90) % 360;
        const hue2 = (hue1 + 150) % 360;

        const d1 = (depth + 1) / 2;
        const d2 = (-depth + 1) / 2;

        ctx.beginPath();
        ctx.arc(x1, y1, 2.5 + 5.5 * d1, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue1}, 95%, 68%, ${(0.2 + 0.75 * d1).toFixed(3)})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x2, y2, 2.5 + 5.5 * d2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue2}, 95%, 68%, ${(0.2 + 0.75 * d2).toFixed(3)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.22,
        zIndex: 0,
      }}
    />
  );
}
