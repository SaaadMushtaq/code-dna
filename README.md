# Code DNA

**Code DNA** is an AI-powered developer personality analyzer. Paste your code and instantly discover your coding style — what your code says about you as a developer, or get brutally roasted by an AI with the energy of Gordon Ramsay meets Reddit.

## Features

- **DNA Mode** — Analyzes your code and surfaces personality traits such as _Minimalist_, _Over-Explainer_, _Functional Thinker_, _OOP Lover_, _Chaotic Coder_, and _Perfectionist_, along with stats like total lines, comment ratio, and functional operation count.
- **Roast Mode** — An unfiltered, savagely witty AI code reviewer that tears your code apart with pop-culture references, memes, and humor ranked from mild to savage.
- **Animated DNA Strand** — Visual DNA helix rendered from your trait color palette.
- **3D Tilt Card** — Interactive card with mouse-tracking tilt and glare effects powered by Framer Motion.
- **Shareable Cards** — Export your DNA result or roast as a PNG image via `html-to-image`.
- **Multi-language Editor** — CodeMirror editor with syntax highlighting for JavaScript/TypeScript, Python, and Java.

## Tech Stack

| Layer        | Technology                                                        |
| ------------ | ----------------------------------------------------------------- |
| Framework    | React 19 + TypeScript                                             |
| Build Tool   | Vite                                                              |
| Styling      | Tailwind CSS v4                                                   |
| Animation    | Framer Motion                                                     |
| Code Editor  | CodeMirror (`@uiw/react-codemirror`)                              |
| AI Backend   | [Groq API](https://console.groq.com/) — `llama-3.3-70b-versatile` |
| Icons        | Lucide React                                                      |
| Image Export | html-to-image                                                     |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Groq API key](https://console.groq.com/keys)

### Installation

```bash
git clone https://github.com/your-username/code-dna.git
cd code-dna
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

> **Note:** Never commit your `.env` file. It is already listed in `.gitignore` by default for Vite projects.

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── CodeInput.tsx       # CodeMirror editor with language support
│   ├── CriteriaModal.tsx   # Modal explaining the analysis criteria
│   ├── DnaBackground.tsx   # Animated background helix
│   ├── DnaCard.tsx         # Main result card with 3D tilt effect
│   ├── DnaStrand.tsx       # DNA strand SVG visualization
│   ├── LoadingState.tsx    # Loading animation
│   ├── RoastCard.tsx       # Roast mode result card
│   ├── ShareCard.tsx       # Share/download image button
│   └── TraitBadges.tsx     # Personality trait badge list
├── types/
│   └── index.ts            # Shared TypeScript interfaces
└── utils/
    ├── aiAnalyze.ts        # Groq API calls for DNA and Roast analysis
    ├── analyzeCode.ts      # Local code metrics utilities
    └── roastCode.ts        # Roast prompt helpers
```

## Usage

1. Select a mode — **DNA** or **Roast** — from the toggle at the top.
2. Paste or type your code into the editor.
3. Click **Analyze DNA** (or **Roast My Code**) and wait for the AI response.
4. View your personality traits, stats, and animated DNA strand — or read your roasts.
5. Click **Share** to download a PNG of your result card.

## License

MIT
