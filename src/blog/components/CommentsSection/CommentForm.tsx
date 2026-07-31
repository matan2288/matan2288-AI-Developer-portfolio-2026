import React from 'react';
import { User, Check, Send } from 'lucide-react';
import { CommentFormProps } from './CommentsSection.types';

export const CommentForm: React.FC<CommentFormProps> = ({
  authorName,
  setAuthorName,
  authorRole,
  setAuthorRole,
  newCommentText,
  setNewCommentText,
  onSubmit,
  submittedToast
}) => {
  return (
    <form onSubmit={onSubmit} className="p-5 rounded-2xl border border-border bg-bg-alt space-y-4 shadow-2xs">
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
  );
};
