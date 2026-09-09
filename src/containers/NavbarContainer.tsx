import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Menu, X, Edit3, BookOpen, Award } from 'lucide-react';

interface NavItem {
  num: string;
  label: string;
  id: string;
  href: string;
}

interface NavbarContainerProps {
  portfolioName?: string;
  brandName?: string;
  navItems: NavItem[];
  activeSection: string;
  currentView: 'portfolio' | 'blog' | 'admin' | 'certifications';
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  onOpenTinaAdmin: () => void;
  onSelectView: (view: 'portfolio' | 'blog' | 'admin' | 'certifications') => void;
}

export const NavbarContainer: React.FC<NavbarContainerProps> = ({
  portfolioName = 'MATAN AI',
  brandName = 'MATAN AI',
  navItems,
  activeSection,
  currentView,
  isMenuOpen,
  setIsMenuOpen,
  onNavClick,
  onOpenTinaAdmin,
  onSelectView,
}) => {
  const brand = brandName || 'MATAN AI';
  const firstName = brand.split(' ')[0] || 'MATAN';
  const restName = brand.split(' ').slice(1).join(' ') || 'AI';

  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const updateIndicator = useCallback(() => {
    if (!navRef.current) return;
    const activeEl = navRef.current.querySelector('[data-active="true"]') as HTMLElement | null;
    if (activeEl) {
      const navRect = navRef.current.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      setIndicator({
        left: elRect.left - navRect.left,
        width: elRect.width,
        opacity: 1,
      });
    } else {
      setIndicator((prev) => ({ ...prev, opacity: 0 }));
    }
  }, []);

  useEffect(() => {
    updateIndicator();
  }, [activeSection, currentView, updateIndicator]);

  useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    const timeout = setTimeout(updateIndicator, 100);
    return () => {
      window.removeEventListener('resize', updateIndicator);
      clearTimeout(timeout);
    };
  }, [updateIndicator]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border transition-all duration-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Name */}
        <a 
          href="#home" 
          onClick={(e) => {
            if (currentView !== 'portfolio') {
              onSelectView('portfolio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              onNavClick(e, '#home');
            }
          }} 
          className="flex items-center gap-2"
        >
          <span className="text-sm font-bold tracking-tight text-text uppercase">
            {firstName}
            <span className="text-text-muted font-normal ml-1">
              {restName}
            </span>
          </span>
        </a>

        {/* Desktop inline navigation */}
        <nav ref={navRef} className="hidden md:flex items-center gap-4 lg:gap-6 relative py-1">
          {navItems.map((item) => (
            <a
              key={item.num}
              href={item.href}
              onClick={(e) => onNavClick(e, item.href)}
              data-active={currentView === 'portfolio' && activeSection === item.num}
              className={`relative text-xs tracking-tight py-1.5 transition-colors cursor-pointer ${
                currentView === 'portfolio' && activeSection === item.num 
                  ? 'text-text font-semibold' 
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <span>{item.label}</span>
            </a>
          ))}

          {/* Pipeline delimiter */}
          <span className="text-border/70 text-xs font-light select-none">|</span>

          {/* Navigation to Certification Page */}
          <button
            onClick={() => {
              onSelectView('certifications');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            data-active={currentView === 'certifications'}
            className={`relative text-xs tracking-tight py-1.5 transition-colors cursor-pointer ${
              currentView === 'certifications'
                ? 'text-text font-semibold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <span>Certifications</span>
          </button>

          {/* Navigation to Blog Page */}
          <button
            onClick={() => {
              onSelectView('blog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            data-active={currentView === 'blog'}
            className={`relative text-xs tracking-tight py-1.5 transition-colors cursor-pointer ${
              currentView === 'blog'
                ? 'text-text font-semibold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <span>Blog</span>
          </button>

          {/* Refined 1px minimalist sliding underline indicator */}
          <span 
            aria-hidden="true"
            className="absolute bottom-0 h-px bg-text pointer-events-none transition-all duration-200 ease-out"
            style={{
              left: `${indicator.left}px`,
              width: `${indicator.width}px`,
              opacity: indicator.opacity,
            }}
          />

          <span className="text-border/70 text-xs font-light select-none">|</span>

          {/* Classy & Discreet Editor Trigger */}
          <button
            onClick={() => onSelectView('admin')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-wide transition-all cursor-pointer ${
              currentView === 'admin'
                ? 'bg-white text-text font-medium border border-border/80 shadow-2xs'
                : 'text-text-muted hover:text-text hover:bg-neutral-50 border border-transparent font-normal'
            }`}
            title="Open Content Editor"
          >
            <Edit3 size={11} className={currentView === 'admin' ? 'text-text' : 'text-text-muted'} />
            <span>Editor</span>
          </button>
        </nav>

        {/* Mobile menu toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="md:hidden text-text p-1.5 hover:bg-neutral-100 rounded-lg focus:outline-none transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile collapsible dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border px-5 py-2.5 shadow-md max-h-[80vh] overflow-y-auto animate-fadeIn">
          <div className="flex flex-col divide-y divide-border/40">
            {navItems.map((item) => (
              <a
                key={item.num}
                href={item.href}
                onClick={(e) => onNavClick(e, item.href)}
                className={`text-xs py-2 flex items-center justify-between transition-colors ${
                  currentView === 'portfolio' && activeSection === item.num 
                    ? 'text-text font-bold' 
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[10px] text-text-subtle font-mono">{item.num}</span>
              </a>
            ))}

            <button
              onClick={() => {
                onSelectView('certifications');
                setIsMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-xs py-2 flex items-center justify-between transition-colors cursor-pointer ${
                currentView === 'certifications' ? 'text-text font-bold' : 'text-text-muted hover:text-text'
              }`}
            >
              <span className="flex items-center gap-2">
                <Award size={13} className={currentView === 'certifications' ? 'text-text' : 'text-text-muted'} />
                <span>Certifications</span>
              </span>
            </button>

            <button
              onClick={() => {
                onSelectView('blog');
                setIsMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-xs py-2 flex items-center justify-between transition-colors cursor-pointer ${
                currentView === 'blog' ? 'text-text font-bold' : 'text-text-muted hover:text-text'
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen size={13} className={currentView === 'blog' ? 'text-text' : 'text-text-muted'} />
                <span>Blog</span>
              </span>
            </button>

            <button
              onClick={() => {
                onSelectView('admin');
                setIsMenuOpen(false);
              }}
              className={`text-xs py-2 flex items-center justify-between transition-colors cursor-pointer ${
                currentView === 'admin' ? 'text-text font-bold' : 'text-text-muted hover:text-text'
              }`}
            >
              <span className="flex items-center gap-2">
                <Edit3 size={13} className={currentView === 'admin' ? 'text-text' : 'text-text-muted'} />
                <span>Editor</span>
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
