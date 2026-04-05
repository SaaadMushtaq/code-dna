import { motion } from "framer-motion";
import { Dna, Flame } from "lucide-react";
import type { AppMode } from "../types";

interface LoadingStateProps {
  mode: AppMode;
}

const modeConfig: Record<AppMode, { icon: React.ReactNode; text: string }> = {
  dna: {
    icon: <Dna size={16} className="text-purple-400" strokeWidth={1.5} />,
    text: "Analyzing your code DNA...",
  },
  roast: {
    icon: <Flame size={16} className="text-orange-400" strokeWidth={1.5} />,
    text: "Cooking up your roast...",
  },
};

export default function LoadingState({ mode }: LoadingStateProps) {
  const cfg = modeConfig[mode];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center gap-5 py-12"
    >
      {/* Animated dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-zinc-400"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <p className="flex items-center gap-2 text-zinc-400 text-sm tracking-wide">
        {cfg.icon}
        {cfg.text}
      </p>
    </motion.div>
  );
}
