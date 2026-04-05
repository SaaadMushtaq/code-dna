import { motion } from "framer-motion";
import type { Roast } from "../types";

interface RoastCardProps {
  roasts: Roast[];
}

const severityStyles: Record<
  Roast["severity"],
  { border: string; bg: string; label: string }
> = {
  mild: { border: "border-yellow-500", bg: "bg-yellow-500/10", label: "🌶️" },
  medium: {
    border: "border-orange-500",
    bg: "bg-orange-500/10",
    label: "🌶️🌶️",
  },
  savage: { border: "border-red-500", bg: "bg-red-500/10", label: "🌶️🌶️🌶️" },
};

export default function RoastCard({ roasts }: RoastCardProps) {
  return (
    <div className="flex flex-col gap-3 w-full bg-zinc-950 p-4 rounded-xl">
      {roasts.map((roast, index) => {
        const styles = severityStyles[roast.severity];
        return (
          <motion.div
            key={roast.id}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.12, ease: "easeOut" }}
            className={`rounded-xl border ${styles.border} ${styles.bg} px-4 py-3`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-bold text-white text-sm">
                {roast.emoji} {roast.title}
              </span>
              <span className="text-xs font-semibold capitalize text-zinc-300 shrink-0">
                {roast.severity} {styles.label}
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              {roast.message}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
