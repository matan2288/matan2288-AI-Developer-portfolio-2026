import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ExternalLink, RefreshCw, ShieldAlert, Globe, ArrowUpRight } from 'lucide-react';
import { useTinaPortfolio } from '../services/tinaContent';

interface BlogIframeContainerProps {
  onBackToPortfolio: () => void;
}

export const BlogIframeContainer: React.FC<BlogIframeContainerProps> = ({ onBackToPortfolio }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasTimedOut, setHasTimedOut] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const portfolio = useTinaPortfolio();

  const DEFAULT_BLOG_URL = 'https://blog.google/technology/ai/';
  const rawUrl = portfolio.blogUrl?.trim() || DEFAULT_BLOG_URL;
  // Ensure valid HTTPS protocol
  const iframeUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://') 
    ? rawUrl 
    : `https://${rawUrl}`;

  let displayHost = 'blog.google';
  try {
    displayHost = new URL(iframeUrl).hostname;
  } catch {
    displayHost = iframeUrl;
  }

  // Auto-detect iframes that fail or get blocked by X-Frame-Options / SAMEORIGIN
  useEffect(() => {
    setIsLoaded(false);
    setHasTimedOut(false);

    const timer = setTimeout(() => {
      setHasTimedOut(true);
    }, 2800);

    return () => clearTimeout(timer);
  }, [iframeUrl]);

  const handleRefresh = () => {
    setIsLoaded(false);
    setHasTimedOut(false);
    if (iframeRef.current) {
      iframeRef.current.src = iframeUrl;
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col bg-white overflow-hidden">
      {/* Sleek Utility Bar */}
      <div className="h-12 px-4 sm:px-6 bg-white border-b border-border flex items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBackToPortfolio}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-neutral-50 hover:border-neutral-300 text-xs text-text-muted hover:text-text font-medium transition-all cursor-pointer shrink-0 shadow-2xs"
          >
            <ArrowLeft size={13} />
            <span>Back to Portfolio</span>
          </button>

          <span className="text-border text-xs hidden sm:inline">|</span>

          {/* Current Blog URL Destination */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-text-muted truncate max-w-sm">
            <Globe size={13} className="shrink-0 text-text-subtle" />
            <span className="font-mono text-[11px] truncate">{displayHost}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRefresh}
            title="Reload Blog"
            className="p-1.5 rounded-lg border border-border bg-white hover:bg-neutral-50 hover:border-neutral-300 text-text-muted hover:text-text transition-all cursor-pointer shadow-2xs"
          >
            <RefreshCw size={13} className={!isLoaded && !hasTimedOut ? 'animate-spin' : ''} />
          </button>

          <a
            href={iframeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-text text-white hover:bg-neutral-800 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            title="Open blog in new window"
          >
            <span>Open Blog in Tab</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full h-full relative bg-neutral-50 overflow-hidden flex flex-col">
        
        {/* Loading Spinner with early hint */}
        {!isLoaded && !hasTimedOut && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-20 p-6 text-center">
            <div className="w-7 h-7 border-2 border-text border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium text-text">
              Connecting to {displayHost}...
            </p>
            <p className="text-[11px] text-text-muted max-w-xs">
              If the blog does not appear in a moment, click below to open directly in a new tab.
            </p>
            <a
              href={iframeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-text text-white text-xs font-semibold hover:bg-neutral-800 transition-all shadow-2xs"
            >
              <span>Open in New Window</span>
              <ExternalLink size={12} />
            </a>
          </div>
        )}

        {/* Fallback Banner for blocked iframe security policies (X-Frame-Options: SAMEORIGIN) */}
        {hasTimedOut && !isLoaded && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 z-20 text-center animate-fadeIn">
            <div className="max-w-md w-full p-6 sm:p-8 bg-neutral-50 rounded-2xl border border-border shadow-xs text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-border/80 flex items-center justify-center mx-auto shadow-2xs text-text">
                <Globe size={24} />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-text uppercase tracking-tight">
                  External Engineering Blog
                </h3>
                <p className="text-xs text-text-muted leading-relaxed font-mono break-all">
                  {iframeUrl}
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-border/70 text-left text-xs text-text-muted space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-text text-[11px]">
                  <ShieldAlert size={13} className="text-amber-600 shrink-0" />
                  <span>External Host Protection</span>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Major publication platforms (Google, Medium, Substack) restrict direct iframe embedding through browser security headers (<code className="text-[10px] bg-neutral-100 px-1 py-0.5 rounded">X-Frame-Options</code>).
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <a
                  href={iframeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-text text-white hover:bg-neutral-800 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                >
                  <span>Open Blog in New Tab</span>
                  <ExternalLink size={13} />
                </a>

                <button
                  type="button"
                  onClick={onBackToPortfolio}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border bg-white hover:bg-neutral-100 text-xs font-medium text-text-muted hover:text-text transition-colors cursor-pointer"
                >
                  Back to Portfolio
                </button>
              </div>
            </div>
          </div>
        )}

        {/* The Embedded Frame */}
        <iframe
          ref={iframeRef}
          src={iframeUrl}
          title="Engineering Blog"
          className="w-full h-full border-0 block flex-1"
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </div>
  );
};

export default BlogIframeContainer;
