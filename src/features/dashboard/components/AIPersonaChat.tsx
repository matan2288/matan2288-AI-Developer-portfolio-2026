import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithMatanPersona } from '../../../services/api-client';

export const AIPersonaChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    { label: "Tech Stack", text: "What is your core tech stack?" },
    { label: "Experience", text: "What did you build at Amdocs?" },
    { label: "Background", text: "Tell me about your background." }
  ];

  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: "Hi! Ask me anything about my software engineering experience and background.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const reply = await chatWithMatanPersona(messages, textToSend);

      const modelMessage: ChatMessage = {
        id: Math.random().toString(),
        role: 'model',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: 'err-' + Math.random(),
        role: 'model',
        text: "Brief connection issue. Let's talk over email: MaTaN2288@gmail.com.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        return (
          <a key={index} href={`mailto:${part}`} className="text-accent underline hover:text-accent-hover transition-colors font-semibold">
            {part}
          </a>
        );
      } else if (part.match(/^https?:\/\/[^\s]+/)) {
        const url = part.replace(/[.,;:)\]]+$/, '');
        const trailing = part.slice(url.length);
        return (
          <React.Fragment key={index}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent-hover transition-colors font-semibold">
              {url}
            </a>
            {trailing}
          </React.Fragment>
        );
      }
      return part;
    });
  };

  const renderMessageText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const cleanText = part.slice(2, -2);
        return (
          <strong key={index} className="font-bold text-text">
            {formatLinks(cleanText)}
          </strong>
        );
      }
      return <React.Fragment key={index}>{formatLinks(part)}</React.Fragment>;
    });
  };

  return (
    <div className="flex flex-col bg-white border border-border/80 rounded-xl shadow-2xs overflow-hidden">
      {/* Sandbox Header */}
      <div className="bg-neutral-50/70 px-4 py-2.5 border-b border-border/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-text font-bold">
            Interactive Assistant
          </span>
        </div>
        <Sparkles size={12} className="text-text-muted" />
      </div>

      {/* Message Feed */}
      <div ref={containerRef} className="p-3.5 sm:p-5 h-[230px] sm:h-[270px] overflow-y-auto space-y-3.5 sm:space-y-4 bg-white border-b border-border">
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
                <p className="whitespace-pre-wrap break-words">{renderMessageText(m.text)}</p>
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-3 bg-white flex items-center gap-2"
      >
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
