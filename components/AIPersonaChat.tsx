import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, ArrowRight } from 'lucide-react';
import { chatWithMatanPersona } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AIPersonaChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    { label: "Experience & Stack", text: "Tell me about your tech stack and experience." },
    { label: "Core Projects", text: "What are your core projects?" },
    { label: "Contract Status", text: "Are you open to contract or full-time roles?" },
    { label: "Engineering Ethic", text: "How does powerlifting translate to your code?" }
  ];

  // Auto-initialize on page load via useEffect
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: "Hi, I am Matan's portfolio assistant. Ask me about Matan's projects, stack (Vue 3, React, PHP, GTM/GA4), or how to get in touch! I will keep my answers brief.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      const mappedHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const reply = await chatWithMatanPersona(mappedHistory);

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

  return (
    <div className="w-full mt-4 border border-border rounded-xl bg-surface overflow-hidden text-left shadow-[0_1px_6px_rgba(0,0,0,0.03)] selection:bg-accent-soft">
      {/* Header Info */}
      <div className="border-b border-border bg-bg-alt px-5 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-pulse"></span>
          <span className="font-mono text-[10px] tracking-wider text-text uppercase font-bold">
            Portfolio Assistant
          </span>
        </div>
        <span className="font-mono text-[9px] text-text-muted">Active</span>
      </div>

      {/* Message Feed */}
      <div className="p-5 h-[270px] overflow-y-auto space-y-4 bg-white border-b border-border">
        {messages.map((m) => {
          const isModel = m.role === 'model';
          return (
            <div key={m.id} className={`flex ${isModel ? 'justify-start' : 'justify-end'}`}>
              <div 
                className={`max-w-[85%] rounded-lg px-4 py-3 border ${
                  isModel 
                    ? 'bg-bg-alt border-border text-text rounded-bl-none' 
                    : 'bg-accent-soft border-border text-text rounded-br-none'
                }`}
              >
                <p className="text-xs font-sans leading-relaxed whitespace-pre-line">{m.text}</p>
                <div 
                  className={`text-[8px] mt-1.5 font-mono ${
                    isModel ? 'text-text-muted' : 'text-accent'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-bg-alt border border-border rounded-lg rounded-bl-none px-4 py-3 flex items-center gap-2">
              <Loader2 className="animate-spin text-accent" size={12} />
              <span className="text-[10px] font-mono text-text-muted">Formulating concise reply...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested Questions Quick Grid */}
      <div className="p-3 bg-bg-alt border-b border-border grid grid-cols-2 gap-2">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q.text)}
            disabled={loading}
            className="text-left py-2 px-3 rounded border border-border bg-white hover:border-accent hover:text-accent hover:shadow-xs transition-all font-mono tracking-tight flex items-center justify-between cursor-pointer outline-none text-[10px]"
          >
            <span className="truncate pr-1">{q.label}</span>
            <ArrowRight size={10} className="text-text-subtle shrink-0 group-hover:text-accent" />
          </button>
        ))}
      </div>

      {/* Input Row */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
        className="p-3 bg-white flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about checkout projects, GA4 tracking..."
          className="flex-grow bg-white border border-border rounded px-3 py-2 text-xs text-text placeholder-text-subtle outline-none focus:border-accent font-mono transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded bg-accent text-white px-3.5 py-2 hover:bg-accent-hover transition-colors disabled:opacity-35 flex items-center justify-center cursor-pointer outline-none font-mono text-xs shadow-xs"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
        </button>
      </form>
    </div>
  );
};
