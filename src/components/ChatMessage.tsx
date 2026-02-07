import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { User, Volume2 } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  attachments?: Array<{ type: "image" | "voice"; url: string }>;
}

const ChatMessage = ({ role, content, attachments }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex items-start gap-3 px-4 py-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${
          isUser
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : "N"}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: isUser ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "rounded-tr-sm bg-primary text-primary-foreground"
            : "rounded-tl-sm bg-card text-card-foreground border border-border"
        }`}
      >
        {/* Attachment previews */}
        {attachments && attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((att, i) =>
              att.type === "image" ? (
                <motion.img
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={att.url}
                  alt="Attached"
                  className="h-32 w-auto max-w-full rounded-lg object-cover"
                />
              ) : (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2"
                >
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <audio controls src={att.url} className="h-8" />
                </motion.div>
              )
            )}
          </div>
        )}

        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed [&_pre]:bg-secondary [&_pre]:rounded-lg [&_pre]:p-3 [&_code]:font-mono [&_code]:text-xs [&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_li]:my-0.5">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ChatMessage;
