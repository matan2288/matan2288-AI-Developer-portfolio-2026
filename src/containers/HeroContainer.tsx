import React, { useState, useRef } from 'react';
import { ArrowRight, Mail, MessageSquare, Github, Linkedin, Camera, Check, MapPin } from 'lucide-react';
import { AICommandBar } from '../features/dashboard';
import { PortfolioContent } from '../features/dashboard/types';
import { updateAvatarUrl } from '../services/tinaContent';

interface HeroContainerProps {
  portfolio: PortfolioContent;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  onOpenTinaAdmin: () => void;
}

export const HeroContainer: React.FC<HeroContainerProps> = ({
  portfolio,
  onNavClick,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (JPEG, PNG, WebP, etc.)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        updateAvatarUrl(dataUrl);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <section id="home" className="bg-white pt-24 sm:pt-28 pb-12 sm:pb-16">
      <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 md:px-8 w-full">
        {/* Centered Structured Hero Content */}
        <div className="flex flex-col items-center text-center space-y-5 sm:space-y-6">
          
          {/* Centered Profile Avatar with Direct Upload & Drag-and-Drop */}
          <div className="relative group shrink-0">
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              title="Click or drag & drop to update profile photo"
              className={`w-[15em] h-[15em] rounded-3xl overflow-hidden bg-neutral-100 text-left cursor-pointer shrink-0 shadow-2xs relative transition-all duration-200 ${
                isDragging 
                  ? 'ring-2 ring-text/30 scale-105' 
                  : 'hover:opacity-95'
              }`}
            >
              <img
                src={portfolio.avatarUrl}
                alt={portfolio.developerName}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('githubusercontent.com')) {
                    target.src = 'https://avatars.githubusercontent.com/u/60103076?v=4';
                  }
                }}
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              />
              {/* Hover Overlay */}
              <div className={`absolute inset-0 bg-black/45 backdrop-blur-[1px] flex flex-col items-center justify-center text-white transition-opacity duration-200 ${
                isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}>
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">
                  {isDragging ? 'Drop photo' : 'Change photo'}
                </span>
              </div>
            </button>

            {/* Success Toast */}
            {showSuccessToast && (
              <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 z-30 bg-neutral-900 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 whitespace-nowrap animate-fade-in">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Profile photo updated!</span>
              </div>
            )}
          </div>

          {/* Name & Title & Location Stack */}
          <div className="space-y-1 max-w-xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 font-sans">
              {portfolio.developerName}
            </h1>

            <p className="text-base sm:text-lg font-medium text-neutral-800 tracking-tight pt-0.5">
              {portfolio.title}
            </p>

            <p className="text-xs sm:text-[13px] text-neutral-400 font-normal tracking-normal flex items-center justify-center gap-1 pt-0.5">
              <MapPin className="w-3 h-3 text-neutral-400/80 shrink-0" />
              <span>{portfolio.location}</span>
            </p>
          </div>

          {/* Centered Bio Summary */}
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal max-w-2xl mx-auto px-2">
            {portfolio.heroBio}
          </p>

          {/* Quantitative Stats Strip */}
          {portfolio.stats && portfolio.stats.length > 0 && (
            <div className={`w-full max-w-5xl mx-auto py-5 my-1 border-y border-neutral-200/80 grid text-center ${
              portfolio.stats.length <= 2 
                ? 'grid-cols-2' 
                : portfolio.stats.length <= 4 
                  ? 'grid-cols-2 sm:grid-cols-4' 
                  : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
            } gap-6 sm:gap-6 text-left`}>
              {portfolio.stats.map((stat, idx) => (
                <div key={idx} className="space-y-0.5">
                  <span className="block text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs text-neutral-500 block font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Centered AI Command Bar */}
          <div className="w-full max-w-3xl mx-auto pt-2">
            <AICommandBar />
          </div>

          {/* Centered Action Links & Social Icons (Stacked) */}
          <div className="flex flex-col items-center gap-3.5 pt-1">
            {/* Primary Action Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm">
              <a 
                href="#experience"
                onClick={(e) => onNavClick(e, '#experience')}
                className="inline-flex items-center gap-1.5 font-medium text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer group"
              >
                <span>View Experience</span>
                <ArrowRight size={14} className="text-neutral-500 transition-transform group-hover:translate-x-0.5" />
              </a>

              <a 
                href="#contact"
                onClick={(e) => onNavClick(e, '#contact')}
                className="inline-flex items-center gap-1.5 font-medium text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <MessageSquare size={15} className="text-neutral-500" />
                <span>Get in Touch</span>
              </a>
            </div>

            {/* Social Icons (Below Links) */}
            <div className="flex items-center justify-center gap-1 text-neutral-500">
              <a
                href="https://github.com/matan2288"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-900 transition-colors p-1"
                aria-label="GitHub Profile"
              >
                <Github size={16} />
              </a>
              <a
                href={portfolio.linkedInUrl || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-900 transition-colors p-1"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={`mailto:${portfolio.contactEmail || "MaTaN2288@gmail.com"}`}
                className="text-neutral-500 hover:text-neutral-900 transition-colors p-1"
                aria-label="Send Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
