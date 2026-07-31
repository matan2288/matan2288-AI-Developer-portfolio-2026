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
      <h4 className="text-xs font-mono font-bold text-text uppercase tracking-wider mb-6 pb-2 border-b border-border">
        Launch Coordinate Inquiry
      </h4>

      {submitted ? (
        <div className="p-8 rounded-xl border border-success/30 bg-success-soft text-text text-center space-y-3">
          <CheckCircle size={28} className="text-success mx-auto" />
          <div className="font-mono text-xs font-bold uppercase text-success tracking-wider">
            Transmission Received
          </div>
          <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
            Your project coordinates have been logged. I will analyze requirements and establish communication within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="Hiring / Client Coordinates (Email)"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hiring@techcluster.com"
          />

          <Textarea 
            label="Project Structuring & Target parameters"
            required
            rows={5}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Detail the target tech stack, contract terms, or core challenges..."
          />

          <Button 
            type="submit"
            className="w-full"
          >
            Transmit Inquiries <ArrowRight size={12} className="ml-1" />
          </Button>
        </form>
      )}
    </div>
  );
};
