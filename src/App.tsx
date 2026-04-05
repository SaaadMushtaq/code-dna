import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CodeInput from "./components/CodeInput";
import DnaBackground from "./components/DnaBackground";
import DnaCard from "./components/DnaCard";
import CriteriaModal from "./components/CriteriaModal";
import { analyzeCode } from "./utils/analyzeCode";
import type { AnalysisResult } from "./types";

export default function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [criteriaOpen, setCriteriaOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleAnalyze = (code: string) => {
    setResult(analyzeCode(code));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 px-4 py-12 relative overflow-hidden">
      <DnaBackground />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold tracking-tight gradient-text">
            🧬 Code DNA
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-zinc-500 mt-3 text-sm tracking-wide"
          >
            Paste your code. Discover your developer personality.
          </motion.p>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setCriteriaOpen(true)}
            className="cursor-pointer mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-zinc-700 bg-zinc-900/70 text-zinc-400 text-xs hover:border-purple-500/50 hover:text-purple-300 transition-colors"
          >
            <span>🔬</span> See Criteria
          </motion.button>
        </motion.div>

        <CriteriaModal
          open={criteriaOpen}
          onClose={() => setCriteriaOpen(false)}
        />

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CodeInput onAnalyze={handleAnalyze} />
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <DnaCard result={result} cardRef={cardRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
