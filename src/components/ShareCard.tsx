import { toPng } from "html-to-image";
import type { RefObject } from "react";
import { Download } from "lucide-react";

interface ShareCardProps {
  cardRef: RefObject<HTMLDivElement | null>;
}

export default function ShareCard({ cardRef }: ShareCardProps) {
  const handleDownload = async () => {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { cacheBust: true });
    const link = document.createElement("a");
    link.download = "my-code-dna.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <button
      onClick={handleDownload}
      className="cursor-pointer mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-800 border border-zinc-700 text-slate-400 text-sm hover:bg-zinc-700 transition-colors"
    >
      <Download size={14} /> Download DNA Card
    </button>
  );
}
