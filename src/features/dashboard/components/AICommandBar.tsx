import React, { useState, useRef } from 'react';
import { Sparkles, ArrowRight, X, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePersonaChat } from '../context/PersonaChatContext';

export const AICommandBar: React.FC = () => {
  const {
    loading,
    lastQuestion,
    lastAnswer,
    handleSend,
    renderFormattedContent,
    clearChat,
  } = usePersonaChat();

  const [inputQuery, setInputQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [showResponse, setShowResponse] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || loading) return;
    const query = inputQuery;
    setInputQuery('');
    setShowResponse(true);
    await handleSend(query);
  };

  const handleCopy = () => {
    if (!lastAnswer) return;
    navigator.clipboard.writeText(lastAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-3">
      {/* Clean, Understated Command Bar */}
      <form
        onSubmit={onSubmit}
        className="relative flex items-center bg-white border border-border hover:border-neutral-400 focus-within:border-text rounded-xl p-1.5 shadow-2xs transition-colors"
      >
        <div className="pl-3 pr-2 text-text-muted shrink-0 select-none flex items-center">
          <Sparkles size={16} className="text-text-muted" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          disabled={loading}
          placeholder="Ask anything about Matan's experience, stack, or projects..."
          className="w-full bg-transparent px-1 py-1.5 text-sm text-text placeholder:text-text-muted/70 focus:outline-none font-sans"
        />

        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-neutral-50 disabled:bg-neutral-100 text-text disabled:text-neutral-400 border border-border/80 hover:border-neutral-300 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:cursor-not-allowed shrink-0 shadow-2xs active:scale-[0.98]"
        >
          <span>{loading ? 'Thinking...' : 'Ask'}</span>
          {!loading && <ArrowRight size={12} />}
        </button>
      </form>

      {/* Response Box with smooth height glide and balanced whitespace */}
      <AnimatePresence initial={false}>
        {(lastAnswer || loading) && showResponse && (
          <motion.div
            key="ai-command-response"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-border/90 bg-neutral-50/60 p-3.5 sm:p-4 text-xs sm:text-[13px]">
              <div className="flex items-center justify-between pb-2 border-b border-border/70 gap-2">
                <span className="text-[11px] font-medium text-text-muted truncate">
                  {lastQuestion ? `"${lastQuestion}"` : 'AI Response'}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  {lastAnswer && !loading && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="p-1 rounded text-text-muted hover:text-text hover:bg-neutral-200/50 transition-colors cursor-pointer"
                      title="Copy response"
                    >
                      {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowResponse(false)}
                    className="p-1 rounded text-text-muted hover:text-text hover:bg-neutral-200/50 transition-colors cursor-pointer"
                    title="Dismiss"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              <div className="pt-2.5 text-text leading-relaxed">
                {loading ? (
                  <div className="flex items-center gap-2 py-0.5 text-text-muted text-xs">
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse" />
                    <span>Thinking...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="whitespace-pre-wrap">{renderFormattedContent(lastAnswer || '')}</div>
                    <div className="flex items-center justify-end pt-0.5">
                      <button
                        type="button"
                        onClick={clearChat}
                        className="text-[11px] text-text-muted hover:text-text underline cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
