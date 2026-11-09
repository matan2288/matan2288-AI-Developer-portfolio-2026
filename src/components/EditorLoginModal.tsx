import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { verifyEditorCredentials, setEditorAuthenticated } from '../services/editorAuth';

interface EditorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditorLoginModal: React.FC<EditorLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setError(null);
      setShowPassword(false);
      setTimeout(() => usernameInputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setIsSubmitting(true);

        try {
          const isValid = await verifyEditorCredentials(username, password);
          if (isValid) {
            setEditorAuthenticated(true);
            setIsSubmitting(false);
            onSuccess();
          } else {
            setError('Invalid username or password. Check your environment configuration.');
            setIsSubmitting(false);
          }
    } catch {
      setError('Authentication request failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-login-title"
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-border p-6 z-10 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-text-subtle hover:text-text rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mb-3 text-text">
            <Lock size={18} />
          </div>
          <h2 id="editor-login-title" className="text-base font-bold text-text">
            Editor Authentication
          </h2>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Content management studio is password-protected. Enter your credentials to continue.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200/80 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
              Username
            </label>
            <input
              ref={usernameInputRef}
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              autoComplete="username"
              className="w-full px-3 py-2 text-xs bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-text focus:border-text transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full px-3 py-2 pr-9 text-xs bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-text focus:border-text transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text cursor-pointer p-0.5"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-text-muted hover:text-text hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold bg-text text-white hover:bg-neutral-800 rounded-xl transition-all cursor-pointer disabled:opacity-60 shadow-2xs"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

