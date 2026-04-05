import { useRef } from "react";
import type { RefObject } from "react";
import { FileText, MessageSquare, Repeat2 } from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import DnaStrand from "./DnaStrand";
import TraitBadges from "./TraitBadges";
import ShareCard from "./ShareCard";
import type { AnalysisResult } from "../types";

interface DnaCardProps {
  result: AnalysisResult;
  cardRef: RefObject<HTMLDivElement | null>;
}

export default function DnaCard({ result, cardRef }: DnaCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-260, 260], [12, -12]), {
    stiffness: 120,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(mouseX, [-260, 260], [-12, 12]), {
    stiffness: 120,
    damping: 24,
  });

  const glareX = useTransform(mouseX, [-260, 260], [15, 85]);
  const glareY = useTransform(mouseY, [-260, 260], [15, 85]);
  const glare = useTransform(
    [glareX, glareY] as MotionValue<number>[],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.09) 0%, transparent 52%)`,
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const stats = [
    {
      icon: <FileText size={12} className="text-zinc-500" />,
      value: `${result.totalLines}`,
      label: "lines",
    },
    {
      icon: <MessageSquare size={12} className="text-zinc-500" />,
      value: `${Math.round(result.commentRatio * 100)}%`,
      label: "comments",
    },
    {
      icon: <Repeat2 size={12} className="text-zinc-500" />,
      value: `${result.functionalOps}`,
      label: "functional ops",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Perspective wrapper */}
      <div
        ref={containerRef}
        className="w-full"
        style={{ perspective: "900px" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, y: 48, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full relative"
        >
          {/* Pulsing glow beneath the card — gives a "lifted" 3D shadow */}
          <motion.div
            className="absolute -inset-2 rounded-3xl -z-10"
            style={{
              background:
                "linear-gradient(135deg, rgba(168,85,247,0.35) 0%, rgba(59,130,246,0.25) 100%)",
              filter: "blur(22px)",
              transform: "translateY(10px) scaleX(0.95)",
            }}
            animate={{ opacity: [0.55, 0.9, 0.55] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          />

          {/* Card face — this inner div is what gets screenshotted */}
          <div
            ref={cardRef as RefObject<HTMLDivElement>}
            className="relative w-full rounded-2xl overflow-hidden text-center p-8"
            style={{
              background: "rgba(18,18,22,0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(113,113,122,0.45)",
              boxShadow:
                "0 0 0 1px rgba(168,85,247,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Ambient gradient tint */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(145deg, rgba(168,85,247,0.11) 0%, transparent 42%, rgba(59,130,246,0.08) 100%)",
              }}
            />

            {/* One-shot scan line on mount */}
            <motion.div
              className="absolute left-0 right-0 h-0.5 pointer-events-none z-20"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.9) 30%, rgba(56,189,248,0.9) 70%, transparent 100%)",
              }}
              initial={{ top: "-4px", opacity: 1 }}
              animate={{ top: "104%", opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeIn", delay: 0.35 }}
            />

            {/* Mouse glare */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
              style={{ background: glare }}
            />

            {/* Content */}
            <div className="relative z-10">
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-zinc-500 text-[11px] mb-4 uppercase tracking-[0.25em] font-medium"
              >
                Your Code DNA
              </motion.p>

              <DnaStrand result={result} />

              <TraitBadges traits={result.traits} />

              <motion.div
                className="flex flex-wrap justify-center gap-2.5 mt-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                {stats.map(({ icon, value, label }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 bg-zinc-800/70 px-3 py-1.5 rounded-full text-xs text-zinc-500 border border-zinc-700/50"
                  >
                    {icon}
                    <span className="text-zinc-300 font-semibold">{value}</span>
                    {label}
                  </span>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.05 }}
                className="text-zinc-700 text-[11px] mt-5 tracking-widest font-light"
              >
                codedna.app
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>

      <ShareCard cardRef={cardRef} />
    </div>
  );
}
