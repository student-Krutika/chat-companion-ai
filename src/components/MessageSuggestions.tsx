import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface MessageSuggestionsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const MessageSuggestions = ({ suggestions, onSelect }: MessageSuggestionsProps) => {
  if (!suggestions.length) return null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-wrap gap-2 px-4 py-2"
    >
      <motion.div variants={item} className="flex items-center gap-1 text-xs text-muted-foreground mr-1">
        <Sparkles className="h-3 w-3" />
        <span>Suggestions</span>
      </motion.div>
      {suggestions.map((s) => (
        <motion.button
          key={s}
          variants={item}
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(s)}
          className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-card-foreground transition-colors hover:bg-secondary hover:border-primary/30"
        >
          {s}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default MessageSuggestions;
