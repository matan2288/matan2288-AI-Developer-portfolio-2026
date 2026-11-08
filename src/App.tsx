import React, { useState, useEffect, useRef } from 'react';
import { NavbarContainer } from './containers/NavbarContainer';
import { HeroContainer } from './containers/HeroContainer';
import { AboutContainer } from './containers/AboutContainer';
import { ExperienceContainer } from './containers/ExperienceContainer';
import { TestimonialsContainer } from './containers/TestimonialsContainer';
import { ContactContainer } from './containers/ContactContainer';
import { FooterContainer } from './containers/FooterContainer';
import { BlogIframeContainer } from './components/BlogIframeContainer';
import { AdminPageContainer } from './containers/AdminPageContainer';
import { CertificationsContainer } from './containers/CertificationsContainer';
import { PersonaChatProvider, AIFloatingWidget } from './features/dashboard';
import { EditorLoginModal } from './components/EditorLoginModal';
import { isEditorAuthenticated, logoutEditor } from './services/editorAuth';
import { 
  useTinaPortfolio, 
  useTinaRecommendations,
  useTinaCertifications
} from './services/tinaContent';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('00');
  const [editorAuthenticated, setEditorAuthenticatedState] = useState<boolean>(() => isEditorAuthenticated());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Detect initial view from URL params, pathname, or hash
  const [currentView, setCurrentView] = useState<'portfolio' | 'blog' | 'admin' | 'certifications'>(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.replace(/\/+$/, '');
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();
      if (pathname === '/admin' || params.get('view') === 'admin' || hash === '#admin') {
        if (isEditorAuthenticated()) {
          return 'admin';
        }
      }
      if (pathname === '/blog' || params.get('view') === 'blog' || hash === '#blog') {
        return 'blog';
      }
      if (pathname === '/certifications' || params.get('view') === 'certifications' || hash === '#certifications') {
        return 'certifications';
      }
    }
    return 'portfolio';
  });

  const isPreviewMode = typeof window !== 'undefined' && (
    new URLSearchParams(window.location.search).get('preview') === 'true' ||
    window.self !== window.top
  );

  // If directly navigating to /admin while unauthenticated, trigger login modal immediately
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.replace(/\/+$/, '');
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();
      if (pathname === '/admin' || params.get('view') === 'admin' || hash === '#admin') {
        if (!isEditorAuthenticated()) {
          setIsLoginModalOpen(true);
        }
      }
    }
  }, []);

  // Sync view selection with browser URL history
  const handleSelectView = (view: 'portfolio' | 'blog' | 'admin' | 'certifications') => {
    if (view === 'admin' && !editorAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      if (view === 'portfolio') {
        window.history.pushState({}, '', '/');
      } else if (view === 'admin') {
        window.history.pushState({}, '', '/admin');
      } else {
        const url = new URL(window.location.href);
        url.searchParams.set('view', view);
        url.hash = `#${view}`;
        window.history.pushState({}, '', url.toString());
      }
    }
  };

  const handleLoginSuccess = () => {
    setEditorAuthenticatedState(true);
    setIsLoginModalOpen(false);
    setCurrentView('admin');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/admin');
    }
  };

  const handleEditorLogout = () => {
    logoutEditor();
    setEditorAuthenticatedState(false);
    setCurrentView('portfolio');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
    }
  };

  // Listen for browser forward/backward and direct hash changes (e.g. /admin, #blog)
  useEffect(() => {
    const handleUrlChange = () => {
      const pathname = window.location.pathname.replace(/\/+$/, '');
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();
      if (pathname === '/admin' || params.get('view') === 'admin' || hash === '#admin') {
        if (isEditorAuthenticated()) {
          setCurrentView('admin');
        } else {
          setCurrentView('portfolio');
          setIsLoginModalOpen(true);
        }
      } else if (pathname === '/blog' || params.get('view') === 'blog' || hash === '#blog') {
        setCurrentView('blog');
      } else if (pathname === '/certifications' || params.get('view') === 'certifications' || hash === '#certifications') {
        setCurrentView('certifications');
      } else if (params.get('view') === 'portfolio' || hash === '#home' || hash === '#experience' || hash === '#testimonials' || hash === '#contact') {
        setCurrentView('portfolio');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Tina CMS content state hooks (reactive to live draft updates)
  const portfolio = useTinaPortfolio();
  const portfolioRecommendations = useTinaRecommendations();
  const portfolioCertifications = useTinaCertifications();

  // Navigation config for scroll-spy and header links
  const navItems = [
    { num: '00', label: 'Home',         id: 'home',         href: '#home' },
    { num: '01', label: 'About',        id: 'about',        href: '#about' },
    { num: '02', label: 'Experience',   id: 'experience',   href: '#experience' },
    { num: '03', label: 'Testimonials', id: 'testimonials', href: '#testimonials' },
    { num: '04', label: 'Contact',      id: 'contact',      href: '#contact' },
  ];

  const isClickScrollingRef = useRef(false);
  const scrollLockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll spy listener
  useEffect(() => {
    if (currentView !== 'portfolio') return;

    const handleScroll = () => {
      // Don't override active section while programmatic smooth scroll is underway
      if (isClickScrollingRef.current) return;

      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;

      // Bottom of page: activate Contact section ('04') reliably
      if (scrollY + windowHeight >= scrollHeight - 60) {
        setActiveSection('04');
        return;
      }

      // Top of page: activate Home section ('00')
      if (scrollY < 80) {
        setActiveSection('00');
        return;
      }

      // Reading probe line at 35% from viewport top
      const probeY = windowHeight * 0.35;
      for (let i = navItems.length - 1; i >= 0; i--) {
        const item = navItems[i];
        const element = document.getElementById(item.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= probeY && rect.bottom > 0) {
            setActiveSection(item.num);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to set initial active section
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Smooth scroll click handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === '#blog') {
      handleSelectView('blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMenuOpen(false);
      return;
    }
    if (href === '#certifications') {
      handleSelectView('certifications');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMenuOpen(false);
      return;
    }
    const targetItem = navItems.find((n) => n.href === href);
    if (targetItem) {
      setActiveSection(targetItem.num);
      isClickScrollingRef.current = true;
      if (scrollLockTimeoutRef.current) clearTimeout(scrollLockTimeoutRef.current);
      scrollLockTimeoutRef.current = setTimeout(() => {
        isClickScrollingRef.current = false;
      }, 750);
    }

    if (currentView !== 'portfolio') {
      handleSelectView('portfolio');
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
    <PersonaChatProvider>
      {/* Dedicated Full-Page Admin Studio View */}
      {currentView === 'admin' && editorAuthenticated ? (
        <AdminPageContainer 
          onBackToPortfolio={() => handleSelectView('portfolio')} 
          onLogout={handleEditorLogout}
        />
      ) : (
        <div className="min-h-screen bg-white text-text font-sans selection:bg-neutral-100 selection:text-text antialiased scroll-smooth">
          
          {/* Header / Navbar Container */}
          <NavbarContainer 
            brandName="MATAN AI"
            portfolioName={portfolio.developerName}
            navItems={navItems}
            activeSection={activeSection}
            currentView={currentView}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            onNavClick={handleNavClick}
            onSelectView={handleSelectView}
            showBlogTab={portfolio.showBlogTab !== false}
          />

          {/* Main View Switcher */}
          {currentView === 'blog' ? (
            <main className="pt-16 h-screen flex flex-col overflow-hidden">
              <BlogIframeContainer 
                onBackToPortfolio={() => {
                  handleSelectView('portfolio');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </main>
          ) : currentView === 'certifications' ? (
            <main>
              <CertificationsContainer 
                certifications={portfolioCertifications}
                developerName={portfolio.developerName}
                onBackToPortfolio={() => {
                  handleSelectView('portfolio');
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
                onOpenTinaAdmin={() => handleSelectView('admin')}
              />

              {/* Section 01 — About Overview Container */}
              <AboutContainer 
                title={portfolio.aboutTitle}
                content={portfolio.aboutBio1}
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

          {/* Sticky Bottom-Right Floating Agent Widget (accessible anywhere across the page) */}
          {currentView === 'portfolio' && (
            <AIFloatingWidget 
              avatarUrl={portfolio.avatarUrl} 
              developerName={portfolio.developerName} 
            />
          )}

          {/* Footer Container */}
          <FooterContainer 
            developerName={portfolio.developerName} 
            contactEmail={portfolio.contactEmail}
            linkedInUrl={portfolio.linkedInUrl}
          />

        </div>
      )}

      {/* Protected Editor Login Modal */}
      <EditorLoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSuccess={handleLoginSuccess} 
      />
    </PersonaChatProvider>
  );
}
