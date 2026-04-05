import { motion } from "framer-motion";
import type { Trait } from "../types";

interface TraitBadgesProps {
  traits: Trait[];
}

export default function TraitBadges({ traits }: TraitBadgesProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-6">
      {traits.map((trait, i) => (
        <motion.div
          key={trait.id}
          title={trait.desc}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.08,
            y: -3,
            transition: { type: "spring", stiffness: 400, damping: 17 },
          }}
          whileTap={{ scale: 0.94, transition: { duration: 0.1 } }}
          transition={{ delay: i * 0.1 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold cursor-default ${trait.bgColor} ${trait.borderColor}`}
          style={{ color: trait.color }}
        >
          <span>{trait.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
