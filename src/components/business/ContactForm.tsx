import React, { useState } from 'react';
import { Check, ArrowRight, Mail, RotateCcw, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input, Textarea } from '../ui/input';

interface ContactFormProps {
  contactEmail?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ contactEmail = 'MaTaN2288@gmail.com' }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mailtoUrl, setMailtoUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !msg.trim()) return;

    setIsSubmitting(true);

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name.trim() || email.trim()}`);
    const bodyText = encodeURIComponent(
      `Name: ${name.trim() || 'N/A'}\nEmail: ${email.trim()}\n\nMessage:\n${msg.trim()}`
    );
    const link = `mailto:${contactEmail}?subject=${subject}&body=${bodyText}`;
    setMailtoUrl(link);

    // Save to local storage for persistent inquiry log
    try {
      const existing = JSON.parse(localStorage.getItem('portfolio_contact_inquiries') || '[]');
      existing.unshift({
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim(),
        message: msg.trim(),
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('portfolio_contact_inquiries', JSON.stringify(existing.slice(0, 50)));
    } catch {
      // Ignore storage errors
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      // Trigger mailto intent
      try {
        const linkElem = document.createElement('a');
        linkElem.href = link;
        linkElem.style.display = 'none';
        document.body.appendChild(linkElem);
        linkElem.click();
        document.body.removeChild(linkElem);
      } catch {
        // Fallback handled by direct button in success state
      }
    }, 400);
  };

  const handleReset = () => {
    setSubmitted(false);
    setMsg('');
  };

  return (
    <div className="bg-bg-alt p-5 sm:p-6 rounded-2xl border border-border/90 shadow-2xs">
      {submitted ? (
        <div className="p-6 sm:p-8 rounded-xl border border-border/90 bg-white text-text text-center space-y-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-text mx-auto border border-border/70">
            <Check size={18} strokeWidth={2.2} />
          </div>

          <div className="space-y-1">
            <h5 className="text-xs font-bold uppercase tracking-wider text-text">
              Message Prepared
            </h5>
            <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
              Your inquiry has been recorded. If your email app did not open automatically, send directly to <span className="font-semibold text-text">{contactEmail}</span>.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <a
              href={mailtoUrl}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-text hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer w-full sm:w-auto"
            >
              <Mail size={13} />
              <span>Open in Email App</span>
              <ArrowUpRight size={13} className="text-neutral-400" />
            </a>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-50 text-text-muted hover:text-text border border-border rounded-lg text-xs font-medium transition-colors cursor-pointer w-full sm:w-auto"
            >
              <RotateCcw size={12} />
              <span>Send another</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (Optional)"
            />

            <Input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address *"
            />
          </div>

          <Textarea 
            required
            rows={3}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Write your message or inquiry..."
          />

          <div className="pt-1 flex justify-end">
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2 text-xs"
            >
              {isSubmitting ? (
                <span>Preparing message...</span>
              ) : (
                <>
                  <span>Send Message</span>
                  <ArrowRight size={12} className="ml-1.5" />
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
