import { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import VoiceRecorder from "@/components/VoiceRecorder";
import AttachmentPreview, { type Attachment } from "@/components/AttachmentPreview";

interface ChatInputProps {
  onSend: (message: string, attachments?: Attachment[]) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if ((!trimmed && !attachments.length) || disabled) return;
    onSend(trimmed, attachments.length ? attachments : undefined);
    setInput("");
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAtts: Attachment[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      type: "image" as const,
      file,
      preview: URL.createObjectURL(file),
    }));
    setAttachments((prev) => [...prev, ...newAtts]);
    e.target.value = "";
  };

  const handleVoiceRecorded = (blob: Blob) => {
    setAttachments((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: "voice", file: blob },
    ]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const att = prev.find((a) => a.id === id);
      if (att?.preview) URL.revokeObjectURL(att.preview);
      return prev.filter((a) => a.id !== id);
    });
  };

  const canSend = (input.trim() || attachments.length > 0) && !disabled;

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="mx-auto max-w-3xl">
        <motion.div
          layout
          className="flex flex-col rounded-2xl border border-border bg-card shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-1 focus-within:ring-ring"
        >
          <AttachmentPreview attachments={attachments} onRemove={removeAttachment} />

          <div className="flex items-end gap-2 p-2">
            {/* Image upload */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageSelect}
            />
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => imageInputRef.current?.click()}
                disabled={disabled}
                className="h-8 w-8 shrink-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </motion.div>

            {/* Voice recorder */}
            <VoiceRecorder onRecorded={handleVoiceRecorded} disabled={disabled} />

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message..."
              disabled={disabled}
              rows={1}
              className="flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
            />

            {/* Send button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={canSend ? { opacity: 1 } : { opacity: 0.5 }}
            >
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!canSend}
                className="h-9 w-9 shrink-0 rounded-xl"
              >
                <Send className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          NexusAI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
