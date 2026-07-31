import React from 'react';
import { BlogCard } from '../BlogCard';
import { BlogListProps } from './BlogList.types';

export const BlogList: React.FC<BlogListProps> = ({
  posts,
  onSelectPost,
  searchQuery,
  selectedCategory,
  onResetFilters
}) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-bg-alt">
        <p className="text-sm font-mono uppercase text-text-muted">
          No articles matching "{searchQuery}" in {selectedCategory}.
        </p>
        <button
          onClick={onResetFilters}
          className="mt-4 px-4 py-2 bg-text text-white rounded-lg text-xs font-mono uppercase tracking-wider font-bold cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} onSelectPost={onSelectPost} />
      ))}
    </div>
  );
};

export default BlogList;
