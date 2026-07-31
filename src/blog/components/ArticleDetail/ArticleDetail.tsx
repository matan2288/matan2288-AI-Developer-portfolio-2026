import React from 'react';
import { ArrowLeft, Tag, ChevronRight } from 'lucide-react';
import { ArticleDetailProps } from './ArticleDetail.types';
import { ArticleHeader } from '../ArticleHeader';
import { ArticleBody } from '../ArticleBody';
import { CommentsSection } from '../CommentsSection';

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  post,
  allPosts,
  onSelectPost,
  onBackToPortfolio
}) => {
  const otherPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <article className="max-w-4xl mx-auto px-6 pt-8 pb-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={() => onSelectPost(null)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-bg-alt hover:bg-neutral-100 text-xs font-mono uppercase tracking-wider text-text transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>All Engineering Articles</span>
        </button>

        <button
          onClick={onBackToPortfolio}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text transition-colors cursor-pointer"
        >
          <span>Back to Portfolio Shell</span>
        </button>
      </div>

      {/* Article Header */}
      <ArticleHeader post={post} />

      {/* Article Main Body */}
      <ArticleBody content={post.content} />

      {/* Tags list */}
      <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono uppercase text-text-muted mr-2 flex items-center gap-1">
          <Tag size={13} />
          Tags:
        </span>
        {post.tags.map((tag) => (
          <span key={tag} className="px-2.5 py-1 rounded-md bg-bg-alt border border-border text-xs font-mono text-text-muted">
            #{tag}
          </span>
        ))}
      </div>

      {/* Comments Section */}
      <CommentsSection postId={post.id} />

      {/* Bottom CTA / Next Articles */}
      <div className="pt-12 border-t border-border mt-12">
        <h3 className="text-lg font-bold uppercase text-text mb-6">
          More Engineering Articles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherPosts.map((nextPost) => (
            <button
              key={nextPost.id}
              onClick={() => onSelectPost(nextPost.id)}
              className="p-4 rounded-xl border border-border bg-bg-alt hover:border-text text-left transition-all group cursor-pointer"
            >
              <span className="text-[10px] font-mono text-accent uppercase font-bold block mb-1">
                {nextPost.category}
              </span>
              <h4 className="text-sm font-bold text-text uppercase group-hover:text-accent transition-colors line-clamp-2">
                {nextPost.title}
              </h4>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-mono text-text-muted group-hover:text-text">
                Read Post <ChevronRight size={13} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
