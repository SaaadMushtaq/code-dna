import type { AnalysisResult, Trait } from "../types";

export function analyzeCode(code: string): AnalysisResult {
  const lines = code.split("\n");
  const totalLines = lines.length || 1;

  const commentLines = lines.filter((l) => /^\s*(\/\/|#|\*)/.test(l)).length;

  const longVarNames = (code.match(/\b[a-zA-Z]{15,}\b/g) ?? []).length;
  const shortVarNames = (code.match(/\b[a-z]{1,2}\b/g) ?? []).length;
  const functionalOps = (
    code.match(/\.(map|filter|reduce|forEach|find|some|every)\(/g) ?? []
  ).length;
  const classUsage = (code.match(/\bclass\b|\bthis\b|\bextends\b/g) ?? [])
    .length;
  const inconsistentIndent = lines.filter(
    (l) => l.startsWith("   ") && !l.startsWith("    "),
  ).length;
  const hasDoubleQuotes = code.includes('"');
  const hasSingleQuotes = code.includes("'");
  const mixedQuotes = hasDoubleQuotes && hasSingleQuotes;

  const commentRatio = commentLines / totalLines;
  const shortVarRatio = shortVarNames / totalLines;

  const traits: Trait[] = [];

  if (commentRatio > 0.3 || longVarNames > 10) {
    traits.push({
      id: "over-explainer",
      label: "Over-Explainer",
      emoji: "🟢",
      color: "#22c55e",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500",
      desc: "You love comments and descriptive names.",
    });
  }

  if (shortVarRatio > 2 && commentRatio < 0.1) {
    traits.push({
      id: "minimalist",
      label: "Minimalist",
      emoji: "🔵",
      color: "#3b82f6",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500",
      desc: "Short, sharp, no fluff.",
    });
  }

  if (functionalOps > 3) {
    traits.push({
      id: "functional",
      label: "Functional Thinker",
      emoji: "🟣",
      color: "#a855f7",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500",
      desc: "You think in maps, filters and reduces.",
    });
  }

  if (classUsage > 4) {
    traits.push({
      id: "oop",
      label: "OOP Lover",
      emoji: "⚪",
      color: "#94a3b8",
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-400",
      desc: "Classes and objects are your comfort zone.",
    });
  }

  if (inconsistentIndent > 3 || mixedQuotes) {
    traits.push({
      id: "chaotic",
      label: "Chaotic Coder",
      emoji: "🔴",
      color: "#ef4444",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500",
      desc: "Rules? What rules?",
    });
  }

  if (
    traits.length === 0 ||
    (commentRatio > 0.1 && functionalOps <= 3 && inconsistentIndent <= 2)
  ) {
    traits.push({
      id: "perfectionist",
      label: "Perfectionist",
      emoji: "🟡",
      color: "#eab308",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500",
      desc: "Clean, consistent, and methodical.",
    });
  }

  // Sample evenly across full code, blend towards dominant trait hue
  const nodeCount = Math.max(8, Math.min(20, Math.ceil(totalLines / 4)));
  const traitHues = traits.map((tr) => {
    const match = tr.color.match(/\d+/);
    const hueMap: Record<string, number> = {
      "#22c55e": 142,
      "#3b82f6": 217,
      "#a855f7": 270,
      "#94a3b8": 213,
      "#ef4444": 0,
      "#eab308": 48,
    };
    return hueMap[tr.color] ?? parseInt(match?.[0] ?? "260");
  });
  const dominantHue = traitHues.length > 0 ? traitHues[0] : 260;
  const step = Math.max(1, Math.floor(code.length / nodeCount));
  const dnaColors = Array.from({ length: nodeCount }, (_, i) => {
    const charCode = code.charCodeAt(i * step) || 65;
    const rawHue = (charCode * 17) % 360;
    const blendedHue = Math.round(rawHue * 0.35 + dominantHue * 0.65);
    return `hsl(${blendedHue}, 78%, 62%)`;
  });

  return { traits, dnaColors, totalLines, commentRatio, functionalOps };
}
