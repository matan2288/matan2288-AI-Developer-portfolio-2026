import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Minimize2, Send, RotateCcw, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePersonaChat } from '../context/PersonaChatContext';

interface AIFloatingWidgetProps {
  avatarUrl?: string;
  developerName?: string;
}

export const AIFloatingWidget: React.FC<AIFloatingWidgetProps> = ({
  avatarUrl = '/profile.png',
  developerName = "Hi I'm Matan",
}) => {
  const {
    messages,
    loading,
    isWidgetOpen,
    setIsWidgetOpen,
    isBlinking,
    hasEverOpened,
    handleSend,
    clearChat,
    suggestedQuestions,
    renderFormattedContent,
  } = usePersonaChat();

  const [inputText, setInputText] = useState('');
  const [showInquiries, setShowInquiries] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevMessagesCountRef = useRef(messages.length);

  // Blinking rule: stop permanently after opening for the first time, never blink if already open
  const shouldBlink = isBlinking && !isWidgetOpen && !hasEverOpened;

  // Ensure scroll is at the top when chat opens
  useEffect(() => {
    if (isWidgetOpen) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      const timer = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isWidgetOpen]);

  // Auto scroll to latest message only when a new message arrives or during loading
  useEffect(() => {
    if (isWidgetOpen) {
      if (messages.length > prevMessagesCountRef.current && prevMessagesCountRef.current > 0) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (loading) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    prevMessagesCountRef.current = messages.length;
  }, [messages, loading, isWidgetOpen]);

  const onSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;
    const text = inputText;
    setInputText('');
    setShowInquiries(false);
    await handleSend(text);
  };

  const handleQuickQuestion = async (qText: string) => {
    if (loading) return;
    setInputText('');
    setShowInquiries(false);
    await handleSend(qText);
  };

  const toggleChat = () => {
    setIsWidgetOpen(!isWidgetOpen);
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Floating Chat Modal Box with smooth spring transition and exit animation */}
      <AnimatePresence mode="wait">
        {isWidgetOpen && (
          <motion.div
            key="ai-floating-chat"
            initial={{ opacity: 0, scale: 0.92, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16, transition: { duration: 0.18, ease: 'easeInOut' } }}
            transition={{
              type: 'spring',
              stiffness: 360,
              damping: 27,
              mass: 0.8
            }}
            className="pointer-events-auto w-[calc(100vw-2.5rem)] sm:w-[380px] md:w-[400px] h-[520px] max-h-[80vh] bg-white border border-border/80 rounded-2xl shadow-xl flex flex-col overflow-hidden mb-3.5 origin-bottom-right"
          >
            {/* Header */}
            <div className="bg-neutral-50/90 px-4 py-3 border-b border-border/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border shrink-0 bg-neutral-200">
                  <img
                    src={avatarUrl}
                    alt={developerName}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('githubusercontent.com')) {
                        target.src = 'https://avatars.githubusercontent.com/u/60103076?v=4';
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-text truncate">
                    {developerName}
                  </div>
                  <div className="text-[11px] text-text-muted">
                    AI Digital Twin
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearChat}
                  className="p-1.5 text-text-muted hover:text-text hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                  title="Reset conversation"
                >
                  <RotateCcw size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsWidgetOpen(false)}
                  className="p-1.5 text-text-muted hover:text-text hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                  title="Minimize chat"
                >
                  <Minimize2 size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsWidgetOpen(false)}
                  className="p-1.5 text-text-muted hover:text-text hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                  title="Close chat"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div ref={scrollContainerRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-white text-xs">
              {messages.map((m, idx) => {
                const isModel = m.role === 'model';
                return (
                  <React.Fragment key={m.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex flex-col ${isModel ? 'items-start' : 'items-end'} space-y-1 w-full`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed break-words ${isModel
                            ? 'bg-neutral-50 text-text border border-border rounded-tl-xs'
                            : 'bg-text text-white rounded-tr-xs shadow-2xs font-normal'
                          }`}
                      >
                        <div className="whitespace-pre-wrap">{renderFormattedContent(m.text)}</div>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono select-none">
                        {m.timestamp}
                      </span>
                    </motion.div>

                    {/* Inquiries Section - associated directly with the welcome greeting at idx 0 */}
                    {idx === 0 && (
                      <div className="pt-1 pb-1 space-y-2">
                        {messages.length > 1 ? (
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => setShowInquiries((prev) => !prev)}
                              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-text-muted hover:text-text px-2.5 py-1 rounded-lg border border-border/80 bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer select-none"
                            >
                              <span>{showInquiries ? 'Hide Inquiries' : 'Suggested Inquiries (8)'}</span>
                              <ChevronDown
                                size={12}
                                className={`transition-transform duration-200 ${showInquiries ? 'rotate-180' : ''}`}
                              />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block">
                            Quick Inquiries
                          </span>
                        )}

                        <AnimatePresence initial={false}>
                          {(messages.length <= 1 || showInquiries) && (
                            <motion.div
                              initial={messages.length > 1 ? { opacity: 0, height: 0 } : false}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {suggestedQuestions.map((sq, sqIdx) => (
                                  <button
                                    key={sqIdx}
                                    type="button"
                                    onClick={() => handleQuickQuestion(sq.text)}
                                    className="text-[11px] px-2.5 py-1 rounded-lg border border-border/80 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300 text-text transition-colors cursor-pointer text-left active:scale-95"
                                  >
                                    {sq.label}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Loader: appears directly below the user's message */}
              {loading && (
                <div className="flex flex-col items-start space-y-1">
                  <div className="bg-neutral-50 text-text border border-border rounded-2xl rounded-tl-xs px-4 py-2.5 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={onSendMessage}
              className="p-3 bg-white border-t border-border flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={loading}
                placeholder="Ask a question about Matan..."
                className="flex-1 bg-neutral-50 border border-border focus:border-text focus:bg-white rounded-xl px-3 py-2 text-xs text-text outline-none transition-all font-sans"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || loading}
                className="p-2 bg-white hover:bg-neutral-50 disabled:bg-neutral-100 text-text disabled:text-neutral-400 border border-border/80 hover:border-neutral-300 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed shrink-0 shadow-2xs active:scale-[0.98]"
                aria-label="Send query"
              >
                <Send size={13} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button with Clear, UX-Friendly Sizing */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onClick={toggleChat}
        className={`pointer-events-auto relative inline-flex items-center justify-center gap-2 h-10 sm:h-10.5 px-4 sm:px-4.5 rounded-full transition-all cursor-pointer bg-white text-text border ${shouldBlink
            ? 'animate-minimal-blink border-neutral-300 font-medium'
            : 'hover:bg-neutral-50 border-border/80 hover:border-neutral-300 shadow-sm hover:shadow-md font-medium'
          }`}
        aria-label="Toggle AI Assistant"
      >
        <motion.div
          animate={
            loading
              ? {
                  scale: [1, 1.08, 1],
                  opacity: [0.7, 1, 0.7],
                }
              : { scale: 1, opacity: 1 }
          }
          transition={
            loading
              ? {
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : { duration: 0.2 }
          }
          className="flex items-center justify-center shrink-0 origin-center bg-transparent"
        >
          <Bot size={15} className="text-text-muted bg-transparent" />
        </motion.div>
        <span className="text-xs sm:text-[13px] font-medium select-none whitespace-nowrap text-text">Ask AI Matan</span>
        {shouldBlink && (
          <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-300 opacity-40" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neutral-400" />
          </span>
        )}
      </motion.button>
    </div>
  );
};
