import { BlogPost } from '../../types';

export interface BlogListProps {
  posts: BlogPost[];
  onSelectPost: (id: string) => void;
  searchQuery: string;
  selectedCategory: string;
  onResetFilters: () => void;
}
