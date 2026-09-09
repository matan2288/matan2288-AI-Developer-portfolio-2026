import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, RotateCcw } from 'lucide-react';
import { usePersonaChat } from '../context/PersonaChatContext';

export const AIPersonaChat: React.FC = () => {
  const {
    messages,
    loading,
    handleSend,
    clearChat,
    suggestedQuestions,
    renderFormattedContent,
  } = usePersonaChat();

  const [input, setInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, loading]);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input;
    setInput('');
    await handleSend(text);
  };

  return (
    <div className="flex flex-col bg-white border border-border/80 rounded-2xl shadow-2xs overflow-hidden">
      {/* Sandbox Header */}
      <div className="bg-neutral-50/70 px-4 py-2.5 border-b border-border/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-text font-bold">
            Interactive Assistant Twin
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={clearChat}
            className="p-1 text-text-muted hover:text-text rounded transition-colors cursor-pointer"
            title="Reset Chat"
          >
            <RotateCcw size={12} />
          </button>
          <Sparkles size={12} className="text-text-muted" />
        </div>
      </div>

      {/* Message Feed */}
      <div
        ref={containerRef}
        className="p-3.5 sm:p-5 h-[230px] sm:h-[270px] overflow-y-auto space-y-3.5 sm:space-y-4 bg-white border-b border-border"
      >
        {messages.map((m) => {
          const isModel = m.role === 'model';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isModel ? 'items-start' : 'items-end'} space-y-1 w-full`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-3.5 sm:px-4 py-2.5 text-xs leading-relaxed break-words ${
                  isModel
                    ? 'bg-neutral-50/80 text-text border border-border/80 rounded-tl-none'
                    : 'bg-white text-text border border-border/80 rounded-tr-none shadow-2xs font-medium'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">
                  {renderFormattedContent(m.text)}
                </div>
              </div>
              <span className="text-[10px] text-text-subtle px-1 font-medium">
                {m.timestamp}
              </span>
            </div>
          );
        })}
        {loading && (
          <div className="flex flex-col items-start space-y-1">
            <div className="bg-neutral-50/80 text-text border border-border/80 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions Quick Grid */}
      <div className="p-2.5 sm:p-3 bg-neutral-50/50 border-b border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q.text)}
            disabled={loading}
            className="text-left px-2.5 py-1.5 bg-white border border-border/80 hover:border-neutral-300 hover:bg-neutral-50 rounded-lg text-[10px] sm:text-[11px] text-text-muted hover:text-text font-medium leading-tight transition-all cursor-pointer truncate shadow-2xs disabled:opacity-50"
            title={q.text}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={onFormSubmit} className="p-3 bg-white flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="Ask a question..."
          className="flex-1 bg-white border border-border/80 rounded-lg px-3.5 py-2 text-xs text-text outline-none focus:border-neutral-400 transition-all font-sans disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2 bg-white hover:bg-neutral-50 text-text border border-border/80 hover:border-neutral-300 rounded-lg transition-all cursor-pointer disabled:opacity-40 shadow-2xs"
          aria-label="Send message"
        >
          <Send size={13} className="text-text-muted" />
        </button>
      </form>
    </div>
  );
};
