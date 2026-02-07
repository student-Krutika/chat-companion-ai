import { useRef, useEffect, useState } from "react";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ChatSidebar from "@/components/ChatSidebar";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import MessageSuggestions from "@/components/MessageSuggestions";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";

const FOLLOW_UP_SUGGESTIONS = [
  "Tell me more",
  "Can you give an example?",
  "Explain it simpler",
  "What are the alternatives?",
];

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    sendMessage,
    setActiveConversationId,
    deleteConversation,
    newChat,
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Show suggestions after assistant's last message
  const lastMsg = messages[messages.length - 1];
  const showSuggestions = lastMsg?.role === "assistant" && !isLoading;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="dark flex h-screen bg-background">
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
        onNew={newChat}
        onDelete={deleteConversation}
        onLogout={signOut}
        open={sidebarOpen}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-3 border-b border-border px-4 py-3"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h2 className="text-sm font-medium text-foreground">
            {activeConversationId
              ? conversations.find((c) => c.id === activeConversationId)?.title || "Chat"
              : "New Chat"}
          </h2>
        </motion.header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="flex h-full flex-col items-center justify-center px-4"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                >
                  <Sparkles className="h-8 w-8 text-primary" />
                </motion.div>
                <h2 className="text-xl font-semibold text-foreground">How can I help you today?</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Ask me anything — coding, writing, math, science, or just have a conversation.
                </p>
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
                  }}
                  className="mt-6 flex flex-wrap justify-center gap-2"
                >
                  {["Explain quantum computing", "Write a Python script", "Help me brainstorm", "Summarize an article"].map(
                    (suggestion) => (
                      <motion.button
                        key={suggestion}
                        variants={{
                          hidden: { opacity: 0, y: 16 },
                          show: { opacity: 1, y: 0 },
                        }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => sendMessage(suggestion)}
                        className="rounded-full border border-border bg-card px-4 py-2 text-xs text-card-foreground transition-colors hover:bg-secondary hover:border-primary/30"
                      >
                        {suggestion}
                      </motion.button>
                    )
                  )}
                </motion.div>
              </motion.div>
            ) : (
              <div key="messages" className="mx-auto max-w-3xl py-4">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
                ))}
                <AnimatePresence>
                  {isLoading && messages[messages.length - 1]?.role === "user" && <TypingIndicator />}
                </AnimatePresence>
                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      <MessageSuggestions
                        suggestions={FOLLOW_UP_SUGGESTIONS}
                        onSelect={sendMessage}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </div>

        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </main>
    </div>
  );
};

export default Index;
