import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, CornerDownRight, Send, User, Check, Sparkles, Filter } from 'lucide-react';
import { CommentItem } from './types';
import { INITIAL_COMMENTS } from './defaultComments';

interface CommentsSectionProps {
  postId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'top'>('top');
  const [submittedToast, setSubmittedToast] = useState(false);

  // Load comments from localStorage or default
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

  // Save comments to localStorage whenever updated
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

  // Top-level comments
  const topLevelComments = comments.filter(c => !c.parentId);

  // Sorting
  const sortedTopLevel = [...topLevelComments].sort((a, b) => {
    if (sortBy === 'top') {
      return b.likes - a.likes;
    }
    return 0; // retain chronological / array order for newest
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
              className={`px-2.5 py-1 rounded transition-colors ${
                sortBy === 'top' ? 'bg-text text-white font-bold' : 'text-text-muted hover:text-text'
              }`}
            >
              Top Voted
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-2.5 py-1 rounded transition-colors ${
                sortBy === 'newest' ? 'bg-text text-white font-bold' : 'text-text-muted hover:text-text'
              }`}
            >
              Newest
            </button>
          </div>
        )}
      </div>

      {/* Main Add Comment Form */}
      <form onSubmit={handleAddComment} className="p-5 rounded-2xl border border-border bg-bg-alt space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase font-bold text-text flex items-center gap-1.5">
            <User size={14} className="text-accent" />
            <span>Leave a Comment</span>
          </span>
          {submittedToast && (
            <span className="text-xs font-mono text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded border border-green-200">
              <Check size={13} /> Posted!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Your Name (required)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            className="w-full px-3.5 py-2 text-xs font-mono bg-white border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-text transition-colors"
          />
          <input
            type="text"
            placeholder="Your Title / Role (e.g. Frontend Dev)"
            value={authorRole}
            onChange={(e) => setAuthorRole(e.target.value)}
            className="w-full px-3.5 py-2 text-xs font-mono bg-white border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-text transition-colors"
          />
        </div>

        <textarea
          placeholder="Share your thoughts, questions, or experience..."
          rows={3}
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          required
          className="w-full px-3.5 py-2.5 text-xs font-mono bg-white border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-text transition-colors resize-y"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-text hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-wider font-bold rounded-lg transition-colors cursor-pointer"
          >
            <Send size={13} />
            <span>Post Comment</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 pt-2">
        {sortedTopLevel.length > 0 ? (
          sortedTopLevel.map((comment) => {
            const replies = getRepliesFor(comment.id);
            const isReplying = replyingToId === comment.id;

            return (
              <div key={comment.id} className="p-5 rounded-xl border border-border bg-white space-y-3">
                {/* Comment Author Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={comment.avatarUrl}
                      alt={comment.authorName}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-text uppercase">
                          {comment.authorName}
                        </h4>
                        {comment.authorName === 'Matan Elmaliah' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-accent text-white font-bold">
                            Author
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-text-muted font-mono">
                        {comment.authorRole || 'Developer'} • {comment.createdAt}
                      </p>
                    </div>
                  </div>

                  {/* Upvote Button */}
                  <button
                    onClick={() => handleLike(comment.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                      comment.userLiked
                        ? 'bg-accent/10 border border-accent/30 text-accent font-bold'
                        : 'bg-bg-alt border border-border text-text-muted hover:text-text'
                    }`}
                  >
                    <ThumbsUp size={12} className={comment.userLiked ? 'fill-accent' : ''} />
                    <span>{comment.likes}</span>
                  </button>
                </div>

                {/* Comment Content */}
                <p className="text-xs sm:text-sm text-text leading-relaxed pl-12 font-sans">
                  {comment.content}
                </p>

                {/* Reply Toggle */}
                <div className="pl-12 flex items-center gap-4 pt-1">
                  <button
                    onClick={() => setReplyingToId(isReplying ? null : comment.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-text-muted hover:text-text transition-colors cursor-pointer"
                  >
                    <CornerDownRight size={12} />
                    <span>{isReplying ? 'Cancel Reply' : 'Reply'}</span>
                  </button>
                </div>

                {/* Inline Reply Input Form */}
                {isReplying && (
                  <div className="ml-12 mt-3 p-3.5 rounded-xl border border-border bg-bg-alt space-y-3">
                    <p className="text-[11px] font-mono text-text-muted">
                      Replying to <span className="font-bold text-text">@{comment.authorName}</span>:
                    </p>
                    {!authorName && (
                      <input
                        type="text"
                        placeholder="Your Name (required)"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-text"
                      />
                    )}
                    <textarea
                      placeholder="Write your reply..."
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-text resize-y"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setReplyingToId(null)}
                        className="px-3 py-1 text-xs font-mono text-text-muted hover:text-text"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAddReply(comment.id)}
                        disabled={!replyText.trim()}
                        className="px-3 py-1 bg-text text-white rounded text-xs font-mono font-bold uppercase disabled:opacity-50"
                      >
                        Submit Reply
                      </button>
                    </div>
                  </div>
                )}

                {/* Nested Replies */}
                {replies.length > 0 && (
                  <div className="ml-8 sm:ml-12 pl-3 border-l-2 border-border space-y-3 pt-2">
                    {replies.map((reply) => (
                      <div key={reply.id} className="p-3 rounded-lg bg-bg-alt border border-border/60 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={reply.avatarUrl}
                              alt={reply.authorName}
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h5 className="text-[11px] font-bold text-text uppercase">
                                  {reply.authorName}
                                </h5>
                                {reply.authorName === 'Matan Elmaliah' && (
                                  <span className="px-1 py-0.1 rounded text-[8px] font-mono bg-accent text-white font-bold uppercase">
                                    Author
                                  </span>
                                )}
                              </div>
                              <p className="text-[9px] text-text-muted font-mono">
                                {reply.createdAt}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleLike(reply.id)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                              reply.userLiked
                                ? 'bg-accent/10 text-accent font-bold'
                                : 'text-text-muted hover:text-text'
                            }`}
                          >
                            <ThumbsUp size={10} />
                            <span>{reply.likes}</span>
                          </button>
                        </div>

                        <p className="text-xs text-text leading-relaxed font-sans pl-9">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center rounded-xl border border-dashed border-border bg-bg-alt">
            <p className="text-xs font-mono uppercase text-text-muted">No comments yet. Be the first to start the discussion!</p>
          </div>
        )}
      </div>
    </section>
  );
};
