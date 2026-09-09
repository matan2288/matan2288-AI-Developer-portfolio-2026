import React, { useState, useRef } from 'react';
import { 
  Save, 
  RotateCcw, 
  ArrowLeft, 
  ExternalLink, 
  Check, 
  FileText, 
  Layers, 
  Briefcase, 
  Award, 
  Database, 
  Plus, 
  Trash2, 
  Code,
  Sparkles,
  ChevronRight,
  Eye,
  Globe,
  Upload
} from 'lucide-react';
import { 
  getStoredTinaContent, 
  saveTinaContent, 
  resetTinaContentToDefaults, 
  defaultTinaContent,
  PortfolioGeneralContent 
} from '../services/tinaContent';
import { PillarItem, SkillCategory, ExperienceItem, RecommendationItem, CertificationItem } from '../features/dashboard/types';
import { HeroContainer } from './HeroContainer';
import { AboutContainer } from './AboutContainer';
import { ExperienceContainer } from './ExperienceContainer';
import { TestimonialsContainer } from './TestimonialsContainer';
import { ContactContainer } from './ContactContainer';
import { FooterContainer } from './FooterContainer';

interface AdminPageContainerProps {
  onBackToPortfolio: () => void;
}

export const AdminPageContainer: React.FC<AdminPageContainerProps> = ({ onBackToPortfolio }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'pillars' | 'skills' | 'experiences' | 'testimonials' | 'certifications' | 'blog' | 'json'>('general');
  const [cmsState, setCmsState] = useState(() => getStoredTinaContent());
  const [mobilePanel, setMobilePanel] = useState<'editor' | 'preview'>('editor');
  const [isSaved, setIsSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const previewScrollRef = useRef<HTMLDivElement>(null);

  // Sync state changes
  const handleStateChange = (updater: (prev: typeof cmsState) => typeof cmsState) => {
    setCmsState((prev: typeof cmsState) => {
      const next = updater(prev);
      setHasUnsavedChanges(true);
      return next;
    });
  };

  // Save changes to persistent storage
  const handleSave = () => {
    saveTinaContent(cmsState);
    setHasUnsavedChanges(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Reset to defaults
  const handleReset = () => {
    if (confirm('Are you sure you want to reset all portfolio data back to default TinaCMS JSON collections? This will override unsaved modifications.')) {
      resetTinaContentToDefaults();
      const defaults = getStoredTinaContent();
      setCmsState(defaults);
      setHasUnsavedChanges(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  // Open preview in a new window/tab
  const handleOpenNewTab = () => {
    window.open(window.location.origin + window.location.pathname, '_blank');
  };

  // Jump to section in preview scroll container
  const scrollToSectionInPreview = (sectionId: string) => {
    if (!previewScrollRef.current) return;
    const target = previewScrollRef.current.querySelector(`#preview-${sectionId}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Field updaters
  const updateGeneralField = (field: keyof PortfolioGeneralContent, val: any) => {
    handleStateChange(prev => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        [field]: val,
      },
    }));
  };

  const addStat = () => {
    const current = cmsState.portfolio.stats || [];
    updateGeneralField('stats', [...current, { value: '100%', label: 'Key Achievement' }]);
  };

  const deleteStat = (index: number) => {
    const current = cmsState.portfolio.stats || [];
    if (current.length <= 1) {
      alert('You must keep at least one metric.');
      return;
    }
    const updated = current.filter((_, i) => i !== index);
    updateGeneralField('stats', updated);
  };

  // Pillar handlers
  const addPillar = () => {
    const count = cmsState.pillars.length + 1;
    const newPillar: PillarItem = {
      id: `Pillar ${count}`,
      num: `01.${count}X`,
      title: 'New Architecture Pillar',
      subtitle: 'Technical Domain',
      desc: 'Describe this technical pillar or key domain capability here...',
    };
    handleStateChange(prev => ({ ...prev, pillars: [...prev.pillars, newPillar] }));
  };

  const updatePillar = (index: number, field: keyof PillarItem, val: string) => {
    const updated = [...cmsState.pillars];
    updated[index] = { ...updated[index], [field]: val };
    handleStateChange(prev => ({ ...prev, pillars: updated }));
  };

  const deletePillar = (index: number) => {
    if (cmsState.pillars.length <= 1) {
      alert('You must keep at least one Pillar card.');
      return;
    }
    const updated = cmsState.pillars.filter((_, i) => i !== index);
    handleStateChange(prev => ({ ...prev, pillars: updated }));
  };

  // Skill category handlers
  const addSkillCategory = () => {
    const newCat: SkillCategory = {
      title: 'New Toolset Category',
      items: ['Item 1', 'Item 2', 'Item 3'],
    };
    handleStateChange(prev => ({ ...prev, skills: [...prev.skills, newCat] }));
  };

  const deleteSkillCategory = (index: number) => {
    if (cmsState.skills.length <= 1) {
      alert('You must keep at least one Skill category.');
      return;
    }
    const updated = cmsState.skills.filter((_, i) => i !== index);
    handleStateChange(prev => ({ ...prev, skills: updated }));
  };

  // Experience handlers
  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp_${Date.now()}`,
      company: 'New Enterprise Corp',
      role: 'Staff Engineer',
      location: 'Remote / Hybrid',
      period: '2025 — PRESENT',
      isLatest: false,
      bullets: [
        'Architected high-throughput services with automated CI/CD pipeline.',
        'Engineered responsive customer buyflow journeys resulting in +18% conversion.'
      ],
      skills: ['TypeScript', 'React', 'Node.js', 'TinaCMS']
    };
    handleStateChange(prev => ({ ...prev, experiences: [newExp, ...prev.experiences] }));
  };

  const updateExperience = (index: number, field: keyof ExperienceItem, val: any) => {
    const updated = [...cmsState.experiences];
    updated[index] = { ...updated[index], [field]: val };
    handleStateChange(prev => ({ ...prev, experiences: updated }));
  };

  const deleteExperience = (index: number) => {
    if (cmsState.experiences.length <= 1) {
      alert('You must keep at least one Experience card.');
      return;
    }
    const updated = cmsState.experiences.filter((_, i) => i !== index);
    handleStateChange(prev => ({ ...prev, experiences: updated }));
  };

  // Testimonial handlers
  const addRecommendation = () => {
    const newRec: RecommendationItem = {
      quote: 'Matan is an exceptional engineer who consistently ships reliable, high-performance web systems.',
      author: 'VP of Engineering',
      role: 'Technical Leadership',
      company: 'Enterprise Partner'
    };
    handleStateChange(prev => ({ ...prev, recommendations: [...prev.recommendations, newRec] }));
  };

  const updateRecommendation = (index: number, field: keyof RecommendationItem, val: string) => {
    const updated = [...cmsState.recommendations];
    updated[index] = { ...updated[index], [field]: val };
    handleStateChange(prev => ({ ...prev, recommendations: updated }));
  };

  const deleteRecommendation = (index: number) => {
    if (cmsState.recommendations.length <= 1) {
      alert('You must keep at least one Testimonial card.');
      return;
    }
    const updated = cmsState.recommendations.filter((_, i) => i !== index);
    handleStateChange(prev => ({ ...prev, recommendations: updated }));
  };

  const updateCertification = (index: number, field: string, val: any) => {
    const certs = cmsState.certifications || defaultTinaContent.certifications;
    const updated = [...certs];
    updated[index] = { ...updated[index], [field]: val };
    handleStateChange(prev => ({ ...prev, certifications: updated }));
  };

  const addCertification = () => {
    const certs = cmsState.certifications || defaultTinaContent.certifications;
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      title: 'New Professional Certificate',
      issuer: 'Certification Authority',
      issueDate: '2025',
      credentialId: 'CERT-00000',
      description: 'Credential verifying advanced proficiency and system architecture mastery.',
      driveUrl: 'https://drive.google.com/file/d/1lU2k3u7W2jB3w6eQ8r9s0t1u2v3w4x5y/preview',
      skills: ['Cloud Architecture', 'Security']
    };
    handleStateChange(prev => ({ ...prev, certifications: [...certs, newCert] }));
  };

  const deleteCertification = (index: number) => {
    const certs = cmsState.certifications || defaultTinaContent.certifications;
    if (certs.length <= 1) {
      alert('You must keep at least one Certification item.');
      return;
    }
    const updated = certs.filter((_, i) => i !== index);
    handleStateChange(prev => ({ ...prev, certifications: updated }));
  };

  return (
    <div className="h-screen h-[100dvh] max-h-screen bg-bg-alt flex flex-col font-sans text-text antialiased overflow-hidden">
      
      {/* Studio Header Bar - Spacious, Air-Gapped & Classy */}
      <header className="bg-white/95 backdrop-blur-md border-b border-border/80 px-4 sm:px-7 min-h-[64px] h-16 sm:h-18 pt-2 sm:pt-2.5 pb-2 sm:pb-2.5 flex items-center justify-between z-30 shrink-0 shadow-2xs">
        {/* Left: Back & Context */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={onBackToPortfolio}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-text bg-white hover:bg-neutral-50 border border-border/80 hover:border-neutral-300 transition-all cursor-pointer shadow-2xs group shrink-0"
            title="Return to public portfolio"
          >
            <ArrowLeft size={14} className="text-text-muted group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Back to Portfolio</span>
            <span className="sm:hidden">Portfolio</span>
          </button>

          <div className="h-5 w-px bg-border/70 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold tracking-tight text-text hidden sm:inline">
              Content Studio
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-neutral-50 text-text-muted border border-border/60">
              <span className={`w-1.5 h-1.5 rounded-full ${hasUnsavedChanges ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
              <span>{hasUnsavedChanges ? 'Unsaved edits' : 'Synced'}</span>
            </span>
          </div>
        </div>

        {/* Mobile View Toggle (< md screens only) */}
        <div className="flex md:hidden items-center p-1 bg-neutral-50 rounded-xl border border-border/70 shadow-2xs">
          <button
            onClick={() => setMobilePanel('editor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              mobilePanel === 'editor'
                ? 'bg-white text-text font-semibold shadow-2xs border border-border/40'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setMobilePanel('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              mobilePanel === 'preview'
                ? 'bg-white text-text font-semibold shadow-2xs border border-border/40'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            onClick={handleOpenNewTab}
            title="Open live site in separate tab"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-text bg-white hover:bg-neutral-50 border border-border/80 hover:border-neutral-300 transition-all cursor-pointer shadow-2xs"
          >
            <ExternalLink size={13} className="text-text-muted" />
            <span className="hidden sm:inline">Live Site</span>
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-red-600 hover:bg-red-50/70 border border-transparent hover:border-red-200/60 transition-all cursor-pointer"
            title="Reset all content to initial defaults"
          >
            <RotateCcw size={12} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleSave}
            className={`inline-flex items-center gap-2 px-4 sm:px-4.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer border ${
              isSaved
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300 ring-2 ring-emerald-200/40'
                : 'bg-white hover:bg-neutral-50 text-text border-border/80 hover:border-neutral-300 active:scale-[0.98]'
            }`}
          >
            {isSaved ? <Check size={13} className="text-emerald-600" /> : <Save size={13} className="text-text-muted" />}
            <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
          </button>
        </div>
      </header>

      {/* Studio Workspace Main Split View */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        
        {/* Left Side: Headless Content Schema Form Inspector */}
        <div className={`${mobilePanel === 'editor' ? 'flex' : 'hidden md:flex'} w-full md:w-[460px] lg:w-[490px] xl:w-[530px] 2xl:w-[570px] bg-white border-r border-border/80 flex-col shrink-0 h-full min-h-0 overflow-hidden`}>
          
          {/* Schema Category Tabs */}
          <div className="px-3.5 py-2.5 border-b border-border bg-neutral-50/70 overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
            {[
              { id: 'general', label: 'General', icon: FileText },
              { id: 'pillars', label: `Pillars (${cmsState.pillars.length})`, icon: Layers },
              { id: 'skills', label: `Skills (${cmsState.skills.length})`, icon: Database },
              { id: 'experiences', label: `Experience (${cmsState.experiences.length})`, icon: Briefcase },
              { id: 'testimonials', label: `Testimonials (${cmsState.recommendations.length})`, icon: Award },
              { id: 'certifications', label: `Certs (${(cmsState.certifications || defaultTinaContent.certifications).length})`, icon: Award },
              { id: 'blog', label: 'Blog Embed', icon: Globe },
              { id: 'json', label: 'JSON', icon: Code },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-white text-text font-semibold shadow-2xs border border-border/80'
                      : 'text-text-muted hover:text-text hover:bg-neutral-100/70'
                  }`}
                >
                  <Icon size={13} className={isActive ? 'text-text' : 'text-text-muted'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Form Fields */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="pb-3 border-b border-border/70">
                  <h3 className="text-xs font-semibold text-text">Developer Profile & Bio</h3>
                  <p className="text-[11px] text-text-muted mt-0.5">Live updates reflect immediately in the right preview canvas.</p>
                </div>

                <div className="p-5 bg-white border border-border/80 rounded-xl shadow-2xs space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-text-muted mb-1.5">Developer Name</label>
                      <input
                        type="text"
                        value={cmsState.portfolio.developerName}
                        onChange={(e) => updateGeneralField('developerName', e.target.value)}
                        className="w-full px-3.5 py-2 border border-border rounded-lg text-xs font-semibold bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-text-muted mb-1.5">Professional Title</label>
                      <input
                        type="text"
                        value={cmsState.portfolio.title}
                        onChange={(e) => updateGeneralField('title', e.target.value)}
                        className="w-full px-3.5 py-2 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-text-muted mb-1.5">Location</label>
                      <input
                        type="text"
                        value={cmsState.portfolio.location}
                        onChange={(e) => updateGeneralField('location', e.target.value)}
                        className="w-full px-3.5 py-2 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-text-muted mb-1.5">Avatar Image URL or Direct File Upload</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={cmsState.portfolio.avatarUrl}
                          onChange={(e) => updateGeneralField('avatarUrl', e.target.value)}
                          placeholder="/profile.png or paste image URL"
                          className="flex-1 px-3.5 py-2 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all"
                        />
                        <label className="px-3 py-2 border border-border hover:border-text rounded-lg text-xs font-medium cursor-pointer bg-neutral-50 hover:bg-white transition-colors shrink-0 flex items-center gap-1.5 text-text">
                          <Upload className="w-3.5 h-3.5 text-text-muted" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  if (ev.target?.result) {
                                    updateGeneralField('avatarUrl', ev.target.result as string);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-text-muted mb-1.5">Hero Bio Summary</label>
                    <textarea
                      rows={3}
                      value={cmsState.portfolio.heroBio}
                      onChange={(e) => updateGeneralField('heroBio', e.target.value)}
                      className="w-full px-3.5 py-2 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all leading-relaxed"
                    />
                  </div>
                </div>

                <div className="p-5 bg-white border border-border/80 rounded-xl shadow-2xs space-y-4">
                  <div>
                    <label className="block text-[11px] font-medium text-text-muted mb-1.5">About Section Headline</label>
                    <input
                      type="text"
                      value={cmsState.portfolio.aboutTitle}
                      onChange={(e) => updateGeneralField('aboutTitle', e.target.value)}
                      className="w-full px-3.5 py-2 border border-border rounded-lg text-xs font-semibold bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-text-muted mb-1.5">About Paragraph 1</label>
                    <textarea
                      rows={3}
                      value={cmsState.portfolio.aboutBio1}
                      onChange={(e) => updateGeneralField('aboutBio1', e.target.value)}
                      className="w-full px-3.5 py-2 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-text-muted mb-1.5">About Paragraph 2 (Philosophy)</label>
                    <textarea
                      rows={2}
                      value={cmsState.portfolio.aboutBio2}
                      onChange={(e) => updateGeneralField('aboutBio2', e.target.value)}
                      className="w-full px-3.5 py-2 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all leading-relaxed"
                    />
                  </div>
                </div>

                <div className="p-5 bg-white border border-border/80 rounded-xl shadow-2xs space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-text-muted mb-1.5">Contact Email</label>
                      <input
                        type="email"
                        value={cmsState.portfolio.contactEmail}
                        onChange={(e) => updateGeneralField('contactEmail', e.target.value)}
                        className="w-full px-3.5 py-2 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-text-muted mb-1.5">LinkedIn Profile URL</label>
                      <input
                        type="text"
                        value={cmsState.portfolio.linkedInUrl}
                        onChange={(e) => updateGeneralField('linkedInUrl', e.target.value)}
                        className="w-full px-3.5 py-2 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Blog iFrame URL Configuration */}
                  <div className="pt-2 border-t border-border/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-medium text-text-muted">
                        Blog iFrame URL (Full-Screen View)
                      </label>
                      <span className="text-[10px] text-text-subtle font-medium">Editor Mode Only</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="url"
                        placeholder="https://ai.google/blog/"
                        value={cmsState.portfolio.blogUrl || ''}
                        onChange={(e) => updateGeneralField('blogUrl', e.target.value)}
                        className="flex-1 px-3.5 py-2 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all font-mono text-text"
                      />
                      {cmsState.portfolio.blogUrl && (
                        <a
                          href={cmsState.portfolio.blogUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border border-border hover:bg-neutral-100 text-text-muted hover:text-text transition-colors shrink-0"
                          title="Test URL in new tab"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantitative Stats */}
                <div className="p-5 bg-white border border-border/80 rounded-xl shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-border/60">
                    <div>
                      <h4 className="text-xs font-semibold text-text">Hero Quantitative Stats</h4>
                      <p className="text-[11px] text-text-muted mt-0.5">Metrics displayed in the experience highlight strip.</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] text-text-muted">{cmsState.portfolio.stats?.length || 0} metrics</span>
                      <button
                        type="button"
                        onClick={addStat}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-neutral-50 border border-border text-text text-xs font-medium rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                        <span>Add Metric</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {cmsState.portfolio.stats?.map((st: { value: string; label: string }, idx: number) => (
                      <div key={idx} className="p-3.5 bg-neutral-50/70 rounded-lg border border-border/70 space-y-2.5 relative group">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Metric #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => deleteStat(idx)}
                            className="p-1 text-text-muted hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Delete metric"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-text-muted mb-1">Metric Value</label>
                          <input
                            type="text"
                            value={st.value}
                            onChange={(e) => {
                              const newStats = [...cmsState.portfolio.stats];
                              newStats[idx].value = e.target.value;
                              updateGeneralField('stats', newStats);
                            }}
                            className="w-full px-3 py-1.5 border border-border rounded-lg text-xs bg-white font-bold outline-none focus:border-text"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-text-muted mb-1">Metric Label</label>
                          <input
                            type="text"
                            value={st.label}
                            onChange={(e) => {
                              const newStats = [...cmsState.portfolio.stats];
                              newStats[idx].label = e.target.value;
                              updateGeneralField('stats', newStats);
                            }}
                            className="w-full px-3 py-1.5 border border-border rounded-lg text-xs bg-white text-text-muted outline-none focus:border-text"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pillars Tab */}
            {activeTab === 'pillars' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border/70">
                  <div>
                    <h3 className="text-xs font-semibold text-text">
                      Engineering Pillar Cards ({cmsState.pillars.length})
                    </h3>
                    <p className="text-[11px] text-text-muted mt-0.5">Core architectural pillars and interactive competencies.</p>
                  </div>
                  <button
                    onClick={addPillar}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-50 border border-border text-text text-xs font-medium rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Card</span>
                  </button>
                </div>

                {cmsState.pillars.map((pillar: PillarItem, idx: number) => (
                  <div key={pillar.id || idx} className="p-5 border border-border/80 rounded-xl bg-white shadow-2xs space-y-4 relative group">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-text">Pillar #{idx + 1}</span>
                        <span className="text-[11px] font-mono text-text-muted px-1.5 py-0.5 bg-neutral-100 rounded border border-border/60">{pillar.num}</span>
                      </div>
                      <button
                        onClick={() => deletePillar(idx)}
                        title="Remove Card"
                        className="text-text-muted hover:text-red-600 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-text-muted mb-1">Identifier / Num</label>
                        <input
                          type="text"
                          value={pillar.num}
                          onChange={(e) => updatePillar(idx, 'num', e.target.value)}
                          className="w-full px-3 py-1.5 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-text-muted mb-1">Title</label>
                        <input
                          type="text"
                          value={pillar.title}
                          onChange={(e) => updatePillar(idx, 'title', e.target.value)}
                          className="w-full px-3 py-1.5 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-text-muted mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={pillar.subtitle}
                          onChange={(e) => updatePillar(idx, 'subtitle', e.target.value)}
                          className="w-full px-3 py-1.5 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-text-muted mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={pillar.desc}
                        onChange={(e) => updatePillar(idx, 'desc', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border/70">
                  <div>
                    <h3 className="text-xs font-semibold text-text">
                      Skill Toolset Categories ({cmsState.skills.length})
                    </h3>
                    <p className="text-[11px] text-text-muted mt-0.5">Categorized tech stacks and enterprise competencies.</p>
                  </div>
                  <button
                    onClick={addSkillCategory}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-50 border border-border text-text text-xs font-medium rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Category</span>
                  </button>
                </div>

                {cmsState.skills.map((cat: SkillCategory, idx: number) => (
                  <div key={idx} className="p-5 border border-border/80 rounded-xl bg-white shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                      <div className="flex items-center gap-2 w-full max-w-sm">
                        <label className="text-[11px] font-medium text-text-muted shrink-0">Category Name:</label>
                        <input
                          type="text"
                          value={cat.title}
                          onChange={(e) => {
                            const newSkills = [...cmsState.skills];
                            newSkills[idx].title = e.target.value;
                            handleStateChange(prev => ({ ...prev, skills: newSkills }));
                          }}
                          className="font-medium text-xs text-text border border-border rounded-lg px-3 py-1 bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all w-full"
                        />
                      </div>
                      <button
                        onClick={() => deleteSkillCategory(idx)}
                        title="Remove Category"
                        className="text-text-muted hover:text-red-600 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-text-muted mb-1.5">
                        Skill Items (comma separated)
                      </label>
                      <input
                        type="text"
                        value={(cat.items || []).join(', ')}
                        onChange={(e) => {
                          const items = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          const newSkills = [...cmsState.skills];
                          newSkills[idx].items = items;
                          handleStateChange(prev => ({ ...prev, skills: newSkills }));
                        }}
                        className="w-full px-3.5 py-2 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all"
                        placeholder="React, TypeScript, GraphQL, Node.js..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Experiences Tab */}
            {activeTab === 'experiences' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border/70">
                  <div>
                    <h3 className="text-xs font-semibold text-text">
                      Career Experiences ({cmsState.experiences.length})
                    </h3>
                    <p className="text-[11px] text-text-muted mt-0.5">Timeline roles, achievements, and technology tags.</p>
                  </div>
                  <button
                    onClick={addExperience}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-50 border border-border text-text text-xs font-medium rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Experience</span>
                  </button>
                </div>

                {cmsState.experiences.map((exp: ExperienceItem, idx: number) => (
                  <div key={exp.id || idx} className="p-5 border border-border/80 rounded-xl bg-white shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2.5 text-xs font-semibold text-text">
                      <span>{exp.company || 'New Company'} <span className="text-border/80 mx-1">/</span> <span className="font-normal text-text-muted">{exp.role}</span></span>
                      <div className="flex items-center gap-2">
                        <span className="text-text-muted text-[11px] font-normal">{exp.period}</span>
                        <button
                          onClick={() => deleteExperience(idx)}
                          title="Remove Card"
                          className="text-text-muted hover:text-red-600 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-text-muted mb-1">Role Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                          className="w-full px-3 py-1.5 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-text-muted mb-1">Company / Org</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                          className="w-full px-3 py-1.5 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-text-muted mb-1">Period</label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => updateExperience(idx, 'period', e.target.value)}
                          className="w-full px-3 py-1.5 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-text-muted mb-1">
                        Achievement Bullets (one per line)
                      </label>
                      <textarea
                        rows={3}
                        value={(exp.bullets || []).join('\n')}
                        onChange={(e) => {
                          const newBullets = e.target.value.split('\n').filter(line => line.trim().length > 0);
                          updateExperience(idx, 'bullets', newBullets);
                        }}
                        className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all leading-relaxed"
                        placeholder="Bullet 1&#10;Bullet 2&#10;Bullet 3"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-text-muted mb-1">
                        Skill Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={(exp.skills || []).join(', ')}
                        onChange={(e) => {
                          const newSkills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          updateExperience(idx, 'skills', newSkills);
                        }}
                        className="w-full px-3 py-1.5 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all"
                        placeholder="TypeScript, React, Node.js"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Testimonials Tab */}
            {activeTab === 'testimonials' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border/70">
                  <div>
                    <h3 className="text-xs font-semibold text-text">
                      Client & Partner Endorsements ({cmsState.recommendations.length})
                    </h3>
                    <p className="text-[11px] text-text-muted mt-0.5">Testimonial quotes and author credentials.</p>
                  </div>
                  <button
                    onClick={addRecommendation}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-50 border border-border text-text text-xs font-medium rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Testimonial</span>
                  </button>
                </div>

                {cmsState.recommendations.map((rec: RecommendationItem, idx: number) => (
                  <div key={idx} className="p-5 border border-border/80 rounded-xl bg-white shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                      <span className="text-xs font-semibold text-text">
                        Testimonial #{idx + 1} <span className="text-border/80 mx-1">/</span> <span className="font-normal text-text-muted">{rec.company}</span>
                      </span>
                      <button
                        onClick={() => deleteRecommendation(idx)}
                        title="Remove Card"
                        className="text-text-muted hover:text-red-600 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-text-muted mb-1">Quote</label>
                      <textarea
                        rows={3}
                        value={rec.quote}
                        onChange={(e) => updateRecommendation(idx, 'quote', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all leading-relaxed italic"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-text-muted mb-1">Author Name</label>
                        <input
                          type="text"
                          value={rec.author}
                          onChange={(e) => updateRecommendation(idx, 'author', e.target.value)}
                          className="w-full px-3 py-1.5 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-text-muted mb-1">Role Title</label>
                        <input
                          type="text"
                          value={rec.role}
                          onChange={(e) => updateRecommendation(idx, 'role', e.target.value)}
                          className="w-full px-3 py-1.5 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-text-muted mb-1">Company / Org</label>
                        <input
                          type="text"
                          value={rec.company}
                          onChange={(e) => updateRecommendation(idx, 'company', e.target.value)}
                          className="w-full px-3 py-1.5 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white focus:border-text outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Certifications Tab */}
            {activeTab === 'certifications' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border/70">
                  <div>
                    <h3 className="text-xs font-semibold text-text">Certifications & Documents</h3>
                    <p className="text-[11px] text-text-muted mt-0.5">Document names & Google Drive show-only links.</p>
                  </div>
                  <button
                    onClick={addCertification}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-50 border border-border text-text text-xs font-medium rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add File</span>
                  </button>
                </div>

                <div className="space-y-3.5">
                  {(cmsState.certifications || defaultTinaContent.certifications).map((cert, idx) => (
                    <div 
                      key={cert.id || idx} 
                      className="p-4 bg-white border border-border/80 rounded-xl space-y-3 shadow-2xs hover:border-text/40 transition-colors"
                    >
                      {/* Top Bar: Row # and Delete */}
                      <div className="flex items-center justify-between pb-2 border-b border-border/60">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-neutral-100 border border-border text-text-muted font-sans text-[10px] flex items-center justify-center font-medium">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-medium text-text truncate max-w-[260px]">
                            {cert.title ? `${cert.title.replace(/[^a-zA-Z0-9\s_-]/g, '').trim().replace(/[\s]+/g, '_')}.pdf` : 'Untitled.pdf'}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteCertification(idx)}
                          className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete file"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* File / Document Name */}
                      <div>
                        <label className="block text-[11px] font-medium text-text-muted mb-1">
                          Document Name
                        </label>
                        <input
                          type="text"
                          value={cert.title}
                          onChange={(e) => updateCertification(idx, 'title', e.target.value)}
                          placeholder="e.g. Full-Stack Web Development Diploma"
                          className="w-full px-3 py-1.5 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white font-medium text-text outline-none focus:border-text transition-all"
                        />
                      </div>

                      {/* Issuer & Year */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-text-muted mb-1">
                            Issuer
                          </label>
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => updateCertification(idx, 'issuer', e.target.value)}
                            placeholder="e.g. Etgar College"
                            className="w-full px-3 py-1.5 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white text-text outline-none focus:border-text transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-text-muted mb-1">
                            Year
                          </label>
                          <input
                            type="text"
                            value={cert.issueDate}
                            onChange={(e) => updateCertification(idx, 'issueDate', e.target.value)}
                            placeholder="e.g. 2020"
                            className="w-full px-3 py-1.5 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white text-text outline-none focus:border-text transition-all font-mono"
                          />
                        </div>
                      </div>

                      {/* Google Drive PDF URL */}
                      <div>
                        <label className="block text-[11px] font-medium text-text-muted mb-1">
                          Google Drive Link
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="url"
                            value={cert.driveUrl}
                            onChange={(e) => updateCertification(idx, 'driveUrl', e.target.value)}
                            placeholder="https://drive.google.com/file/d/.../preview"
                            className="flex-1 px-3 py-1.5 border border-border rounded-lg text-xs bg-neutral-50/50 focus:bg-white font-mono text-text outline-none focus:border-text transition-all truncate"
                          />
                          {cert.driveUrl && (
                            <a
                              href={cert.driveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg border border-border hover:bg-neutral-100 text-text-muted hover:text-text transition-colors shrink-0"
                              title="Test link in new tab"
                            >
                              <ExternalLink size={13} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blog iFrame Configuration Tab */}
            {activeTab === 'blog' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-border/70">
                  <div className="flex items-center gap-2">
                    <Globe size={15} className="text-text" />
                    <h3 className="text-xs font-semibold text-text">Blog iFrame Embed URL</h3>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                    Set the destination blog URL displayed in the full-screen Blog tab. Only you can configure this URL from Editor Mode.
                  </p>
                </div>

                {/* Privacy and Editor-Only Notice Card */}
                <div className="p-4 bg-neutral-50/80 rounded-xl border border-border/80 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-text">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    <span>Editor-Controlled Embedding</span>
                  </div>
                  <p className="text-text-muted text-[11px] leading-relaxed">
                    Public visitors to your portfolio cannot modify or see configuration controls on the blog page. They experience your embedded engineering articles cleanly and edge-to-edge.
                  </p>
                </div>

                {/* Target URL Input */}
                <div className="p-5 bg-white border border-border/80 rounded-xl shadow-2xs space-y-3">
                  <label className="block text-[11px] font-medium text-text-muted">
                    Destination Blog URL (HTTPS)
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="url"
                      placeholder="https://ai.google/blog/"
                      value={cmsState.portfolio.blogUrl || ''}
                      onChange={(e) => updateGeneralField('blogUrl', e.target.value)}
                      className="flex-1 px-3.5 py-2 border border-border rounded-lg text-xs font-mono bg-neutral-50/50 focus:bg-white outline-none focus:border-text text-text"
                    />
                    {cmsState.portfolio.blogUrl && (
                      <a
                        href={cmsState.portfolio.blogUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-border hover:bg-neutral-100 text-text-muted hover:text-text transition-colors shrink-0"
                        title="Open in new window"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="space-y-2.5">
                  <span className="block text-[11px] font-medium text-text-muted">
                    Quick Platform Presets
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { name: 'Google AI Blog', url: 'https://ai.google/blog/' },
                      { name: 'Dev.to Feed', url: 'https://dev.to' },
                      { name: 'Medium', url: 'https://medium.com' },
                      { name: 'Substack', url: 'https://substack.com' },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => updateGeneralField('blogUrl', preset.url)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          cmsState.portfolio.blogUrl === preset.url
                            ? 'border-text bg-neutral-100/80 font-medium text-text shadow-2xs'
                            : 'border-border/80 bg-white text-text-muted hover:text-text hover:bg-neutral-50'
                        }`}
                      >
                        <div className="font-semibold text-xs text-text">{preset.name}</div>
                        <div className="text-[10px] text-text-muted font-mono truncate mt-0.5">{preset.url}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Embed Summary */}
                <div className="p-3.5 bg-neutral-50/80 rounded-xl border border-border/70 text-[11px] text-text-muted space-y-1">
                  <div className="font-medium text-text">Active Embed Target:</div>
                  <div className="font-mono text-[10px] text-text break-all">
                    {cmsState.portfolio.blogUrl?.trim() || 'https://ai.google/blog/ (Default)'}
                  </div>
                </div>
              </div>
            )}

            {/* JSON Tab */}
            {activeTab === 'json' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/70">
                  <div>
                    <h3 className="text-xs font-semibold text-text">Raw TinaCMS JSON Snapshot</h3>
                    <p className="text-[11px] text-text-muted mt-0.5">Live serializable state backing all portfolio schemas.</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(cmsState, null, 2));
                      setCopiedJson(true);
                      setTimeout(() => setCopiedJson(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border hover:border-text rounded-lg text-xs font-medium text-text cursor-pointer transition-colors shadow-2xs"
                  >
                    {copiedJson ? <Check size={13} className="text-emerald-600" /> : <FileText size={13} />}
                    <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                </div>

                <div className="bg-neutral-900 text-neutral-100 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-[500px] border border-neutral-800 leading-relaxed">
                  <pre>{JSON.stringify(cmsState, null, 2)}</pre>
                </div>
              </div>
            )}

          </div>

          {/* Subtle Form Status Strip */}
          <div className="px-5 py-3 border-t border-border/80 bg-neutral-50/60 flex items-center justify-between text-[11px] text-text-muted shrink-0">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Auto-syncing to live preview</span>
            </span>
            <span className="font-mono text-[10px] text-text-subtle">
              TinaCMS Local Storage
            </span>
          </div>

        </div>

        {/* Right Side: Interactive Real-Time Live Preview Pane */}
        <div className={`${mobilePanel === 'preview' ? 'flex' : 'hidden md:flex'} flex-1 bg-white flex-col overflow-hidden min-h-0 h-full`}>
          
          {/* Canvas Sub-Header Bar */}
          <div className="h-11 bg-white border-b border-border/70 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 z-10">
            
            {/* Left: Section Jump Shortcuts */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 min-w-0">
              <span className="text-[11px] font-medium text-text-muted mr-1.5 hidden sm:inline">Jump:</span>
              {[
                { id: 'home', label: 'Top' },
                { id: 'about', label: 'About' },
                { id: 'experience', label: 'Experience' },
                { id: 'testimonials', label: 'Testimonials' },
                { id: 'contact', label: 'Contact' },
              ].map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSectionInPreview(sec.id)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium text-text-muted hover:text-text hover:bg-neutral-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {sec.label}
                </button>
              ))}
            </div>

            {/* Right: Clean Live Preview Status Indicator */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Preview
              </span>
            </div>
          </div>

          {/* Full Width Live Preview Container */}
          <div className="flex-1 overflow-hidden min-h-0 w-full h-full flex flex-col bg-white">
            {activeTab === 'blog' ? (
              <div className="flex-1 min-h-0 w-full h-full relative bg-neutral-100 flex flex-col overflow-hidden">
                <div className="h-8 px-4 bg-white border-b border-border/70 flex items-center justify-between text-[11px] text-text-muted shrink-0">
                  <div className="flex items-center gap-1.5 font-medium text-text">
                    <Globe size={12} className="text-text-muted" />
                    <span>Blog Preview</span>
                  </div>
                </div>
                <iframe
                  key={cmsState.portfolio.blogUrl || 'default'}
                  src={cmsState.portfolio.blogUrl?.trim() || 'https://ai.google/blog/'}
                  title="Live Blog Embed Preview"
                  className="w-full flex-1 border-0 bg-white"
                />
              </div>
            ) : (
              <div 
                ref={previewScrollRef}
                className="flex-1 min-h-0 overflow-y-auto bg-white text-text font-sans scroll-smooth"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {/* Hero Section */}
                <div id="preview-home">
                  <HeroContainer 
                    portfolio={cmsState.portfolio}
                    onNavClick={(e, href) => {
                      e.preventDefault();
                      scrollToSectionInPreview(href.replace('#', ''));
                    }}
                    onOpenTinaAdmin={() => {}}
                  />
                </div>

                {/* About Section */}
                <div id="preview-about">
                  <AboutContainer 
                    portfolio={cmsState.portfolio}
                    pillars={cmsState.pillars}
                    skills={cmsState.skills}
                  />
                </div>

                {/* Experience Section */}
                <div id="preview-experience">
                  <ExperienceContainer 
                    experiences={cmsState.experiences}
                  />
                </div>

                {/* Testimonials Section */}
                <div id="preview-testimonials">
                  <TestimonialsContainer 
                    recommendations={cmsState.recommendations}
                  />
                </div>

                {/* Contact Section */}
                <div id="preview-contact">
                  <ContactContainer 
                    portfolio={cmsState.portfolio}
                  />
                </div>

                {/* Footer Section */}
                <FooterContainer 
                  developerName={cmsState.portfolio.developerName} 
                />
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
