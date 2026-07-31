import React from 'react';
import { Search } from 'lucide-react';
import { SearchAndFilterProps } from './SearchAndFilter.types';

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
      {/* Search Input */}
      <div className="md:col-span-5 relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search articles or tags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-bg-alt border border-border rounded-lg text-xs font-mono text-text placeholder:text-text-muted focus:outline-none focus:border-text transition-colors"
        />
      </div>

      {/* Category Filter Tabs */}
      <div className="md:col-span-7 flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-text-muted uppercase mr-1 hidden sm:inline">
          Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-text text-white font-bold shadow-2xs'
                : 'bg-bg-alt border border-border text-text-muted hover:text-text hover:border-text'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFilter;
