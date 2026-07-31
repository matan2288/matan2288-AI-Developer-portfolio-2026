import React, { useState, useEffect } from 'react';
import { MessageSquare, Filter } from 'lucide-react';
import { CommentItem } from '../../types';
import { INITIAL_COMMENTS } from '../../data/defaultComments';
import { CommentsSectionProps } from './CommentsSection.types';
import { CommentForm } from './CommentForm';
import { CommentItemView } from './CommentItemView';

export const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'top'>('top');
  const [submittedToast, setSubmittedToast] = useState(false);

  useEffect(() => {
    const storageKey = `matan_blog_comments_${postId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setComments(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cached comments', e);
        setComments(INITIAL_COMMENTS[postId] || []);
      }
    } else {
      setComments(INITIAL_COMMENTS[postId] || []);
    }
  }, [postId]);

  const saveComments = (updated: CommentItem[]) => {
    setComments(updated);
    const storageKey = `matan_blog_comments_${postId}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleLike = (commentId: string) => {
    const updated = comments.map(c => {
      if (c.id === commentId) {
        const isLiked = !c.userLiked;
        return {
          ...c,
          userLiked: isLiked,
          likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1)
        };
      }
      return c;
    });
    saveComments(updated);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !authorName.trim()) return;

    const newComment: CommentItem = {
      id: `custom-${Date.now()}`,
      postId,
      authorName: authorName.trim(),
      authorRole: authorRole.trim() || 'Software Engineer',
      avatarUrl: `https://picsum.photos/seed/${encodeURIComponent(authorName)}/150/150`,
      content: newCommentText.trim(),
      createdAt: 'Just now',
      likes: 0,
      userLiked: false,
      parentId: null
    };

    const updated = [newComment, ...comments];
    saveComments(updated);
    setNewCommentText('');
    setSubmittedToast(true);
    setTimeout(() => setSubmittedToast(false), 3000);
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim() || !authorName.trim()) return;

    const newReply: CommentItem = {
      id: `reply-${Date.now()}`,
      postId,
      authorName: authorName.trim(),
      authorRole: authorRole.trim() || 'Software Engineer',
      avatarUrl: `https://picsum.photos/seed/${encodeURIComponent(authorName)}/150/150`,
      content: replyText.trim(),
      createdAt: 'Just now',
      likes: 0,
      userLiked: false,
      parentId
    };

    const updated = [...comments, newReply];
    saveComments(updated);
    setReplyText('');
    setReplyingToId(null);
    setSubmittedToast(true);
    setTimeout(() => setSubmittedToast(false), 3000);
  };

  const topLevelComments = comments.filter(c => !c.parentId);

  const sortedTopLevel = [...topLevelComments].sort((a, b) => {
    if (sortBy === 'top') {
      return b.likes - a.likes;
    }
    return 0;
  });

  const getRepliesFor = (parentId: string) => {
    return comments.filter(c => c.parentId === parentId);
  };

  return (
    <section className="pt-12 border-t border-border mt-16 space-y-8">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10 text-accent">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="text-xl font-bold uppercase text-text tracking-tight flex items-center gap-2">
              Discussion <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg-alt border border-border text-text-muted">{comments.length}</span>
            </h3>
            <p className="text-xs text-text-muted font-mono">Join the technical conversation</p>
          </div>
        </div>

        {/* Sort Filter */}
        {comments.length > 1 && (
          <div className="flex items-center gap-2 text-xs font-mono">
            <Filter size={13} className="text-text-muted" />
            <span className="text-text-muted uppercase">Sort by:</span>
            <button
              onClick={() => setSortBy('top')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                sortBy === 'top' ? 'bg-text text-white font-bold' : 'text-text-muted hover:text-text'
              }`}
            >
              Top Voted
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                sortBy === 'newest' ? 'bg-text text-white font-bold' : 'text-text-muted hover:text-text'
              }`}
            >
              Newest
            </button>
          </div>
        )}
      </div>

      {/* Main Add Comment Form */}
      <CommentForm
        authorName={authorName}
        setAuthorName={setAuthorName}
        authorRole={authorRole}
        setAuthorRole={setAuthorRole}
        newCommentText={newCommentText}
        setNewCommentText={setNewCommentText}
        onSubmit={handleAddComment}
        submittedToast={submittedToast}
      />

      {/* Comments List */}
      <div className="space-y-4 pt-2">
        {sortedTopLevel.length > 0 ? (
          sortedTopLevel.map((comment) => (
            <CommentItemView
              key={comment.id}
              comment={comment}
              replies={getRepliesFor(comment.id)}
              onLike={handleLike}
              isReplying={replyingToId === comment.id}
              onToggleReply={setReplyingToId}
              authorName={authorName}
              setAuthorName={setAuthorName}
              replyText={replyText}
              setReplyText={setReplyText}
              onSubmitReply={handleAddReply}
            />
          ))
        ) : (
          <div className="p-8 text-center rounded-xl border border-dashed border-border bg-bg-alt">
            <p className="text-xs font-mono uppercase text-text-muted">No comments yet. Be the first to start the discussion!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommentsSection;
