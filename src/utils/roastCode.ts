import type { Roast } from "../types";

export function roastCode(code: string): Roast[] {
  const roasts: Roast[] = [];
  const lines = code.split("\n");
  const totalLines = lines.length;

  // --- Magic numbers (unnamed numeric literals, ignoring 0 and 1) ---
  const magicNumberMatches =
    code.match(/(?<![.\w])(?!0\b|1\b)\d+\.?\d*(?!\s*[:/])/g) ?? [];
  if (magicNumberMatches.length > 3) {
    roasts.push({
      id: "magic-numbers",
      emoji: "🪄",
      title: "Magic Number Hoarder",
      message: `Found ${magicNumberMatches.length} magic numbers sprinkled through your code like seasoning. What does 42 mean? What does 9371 mean? Your future self will weep.`,
      severity: "medium",
    });
  }

  // --- async/await without try/catch ---
  const hasAsyncAwait = /\bawait\b/.test(code);
  const hasTryCatch = /\btry\s*\{/.test(code);
  if (hasAsyncAwait && !hasTryCatch) {
    roasts.push({
      id: "async-no-try-catch",
      emoji: "💣",
      title: "Async Daredevil",
      message: `You're using async/await with zero try/catch blocks. Bold strategy. Nothing can go wrong until absolutely everything does.`,
      severity: "savage",
    });
  }

  // --- Deep nesting (indentation > 16 spaces) ---
  const deeplyNestedLine = lines.find((line) => /^( {17,}|\t{5,})/.test(line));
  if (deeplyNestedLine) {
    roasts.push({
      id: "deep-nesting",
      emoji: "🪆",
      title: "Nesting Doll Enthusiast",
      message: `Your indentation is so deep it needs its own GPS. Somewhere past 16 spaces, a developer cried. That developer was probably you.`,
      severity: "savage",
    });
  }

  // --- Single-letter variable declarations ---
  const singleLetterVars =
    code.match(/\b(?:var|let|const)\s+([a-z])\s*=/g) ?? [];
  if (singleLetterVars.length > 2) {
    roasts.push({
      id: "single-letter-vars",
      emoji: "🔤",
      title: "Variable Name Crisis",
      message: `${singleLetterVars.length} single-letter variables? Were you paid by the keystroke saved? \`x\`, \`y\`, \`z\` — this isn't algebra class.`,
      severity: "medium",
    });
  }

  // --- TODO / FIXME / HACK / XXX comments ---
  const debtComments = lines.filter((line) =>
    /\/\/.*\b(TODO|FIXME|HACK|XXX)\b|\/\*.*\b(TODO|FIXME|HACK|XXX)\b/.test(
      line,
    ),
  );
  if (debtComments.length > 0) {
    roasts.push({
      id: "tech-debt-comments",
      emoji: "📋",
      title: "Technical Debt Collector",
      message: `${debtComments.length} TODO/FIXME/HACK comment${debtComments.length > 1 ? "s" : ""} found. Congratulations on building a museum of your own procrastination.`,
      severity: "mild",
    });
  }

  // --- console.log abuse ---
  const consoleLogs = code.match(/\bconsole\.log\s*\(/g) ?? [];
  if (consoleLogs.length > 2) {
    roasts.push({
      id: "console-log-spam",
      emoji: "📢",
      title: "console.log Journalist",
      message: `${consoleLogs.length} console.log statements? Debuggers exist. Breakpoints exist. And yet here you are, narrating your own code like a sports commentator.`,
      severity: "medium",
    });
  }

  // --- Long lines (> 120 characters) ---
  const longLines = lines.filter((line) => line.length > 120);
  if (longLines.length > 2) {
    roasts.push({
      id: "long-lines",
      emoji: "📏",
      title: "Horizontal Scroll Champion",
      message: `${longLines.length} lines longer than 120 characters. Do you code on a cinema display? Line wrapping is a feature, not a personal attack.`,
      severity: "mild",
    });
  }

  // --- God function (> 80 lines, fewer than 2 functions) ---
  const functionCount = (code.match(/\bfunction\b|=>\s*\{|\basync\s+\(/g) ?? [])
    .length;
  if (totalLines > 80 && functionCount < 2) {
    roasts.push({
      id: "god-function",
      emoji: "🦕",
      title: "The Monolith",
      message: `${totalLines} lines and barely a function in sight. You didn't write code — you wrote a novel. A single, load-bearing, terrifying novel.`,
      severity: "savage",
    });
  }

  // --- No comments in a file longer than 20 lines ---
  const hasComments = /\/\/|\/\*/.test(code);
  if (totalLines > 20 && !hasComments) {
    roasts.push({
      id: "no-comments",
      emoji: "🔇",
      title: "Comment Atheist",
      message: `${totalLines} lines of code and not a single comment. Either this is self-documenting genius or a war crime waiting to be discovered by the next developer.`,
      severity: "medium",
    });
  }

  // --- Backhanded compliment if no issues found ---
  if (roasts.length === 0) {
    roasts.push({
      id: "suspiciously-clean",
      emoji: "🤨",
      title: "Suspiciously Clean",
      message: `Wow, no obvious issues. Either you actually know what you're doing, or this file is too short to fail. Both are equally plausible.`,
      severity: "mild",
    });
  }

  return roasts;
}
