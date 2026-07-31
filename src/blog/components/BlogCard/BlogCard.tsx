import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { BlogCardProps } from './BlogCard.types';

export const BlogCard: React.FC<BlogCardProps> = ({ post, onSelectPost }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="group relative rounded-2xl border border-border bg-white p-6 sm:p-8 hover:border-text transition-all duration-200 flex flex-col justify-between shadow-2xs hover:shadow-sm"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded bg-accent/10 border border-accent/20 text-accent text-[11px] font-mono font-bold uppercase tracking-wider">
            {post.category}
          </span>
          <span className="text-[11px] font-mono text-text-muted flex items-center gap-1">
            <Clock size={12} />
            {post.readTime}
          </span>
        </div>

        <h2 
          onClick={() => onSelectPost(post.id)}
          className="text-xl sm:text-2xl font-bold text-text uppercase tracking-tight group-hover:text-accent transition-colors cursor-pointer leading-snug font-sans"
        >
          {post.title}
        </h2>

        <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3 font-sans">
          {post.excerpt}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            referrerPolicy="no-referrer"
            className="w-6 h-6 rounded-full object-cover border border-border"
          />
          <span className="text-[11px] font-mono text-text-muted">
            {post.date}
          </span>
        </div>

        <button
          onClick={() => onSelectPost(post.id)}
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-text group-hover:text-accent transition-colors cursor-pointer"
        >
          <span>Read Article</span>
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default BlogCard;
