export interface Trait {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  desc: string;
}

export interface AnalysisResult {
  traits: Trait[];
  dnaColors: string[];
  totalLines: number;
  commentRatio: number;
  functionalOps: number;
}

export interface Roast {
  id: string;
  emoji: string;
  title: string;
  message: string;
  severity: "mild" | "medium" | "savage";
}

export type AppMode = "dna" | "roast";
