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
