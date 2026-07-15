import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ArrowRight, Linkedin, Mail, Check, 
  ArrowUpRight, Sparkles, Code, Cpu, Shield, 
  CheckCircle, Database, ChevronRight, FileText, Send,
  ChevronLeft, LayoutGrid, SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AIPersonaChat } from './components/AIPersonaChat';
import { 
  portfolioPillars, 
  portfolioExperiences, 
  portfolioSkills, 
  portfolioRecommendations 
} from './portfolio-data';

// Reuse SectionLabel component for section headers in the exact requested "01 — About" monospace format
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
  
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // States for Carousel / Grid views of experience and testimonials
  const [expViewMode, setExpViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [activeExpIdx, setActiveExpIdx] = useState(0);

  const [testViewMode, setTestViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [activeTestIdx, setActiveTestIdx] = useState(0);

  const nextExp = () => {
    setActiveExpIdx((prev) => (prev + 1) % portfolioExperiences.length);
  };
  const prevExp = () => {
    setActiveExpIdx((prev) => (prev - 1 + portfolioExperiences.length) % portfolioExperiences.length);
  };

  const nextTest = () => {
    setActiveTestIdx((prev) => (prev + 1) % portfolioRecommendations.length);
  };
  const prevTest = () => {
    setActiveTestIdx((prev) => (prev - 1 + portfolioRecommendations.length) % portfolioRecommendations.length);
  };

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
  }, []);

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
          <a href="#home" className="flex items-center gap-3">
            <span className="text-sm font-bold tracking-tight text-text uppercase">
              matan<span className="text-text-muted font-normal">2288</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-bg-alt text-[10px] text-text-muted font-medium border border-border select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-text-subtle animate-pulse"></span>
              Available for contracts
            </span>
          </a>

          {/* Desktop horizontal inline navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <a
                key={item.num}
                href={item.href}
                className={`relative text-xs tracking-tight py-1.5 transition-colors ${
                  activeSection === item.num 
                    ? 'text-text font-semibold' 
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <span>{item.label}</span>
                {activeSection === item.num && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-text rounded-full" />
                )}
              </a>
            ))}
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
              {navItems.map((item) => (
                <a
                  key={item.num}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm tracking-tight py-2.5 border-b border-neutral-50 last:border-0 transition-colors block ${
                    activeSection === item.num 
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

      {/* Main Container - max-width: 6xl for wider, layout-rich visual layout */}
      <main className="pt-16">
        
        {/* Section 00 — Home (Hero split layout with live AI chat above the fold) */}
        <section id="home" className="min-h-[calc(100vh-4rem)] flex items-center bg-white py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-6 md:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Primary Professional Facts */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  {/* Availability status line */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-alt text-text-muted text-[11px] font-mono tracking-tight font-semibold border border-border mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-text-subtle animate-pulse"></span>
                    Available for select contracts &amp; roles
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text leading-tight uppercase font-sans">
                    Matan <span className="block text-text-muted">// 2288</span>
                  </h1>
                </div>

                <p className="text-base text-text-muted leading-relaxed">
                  Full-Stack Specialist with 4 years of experience building checkout systems and analytics integrations for major telecoms including Altice, 3UK, and USCC.
                </p>

                {/* Quantitative Highlights List */}
                <div className="grid grid-cols-2 gap-4 py-2 border-y border-border">
                  <div>
                    <span className="block text-xl font-bold text-text">04 Years</span>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Enterprise Work</span>
                  </div>
                  <div>
                    <span className="block text-xl font-bold text-accent">3 Telecoms</span>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Altice, 3UK, USCC</span>
                  </div>
                </div>

                {/* Primary Interaction Links */}
                <div className="flex flex-wrap items-center gap-4">
                  <a 
                    href="#experience"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-mono uppercase tracking-wider rounded-lg shadow-sm transition-all"
                  >
                    Explore Contracts <ArrowRight size={13} />
                  </a>
                  <a 
                    href="#contact"
                    className="inline-flex items-center gap-1 px-4 py-2.5 bg-white border border-border hover:border-text text-text-muted hover:text-text text-xs font-mono uppercase tracking-wider rounded-lg transition-all"
                  >
                    Inquire parameters
                  </a>
                </div>
              </div>

              {/* Right Column: Prominent Embedded AI Chat Sandbox */}
              <div className="lg:col-span-6">
                <div className="bg-bg-alt rounded-2xl p-4 md:p-6 border border-border/80">
                  <div className="mb-2 pl-1">
                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block font-bold">
                      00 // Interactive Sandbox Route
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

        {/* Section 01 — About (Alternating Background: `#F8FAFC`) */}
        <section id="about" className="py-20 md:py-28 bg-bg-alt border-t border-border">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <SectionLabel num="01" title="About &amp; Tech" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
              <div className="lg:col-span-5">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text uppercase leading-tight">
                  High technical standards. Rigorous engineering form.
                </h2>
              </div>
              <div className="lg:col-span-7 space-y-4 text-text-muted text-sm sm:text-base leading-relaxed">
                <p>
                  I treat digital systems with absolute discipline. In enterprise checkouts where every extra block of script increases bundle weights and ruins customer transaction rates, I commit to lightweight component loops, clean type handling, and robust analytical tracking coverage.
                </p>
                <p>
                  Over my 4 years of client-facing deliverables, I have established a track record of resolving critical bottlenecks on production lines, managing secure Adobe OKTA integrations, and presenting technical diagnostics directly to stakeholder matrices.
                </p>
              </div>
            </div>

            {/* Interactive pillars with responsive tab selector */}
            <div className="border border-border rounded-2xl p-6 bg-white shadow-xs mb-16">
              <div className="flex gap-2 overflow-x-auto pb-4 border-b border-border scrollbar-none">
                {portfolioPillars.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPillarId(p.id)}
                    className={`px-3.5 py-2 font-mono text-[10px] uppercase tracking-wide rounded-lg border transition-all cursor-pointer whitespace-nowrap outline-none ${
                      selectedPillarId === p.id
                        ? 'bg-accent border-accent text-white font-bold shadow-xs'
                        : 'bg-bg-alt border-border text-text-muted hover:text-text'
                    }`}
                  >
                    {p.num} / {p.id}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block mb-1">
                  {selectedPillar.subtitle}
                </span>
                <h4 className="text-base font-bold text-text uppercase mb-2">
                  {selectedPillar.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed max-w-3xl">
                  {selectedPillar.desc}
                </p>
              </div>
            </div>

            {/* Tech Stack integrated directly into Section 01 */}
            <div className="pt-12 border-t border-border/60">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4">
                  <span className="text-[10px] uppercase tracking-widest text-text-muted block mb-1">
                    01.2 // Toolsets
                  </span>
                  <h3 className="text-xl font-bold uppercase text-text tracking-tight mb-3">
                    Enterprise Tech Stack
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Selected specifically for high-converting checkout buyflows, telemetry integrations, and server scalability.
                  </p>
                </div>
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolioSkills.map((cat, idx) => (
                    <div key={idx} className="bg-bg-alt border border-border rounded-xl p-5 hover:shadow-2xs transition-all">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-3">
                        {cat.title}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.items.map((skill) => (
                          <span 
                            key={skill}
                            className="px-2.5 py-1 rounded-md text-[11px] font-medium text-text bg-white border border-border hover:border-text transition-colors cursor-default select-none"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Section 02 — Experience & Deliverables (Background: `#FFFFFF`) */}
        <section id="experience" className="py-20 md:py-28 bg-white border-t border-border">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <SectionLabel num="02" title="Experience &amp; Case Studies" />
            
            {/* Header row with text and the modern visual toggle controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div className="max-w-xl">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text uppercase leading-tight mb-2">
                  High-Impact Case Deliverables
                </h2>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  Contract delivery roles optimizing high-converting subscriber checkouts, checkout state pipelines, and telemetry-tracking analytics.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start md:self-auto">
                <div className="flex bg-bg-alt border border-border p-1 rounded-xl">
                  <button
                    onClick={() => setExpViewMode('carousel')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      expViewMode === 'carousel'
                        ? 'bg-white text-text shadow-2xs border border-border'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    <SlidersHorizontal size={11} />
                    <span>Carousel</span>
                  </button>
                  <button
                    onClick={() => setExpViewMode('grid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      expViewMode === 'grid'
                        ? 'bg-white text-text shadow-2xs border border-border'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    <LayoutGrid size={11} />
                    <span>Grid View</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Render chosen view mode */}
            {expViewMode === 'carousel' ? (
              <div className="max-w-4xl">
                <AnimatePresence mode="wait">
                  {portfolioExperiences.map((exp, idx) => {
                    if (idx !== activeExpIdx) return null;
                    const caseDescription = exp.company.includes("Altice")
                      ? "Migrated the legacy React enterprise portal system into Drupal and Vue 3 custom components. Completely rebuilt the subscriber buyflow pathways, reducing transaction times."
                      : exp.company.includes("UK")
                      ? "Delivered high-performance mobile wrappers and order paths using React and Redux-Saga. Resolved live checkout bottlenecks and high-concurrency race conditions during broadband product launches."
                      : "Designed automated component packages using Adobe Experience Manager (AEM). Configured custom lightweight JS routines to feed user interactions and buyflow navigation states straight to GA4 dataLayers.";

                    return (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.2 }}
                        className="group bg-bg-alt p-6 md:p-8 rounded-2xl border border-border hover:border-text transition-all duration-300 relative"
                      >
                        <div className="absolute left-[-2px] top-6 w-[4px] h-[40px] bg-text-subtle group-hover:bg-text transition-colors rounded-r-lg"></div>
                        
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                          <div>
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                              0{idx + 1} // {exp.company} // {exp.location}
                            </span>
                            <h4 className="text-lg font-bold text-text uppercase">
                              {exp.role}
                            </h4>
                          </div>
                          <span className="text-xs text-text-muted font-medium bg-white border border-border px-3 py-1 rounded-lg shrink-0 self-start md:self-auto">
                            {exp.period}
                          </span>
                        </div>

                        <p className="text-xs text-[#4B5563] leading-relaxed mb-6 italic max-w-3xl">
                          {caseDescription}
                        </p>

                        <ul className="space-y-3 mb-6">
                          {exp.bullets.map((bullet, bulletIdx) => (
                            <li key={bulletIdx} className="text-xs sm:text-sm text-[#4B5563] leading-relaxed flex items-start gap-2.5">
                              <CheckCircle className="text-text-subtle shrink-0 mt-0.5" size={14} />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/60">
                          {exp.skills.map((s) => (
                            <span key={s} className="text-[10px] text-text bg-white border border-border px-2.5 py-1 rounded-md">
                              {s}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Carousel Controls */}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex gap-1.5">
                    {portfolioExperiences.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveExpIdx(i)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          activeExpIdx === i ? 'w-6 bg-text' : 'w-1.5 bg-border hover:bg-text-subtle'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={prevExp}
                      className="p-2 border border-border rounded-xl bg-white hover:border-text text-text-muted hover:text-text transition-all shadow-2xs cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="font-mono text-xs text-text-muted select-none">
                      0{activeExpIdx + 1} / 0{portfolioExperiences.length}
                    </span>
                    <button 
                      onClick={nextExp}
                      className="p-2 border border-border rounded-xl bg-white hover:border-text text-text-muted hover:text-text transition-all shadow-2xs cursor-pointer"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {portfolioExperiences.map((exp, idx) => {
                  const caseDescription = exp.company.includes("Altice")
                    ? "Migrated legacy React portal systems to modern Drupal & Vue 3 custom components."
                    : exp.company.includes("UK")
                    ? "Delivered broadband order checkouts in React & Redux-Saga; optimized webpack bundles."
                    : "Built lightweight component modules in AEM. Crafted auto-tracking JS script layouts.";

                  return (
                    <div key={idx} className="bg-bg-alt p-5 rounded-2xl border border-border hover:border-text transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">
                            0{idx + 1} // {exp.company}
                          </span>
                          <span className="text-[10px] text-text-subtle font-mono">{exp.period}</span>
                        </div>
                        <h4 className="text-sm font-bold text-text uppercase mb-1">
                          {exp.role}
                        </h4>
                        <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
                          {caseDescription}
                        </p>
                        
                        <ul className="space-y-1.5 mb-4 text-[11px] text-text-muted">
                          {exp.bullets.slice(0, 2).map((bullet, bulletIdx) => (
                            <li key={bulletIdx} className="line-clamp-2">
                              • {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-3 border-t border-border/40">
                        {exp.skills.slice(0, 4).map((s) => (
                          <span key={s} className="text-[9px] text-text bg-white border border-border px-1.5 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                        {exp.skills.length > 4 && (
                          <span className="text-[9px] text-text-subtle px-1 py-0.5 font-mono">
                            +{exp.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Section 03 — Testimonials (Alternating Background: `#F8FAFC`) */}
        <section id="testimonials" className="py-20 md:py-28 bg-bg-alt border-t border-border">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <SectionLabel num="03" title="Testimonials" />
            
            {/* Header row with toggle controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div className="max-w-xl">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text uppercase leading-tight mb-2">
                  Client Testimonials
                </h2>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  What delivery leads, principal engineers, and stakeholders say about our joint contract delivery.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start md:self-auto">
                <div className="flex bg-white border border-border p-1 rounded-xl">
                  <button
                    onClick={() => setTestViewMode('carousel')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      testViewMode === 'carousel'
                        ? 'bg-bg-alt text-text shadow-2xs border border-border'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    <SlidersHorizontal size={11} />
                    <span>Carousel</span>
                  </button>
                  <button
                    onClick={() => setTestViewMode('grid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      testViewMode === 'grid'
                        ? 'bg-bg-alt text-text shadow-2xs border border-border'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    <LayoutGrid size={11} />
                    <span>Grid View</span>
                  </button>
                </div>
              </div>
            </div>

            {testViewMode === 'carousel' ? (
              <div className="relative bg-white border border-border p-8 md:p-12 rounded-3xl shadow-2xs overflow-hidden">
                <div className="absolute right-6 top-4 text-8xl font-serif text-neutral-100 select-none pointer-events-none">
                  “
                </div>
                <AnimatePresence mode="wait">
                  {portfolioRecommendations.map((rec, idx) => {
                    if (idx !== activeTestIdx) return null;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6 relative z-10"
                      >
                        <p className="text-sm sm:text-base text-text leading-relaxed font-serif italic max-w-4xl">
                          "{rec.quote}"
                        </p>
                        <div>
                          <h5 className="font-bold text-sm text-text uppercase">
                            {rec.author}
                          </h5>
                          <div className="text-xs font-mono text-text-muted mt-1">
                            {rec.role} · <span className="font-semibold text-accent">{rec.company}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Navigation and Indicator bar */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/60">
                  <div className="flex gap-1.5">
                    {portfolioRecommendations.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTestIdx(i)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          activeTestIdx === i ? 'w-6 bg-text' : 'w-1.5 bg-border hover:bg-text-subtle'
                        }`}
                        aria-label={`Go to testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={prevTest}
                      className="p-2 border border-border rounded-xl bg-bg-alt hover:border-text text-text-muted hover:text-text transition-all cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="font-mono text-xs text-text-muted select-none">
                      0{activeTestIdx + 1} / 0{portfolioRecommendations.length}
                    </span>
                    <button 
                      onClick={nextTest}
                      className="p-2 border border-border rounded-xl bg-bg-alt hover:border-text text-text-muted hover:text-text transition-all cursor-pointer"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
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
            )}

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

              {/* Right Column: Inquiries parameters Form */}
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
                    <div>
                      <label className="text-[10px] font-mono text-text-muted uppercase block mb-1.5 font-bold">
                        Hiring / Client Coordinates (Email)
                      </label>
                      <input 
                        type="email" 
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="hiring@techcluster.com"
                        className="w-full bg-white border border-border rounded-lg px-4 py-2.5 text-xs text-text font-mono tracking-tight outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-text-muted uppercase block mb-1.5 font-bold">
                        Project Structuring &amp; Target parameters
                      </label>
                      <textarea 
                        required
                        rows={5}
                        value={contactMsg}
                        onChange={(e) => setContactMsg(e.target.value)}
                        placeholder="Detail the target tech stack, contract terms, or core challenges..."
                        className="w-full bg-white border border-border rounded-lg px-4 py-2.5 text-xs text-text font-sans outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none leading-relaxed transition-all"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-mono uppercase bg-accent hover:bg-accent-hover text-white transition-colors rounded-lg font-bold shadow-xs cursor-pointer outline-none"
                    >
                      Transmit Inquiries <ArrowRight size={12} />
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Editorial Footer */}
      <footer className="bg-bg-alt border-t border-border py-12 text-center text-text-muted">
        <div className="max-w-6xl mx-auto px-6 text-[10px] font-mono tracking-widest uppercase space-y-2">
          <p>© 2026 MATAN2288. DETAILED COMPLIANCE METRICS. ALL SYSTEMS OPTIMIZED.</p>
          <p className="font-sans text-[9px] text-text-subtle lowercase tracking-normal">
            built with React 19, TypeScript, and live Gemini RAG assistant middleware integration
          </p>
        </div>
      </footer>

    </div>
  );
}
