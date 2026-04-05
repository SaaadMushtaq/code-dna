import { motion, AnimatePresence } from "framer-motion";

interface CriteriaModalProps {
  open: boolean;
  onClose: () => void;
}

const CRITERIA = [
  {
    emoji: "🟢",
    label: "Over-Explainer",
    color: "#22c55e",
    border: "border-green-500/30",
    bg: "bg-green-500/8",
    hints: [
      "Lots of comments throughout your code",
      "Prefers long, descriptive variable and function names",
      "Makes sure nothing is left unexplained",
    ],
  },
  {
    emoji: "🔵",
    label: "Minimalist",
    color: "#3b82f6",
    border: "border-blue-500/30",
    bg: "bg-blue-500/8",
    hints: [
      "Prefers short, punchy variable names",
      "Little to no comments and the code speaks for itself",
      "Compact and direct style",
    ],
  },
  {
    emoji: "🟣",
    label: "Functional Thinker",
    color: "#a855f7",
    border: "border-purple-500/30",
    bg: "bg-purple-500/8",
    hints: [
      "Heavy use of array operations and transformations",
      "Chains operations together rather than using loops",
      "Thinks in data pipelines",
    ],
  },
  {
    emoji: "⚪",
    label: "OOP Lover",
    color: "#94a3b8",
    border: "border-slate-400/30",
    bg: "bg-slate-500/8",
    hints: [
      "Relies on classes and inheritance",
      "Uses `this` frequently",
      "Structures code around objects and their relationships",
    ],
  },
  {
    emoji: "🔴",
    label: "Chaotic Coder",
    color: "#ef4444",
    border: "border-red-500/30",
    bg: "bg-red-500/8",
    hints: [
      "Mixed or inconsistent indentation",
      "Switches between different quote styles",
      "Code that evolved organically and shows it",
    ],
  },
  {
    emoji: "🟡",
    label: "Perfectionist",
    color: "#eab308",
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/8",
    hints: [
      "Consistent formatting and structure throughout",
      "Balanced use of comments not too many, not too few",
      "Clean, methodical and deliberate",
    ],
  },
];

export default function CriteriaModal({ open, onClose }: CriteriaModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div
              className="modal-scroll relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-zinc-700/50 p-6"
              style={{
                background: "rgba(16,16,20,0.96)",
                backdropFilter: "blur(24px)",
                boxShadow:
                  "0 0 0 1px rgba(168,85,247,0.12), 0 32px 64px rgba(0,0,0,0.6)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-100 tracking-tight">
                    Personality Criteria
                  </h2>
                  <p className="text-zinc-500 text-xs mt-1">
                    How your code style gets decoded into a DNA profile.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-zinc-600 hover:text-zinc-300 transition-colors p-1 rounded-lg hover:bg-zinc-800 ml-4 shrink-0 cursor-pointer"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M4 4l10 10M14 4L4 14" />
                  </svg>
                </button>
              </div>

              {/* Criteria list */}
              <div className="flex flex-col gap-3">
                {CRITERIA.map(
                  ({ emoji, label, color, border, bg, hints }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.35 }}
                      className={`rounded-xl border ${border} ${bg} p-4`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span>{emoji}</span>
                        <span
                          className="font-semibold text-sm"
                          style={{ color }}
                        >
                          {label}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {hints.map((hint) => (
                          <li
                            key={hint}
                            className="text-xs text-zinc-400 flex gap-2"
                          >
                            <span className="text-zinc-600 shrink-0">–</span>
                            {hint}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ),
                )}
              </div>

              <p className="text-zinc-700 text-[11px] text-center mt-5 tracking-wide">
                You can match more than one type.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
