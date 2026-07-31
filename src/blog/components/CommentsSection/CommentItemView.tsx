import React from 'react';
import { ThumbsUp, CornerDownRight } from 'lucide-react';
import { CommentItemViewProps } from './CommentsSection.types';

export const CommentItemView: React.FC<CommentItemViewProps> = ({
  comment,
  replies,
  onLike,
  isReplying,
  onToggleReply,
  authorName,
  setAuthorName,
  replyText,
  setReplyText,
  onSubmitReply
}) => {
  return (
    <div className="p-5 rounded-xl border border-border bg-white space-y-3">
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
          onClick={() => onLike(comment.id)}
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
          onClick={() => onToggleReply(isReplying ? null : comment.id)}
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
              onClick={() => onToggleReply(null)}
              className="px-3 py-1 text-xs font-mono text-text-muted hover:text-text cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmitReply(comment.id)}
              disabled={!replyText.trim()}
              className="px-3 py-1 bg-text text-white rounded text-xs font-mono font-bold uppercase disabled:opacity-50 cursor-pointer"
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
                  onClick={() => onLike(reply.id)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
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
};
