import React, { useState, useEffect } from 'react';
import { NavbarContainer } from './containers/NavbarContainer';
import { HeroContainer } from './containers/HeroContainer';
import { AboutContainer } from './containers/AboutContainer';
import { ExperienceContainer } from './containers/ExperienceContainer';
import { TestimonialsContainer } from './containers/TestimonialsContainer';
import { ContactContainer } from './containers/ContactContainer';
import { FooterContainer } from './containers/FooterContainer';
import { BlogIframeContainer } from './components/BlogIframeContainer';
import { TinaAdmin } from './components/TinaAdmin';
import { 
  useTinaPortfolio, 
  useTinaPillars, 
  useTinaSkills, 
  useTinaRecommendations 
} from './services/tinaContent';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTinaAdminOpen, setIsTinaAdminOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('00');
  const [currentView, setCurrentView] = useState<'portfolio' | 'blog'>('portfolio');

  // Tina CMS content state hooks
  const portfolio = useTinaPortfolio();
  const portfolioPillars = useTinaPillars();
  const portfolioSkills = useTinaSkills();
  const portfolioRecommendations = useTinaRecommendations();

  // Navigation config for scroll-spy and header links
  const navItems = [
    { num: '00', label: 'Home',         id: 'home',         href: '#home' },
    { num: '01', label: 'About',        id: 'about',        href: '#about' },
    { num: '02', label: 'Experience',   id: 'experience',   href: '#experience' },
    { num: '03', label: 'Testimonials', id: 'testimonials', href: '#testimonials' },
    { num: '04', label: 'Contact',      id: 'contact',      href: '#contact' },
  ];

  // Scroll spy listener
  useEffect(() => {
    if (currentView !== 'portfolio') return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 240;
      
      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(item.num);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Smooth scroll click handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (currentView !== 'portfolio') {
      setCurrentView('portfolio');
      setTimeout(() => {
        const id = href.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 64;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 50);
    } else {
      const id = href.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 64;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-text font-sans selection:bg-accent-soft selection:text-accent antialiased scroll-smooth">
      
      {/* TinaCMS Headless Studio Modal */}
      <TinaAdmin 
        isOpen={isTinaAdminOpen} 
        onClose={() => setIsTinaAdminOpen(false)} 
      />

      {/* Header / Navbar Container */}
      <NavbarContainer 
        portfolioName={portfolio.developerName}
        navItems={navItems}
        activeSection={activeSection}
        currentView={currentView}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onNavClick={handleNavClick}
        onOpenTinaAdmin={() => setIsTinaAdminOpen(true)}
        onSelectView={setCurrentView}
      />

      {/* Main View Switcher */}
      {currentView === 'blog' ? (
        <main className="pt-16">
          <BlogIframeContainer 
            onBackToPortfolio={() => {
              setCurrentView('portfolio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      ) : (
        <main className="pt-16">
          
          {/* Section 00 — Hero Container */}
          <HeroContainer 
            portfolio={portfolio}
            onNavClick={handleNavClick}
            onOpenTinaAdmin={() => setIsTinaAdminOpen(true)}
          />

          {/* Section 01 — About & Profile Container */}
          <AboutContainer 
            portfolio={portfolio}
            pillars={portfolioPillars}
            skills={portfolioSkills}
          />

          {/* Section 02 — Experience Timeline Container */}
          <ExperienceContainer />

          {/* Section 03 — Testimonials Container */}
          <TestimonialsContainer 
            recommendations={portfolioRecommendations}
          />

          {/* Section 04 — Contact Container */}
          <ContactContainer 
            portfolio={portfolio}
          />

        </main>
      )}

      {/* Footer Container */}
      <FooterContainer developerName={portfolio.developerName} />

    </div>
  );
}
