import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ArrowRight, Linkedin, Mail, Check, 
  ArrowUpRight, Sparkles, Code, Cpu, Shield, 
  CheckCircle, Database, ChevronRight, FileText, Send,
  ChevronLeft, LayoutGrid, SlidersHorizontal, Anchor, Briefcase, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AIPersonaChat, Timeline, portfolioPillars, portfolioSkills, portfolioRecommendations } from './features/dashboard';
import { BlogView } from './features/blog';
import { Button } from './components/ui/button';
import { Input, Textarea } from './components/ui/input';

interface SectionLabelProps {
  num: string;
  title: string;
}

const SectionLabel: React.FC<SectionLabelProps> = ({ num, title }) => {
  return (
    <div className="font-mono text-[11px] uppercase tracking-widest text-text-muted mb-8 flex items-center gap-2">
      <span className="font-bold text-text">{num}</span>
      <span className="text-border">——</span>
      <span className="text-text-muted font-semibold">{title}</span>
    </div>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('00');
  const [selectedPillarId, setSelectedPillarId] = useState(portfolioPillars[0].id);
  
  const [currentView, setCurrentView] = useState<'portfolio' | 'blog'>('portfolio');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Full section order (scroll-spy navigation matching the Mikon specification)
  const navItems = [
    { num: '00', label: 'Home',         id: 'home',         href: '#home' },
    { num: '01', label: 'About',        id: 'about',        href: '#about' },
    { num: '02', label: 'Experience',   id: 'experience',   href: '#experience' },
    { num: '03', label: 'Testimonials', id: 'testimonials', href: '#testimonials' },
    { num: '04', label: 'Contact',      id: 'contact',      href: '#contact' },
  ];

  // Track scroll position to update active navbar section
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

  // Smooth scroll handler with offset for sticky header
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

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactEmail.trim().length > 3) {
      setContactSubmitted(true);
      setTimeout(() => {
        setContactSubmitted(false);
        setContactEmail('');
        setContactMsg('');
      }, 5000);
    }
  };

  const selectedPillar = portfolioPillars.find(p => p.id === selectedPillarId) || portfolioPillars[0];

  return (
    <div className="min-h-screen bg-white text-text font-sans selection:bg-accent-soft selection:text-accent antialiased scroll-smooth">
      
      {/* Sticky top navbar — white background + backdrop-blur + bottom border */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border transition-all duration-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand Name on the Left */}
          <a 
            href="#home" 
            onClick={(e) => {
              if (currentView === 'blog') {
                setCurrentView('portfolio');
                setSelectedPostId(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                handleNavClick(e, '#home');
              }
            }} 
            className="flex items-center gap-2"
          >
            <span className="text-sm font-bold tracking-tight text-text uppercase">
              matan<span className="text-text-muted font-normal">elmaliah</span>
            </span>
          </a>

          {/* Desktop horizontal inline navigation with Blog button on the RIGHT side */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7">
            {navItems.map((item) => (
              <a
                key={item.num}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`relative text-xs tracking-tight py-1.5 transition-colors ${
                  currentView === 'portfolio' && activeSection === item.num 
                    ? 'text-text font-semibold' 
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <span>{item.label}</span>
                {currentView === 'portfolio' && activeSection === item.num && (
                  <motion.span 
                    layoutId="activeSectionUnderline" 
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-text rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}

            {/* Vertical Divider before Blog button on the Right */}
            <span className="text-border text-xs font-light">|</span>

            {/* Blog Button on the Right Side */}
            <button
              onClick={() => {
                setCurrentView('blog');
                setSelectedPostId(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                currentView === 'blog'
                  ? 'bg-text text-white font-bold shadow-xs ring-1 ring-text'
                  : 'bg-bg-alt border border-border text-text-muted hover:text-text hover:border-text'
              }`}
            >
              <BookOpen size={13} className={currentView === 'blog' ? 'text-white' : 'text-accent'} />
              <span>Blog</span>
            </button>
          </nav>

          {/* Mobile hamburger menu toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden text-text p-1.5 hover:bg-neutral-100 rounded-lg focus:outline-none transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile collapsible dropdown menu below header */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border py-6 px-6 space-y-4 shadow-lg max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setCurrentView('blog');
                  setSelectedPostId(null);
                  setIsMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-sm tracking-tight py-2.5 border-b border-neutral-100 flex items-center justify-between transition-colors ${
                  currentView === 'blog' ? 'text-text font-bold' : 'text-text-muted hover:text-text'
                }`}
              >
                <span className="flex items-center gap-2">
                  <BookOpen size={16} className="text-accent" />
                  <span>Engineering Blog</span>
                </span>
                <span className="text-xs font-mono text-accent uppercase font-bold">New</span>
              </button>

              {navItems.map((item) => (
                <a
                  key={item.num}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-sm tracking-tight py-2.5 border-b border-neutral-50 last:border-0 transition-colors block ${
                    currentView === 'portfolio' && activeSection === item.num 
                      ? 'text-text font-bold border-b border-text' 
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main View Router */}
      {currentView === 'blog' ? (
        <main className="pt-16">
          <BlogView 
            onBackToPortfolio={() => {
              setCurrentView('portfolio');
              setSelectedPostId(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            selectedPostId={selectedPostId}
            onSelectPost={setSelectedPostId}
          />
        </main>
      ) : (
        /* Main Container - max-width: 6xl for wider, layout-rich visual layout */
        <main className="pt-16">
          
          {/* Section 00 — Home (Hero split layout with live AI chat above the fold) */}
          <section id="home" className="min-h-[calc(100vh-4rem)] flex items-center bg-white py-12 md:py-20">
            <div className="max-w-6xl mx-auto px-6 md:px-8 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 lg:items-start items-center">
                
                {/* Left Column: Primary Professional Facts with Blended Image */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Blended Profile Photo & Title Row */}
                  <div className="flex flex-col sm:flex-row items-start gap-5">
                    {/* Image seamlessly blending with white background */}
                    <div className="relative shrink-0 group">
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-white shadow-2xs">
                        <img
                          src="https://picsum.photos/seed/matandev/400/400"
                          alt="Matan Elmaliah"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-105"
                        />
                        {/* Soft gradient edge blend matching the white canvas */}
                        <div className="absolute inset-0 ring-1 ring-inset ring-neutral-200/50 rounded-2xl pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted font-bold block">
                        00 — SOFTWARE DEVELOPER
                      </span>
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text uppercase font-sans leading-tight">
                        Matan <span className="text-text-muted">Elmaliah</span>
                      </h1>
                      <p className="text-xs font-mono text-accent uppercase tracking-wider font-semibold">
                        📍 Tel Aviv, Israel · Remote &amp; Hybrid
                      </p>
                    </div>
                  </div>

                  <p className="text-base text-text-muted leading-relaxed">
                    Fullstack &amp; Frontend Specialist with 4 years of experience delivering scalable web software, transaction buyflows, and high-fidelity GTM dataLayers for prominent enterprise telecom systems.
                  </p>

                  {/* Quantitative Highlights List */}
                  <div className="grid grid-cols-2 gap-4 py-2 border-y border-border">
                    <div>
                      <span className="block text-xl font-bold text-text">04 Years</span>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Software Developer</span>
                    </div>
                    <div>
                      <span className="block text-xl font-bold text-accent">4 Enterprise</span>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Clients delivered</span>
                    </div>
                  </div>

                  {/* Primary Interaction Links */}
                  <div className="flex flex-wrap items-center gap-4">
                    <a 
                      href="#experience"
                      onClick={(e) => handleNavClick(e, '#experience')}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-mono uppercase tracking-wider rounded-lg shadow-sm transition-all"
                    >
                      View Timeline <ArrowRight size={13} />
                    </a>
                    <button
                      onClick={() => {
                        setCurrentView('blog');
                        setSelectedPostId(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-border hover:border-text text-text-muted hover:text-text text-xs font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                    >
                      <BookOpen size={13} />
                      <span>Read Articles</span>
                    </button>
                  </div>
                </div>

              {/* Right Column: Prominent Embedded AI Chat Sandbox */}
              <div className="lg:col-span-6">
                <div className="bg-bg-alt rounded-2xl p-4 md:p-6 border border-border/80">
                  <div className="mb-2 pl-1">
                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block font-bold">
                      00 — Interactive Sandbox Route
                    </span>
                    <p className="text-xs text-text-muted">
                      Query the Gemini guide instantly regarding core accomplishments:
                    </p>
                  </div>
                  <AIPersonaChat />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 01 — About & Tech */}
        <section id="about" className="py-20 md:py-28 bg-bg-alt border-t border-border">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <SectionLabel num="01" title="About &amp; Profile" />
            
            {/* Description profile text */}
            <div className="max-w-3xl space-y-4 mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text uppercase leading-tight">
                High technical standards. Rigorous engineering form.
              </h2>
              <div className="text-text-muted text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  I build pixel-perfect, highly performant web systems, e-commerce buyflows, and robust backend integrations. With exactly 4 years of professional experience across prominent telecom giants (Altice, 3UK, USCellular, T-Mobile) and a disciplined background as an IDF navy diving technician and powerlifter, I approach code quality and scalability systematically.
                </p>
                <p className="text-xs sm:text-sm font-mono text-text uppercase tracking-wider">
                  📍 Located in Tel Aviv, Israel · Available for contract, hybrid or remote roles.
                </p>
              </div>
            </div>

            {/* Interactive pillars with responsive tab selector */}
            <div className="border border-border rounded-2xl p-6 bg-white shadow-xs mb-16">
              <div className="flex gap-2 overflow-x-auto pb-4 border-b border-border scrollbar-none">
                {portfolioPillars.map((p) => {
                  const isActive = selectedPillarId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPillarId(p.id)}
                      className="relative px-3.5 py-2 font-mono text-[10px] uppercase tracking-wide rounded-lg border border-border/80 transition-colors cursor-pointer whitespace-nowrap outline-none bg-bg-alt/50 text-text-muted hover:text-text overflow-hidden"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activePillarTab"
                          className="absolute inset-0 bg-accent"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className={`relative z-10 transition-colors ${isActive ? 'text-white font-bold' : ''}`}>
                        {p.num} / {p.id}
                      </span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPillarId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-6"
                >
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block mb-1">
                    {selectedPillar.subtitle}
                  </span>
                  <h4 className="text-base font-bold text-text uppercase mb-2">
                    {selectedPillar.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed max-w-3xl">
                    {selectedPillar.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Tech Stack integrated directly into Section 01 */}
            <div className="pt-12 border-t border-border/60">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4">
                  <span className="text-[10px] uppercase tracking-widest text-text-muted block mb-1">
                    01.2 — Toolsets
                  </span>
                  <h3 className="text-xl font-bold uppercase text-text tracking-tight mb-3">
                    Enterprise Tech Stack
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    A comprehensive set of modern, performance-oriented technologies tailored for enterprise web systems and AI orchestration.
                  </p>
                </div>
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolioSkills.map((cat, idx) => (
                    <div key={idx} className="bg-white border border-border rounded-xl p-5 hover:shadow-2xs transition-all">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-3 font-mono">
                        {cat.title}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.items.map((skill) => (
                          <span 
                            key={skill}
                            className="px-2.5 py-1 rounded-md text-[11px] font-medium text-text bg-bg-alt border border-border hover:border-text transition-colors cursor-default select-none"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {/* AI Skills Card */}
                  <div className="bg-white border border-border rounded-xl p-5 hover:shadow-2xs transition-all sm:col-span-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-3 font-mono">
                      Artificial Intelligence &amp; Workspaces
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Agent Orchestration', 'Context Engineering', 'RAG pipelines', 'Semantic Embeddings', 'VectorDB', 'MCP Servers', 'Figma', 'Playwright automation', 'Vitest'].map((skill) => (
                        <span 
                          key={skill}
                          className="px-2.5 py-1 rounded-md text-[11px] font-medium text-text bg-bg-alt border border-border hover:border-text transition-colors cursor-default select-none"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Section 02 — Experience & Deliverables (Timeline/Timestamp Flow) */}
        <section id="experience" className="py-20 md:py-28 bg-white border-t border-border">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <SectionLabel num="02" title="Experience &amp; Case Timeline" />
            <Timeline />
          </div>
        </section>

        {/* Section 03 — Testimonials */}
        <section id="testimonials" className="py-20 md:py-28 bg-bg-alt border-t border-border">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <SectionLabel num="03" title="Testimonials" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div className="max-w-xl">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text uppercase leading-tight mb-2">
                  Client &amp; Partner Endorsements
                </h2>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  Direct testimony regarding production checkout delivery, tag automation, and cooperative engineering form.
                </p>
              </div>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {portfolioRecommendations.map((rec, idx) => (
                <div key={idx} className="bg-white border border-border p-6 rounded-2xl shadow-xs hover:border-accent hover:shadow-sm transition-all flex flex-col justify-between">
                  <p className="text-sm text-[#4B5563] leading-relaxed italic mb-6">
                    "{rec.quote}"
                  </p>
                  <div>
                    <h5 className="font-bold text-sm text-text uppercase">
                      {rec.author}
                    </h5>
                    <div className="text-[11px] font-mono text-text-muted">
                      {rec.role} · <span className="font-semibold text-accent">{rec.company}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-right pr-2">
              <span className="font-mono text-[9px] text-text-subtle uppercase tracking-widest block">
                * Recommendations verified and imported from LinkedIn profile references.
              </span>
            </div>
          </div>
        </section>

        {/* Section 04 — Contact (Background: `#FFFFFF`) */}
        <section id="contact" className="py-20 md:py-28 bg-white border-t border-border">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <SectionLabel num="04" title="Get in Touch" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column: Coordinates */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold uppercase tracking-tight text-text leading-tight mb-4">
                    Ready to build together?
                  </h2>
                  <p className="text-sm text-text-muted leading-relaxed">
                    I am open to discuss professional engineering contracts, Tel Aviv-based hybrid agreements, or remote integrations under strict metrics alignment.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-text-muted tracking-widest block mb-1">
                      Direct Coordinates
                    </span>
                    <a 
                      href="mailto:MaTaN2288@gmail.com" 
                      className="text-base text-accent font-semibold hover:text-accent-hover hover:underline inline-flex items-center gap-1.5"
                    >
                      MaTaN2288@gmail.com <ArrowUpRight size={16} />
                    </a>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono uppercase text-text-muted tracking-widest block mb-1">
                      Professional Directory
                    </span>
                    <a 
                      href="https://www.linkedin.com/in/matan2288" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-base text-text hover:text-accent font-semibold hover:underline inline-flex items-center gap-1.5"
                    >
                      Connect on LinkedIn <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Inquiries Form */}
              <div className="lg:col-span-7 bg-bg-alt p-6 md:p-8 rounded-2xl border border-border">
                <h4 className="text-xs font-mono font-bold text-text uppercase tracking-wider mb-6 pb-2 border-b border-border">
                  Launch Coordinate Inquiry
                </h4>

                {contactSubmitted ? (
                  <div className="p-8 rounded-xl border border-success/30 bg-success-soft text-text text-center space-y-3">
                    <CheckCircle size={28} className="text-success mx-auto" />
                    <div className="font-mono text-xs font-bold uppercase text-success tracking-wider">
                      Transmission Received
                    </div>
                    <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
                      Your project coordinates have been logged on my dashboard. I will analyze requirements and establish communication within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-5">
                    <Input 
                      label="Hiring / Client Coordinates (Email)"
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="hiring@techcluster.com"
                    />

                    <Textarea 
                      label="Project Structuring &amp; Target parameters"
                      required
                      rows={5}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
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

            </div>
          </div>
        </section>

      </main>
    )}

      {/* Editorial Footer */}
      <footer className="bg-bg-alt border-t border-border py-12 text-center text-text-muted">
        <div className="max-w-6xl mx-auto px-6 text-[10px] font-mono tracking-widest uppercase space-y-2">
          <p>© 2026 MATAN ELMALIACH. DETAILED COMPLIANCE METRICS. ALL SYSTEMS OPTIMIZED.</p>
          <p className="font-sans text-[9px] text-text-subtle lowercase tracking-normal">
            built with React 19, TypeScript, and live Gemini RAG assistant middleware integration
          </p>
        </div>
      </footer>

    </div>
  );
}
