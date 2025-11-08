import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiMessageSquare, FiSend, FiX } from "react-icons/fi";
import api from "../services/apiClient";

const Chatbot = () => {
  const SUGGESTIONS = [
    "How do I register if I don't have a National ID (NID) card?",
    "What happens if my NID card is already registered, but not by me?",
    "Can I change my vaccination center after booking an appointment?",
    "What should I do if I miss my scheduled appointment?",
    "Is my personal information secure?",
  ];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I’m your assistant. How can I help today?" },
  ]);
  const [sending, setSending] = useState(false);

  const send = async (textArg) => {
    const text = (textArg ?? input).trim();
    if (!text || sending) return;
    setSending(true);
    setMessages((m) => [...m, { sender: "user", text }]);
    if (!textArg) setInput("");
    try {
      const res = await api.post("http://localhost:5000/faq_chat", { message: text });
      const botText =
        typeof res === "string"
          ? res
          : res?.answer || res?.response || res?.message || "I’ve received your question.";
      setMessages((m) => [...m, { sender: "bot", text: botText }]);
    } catch (err) {
      const msg = err?.message || "Sorry—couldn’t reach the FAQ assistant. Please try again.";
      setMessages((m) => [...m, { sender: "bot", text: msg }]);
    } finally {
      setSending(false);
    }
  };

  const handleSuggestion = (text) => {
    if (sending) return;
    send(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white shadow ring-1 ring-white/10 bg-gradient-to-r from-[#F04E36] to-[#EAB308]"
      >
        <FiMessageSquare />
        {open ? "Close" : "Chat"}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="mt-3 w-[340px] rounded-2xl bg-white/90 backdrop-blur-md shadow-lg ring-1 ring-[#081F2E]/10 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-white/80 ring-1 ring-[#081F2E]/10">
              <div className="font-semibold text-[#081F2E]">Chat Assistant</div>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#081F2E]/10 text-[#081F2E]"
              >
                <FiX />
              </button>
            </div>
            <div className="max-h-[320px] overflow-y-auto px-4 py-3 space-y-3">
              {/* Suggestions */}
              <div className="mb-2">
                <div className="text-xs font-medium text-[#0c2b40]/70 mb-2">Suggestions</div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSuggestion(s)}
                      className="inline-flex items-center rounded-lg bg-white px-3 py-2 text-xs text-[#081F2E] ring-1 ring-[#081F2E]/10 hover:bg-[#081F2E]/5"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
              {messages.map((m, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    m.sender === "user"
                      ? "ml-auto bg-[#081F2E] text-white"
                      : "bg-white ring-1 ring-[#081F2E]/10 text-[#0c2b40]/80"
                  }`}
                >
                  {m.text}
                </motion.div>
              ))}
              {sending && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-xs text-[#0c2b40]/70 ring-1 ring-[#081F2E]/10"
                >
                  <span>Typing</span>
                  <motion.span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-[#EAB308]"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0 }}
                  />
                  <motion.span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-[#EAB308]"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                  />
                  <motion.span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-[#EAB308]"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.4 }}
                  />
                </motion.div>
              )}
            </div>
            <div className="px-4 py-3 bg-white/80 ring-1 ring-[#081F2E]/10">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={2}
                  placeholder="Type a message..."
                  className="flex-1 resize-none rounded-xl bg-white px-3 py-2 text-sm text-[#081F2E] placeholder:text-[#081F2E]/50 ring-1 ring-[#081F2E]/10 focus:outline-none focus:ring-2 focus:ring-[#EAB308]/40"
                />
                <motion.button
                  whileHover={{ scale: input.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: input.trim() ? 0.98 : 1 }}
                  disabled={!input.trim() || sending}
                  onClick={() => send()}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow ring-1 ring-white/10 ${
                    !input.trim() || sending
                      ? "bg-[#081F2E]/30 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#F04E36] to-[#EAB308] hover:opacity-90"
                  }`}
                >
                  <FiSend />
                  Send
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;