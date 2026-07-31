import React, { useState } from 'react';
import { ArrowLeft, Search, Clock, Tag, Share2, Check, BookOpen, User, Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BLOG_POSTS } from './posts';
import { BlogPost } from './types';
import { CommentsSection } from './CommentsSection';

interface BlogViewProps {
  onBackToPortfolio: () => void;
  selectedPostId?: string | null;
  onSelectPost?: (postId: string | null) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({
  onBackToPortfolio,
  selectedPostId: externalSelectedPostId,
  onSelectPost: externalOnSelectPost
}) => {
  const [internalSelectedPostId, setInternalSelectedPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copied, setCopied] = useState(false);

  const activePostId = externalSelectedPostId !== undefined ? externalSelectedPostId : internalSelectedPostId;

  const handleSelectPost = (id: string | null) => {
    if (externalOnSelectPost) {
      externalOnSelectPost(id);
    } else {
      setInternalSelectedPostId(id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = ['All', 'Architecture', 'DataLayers & GTM', 'Career & Discipline'];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const selectedPost = BLOG_POSTS.find(p => p.id === activePostId);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-white text-text font-sans py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        
        {/* Navigation Breadcrumb / Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <button
              onClick={activePostId ? () => handleSelectPost(null) : onBackToPortfolio}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-border bg-bg-alt text-xs font-mono uppercase tracking-wider text-text-muted hover:text-text hover:border-text transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{activePostId ? 'Back to All Articles' : 'Back to Portfolio'}</span>
            </button>
            <span className="text-border">/</span>
            <span className="text-xs font-mono uppercase tracking-wider text-text font-bold flex items-center gap-1.5">
              <BookOpen size={13} className="text-accent" />
              <span>Engineering Journal</span>
            </span>
          </div>

          {activePostId && (
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-mono text-text-muted hover:text-text hover:bg-neutral-50 transition-colors"
            >
              {copied ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
              <span>{copied ? 'Link Copied' : 'Share Article'}</span>
            </button>
          )}
        </div>

        {/* POST DETAIL VIEW */}
        <AnimatePresence mode="wait">
          {selectedPost ? (
            <motion.article
              key={selectedPost.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Category & Date */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-text-muted">
                  <span className="px-2.5 py-1 rounded bg-accent/10 text-accent font-bold uppercase tracking-wider">
                    {selectedPost.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {selectedPost.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {selectedPost.readTime}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text leading-tight uppercase font-sans">
                  {selectedPost.title}
                </h1>

                <p className="text-base sm:text-lg text-text-muted leading-relaxed font-normal pt-2">
                  {selectedPost.excerpt}
                </p>
              </div>

              {/* Author Box */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-bg-alt">
                <img
                  src={selectedPost.author.avatar}
                  alt={selectedPost.author.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-border"
                />
                <div>
                  <h4 className="text-sm font-bold text-text uppercase">
                    {selectedPost.author.name}
                  </h4>
                  <p className="text-xs text-text-muted font-mono">
                    {selectedPost.author.role}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedPost.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded text-[11px] font-mono text-text bg-white border border-border">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Article Main Body */}
              <div className="space-y-6 pt-6 border-t border-border text-sm sm:text-base leading-relaxed text-[#374151]">
                {selectedPost.content.map((paragraph, index) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-xl sm:text-2xl font-bold uppercase text-text tracking-tight pt-4">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('```')) {
                    const code = paragraph.replace(/```[a-z]*\n?/g, '').replace(/```$/, '');
                    return (
                      <pre key={index} className="p-4 bg-neutral-900 text-neutral-100 rounded-xl overflow-x-auto font-mono text-xs leading-relaxed border border-neutral-800">
                        <code>{code}</code>
                      </pre>
                    );
                  }
                  if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ')) {
                    return (
                      <p key={index} className="pl-4 border-l-2 border-accent text-text font-medium text-sm sm:text-base">
                        {paragraph}
                      </p>
                    );
                  }
                  return (
                    <p key={index} className="leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Comments Infrastructure */}
              <CommentsSection postId={selectedPost.id} />

              {/* Bottom CTA / Next Articles */}
              <div className="pt-12 border-t border-border mt-12">
                <h3 className="text-lg font-bold uppercase text-text mb-6">
                  More Technical Articles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {BLOG_POSTS.filter(p => p.id !== selectedPost.id).slice(0, 2).map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectPost(item.id)}
                      className="p-5 rounded-xl border border-border bg-white hover:border-text hover:shadow-xs transition-all cursor-pointer group"
                    >
                      <span className="text-[10px] font-mono text-accent uppercase font-bold block mb-1">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-bold text-text uppercase group-hover:text-accent transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-text-muted mt-3">
                        <span>Read Article</span>
                        <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ) : (
            /* POST LIST VIEW */
            <motion.div
              key="post-list"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-10"
            >
              {/* Header section */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-[11px] uppercase tracking-wider">
                  <Sparkles size={13} />
                  <span>Engineering, Telecom Buyflows &amp; Architecture</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text uppercase font-sans">
                  Technical <span className="text-text-muted">Articles</span>
                </h1>
                <p className="text-sm sm:text-base text-text-muted max-w-2xl leading-relaxed">
                  Insights on scaling enterprise web applications, building type-safe telemetry dataLayers, optimizing checkout state machines, and engineering discipline.
                </p>
              </div>

              {/* Search & Category Filter Toolbar */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
                  
                  {/* Category Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                          selectedCategory === cat
                            ? 'bg-text text-white font-bold shadow-xs'
                            : 'bg-bg-alt border border-border text-text-muted hover:text-text'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Search input */}
                  <div className="relative w-full sm:w-64 shrink-0">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Search articles or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 text-xs font-mono bg-bg-alt border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-text transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Posts Grid */}
              <div className="grid grid-cols-1 gap-6 pt-4">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map(post => (
                    <article
                      key={post.id}
                      onClick={() => handleSelectPost(post.id)}
                      className="group p-6 sm:p-8 rounded-2xl border border-border bg-white hover:border-text hover:shadow-sm transition-all duration-200 cursor-pointer relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-accent/10 text-accent font-bold">
                            {post.category}
                          </span>
                          {post.featured && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-neutral-900 text-white font-bold">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs font-mono text-text-muted">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold uppercase text-text group-hover:text-accent transition-colors leading-tight mb-3">
                        {post.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-6 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/60">
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono text-text-muted bg-bg-alt border border-border">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <span className="inline-flex items-center gap-1 text-xs font-mono uppercase font-bold text-text group-hover:text-accent group-hover:translate-x-1 transition-all">
                          Read Article <ChevronRight size={14} />
                        </span>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-bg-alt space-y-2">
                    <p className="text-sm font-bold uppercase text-text">No articles found matching "{searchQuery}"</p>
                    <p className="text-xs text-text-muted">Try adjusting your filter or search criteria.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
