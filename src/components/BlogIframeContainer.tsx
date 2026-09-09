import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { useTinaPortfolio } from '../services/tinaContent';

interface BlogIframeContainerProps {
  onBackToPortfolio: () => void;
}

export const BlogIframeContainer: React.FC<BlogIframeContainerProps> = ({ onBackToPortfolio }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const portfolio = useTinaPortfolio();

  const DEFAULT_BLOG_URL = 'https://ai.google/blog/';
  const iframeUrl = portfolio.blogUrl?.trim() || DEFAULT_BLOG_URL;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      if (event.data.type === 'NAVIGATE_TO_PORTFOLIO') {
        onBackToPortfolio();
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

  return (
    <div className="flex-1 w-full flex flex-col bg-white overflow-hidden">
      {/* Slim, Minimalist Utility Bar below Navbar */}
      <div className="h-11 px-4 sm:px-6 bg-white border-b border-border/80 flex items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBackToPortfolio}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border/80 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-xs text-text-muted hover:text-text font-medium transition-all cursor-pointer shrink-0 shadow-2xs"
          >
            <ArrowLeft size={13} />
            <span>Back to Portfolio</span>
          </button>

          <span className="text-border/80 text-xs">|</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={handleRefresh}
            title="Reload Blog"
            className="p-1.5 rounded-lg border border-border/80 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-text-muted hover:text-text transition-all cursor-pointer shadow-2xs"
          >
            <RefreshCw size={12} className={!isLoaded ? 'animate-spin' : ''} />
          </button>

          <a
            href={iframeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/80 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-xs text-text-muted hover:text-text transition-all font-medium shadow-2xs"
            title="Open blog in new window"
          >
            <ExternalLink size={12} />
            <span className="hidden sm:inline">Open in Tab</span>
          </a>
        </div>
      </div>

      {/* Full-Spread iFrame spreading across the screen */}
      <div className="flex-1 w-full h-full relative bg-neutral-50 overflow-hidden">
        {!isLoaded && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-10">
            <div className="w-6 h-6 border-2 border-text border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-text-muted font-medium">
              Loading Blog...
            </p>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={iframeUrl}
          title="Engineering Blog"
          className="w-full h-full border-0 block"
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </div>
  );
};

export default BlogIframeContainer;
