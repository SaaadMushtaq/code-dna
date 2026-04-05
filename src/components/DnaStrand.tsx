import { motion } from "framer-motion";
import type { AnalysisResult } from "../types";

interface DnaStrandProps {
  result: AnalysisResult;
}

// Map trait id → [topHue, botHue] for the backbone strands
const TRAIT_STRAND_COLORS: Record<string, [string, string]> = {
  "over-explainer": ["rgba(34,197,94,0.5)", "rgba(16,185,129,0.4)"],
  minimalist: ["rgba(59,130,246,0.5)", "rgba(14,165,233,0.4)"],
  functional: ["rgba(168,85,247,0.5)", "rgba(139,92,246,0.4)"],
  oop: ["rgba(148,163,184,0.5)", "rgba(100,116,139,0.4)"],
  chaotic: ["rgba(239,68,68,0.5)", "rgba(249,115,22,0.4)"],
  perfectionist: ["rgba(234,179,8,0.5)", "rgba(251,146,60,0.4)"],
};

export default function DnaStrand({ result }: DnaStrandProps) {
  const { dnaColors, commentRatio, functionalOps, traits } = result;
  const pairs = dnaColors.length > 0 ? dnaColors : Array(12).fill("#a855f7");

  // Amplitude encodes comment ratio: verbose code = taller helix
  const AMP = 28 + Math.min(commentRatio * 160, 32);
  // Node base radius encodes functional style: pipelines = bigger nodes
  const NODE_R_BASE = 3.8 + Math.min(functionalOps, 10) * 0.28;
  // Float speed encodes total lines: more code = slightly faster pulse
  const floatDuration = Math.max(3, 6 - Math.min(result.totalLines / 30, 2.5));

  const dominantTrait = traits[0]?.id ?? "functional";
  const [topStroke, botStroke] =
    TRAIT_STRAND_COLORS[dominantTrait] ?? TRAIT_STRAND_COLORS["functional"];

  // Bottom node colors cycle through ALL trait colors for visual variety
  const traitColors = traits.map((t) => t.color);

  const STEP = 44;
  const W = pairs.length * STEP;
  const CY = 82;

  const nodes = pairs.map((color, i) => {
    const angle = (i / pairs.length) * Math.PI * 2;
    const x = i * STEP + STEP / 2;
    const y1 = CY + Math.sin(angle) * AMP;
    const y2 = CY - Math.sin(angle) * AMP;
    const dTop = Math.cos(angle);
    const dBot = -dTop;
    const botColor =
      traitColors.length > 0
        ? traitColors[i % traitColors.length]
        : `hsl(${(i * 37) % 360}, 72%, 58%)`;
    const faceAlpha = (0.1 + 0.38 * Math.abs(Math.sin(angle))).toFixed(3);
    return { color, botColor, x, y1, y2, dTop, dBot, faceAlpha };
  });

  const topPoints = nodes.map((n) => `${n.x},${n.y1}`).join(" ");
  const botPoints = nodes.map((n) => `${n.x},${n.y2}`).join(" ");

  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{
        repeat: Infinity,
        duration: floatDuration,
        ease: "easeInOut",
      }}
    >
      <svg
        width="100%"
        height="168"
        viewBox={`0 0 ${W} 168`}
        preserveAspectRatio="xMidYMid meet"
        overflow="visible"
      >
        <defs>
          <filter id="glow-node" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="4.5"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Rungs */}
        {nodes.map(({ x, y1, y2, faceAlpha }, i) => (
          <motion.line
            key={`rung-${i}`}
            x1={x}
            y1={y1}
            x2={x}
            y2={y2}
            stroke={`rgba(148,163,184,${faceAlpha})`}
            strokeWidth="0.9"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          />
        ))}

        {/* Backbone strands */}
        <motion.polyline
          points={topPoints}
          fill="none"
          stroke={topStroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
        <motion.polyline
          points={botPoints}
          fill="none"
          stroke={botStroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.12 }}
        />

        {/* Nodes */}
        {nodes.map(({ color, botColor, x, y1, y2, dTop, dBot }, i) => {
          // Front node is bigger, brighter; back node is smaller, dimmer
          const rTop = NODE_R_BASE + Math.max(0, dTop) * 4.8;
          const rBot = NODE_R_BASE + Math.max(0, dBot) * 4.8;
          const aTop = 0.42 + Math.max(0, dTop) * 0.58;
          const aBot = 0.42 + Math.max(0, dBot) * 0.58;

          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.06,
                duration: 0.45,
                ease: "easeOut",
              }}
            >
              {/* Top node */}
              <circle
                cx={x}
                cy={y1}
                r={rTop}
                fill={color}
                opacity={aTop}
                filter="url(#glow-node)"
              />
              {/* Top highlight dot */}
              <circle
                cx={x - rTop * 0.28}
                cy={y1 - rTop * 0.3}
                r={rTop * 0.28}
                fill="rgba(255,255,255,0.5)"
                opacity={aTop * 0.85}
              />

              {/* Bottom node */}
              <circle
                cx={x}
                cy={y2}
                r={rBot}
                fill={botColor}
                opacity={aBot}
                filter="url(#glow-node)"
              />
              {/* Bottom highlight dot */}
              <circle
                cx={x - rBot * 0.28}
                cy={y2 - rBot * 0.3}
                r={rBot * 0.28}
                fill="rgba(255,255,255,0.5)"
                opacity={aBot * 0.85}
              />
            </motion.g>
          );
        })}
      </svg>
    </motion.div>
  );
}
