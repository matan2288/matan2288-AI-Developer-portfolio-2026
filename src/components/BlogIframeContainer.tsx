import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ExternalLink, RefreshCw, Layers, CheckCircle2, Monitor } from 'lucide-react';

interface BlogIframeContainerProps {
  onBackToPortfolio: () => void;
}

export const BlogIframeContainer: React.FC<BlogIframeContainerProps> = ({ onBackToPortfolio }) => {
  const [iframeHeight, setIframeHeight] = useState<number>(900);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      if (event.data.type === 'NAVIGATE_TO_PORTFOLIO') {
        onBackToPortfolio();
      }

      if (event.data.type === 'BLOG_IFRAME_RESIZE' && typeof event.data.height === 'number') {
        setIframeHeight(Math.max(event.data.height, 700));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onBackToPortfolio]);

  const handleRefresh = () => {
    setIsLoaded(false);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const iframeUrl = `${window.location.origin}${window.location.pathname}?app=blog`;

  return (
    <div className="min-h-screen bg-bg-alt pt-6 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Shell Toolbar for iFrame Embedded Blog */}
        <div className="bg-white rounded-xl border border-border p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPortfolio}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-border bg-bg-alt text-xs font-mono uppercase tracking-wider text-text hover:text-accent hover:border-text transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Portfolio Shell</span>
            </button>
            <span className="text-border">|</span>
            <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
              <Layers size={14} className="text-accent" />
              <span className="font-bold text-text uppercase">Micro-Frontend Mode:</span>
              <span className="hidden sm:inline px-2 py-0.5 rounded bg-neutral-100 text-[11px] font-mono text-neutral-700 border border-neutral-200">
                src/BlogApp.tsx
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              title="Reload iFrame App"
              className="p-2 rounded-lg border border-border text-text-muted hover:text-text hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className={!isLoaded ? 'animate-spin' : ''} />
            </button>
            <a
              href={iframeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-mono text-text-muted hover:text-text hover:bg-neutral-50 transition-colors"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">Open App in New Tab</span>
            </a>
          </div>
        </div>

        {/* Informational Subheader */}
        <div className="mb-4 px-2 flex items-center justify-between text-xs font-mono text-text-muted">
          <span className="flex items-center gap-1.5">
            <Monitor size={13} className="text-accent" />
            <span>Rendering inside React TSX iFrame Shell (`?app=blog`)</span>
          </span>
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <CheckCircle2 size={13} /> Encapsulated Application Sandbox
          </span>
        </div>

        {/* iFrame Container Card */}
        <div className="relative rounded-2xl border border-border bg-white shadow-md overflow-hidden transition-all">
          {!isLoaded && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-10 min-h-[400px]">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono uppercase tracking-wider text-text-muted">
                Initializing Blog TSX App inside iFrame...
              </p>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={iframeUrl}
            title="Matan Elmaliah Engineering Blog"
            className="w-full border-0 transition-all duration-300 block"
            style={{ height: `${iframeHeight}px` }}
            onLoad={() => setIsLoaded(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogIframeContainer;
