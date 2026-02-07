import { X, Image as ImageIcon, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Attachment {
  id: string;
  type: "image" | "voice";
  file: File | Blob;
  preview?: string;
}

interface AttachmentPreviewProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}

const AttachmentPreview = ({ attachments, onRemove }: AttachmentPreviewProps) => {
  if (!attachments.length) return null;

  return (
    <div className="flex flex-wrap gap-2 px-2 pt-2">
      <AnimatePresence>
        {attachments.map((att) => (
          <motion.div
            key={att.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="group relative"
          >
            {att.type === "image" && att.preview ? (
              <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-border">
                <img
                  src={att.preview}
                  alt="Attachment"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-secondary">
                <Mic className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(att.id)}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AttachmentPreview;
