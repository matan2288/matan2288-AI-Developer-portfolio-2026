import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { ArticleHeaderProps } from './ArticleHeader.types';

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({ post }) => {
  return (
    <div className="space-y-4 mb-10 pb-8 border-b border-border">
      <div className="flex flex-wrap items-center gap-2">
        <span className="px-2.5 py-1 rounded bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold uppercase tracking-wider">
          {post.category}
        </span>
        <span className="text-text-muted text-xs font-mono">•</span>
        <span className="text-xs font-mono text-text-muted flex items-center gap-1">
          <Calendar size={13} />
          {post.date}
        </span>
        <span className="text-text-muted text-xs font-mono">•</span>
        <span className="text-xs font-mono text-text-muted flex items-center gap-1">
          <Clock size={13} />
          {post.readTime}
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text leading-tight uppercase font-sans">
        {post.title}
      </h1>

      <p className="text-base sm:text-lg text-text-muted leading-relaxed font-sans">
        {post.excerpt}
      </p>

      {/* Author Byline */}
      <div className="flex items-center gap-3 pt-4">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          referrerPolicy="no-referrer"
          className="w-10 h-10 rounded-full object-cover border border-border"
        />
        <div>
          <span className="block text-xs font-bold text-text uppercase">
            {post.author.name}
          </span>
          <span className="block text-[11px] text-text-muted font-mono">
            {post.author.role}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArticleHeader;
