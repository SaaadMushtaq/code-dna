import { motion } from "framer-motion";
import { Flame, AlertTriangle, Zap, ThumbsDown } from "lucide-react";
import type { Roast } from "../types";

interface RoastCardProps {
  roasts: Roast[];
}

const severityConfig: Record<
  Roast["severity"],
  {
    border: string;
    bg: string;
    accent: string;
    accentGlow: string;
    badge: string;
    badgeText: string;
    iconColor: string;
    icon: React.ReactNode;
    label: string;
    numberBg: string;
    numberText: string;
  }
> = {
  mild: {
    border: "border-yellow-500/25",
    bg: "bg-gradient-to-br from-yellow-500/[0.07] to-transparent",
    accent: "bg-yellow-400",
    accentGlow: "shadow-[0_0_12px_rgba(234,179,8,0.15)]",
    badge: "bg-yellow-500/10 border border-yellow-500/25",
    badgeText: "text-yellow-400",
    iconColor: "text-yellow-400",
    icon: <AlertTriangle size={12} strokeWidth={2.5} />,
    label: "Mild",
    numberBg: "bg-yellow-500/10",
    numberText: "text-yellow-500",
  },
  medium: {
    border: "border-orange-500/25",
    bg: "bg-gradient-to-br from-orange-500/[0.07] to-transparent",
    accent: "bg-orange-400",
    accentGlow: "shadow-[0_0_12px_rgba(249,115,22,0.15)]",
    badge: "bg-orange-500/10 border border-orange-500/25",
    badgeText: "text-orange-400",
    iconColor: "text-orange-400",
    icon: <Zap size={12} strokeWidth={2.5} />,
    label: "Medium",
    numberBg: "bg-orange-500/10",
    numberText: "text-orange-500",
  },
  savage: {
    border: "border-red-500/25",
    bg: "bg-gradient-to-br from-red-500/[0.07] to-transparent",
    accent: "bg-red-400",
    accentGlow: "shadow-[0_0_12px_rgba(239,68,68,0.15)]",
    badge: "bg-red-500/10 border border-red-500/25",
    badgeText: "text-red-400",
    iconColor: "text-red-400",
    icon: <Flame size={12} strokeWidth={2.5} />,
    label: "Savage",
    numberBg: "bg-red-500/10",
    numberText: "text-red-500",
  },
};

export default function RoastCard({ roasts }: RoastCardProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-0.5">
        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-zinc-800/80 border border-zinc-700/50">
          <ThumbsDown size={12} className="text-zinc-400" />
        </div>
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          Roast Results
        </span>
        <div className="flex-1 h-px bg-linear-to-r from-zinc-800 to-transparent" />
        <span className="text-[11px] text-zinc-600 font-medium tabular-nums">
          {roasts.length} issue{roasts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2.5">
        {roasts.map((roast, index) => {
          const cfg = severityConfig[roast.severity];
          return (
            <motion.div
              key={roast.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.09,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className={`relative rounded-2xl border ${cfg.border} ${cfg.bg} ${cfg.accentGlow} overflow-hidden`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-0.75 ${cfg.accent} opacity-60`}
              />

              <div className="pl-4 pr-4 py-3.5 ml-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-bold shrink-0 ${cfg.numberBg} ${cfg.numberText}`}
                    >
                      {index + 1}
                    </span>
                    <span className="font-semibold text-white/90 text-sm leading-tight">
                      {roast.title}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.badge} ${cfg.badgeText}`}
                  >
                    <span className={cfg.iconColor}>{cfg.icon}</span>
                    {cfg.label}
                  </span>
                </div>

                <p className="mt-2 text-zinc-400 text-xs leading-relaxed pl-7.5">
                  {roast.message}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
