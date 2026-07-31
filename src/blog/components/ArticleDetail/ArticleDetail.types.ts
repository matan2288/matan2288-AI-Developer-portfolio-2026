import { BlogPost } from '../../types';

export interface ArticleDetailProps {
  post: BlogPost;
  allPosts: BlogPost[];
  onSelectPost: (id: string | null) => void;
  onBackToPortfolio: () => void;
}
