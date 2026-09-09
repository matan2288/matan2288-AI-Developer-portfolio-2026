import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ChatMessage } from '../types';
import { chatWithMatanPersona } from '../../../services/api-client';

export interface SuggestedQuestion {
  label: string;
  text: string;
}

export const DEFAULT_SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { label: "Tech Stack", text: "What is your core tech stack and strongest skills?" },
  { label: "Amdocs Scale", text: "What high-impact systems did you build at Amdocs?" },
  { label: "Engineering Vibe", text: "Tell me about your background and engineering philosophy." },
  { label: "Availability", text: "Are you available for hybrid or remote software developer roles?" },
];

interface PersonaChatContextType {
  messages: ChatMessage[];
  loading: boolean;
  lastQuestion: string | null;
  lastAnswer: string | null;
  isWidgetOpen: boolean;
  setIsWidgetOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isBlinking: boolean;
  setIsBlinking: (blinking: boolean) => void;
  hasEverOpened: boolean;
  toggleWidget: () => void;
  handleSend: (text: string) => Promise<string | null>;
  clearChat: () => void;
  suggestedQuestions: SuggestedQuestion[];
  renderFormattedContent: (text: string) => React.ReactNode;
}

const PersonaChatContext = createContext<PersonaChatContextType | undefined>(undefined);

export const PersonaChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const [lastAnswer, setLastAnswer] = useState<string | null>(null);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  
  // Track whether the user has ever opened the AI assistant
  const [hasEverOpened, setHasEverOpened] = useState<boolean>(false);

  // Minimalist blinking starts OFF by default. It activates only after the first response from section 1 inline chat
  const [isBlinking, setIsBlinking] = useState<boolean>(false);

  // Helper to mark opened and permanently disable blinking
  const markAsOpened = useCallback(() => {
    setHasEverOpened(true);
    setIsBlinking(false);
    try {
      sessionStorage.removeItem('ai_matan_opened_once');
    } catch {}
  }, []);

  const handleSetIsWidgetOpen = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    setIsWidgetOpen((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      if (next) {
        markAsOpened();
      }
      return next;
    });
  }, [markAsOpened]);

  const toggleWidget = useCallback(() => {
    setIsWidgetOpen((prev) => {
      const next = !prev;
      if (next) {
        markAsOpened();
      }
      return next;
    });
  }, [markAsOpened]);

  useEffect(() => {
    // Initial welcome greeting
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: "Hi, I'm Matan's interactive digital twin! Ask me anything about my frontend & fullstack engineering work, telecom checkouts, or technical architecture.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, []);

  const handleSend = useCallback(async (textToSend: string): Promise<string | null> => {
    if (!textToSend.trim() || loading) return null;

    const trimmed = textToSend.trim();
    setLastQuestion(trimmed);

    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const reply = await chatWithMatanPersona(messages, trimmed);
      const modelMessage: ChatMessage = {
        id: Math.random().toString(),
        role: 'model',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMessage]);
      setLastAnswer(reply);
      
      // Stop blinking if already open or if ever opened before
      if (!hasEverOpened && !isWidgetOpen) {
        setIsBlinking(true);
      } else {
        setIsBlinking(false);
      }
      return reply;
    } catch (err) {
      const fallback = "Brief connection issue. Feel free to email me directly at MaTaN2288@gmail.com or connect via LinkedIn!";
      const errorMessage: ChatMessage = {
        id: 'err-' + Math.random(),
        role: 'model',
        text: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setLastAnswer(fallback);
      if (!hasEverOpened && !isWidgetOpen) {
        setIsBlinking(true);
      } else {
        setIsBlinking(false);
      }
      return fallback;
    } finally {
      setLoading(false);
    }
  }, [loading, messages, hasEverOpened, isWidgetOpen]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        role: 'model',
        text: "Hi, I'm Matan's interactive digital twin! Ask me anything about my frontend & fullstack engineering work, telecom checkouts, or technical architecture.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setLastQuestion(null);
    setLastAnswer(null);
  }, []);

  // Text formatter for bold text and clickable URLs / emails
  const renderFormattedContent = useCallback((text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

    const formatLinks = (subText: string) => {
      const parts = subText.split(urlRegex);
      return parts.map((part, index) => {
        if (part.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
          return (
            <a
              key={index}
              href={`mailto:${part}`}
              className="text-text font-semibold underline hover:text-text-muted transition-colors inline-block"
            >
              {part}
            </a>
          );
        } else if (part.match(/^https?:\/\/[^\s]+/)) {
          const url = part.replace(/[.,;:)\]]+$/, '');
          const trailing = part.slice(url.length);
          return (
            <React.Fragment key={index}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text font-semibold underline hover:text-text-muted transition-colors inline-block"
              >
                {url}
              </a>
              {trailing}
            </React.Fragment>
          );
        }
        return part;
      });
    };

    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const clean = part.slice(2, -2);
        return (
          <strong key={index} className="font-bold text-text">
            {formatLinks(clean)}
          </strong>
        );
      }
      return <React.Fragment key={index}>{formatLinks(part)}</React.Fragment>;
    });
  }, []);

  return (
    <PersonaChatContext.Provider
      value={{
        messages,
        loading,
        lastQuestion,
        lastAnswer,
        isWidgetOpen,
        setIsWidgetOpen: handleSetIsWidgetOpen,
        isBlinking,
        setIsBlinking,
        hasEverOpened,
        toggleWidget,
        handleSend,
        clearChat,
        suggestedQuestions: DEFAULT_SUGGESTED_QUESTIONS,
        renderFormattedContent,
      }}
    >
      {children}
    </PersonaChatContext.Provider>
  );
};

export const usePersonaChat = () => {
  const context = useContext(PersonaChatContext);
  if (!context) {
    return {
      messages: [],
      loading: false,
      lastQuestion: null,
      lastAnswer: null,
      isWidgetOpen: false,
      setIsWidgetOpen: () => {},
      isBlinking: false,
      setIsBlinking: () => {},
      toggleWidget: () => {},
      handleSend: async () => null,
      clearChat: () => {},
      suggestedQuestions: DEFAULT_SUGGESTED_QUESTIONS,
      renderFormattedContent: (text: string) => text,
    };
  }
  return context;
};
