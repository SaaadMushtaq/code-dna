import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dna, Microscope, Flame } from "lucide-react";
import CodeInput from "./components/CodeInput";
import DnaBackground from "./components/DnaBackground";
import DnaCard from "./components/DnaCard";
import CriteriaModal from "./components/CriteriaModal";
import RoastCard from "./components/RoastCard";
import LoadingState from "./components/LoadingState";
import { analyzeDNA, roastCode } from "./utils/aiAnalyze";
import type { AnalysisResult, AppMode, Roast } from "./types";

export default function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [roastResult, setRoastResult] = useState<Roast[] | null>(null);
  const [mode, setMode] = useState<AppMode>("dna");
  const [criteriaOpen, setCriteriaOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleAnalyze = async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (mode === "dna") {
        const dnaResult = await analyzeDNA(code);
        setResult(dnaResult);
        setRoastResult(null);
      } else {
        const roasts = await roastCode(code);
        setRoastResult(roasts);
        setResult(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSwitch = (newMode: AppMode) => {
    setMode(newMode);
    setResult(null);
    setRoastResult(null);
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
          <h1 className="text-5xl font-bold tracking-tight gradient-text flex items-center justify-center gap-3">
            <Dna size={44} strokeWidth={1.5} />
            Code DNA
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
            <Microscope size={12} /> See Criteria
          </motion.button>
        </motion.div>

        {/* Mode toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="flex justify-center"
        >
          <div className="flex gap-1 p-1 rounded-full bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => handleModeSwitch("dna")}
              className={`cursor-pointer px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                mode === "dna"
                  ? "bg-linear-to-r from-purple-500 to-blue-500 text-white shadow"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <Dna size={14} strokeWidth={2} /> DNA Mode
              </span>
            </button>
            <button
              onClick={() => handleModeSwitch("roast")}
              className={`cursor-pointer px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                mode === "roast"
                  ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <Flame size={14} strokeWidth={2} /> Roast Mode
              </span>
            </button>
          </div>
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
          <div className={isLoading ? "hidden" : ""}>
            <CodeInput onAnalyze={handleAnalyze} mode={mode} />
          </div>
          <AnimatePresence>
            {isLoading && <LoadingState mode={mode} />}
          </AnimatePresence>
          {error && (
            <p className="mt-3 text-center text-red-400 text-xs">{error}</p>
          )}
        </motion.div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {mode === "dna" && result && (
            <motion.div
              key="dna-result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <DnaCard result={result} cardRef={cardRef} />
            </motion.div>
          )}
          {mode === "roast" && roastResult && (
            <motion.div
              key="roast-result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <RoastCard roasts={roastResult} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
