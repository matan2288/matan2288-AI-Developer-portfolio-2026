import { BlogPost } from '../../types';

export interface BlogCardProps {
  post: BlogPost;
  onSelectPost: (id: string) => void;
}
