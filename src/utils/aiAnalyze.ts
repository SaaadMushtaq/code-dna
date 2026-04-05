import type { AnalysisResult, Roast } from "../types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

async function callGroq(
  systemPrompt: string,
  userContent: string,
): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error("VITE_GROQ_API_KEY is not set in environment variables.");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Groq API request failed (${response.status}): ${errorText}`,
    );
  }

  const data = await response.json();
  const content: string = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Groq API returned an empty response.");
  }
  return content;
}

function extractJSON(text: string): unknown {
  // Strip markdown code fences if present
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenceMatch ? fenceMatch[1] : text;
  return JSON.parse(raw.trim());
}

export async function analyzeDNA(code: string): Promise<AnalysisResult> {
  const systemPrompt = `You are a code personality analyzer. Analyze the given code and return ONLY a valid JSON object with this exact structure:
{
  "traits": [{ "id": string, "label": string, "emoji": string, "color": string, "bgColor": string, "borderColor": string, "desc": string }],
  "totalLines": number,
  "commentRatio": number,
  "functionalOps": number,
  "dnaColors": [string]
}
Detect personality traits like: Minimalist, Over-Explainer, Functional Thinker, OOP Lover, Chaotic Coder, Perfectionist. Be creative with the analysis. Return ONLY the JSON, no explanation.`;

  const content = await callGroq(systemPrompt, code);

  try {
    const parsed = extractJSON(content) as AnalysisResult;
    return parsed;
  } catch {
    throw new Error("Failed to parse DNA analysis response from Groq API.");
  }
}

export async function roastCode(code: string): Promise<Roast[]> {
  const systemPrompt = `You are the most savage, witty, and culturally aware code reviewer on the internet — \
think of a mix between Gordon Ramsay reviewing a dish, a Reddit roast thread, \
and a tech Twitter drama. You have deep knowledge of pop culture, movies, TV shows, \
political scandals, sports failures, and internet memes.

Analyze the given code and return ONLY a valid JSON array of roast objects.

Rules for your roasts:
- Every roast MUST reference a specific pop culture moment, political scandal, \
historical failure, movie scene, sports blunder, or viral internet moment
- Examples of references you can use:
    * "This code has more layers than Shrek's onion metaphor, and somehow less depth"
    * "This is the programming equivalent of Elon Musk's first day at Twitter — \
chaotic, overconfident, and everyone's already planning the exit"
    * "Your variable names are so vague, they make Squid Game's masked men look transparent"
    * "This nesting is deeper than the plot holes in Game of Thrones Season 8"
    * "More console.logs than Kanye has Twitter meltdowns"
    * "This function does so many things it makes the Marvel multiverse look simple"
- Never use generic boring roasts like 'consider using better variable names'
- Be creative, unexpected, and make the developer laugh AND feel attacked at the same time
- Vary the pop culture categories — don't use only tech references
- Each roast should feel like a completely different comedian wrote it
- Make it feel personal, like you actually READ the code

Return between 3 to 6 roast objects with this exact structure:
[{ "id": string, "emoji": string, "title": string, "message": string, "severity": "mild" | "medium" | "savage" }]
Where severity is 'mild', 'medium', or 'savage'.

Return ONLY the JSON array. No explanation. No markdown. Raw JSON only.`;

  const content = await callGroq(systemPrompt, code);

  try {
    const parsed = extractJSON(content) as Roast[];
    return parsed;
  } catch {
    throw new Error("Failed to parse roast response from Groq API.");
  }
}
