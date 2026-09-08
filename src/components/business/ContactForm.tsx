import React, { useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input, Textarea } from '../ui/input';

export const ContactForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().length > 3) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
        setMsg('');
      }, 5000);
    }
  };

  return (
    <div className="bg-bg-alt p-6 md:p-8 rounded-2xl border border-border">
      <h4 className="text-xs font-bold text-text uppercase tracking-wider mb-6 pb-2 border-b border-border">
        Send a Message
      </h4>

      {submitted ? (
        <div className="p-8 rounded-xl border border-emerald-200 bg-emerald-50 text-text text-center space-y-3">
          <CheckCircle size={28} className="text-emerald-600 mx-auto" />
          <div className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
            Message Sent
          </div>
          <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
            Thank you for reaching out. I'll review your note and get back to you within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
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
            rows={5}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Tell me about your team, project, or contract..."
          />

          <Button 
            type="submit"
            className="w-full"
          >
            Send Message <ArrowRight size={12} className="ml-1" />
          </Button>
        </form>
      )}
    </div>
  );
};
