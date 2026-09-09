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
    <div className="bg-bg-alt p-6 md:p-8 rounded-2xl border border-border">
      <h4 className="text-xs font-bold text-text uppercase tracking-wider mb-6 pb-2 border-b border-border">
        Send a Message
      </h4>

      {submitted ? (
        <div className="p-7 sm:p-9 rounded-xl border border-border/90 bg-white text-text text-center space-y-4 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-text mx-auto border border-border/70">
            <Check size={20} strokeWidth={2.2} />
          </div>

          <div className="space-y-1">
            <h5 className="text-sm font-bold uppercase tracking-wider text-text">
              Message Prepared
            </h5>
            <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
              Your inquiry has been recorded. If your email app did not open automatically, click below to send directly to <span className="font-semibold text-text">{contactEmail}</span>.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={mailtoUrl}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-text hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer w-full sm:w-auto"
            >
              <Mail size={13} />
              <span>Open in Email App</span>
              <ArrowUpRight size={13} className="text-neutral-400" />
            </a>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-neutral-50 text-text-muted hover:text-text border border-border rounded-lg text-xs font-medium transition-colors cursor-pointer w-full sm:w-auto"
            >
              <RotateCcw size={12} />
              <span>Send another message</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Your Name (Optional)"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
          />

          <Input 
            label="Your Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />

          <Textarea 
            label="Message"
            required
            rows={4}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Tell me about your team, project, or contract..."
          />

          <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-full"
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
        </form>
      )}
    </div>
  );
};
