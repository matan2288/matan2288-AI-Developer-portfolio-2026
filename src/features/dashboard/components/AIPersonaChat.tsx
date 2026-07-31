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
    { label: "Experience & Stack", text: "Tell me about your tech stack and experience." },
    { label: "Checkout Redesigns", text: "How did you optimize Altice and 3UK checkout flows?" },
    { label: "GTM / Analytics", text: "How do you automate GA4 dataLayers and tracking?" },
    { label: "Powerlifter Discipline", text: "How does powerlifting relate to your software development?" }
  ];

  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: "Hey! I'm Matan's digital double. Ask me anything about my software development career, e-commerce checkout projects, GTM tracking, or navy tech background!",
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
          <a key={index} href={`mailto:${part}`} className="text-accent underline hover:text-accent-hover transition-colors font-mono font-semibold">
            {part}
          </a>
        );
      } else if (part.match(/^https?:\/\/[^\s]+/)) {
        const url = part.replace(/[.,;:)\]]+$/, '');
        const trailing = part.slice(url.length);
        return (
          <React.Fragment key={index}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent-hover transition-colors font-mono font-semibold">
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
    <div className="flex flex-col bg-white border border-border rounded-xl shadow-2xs overflow-hidden">
      {/* Sandbox Header */}
      <div className="bg-bg-alt px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neutral-900 animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-text font-bold">
            Matan Gemini Digital Double
          </span>
        </div>
        <Sparkles size={12} className="text-text-muted" />
      </div>

      {/* Message Feed */}
      <div ref={containerRef} className="p-5 h-[270px] overflow-y-auto space-y-4 bg-white border-b border-border">
        {messages.map((m) => {
          const isModel = m.role === 'model';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isModel ? 'items-start' : 'items-end'} space-y-1`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                  isModel
                    ? 'bg-bg-alt text-text border border-border rounded-tl-none'
                    : 'bg-accent text-white rounded-tr-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{renderMessageText(m.text)}</p>
              </div>
              <span className="font-mono text-[9px] text-text-subtle px-1">
                {m.timestamp}
              </span>
            </div>
          );
        })}
        {loading && (
          <div className="flex flex-col items-start space-y-1">
            <div className="bg-bg-alt text-text border border-border rounded-2xl rounded-tl-none px-4 py-2.5 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-text rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-text rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-text rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions Quick Grid */}
      <div className="p-3 bg-bg-alt border-b border-border grid grid-cols-2 gap-2">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q.text)}
            disabled={loading}
            className="text-left px-2.5 py-1.5 bg-white border border-border hover:border-text rounded-lg text-[10px] text-text-muted hover:text-text font-medium leading-normal transition-all cursor-pointer truncate disabled:opacity-50"
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
          placeholder="Type a message to Matan's clone..."
          className="flex-1 bg-bg-alt border border-border rounded-lg px-3.5 py-2 text-xs text-text outline-none focus:border-accent focus:bg-white transition-all font-sans disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors cursor-pointer disabled:opacity-40"
          aria-label="Send message"
        >
          <Send size={13} />
        </button>
      </form>
    </div>
  );
};
