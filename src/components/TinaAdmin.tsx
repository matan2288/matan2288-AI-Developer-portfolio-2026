import React, { useState } from 'react';
import { Save, RotateCcw, Edit3, X, Check, FileText, Layers, Briefcase, Award, Database, Sparkles, Plus, Trash2 } from 'lucide-react';
import { 
  getStoredTinaContent, 
  saveTinaContent, 
  resetTinaContentToDefaults, 
  PortfolioGeneralContent 
} from '../services/tinaContent';
import { PillarItem, SkillCategory, ExperienceItem, RecommendationItem } from '../features/dashboard/types';

interface TinaAdminProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TinaAdmin: React.FC<TinaAdminProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'pillars' | 'skills' | 'experiences' | 'testimonials'>('general');
  const [cmsState, setCmsState] = useState(() => getStoredTinaContent());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveTinaContent(cmsState);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all portfolio content to TinaCMS default JSON files?')) {
      resetTinaContentToDefaults();
      setCmsState(getStoredTinaContent());
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  // Helper updaters
  const updateGeneralField = (field: keyof PortfolioGeneralContent, val: any) => {
    setCmsState((prev: any) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        [field]: val
      }
    }));
  };

  // Pillar add / update / delete
  const addPillar = () => {
    const newCount = cmsState.pillars.length + 1;
    const newPillar: PillarItem = {
      id: `New Pillar ${newCount}`,
      num: `01.${newCount}X`,
      title: 'New Architecture Pillar',
      subtitle: 'Focus Area Subtitle',
      desc: 'Describe this technical pillar or key domain capability here...'
    };
    setCmsState((prev: any) => ({ ...prev, pillars: [...prev.pillars, newPillar] }));
  };

  const updatePillar = (index: number, field: keyof PillarItem, val: string) => {
    const updated = [...cmsState.pillars];
    updated[index] = { ...updated[index], [field]: val };
    setCmsState((prev: any) => ({ ...prev, pillars: updated }));
  };

  const deletePillar = (index: number) => {
    if (cmsState.pillars.length <= 1) {
      alert('You must keep at least one Pillar card.');
      return;
    }
    const updated = cmsState.pillars.filter((_: any, i: number) => i !== index);
    setCmsState((prev: any) => ({ ...prev, pillars: updated }));
  };

  // Skill category add / update / delete
  const addSkillCategory = () => {
    const newCat: SkillCategory = {
      title: 'New Toolset Category',
      items: ['Item 1', 'Item 2', 'Item 3']
    };
    setCmsState((prev: any) => ({ ...prev, skills: [...prev.skills, newCat] }));
  };

  const deleteSkillCategory = (index: number) => {
    if (cmsState.skills.length <= 1) {
      alert('You must keep at least one Skill category.');
      return;
    }
    const updated = cmsState.skills.filter((_: any, i: number) => i !== index);
    setCmsState((prev: any) => ({ ...prev, skills: updated }));
  };

  // Experience add / update / delete
  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp_${Date.now()}`,
      company: 'New Company / Organization',
      role: 'Senior Developer',
      location: 'Remote / Onsite',
      period: '2025 — PRESENT',
      isLatest: false,
      bullets: ['Led cross-functional feature delivery with high unit coverage.'],
      skills: ['TypeScript', 'React', 'Node.js']
    };
    setCmsState((prev: any) => ({ ...prev, experiences: [newExp, ...prev.experiences] }));
  };

  const updateExperience = (index: number, field: keyof ExperienceItem, val: any) => {
    const updated = [...cmsState.experiences];
    updated[index] = { ...updated[index], [field]: val };
    setCmsState((prev: any) => ({ ...prev, experiences: updated }));
  };

  const deleteExperience = (index: number) => {
    if (cmsState.experiences.length <= 1) {
      alert('You must keep at least one Experience card.');
      return;
    }
    const updated = cmsState.experiences.filter((_: any, i: number) => i !== index);
    setCmsState((prev: any) => ({ ...prev, experiences: updated }));
  };

  // Testimonial add / update / delete
  const addRecommendation = () => {
    const newRec: RecommendationItem = {
      quote: 'Matan is an exceptional engineer who delivers robust, high-performance web systems.',
      author: 'Tech Lead / Director',
      role: 'Engineering Management',
      company: 'Enterprise Partner'
    };
    setCmsState((prev: any) => ({ ...prev, recommendations: [...prev.recommendations, newRec] }));
  };

  const updateRecommendation = (index: number, field: keyof RecommendationItem, val: string) => {
    const updated = [...cmsState.recommendations];
    updated[index] = { ...updated[index], [field]: val };
    setCmsState((prev: any) => ({ ...prev, recommendations: updated }));
  };

  const deleteRecommendation = (index: number) => {
    if (cmsState.recommendations.length <= 1) {
      alert('You must keep at least one Testimonial card.');
      return;
    }
    const updated = cmsState.recommendations.filter((_: any, i: number) => i !== index);
    setCmsState((prev: any) => ({ ...prev, recommendations: updated }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-border w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-bg-alt border-b border-border p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-text text-white flex items-center justify-center font-sans font-bold text-xs shadow-xs">
              TC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold uppercase text-text font-sans">TinaCMS Headless Studio</h3>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-sans font-semibold border border-emerald-200">
                  Schema v1.0
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Edit portfolio static content powered by Tina CMS JSON collections (`content/*`)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="text-xs text-emerald-600 font-sans flex items-center gap-1 font-bold">
                <Check size={14} /> Saved to Tina State
              </span>
            )}
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-50 text-text border border-border/80 hover:border-neutral-300 text-xs font-sans uppercase font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
            >
              <Save size={14} className="text-text-muted" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={handleReset}
              title="Reset to Tina JSON Defaults"
              className="p-2 border border-border/80 rounded-lg text-text-muted hover:text-text bg-white hover:bg-neutral-50 hover:border-neutral-300 transition-all cursor-pointer shadow-2xs"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={onClose}
              className="p-2 border border-border/80 rounded-lg text-text-muted hover:text-text bg-white hover:bg-neutral-50 hover:border-neutral-300 transition-all cursor-pointer shadow-2xs"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border bg-neutral-50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-3 text-xs font-sans uppercase font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'general' ? 'border-text text-text bg-white' : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            <FileText size={14} /> General Profile
          </button>
          <button
            onClick={() => setActiveTab('pillars')}
            className={`px-4 py-3 text-xs font-sans uppercase font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'pillars' ? 'border-text text-text bg-white' : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            <Layers size={14} /> Engineering Pillars
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-3 text-xs font-sans uppercase font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'skills' ? 'border-text text-text bg-white' : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            <Database size={14} /> Skill Categories
          </button>
          <button
            onClick={() => setActiveTab('experiences')}
            className={`px-4 py-3 text-xs font-sans uppercase font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'experiences' ? 'border-text text-text bg-white' : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            <Briefcase size={14} /> Experiences
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-4 py-3 text-xs font-sans uppercase font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'testimonials' ? 'border-text text-text bg-white' : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            <Award size={14} /> Testimonials
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-sans text-text-muted uppercase mb-1 font-bold">
                  Developer Name
                </label>
                <input
                  type="text"
                  value={cmsState.portfolio.developerName}
                  onChange={(e) => updateGeneralField('developerName', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text bg-bg-alt focus:outline-none focus:border-text font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-text-muted uppercase mb-1 font-bold">
                  Primary Title
                </label>
                <input
                  type="text"
                  value={cmsState.portfolio.title}
                  onChange={(e) => updateGeneralField('title', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text bg-bg-alt focus:outline-none focus:border-text font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-text-muted uppercase mb-1 font-bold">
                  Location & Working Mode
                </label>
                <input
                  type="text"
                  value={cmsState.portfolio.location}
                  onChange={(e) => updateGeneralField('location', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text bg-bg-alt focus:outline-none focus:border-text font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-text-muted uppercase mb-1 font-bold">
                  Hero Short Bio
                </label>
                <textarea
                  rows={3}
                  value={cmsState.portfolio.heroBio}
                  onChange={(e) => updateGeneralField('heroBio', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text bg-bg-alt focus:outline-none focus:border-text"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-text-muted uppercase mb-1 font-bold">
                  About Section Title
                </label>
                <input
                  type="text"
                  value={cmsState.portfolio.aboutTitle}
                  onChange={(e) => updateGeneralField('aboutTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text bg-bg-alt focus:outline-none focus:border-text"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-text-muted uppercase mb-1 font-bold">
                  About Bio Paragraph
                </label>
                <textarea
                  rows={4}
                  value={cmsState.portfolio.aboutBio1}
                  onChange={(e) => updateGeneralField('aboutBio1', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text bg-bg-alt focus:outline-none focus:border-text"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-text-muted uppercase mb-1 font-bold">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={cmsState.portfolio.contactEmail}
                    onChange={(e) => updateGeneralField('contactEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text bg-bg-alt focus:outline-none focus:border-text font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans text-text-muted uppercase mb-1 font-bold">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={cmsState.portfolio.linkedInUrl}
                    onChange={(e) => updateGeneralField('linkedInUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text bg-bg-alt focus:outline-none focus:border-text font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans text-text-muted uppercase mb-1 font-bold">
                  Blog iFrame URL (Full-Screen Blog View)
                </label>
                <input
                  type="url"
                  placeholder="https://ai.google/blog/"
                  value={cmsState.portfolio.blogUrl || ''}
                  onChange={(e) => updateGeneralField('blogUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text bg-bg-alt focus:outline-none focus:border-text font-sans"
                />
                <p className="text-xs text-text-muted mt-1">
                  Only you can configure this URL from Editor Mode. It embeds full-screen in the public Blog tab.
                </p>
              </div>
            </div>
          )}

          {/* Pillars Tab */}
          {activeTab === 'pillars' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-sans font-bold text-text uppercase">
                  Engineering Pillar Cards ({cmsState.pillars.length})
                </span>
                <button
                  onClick={addPillar}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-50 border border-border text-text text-xs font-sans uppercase font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                >
                  <Plus size={13} /> Add Pillar Card
                </button>
              </div>

              {cmsState.pillars.map((pillar: PillarItem, idx: number) => (
                <div key={idx} className="p-4 border border-border rounded-xl bg-bg-alt/50 space-y-3 relative group">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="font-sans text-xs font-bold text-text uppercase">
                      Pillar #{idx + 1}: {pillar.num}
                    </span>
                    <button
                      onClick={() => deletePillar(idx)}
                      title="Remove Card"
                      className="text-text-muted hover:text-red-600 transition-colors cursor-pointer p-1 rounded hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-sans uppercase text-text-muted font-bold">Identifier / Num</label>
                      <input
                        type="text"
                        value={pillar.num}
                        onChange={(e) => updatePillar(idx, 'num', e.target.value)}
                        className="w-full px-3 py-1.5 border border-border rounded text-xs bg-white font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans uppercase text-text-muted font-bold">Title</label>
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={(e) => updatePillar(idx, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 border border-border rounded text-xs bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans uppercase text-text-muted font-bold">Subtitle</label>
                      <input
                        type="text"
                        value={pillar.subtitle}
                        onChange={(e) => updatePillar(idx, 'subtitle', e.target.value)}
                        className="w-full px-3 py-1.5 border border-border rounded text-xs bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans uppercase text-text-muted font-bold">Description</label>
                    <textarea
                      rows={2}
                      value={pillar.desc}
                      onChange={(e) => updatePillar(idx, 'desc', e.target.value)}
                      className="w-full px-3 py-1.5 border border-border rounded text-xs bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-sans font-bold text-text uppercase">
                  Skill Categories ({cmsState.skills.length})
                </span>
                <button
                  onClick={addSkillCategory}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-50 border border-border text-text text-xs font-sans uppercase font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                >
                  <Plus size={13} /> Add Category
                </button>
              </div>

              {cmsState.skills.map((cat: SkillCategory, idx: number) => (
                <div key={idx} className="p-4 border border-border rounded-xl bg-bg-alt/50 space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <input
                      type="text"
                      value={cat.title}
                      onChange={(e) => {
                        const newSkills = [...cmsState.skills];
                        newSkills[idx].title = e.target.value;
                        setCmsState((prev: any) => ({ ...prev, skills: newSkills }));
                      }}
                      className="font-sans text-xs font-bold text-text uppercase border border-border rounded px-2 py-1 bg-white"
                    />
                    <button
                      onClick={() => deleteSkillCategory(idx)}
                      title="Remove Category"
                      className="text-text-muted hover:text-red-600 transition-colors cursor-pointer p-1 rounded hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans uppercase text-text-muted mb-1 font-bold">
                      Skill Items (comma separated)
                    </label>
                    <input
                      type="text"
                      value={cat.items.join(', ')}
                      onChange={(e) => {
                        const newSkills = [...cmsState.skills];
                        newSkills[idx].items = e.target.value.split(',').map((s) => s.trim());
                        setCmsState((prev: any) => ({ ...prev, skills: newSkills }));
                      }}
                      className="w-full px-3 py-2 border border-border rounded text-xs font-sans bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Experiences Tab */}
          {activeTab === 'experiences' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-sans font-bold text-text uppercase">
                  Work Experiences ({cmsState.experiences.length})
                </span>
                <button
                  onClick={addExperience}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-50 border border-border text-text text-xs font-sans uppercase font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                >
                  <Plus size={13} /> Add Experience Card
                </button>
              </div>

              {cmsState.experiences.map((exp: ExperienceItem, idx: number) => (
                <div key={idx} className="p-4 border border-border rounded-xl bg-bg-alt/50 space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2 font-sans text-xs font-bold text-text">
                    <span>{exp.company || 'New Company'} / {exp.role}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-text-muted">{exp.period}</span>
                      <button
                        onClick={() => deleteExperience(idx)}
                        title="Remove Card"
                        className="text-text-muted hover:text-red-600 transition-colors cursor-pointer p-1 rounded hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-sans uppercase text-text-muted font-bold">Role</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                        className="w-full px-3 py-1.5 border border-border rounded text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans uppercase text-text-muted font-bold">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                        className="w-full px-3 py-1.5 border border-border rounded text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans uppercase text-text-muted font-bold">Period</label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => updateExperience(idx, 'period', e.target.value)}
                        className="w-full px-3 py-1.5 border border-border rounded text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans uppercase text-text-muted font-bold mb-1">
                      Achievement Bullets (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={(exp.bullets || []).join('\n')}
                      onChange={(e) => {
                        const newBullets = e.target.value.split('\n').filter(line => line.trim().length > 0);
                        updateExperience(idx, 'bullets', newBullets);
                      }}
                      className="w-full px-3 py-1.5 border border-border rounded text-xs bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-sans font-bold text-text uppercase">
                  Testimonials ({cmsState.recommendations.length})
                </span>
                <button
                  onClick={addRecommendation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-50 border border-border text-text text-xs font-sans uppercase font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                >
                  <Plus size={13} /> Add Testimonial Card
                </button>
              </div>

              {cmsState.recommendations.map((rec: RecommendationItem, idx: number) => (
                <div key={idx} className="p-4 border border-border rounded-xl bg-bg-alt/50 space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="font-sans text-xs font-bold text-text uppercase">
                      Testimonial #{idx + 1} / {rec.company}
                    </span>
                    <button
                      onClick={() => deleteRecommendation(idx)}
                      title="Remove Card"
                      className="text-text-muted hover:text-red-600 transition-colors cursor-pointer p-1 rounded hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans uppercase text-text-muted font-bold">Quote</label>
                    <textarea
                      rows={3}
                      value={rec.quote}
                      onChange={(e) => updateRecommendation(idx, 'quote', e.target.value)}
                      className="w-full px-3 py-1.5 border border-border rounded text-xs bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-sans uppercase text-text-muted font-bold">Author</label>
                      <input
                        type="text"
                        value={rec.author}
                        onChange={(e) => updateRecommendation(idx, 'author', e.target.value)}
                        className="w-full px-3 py-1.5 border border-border rounded text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans uppercase text-text-muted font-bold">Role</label>
                      <input
                        type="text"
                        value={rec.role}
                        onChange={(e) => updateRecommendation(idx, 'role', e.target.value)}
                        className="w-full px-3 py-1.5 border border-border rounded text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans uppercase text-text-muted font-bold">Company</label>
                      <input
                        type="text"
                        value={rec.company}
                        onChange={(e) => updateRecommendation(idx, 'company', e.target.value)}
                        className="w-full px-3 py-1.5 border border-border rounded text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-bg-alt border-t border-border flex items-center justify-between text-[11px] font-sans text-text-muted">
          <div className="flex items-center gap-2">
            <Sparkles size={13} className="text-text-muted" />
            <span>Schema directory: `/tina/config.ts` &amp; `/content/*`</span>
          </div>
          <button
            onClick={handleSave}
            className="text-text hover:underline font-bold uppercase cursor-pointer"
          >
            Apply Changes
          </button>
        </div>

      </div>
    </div>
  );
};
