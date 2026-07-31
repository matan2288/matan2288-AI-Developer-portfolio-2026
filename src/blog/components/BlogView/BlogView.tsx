import React, { useState } from 'react';
import { BLOG_POSTS } from '../../data/posts';
import { BlogViewProps } from './BlogView.types';
import { HeaderBanner } from '../HeaderBanner';
import { SearchAndFilter } from '../SearchAndFilter';
import { BlogList } from '../BlogList';
import { ArticleDetail } from '../ArticleDetail';

export const BlogView: React.FC<BlogViewProps> = ({
  onBackToPortfolio,
  selectedPostId,
  onSelectPost
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(selectedPostId || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activePostId = selectedPostId !== undefined ? selectedPostId : internalSelectedId;

  const handleSelectPost = (id: string | null) => {
    if (onSelectPost) {
      onSelectPost(id);
    } else {
      setInternalSelectedId(id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = ['All', 'Architecture', 'DataLayers & GTM', 'Career & Discipline'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const selectedPost = BLOG_POSTS.find((p) => p.id === activePostId);

  return (
    <div className="min-h-screen bg-white text-text font-sans pb-24">
      {selectedPost ? (
        <ArticleDetail
          post={selectedPost}
          allPosts={BLOG_POSTS}
          onSelectPost={handleSelectPost}
          onBackToPortfolio={onBackToPortfolio}
        />
      ) : (
        <div className="max-w-6xl mx-auto px-6 pt-10">
          <HeaderBanner onBackToPortfolio={onBackToPortfolio} />

          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <BlogList
            posts={filteredPosts}
            onSelectPost={handleSelectPost}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onResetFilters={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BlogView;
