import { CommentItem } from '../../types';

export interface CommentsSectionProps {
  postId: string;
}

export interface CommentFormProps {
  authorName: string;
  setAuthorName: (val: string) => void;
  authorRole: string;
  setAuthorRole: (val: string) => void;
  newCommentText: string;
  setNewCommentText: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submittedToast: boolean;
}

export interface CommentItemViewProps {
  comment: CommentItem;
  replies: CommentItem[];
  onLike: (id: string) => void;
  isReplying: boolean;
  onToggleReply: (id: string | null) => void;
  authorName: string;
  setAuthorName: (val: string) => void;
  replyText: string;
  setReplyText: (val: string) => void;
  onSubmitReply: (parentId: string) => void;
}
