export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  featured?: boolean;
}

export interface CommentItem {
  id: string;
  postId: string;
  authorName: string;
  authorRole?: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
  likes: number;
  userLiked?: boolean;
  parentId?: string | null;
}
