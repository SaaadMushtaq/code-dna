import { useState } from "react";
import { motion } from "framer-motion";
import type { AppMode } from "../types";
import CodeMirror from "@uiw/react-codemirror";
import { createTheme } from "@uiw/codemirror-themes";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { tags as t } from "@lezer/highlight";
import { Dna, Flame } from "lucide-react";

const dnaTheme = createTheme({
  theme: "dark",
  settings: {
    background: "transparent",
    foreground: "#cbd5e1",
    caret: "#a855f7",
    selection: "rgba(168,85,247,0.22)",
    selectionMatch: "rgba(168,85,247,0.14)",
    lineHighlight: "rgba(168,85,247,0.06)",
    gutterBackground: "rgba(0,0,0,0)",
    gutterForeground: "#3f3f46",
    gutterBorder: "transparent",
  },
  styles: [
    { tag: t.keyword, color: "#c084fc" },
    { tag: t.operator, color: "#94a3b8" },
    { tag: t.variableName, color: "#e2e8f0" },
    { tag: t.definition(t.variableName), color: "#7dd3fc" },
    { tag: t.function(t.variableName), color: "#818cf8" },
    { tag: t.string, color: "#34d399" },
    { tag: t.number, color: "#fb923c" },
    { tag: t.bool, color: "#f472b6" },
    { tag: t.comment, color: "#52525b", fontStyle: "italic" },
    { tag: t.className, color: "#fbbf24" },
    { tag: t.typeName, color: "#38bdf8" },
    { tag: t.propertyName, color: "#a5b4fc" },
    { tag: t.punctuation, color: "#71717a" },
  ],
});

const EXTENSIONS = [
  javascript({ jsx: true, typescript: true }),
  python(),
  java(),
];

interface CodeInputProps {
  onAnalyze: (code: string) => void;
  mode: AppMode;
}

export default function CodeInput({ onAnalyze, mode }: CodeInputProps) {
  const [code, setCode] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <div
        className="w-full rounded-xl border border-zinc-700 overflow-hidden transition-all focus-within:border-purple-500/70 focus-within:ring-2 focus-within:ring-purple-500/20"
        style={{ background: "rgba(18,18,22,0.85)" }}
      >
        {/* Editor top bar */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-900/50">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-3 text-zinc-600 text-xs font-mono tracking-wide select-none">
            your-code
          </span>
        </div>

        <CodeMirror
          value={code}
          height="224px"
          theme={dnaTheme}
          extensions={EXTENSIONS}
          placeholder="// Paste any code here — JavaScript, Python, Java, anything..."
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            autocompletion: false,
            bracketMatching: true,
            indentOnInput: true,
          }}
          onChange={setCode}
          style={{ fontSize: "13px" }}
        />
      </div>

      <motion.button
        onClick={() => code.trim() && onAnalyze(code)}
        disabled={!code.trim()}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="btn-shimmer cursor-pointer mx-auto px-8 py-3 rounded-full bg-linear-to-r from-purple-500 to-blue-500 text-white font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {mode === "roast" ? (
          <div className="flex items-center gap-2">
            <Flame size={14} strokeWidth={2} />
            <p>Roast My Code</p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Dna size={14} strokeWidth={2} />
            <p>Analyze My DNA</p>
          </div>
        )}
      </motion.button>
    </div>
  );
}
