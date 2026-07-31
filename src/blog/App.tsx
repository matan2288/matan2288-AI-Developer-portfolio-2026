import React, { useState, useEffect } from 'react';
import { BlogView } from './components/BlogView';

export const BlogApp: React.FC = () => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    const sendHeight = () => {
      if (window.parent && window.parent !== window) {
        const height = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          600
        );
        window.parent.postMessage({ type: 'BLOG_IFRAME_RESIZE', height }, '*');
      }
    };

    sendHeight();
    const observer = new ResizeObserver(() => sendHeight());
    observer.observe(document.body);

    window.addEventListener('resize', sendHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', sendHeight);
    };
  }, [selectedPostId]);

  const handleBackToPortfolio = () => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'NAVIGATE_TO_PORTFOLIO' }, '*');
    }
  };

  return (
    <div className="min-h-screen bg-white text-text font-sans antialiased">
      {/* Embedded Sub-App Banner Badge */}
      <div className="bg-neutral-900 text-white text-[11px] font-mono px-4 py-1.5 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-wider uppercase">Standalone Blog App (`/src/blog/App.tsx`)</span>
        </div>
        <button
          onClick={handleBackToPortfolio}
          className="text-neutral-300 hover:text-white uppercase tracking-wider underline cursor-pointer text-[10px]"
        >
          Return to Shell Portfolio
        </button>
      </div>

      <BlogView
        onBackToPortfolio={handleBackToPortfolio}
        selectedPostId={selectedPostId}
        onSelectPost={setSelectedPostId}
      />
    </div>
  );
};

export default BlogApp;
