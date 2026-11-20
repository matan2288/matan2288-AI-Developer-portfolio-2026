import React, { useState } from 'react';
import {
	Save,
	RotateCcw,
	Edit3,
	X,
	Check,
	FileText,
	Layers,
	Briefcase,
	Award,
	Database,
	Sparkles,
	Plus,
	Trash2,
	Loader2,
	AlertCircle,
} from 'lucide-react';
import {
	getStoredTinaContent,
	saveTinaContent,
	persistTinaContentToServer,
	resetTinaContentToDefaults,
	PortfolioGeneralContent,
} from '../services/tinaContent';
import { PillarItem, SkillCategory, ExperienceItem, RecommendationItem } from '../features/dashboard/types';

interface TinaAdminProps {
	isOpen: boolean;
	onClose: () => void;
}

export const TinaAdmin: React.FC<TinaAdminProps> = ({ isOpen, onClose }) => {
	const [activeTab, setActiveTab] = useState<'general' | 'pillars' | 'skills' | 'experiences' | 'testimonials'>(
		'general'
	);
	const [cmsState, setCmsState] = useState(() => getStoredTinaContent());
	const [savedSuccess, setSavedSuccess] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);

	if (!isOpen) return null;

	const handleSave = async () => {
		setIsSaving(true);
		setSaveError(null);
		try {
			const res = await persistTinaContentToServer(cmsState, 'cms: update content from admin modal');
			if (res.success) {
				setSavedSuccess(true);
				setTimeout(() => setSavedSuccess(false), 3000);
			} else {
				setSaveError(res.error || 'Failed to save to backend');
			}
		} catch (err: any) {
			setSaveError(err.message || 'Error saving content');
		} finally {
			setIsSaving(false);
		}
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
				[field]: val,
			},
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
			desc: 'Describe this technical pillar or key domain capability here...',
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
			items: ['Item 1', 'Item 2', 'Item 3'],
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
			skills: ['TypeScript', 'React', 'Node.js'],
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
			company: 'Enterprise Partner',
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
		<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs sm:p-6">
			<div className="border-border flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">
				{/* Header */}
				<div className="bg-bg-alt border-border flex items-center justify-between border-b p-4 sm:p-6">
					<div className="flex items-center gap-3">
						<div className="bg-text flex h-9 w-9 items-center justify-center rounded-xl font-sans text-xs font-bold text-white shadow-xs">
							TC
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h3 className="text-text font-sans text-base font-bold uppercase">
									TinaCMS Headless Studio
								</h3>
								<span className="rounded border border-emerald-200 bg-emerald-100 px-2 py-0.5 font-sans text-[10px] font-semibold text-emerald-800">
									Schema v1.0
								</span>
							</div>
							<p className="text-text-muted text-xs">
								Edit portfolio static content powered by Tina CMS JSON collections (`content/*`)
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						{savedSuccess && (
							<span className="flex items-center gap-1 font-sans text-xs font-bold text-emerald-600">
								<Check size={14} /> Saved to siteContent.json!
							</span>
						)}
						{saveError && (
							<span
								className="flex items-center gap-1 font-sans text-xs font-semibold text-red-600"
								title={saveError}
							>
								<AlertCircle size={14} /> Save error
							</span>
						)}
						<button
							onClick={handleSave}
							disabled={isSaving}
							className="text-text border-border/80 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border bg-white px-4 py-2 font-sans text-xs font-bold uppercase shadow-2xs transition-all hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-60"
						>
							{isSaving ? (
								<Loader2 size={14} className="text-text-muted animate-spin" />
							) : (
								<Save size={14} className="text-text-muted" />
							)}
							<span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
						</button>
						<button
							onClick={handleReset}
							title="Reset to Tina JSON Defaults"
							className="border-border/80 text-text-muted hover:text-text cursor-pointer rounded-lg border bg-white p-2 shadow-2xs transition-all hover:border-neutral-300 hover:bg-neutral-50"
						>
							<RotateCcw size={14} />
						</button>
						<button
							onClick={onClose}
							className="border-border/80 text-text-muted hover:text-text cursor-pointer rounded-lg border bg-white p-2 shadow-2xs transition-all hover:border-neutral-300 hover:bg-neutral-50"
						>
							<X size={16} />
						</button>
					</div>
				</div>

				{/* Tab Navigation */}
				<div className="border-border flex overflow-x-auto border-b bg-neutral-50">
					<button
						onClick={() => setActiveTab('general')}
						className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 font-sans text-xs font-semibold whitespace-nowrap uppercase transition-colors ${
							activeTab === 'general'
								? 'border-text text-text bg-white'
								: 'text-text-muted hover:text-text border-transparent'
						}`}
					>
						<FileText size={14} /> General Profile
					</button>
					<button
						onClick={() => setActiveTab('pillars')}
						className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 font-sans text-xs font-semibold whitespace-nowrap uppercase transition-colors ${
							activeTab === 'pillars'
								? 'border-text text-text bg-white'
								: 'text-text-muted hover:text-text border-transparent'
						}`}
					>
						<Layers size={14} /> Engineering Pillars
					</button>
					<button
						onClick={() => setActiveTab('skills')}
						className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 font-sans text-xs font-semibold whitespace-nowrap uppercase transition-colors ${
							activeTab === 'skills'
								? 'border-text text-text bg-white'
								: 'text-text-muted hover:text-text border-transparent'
						}`}
					>
						<Database size={14} /> Skill Categories
					</button>
					<button
						onClick={() => setActiveTab('experiences')}
						className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 font-sans text-xs font-semibold whitespace-nowrap uppercase transition-colors ${
							activeTab === 'experiences'
								? 'border-text text-text bg-white'
								: 'text-text-muted hover:text-text border-transparent'
						}`}
					>
						<Briefcase size={14} /> Experiences
					</button>
					<button
						onClick={() => setActiveTab('testimonials')}
						className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 font-sans text-xs font-semibold whitespace-nowrap uppercase transition-colors ${
							activeTab === 'testimonials'
								? 'border-text text-text bg-white'
								: 'text-text-muted hover:text-text border-transparent'
						}`}
					>
						<Award size={14} /> Testimonials
					</button>
				</div>

				{/* Form Body */}
				<div className="flex-1 space-y-6 overflow-y-auto p-6">
					{/* General Tab */}
					{activeTab === 'general' && (
						<div className="max-w-2xl space-y-4">
							<div>
								<label className="text-text-muted mb-1 block font-sans text-xs font-bold uppercase">
									Developer Name
								</label>
								<input
									type="text"
									value={cmsState.portfolio.developerName}
									onChange={(e) => updateGeneralField('developerName', e.target.value)}
									className="border-border text-text bg-bg-alt focus:border-text w-full rounded-lg border px-3 py-2 font-sans text-sm focus:outline-none"
								/>
							</div>

							<div>
								<label className="text-text-muted mb-1 block font-sans text-xs font-bold uppercase">
									Primary Title
								</label>
								<input
									type="text"
									value={cmsState.portfolio.title}
									onChange={(e) => updateGeneralField('title', e.target.value)}
									className="border-border text-text bg-bg-alt focus:border-text w-full rounded-lg border px-3 py-2 font-sans text-sm focus:outline-none"
								/>
							</div>

							<div>
								<label className="text-text-muted mb-1 block font-sans text-xs font-bold uppercase">
									Location & Working Mode
								</label>
								<input
									type="text"
									value={cmsState.portfolio.location}
									onChange={(e) => updateGeneralField('location', e.target.value)}
									className="border-border text-text bg-bg-alt focus:border-text w-full rounded-lg border px-3 py-2 font-sans text-sm focus:outline-none"
								/>
							</div>

							<div>
								<label className="text-text-muted mb-1 block font-sans text-xs font-bold uppercase">
									About Section Title
								</label>
								<input
									type="text"
									value={cmsState.portfolio.aboutTitle}
									onChange={(e) => updateGeneralField('aboutTitle', e.target.value)}
									className="border-border text-text bg-bg-alt focus:border-text w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
								/>
							</div>

							<div>
								<label className="text-text-muted mb-1 block font-sans text-xs font-bold uppercase">
									About Bio Paragraph
								</label>
								<textarea
									rows={4}
									value={cmsState.portfolio.aboutBio1}
									onChange={(e) => updateGeneralField('aboutBio1', e.target.value)}
									className="border-border text-text bg-bg-alt focus:border-text w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="text-text-muted mb-1 block font-sans text-xs font-bold uppercase">
										Contact Email
									</label>
									<input
										type="email"
										value={cmsState.portfolio.contactEmail}
										onChange={(e) => updateGeneralField('contactEmail', e.target.value)}
										className="border-border text-text bg-bg-alt focus:border-text w-full rounded-lg border px-3 py-2 font-sans text-sm focus:outline-none"
									/>
								</div>
								<div>
									<label className="text-text-muted mb-1 block font-sans text-xs font-bold uppercase">
										LinkedIn URL
									</label>
									<input
										type="text"
										value={cmsState.portfolio.linkedInUrl}
										onChange={(e) => updateGeneralField('linkedInUrl', e.target.value)}
										className="border-border text-text bg-bg-alt focus:border-text w-full rounded-lg border px-3 py-2 font-sans text-sm focus:outline-none"
									/>
								</div>
							</div>

							<div className="pt-2">
								<label className="text-text-muted mb-1 block font-sans text-xs font-bold uppercase">
									Blog iFrame URL (Full-Screen Blog View)
								</label>
								<input
									type="url"
									placeholder="https://blog.google/technology/ai/"
									value={cmsState.portfolio.blogUrl || ''}
									onChange={(e) => updateGeneralField('blogUrl', e.target.value)}
									className="border-border text-text bg-bg-alt focus:border-text w-full rounded-lg border px-3 py-2 font-sans text-sm focus:outline-none"
								/>
								<p className="text-text-muted mt-1 text-xs">
									Only you can configure this URL from Editor Mode. It embeds full-screen in the
									public Blog tab.
								</p>
							</div>

							<div className="border-border/80 flex items-center justify-between rounded-xl border bg-neutral-50 p-3">
								<div>
									<span className="text-text block text-xs font-semibold">
										Show Blog Tab in Navbar
									</span>
									<span className="text-text-muted block text-xs">
										{cmsState.portfolio.showBlogTab !== false
											? 'Blog tab is currently visible'
											: 'Blog tab is hidden from navbar'}
									</span>
								</div>
								<button
									type="button"
									role="switch"
									aria-checked={cmsState.portfolio.showBlogTab !== false}
									onClick={() =>
										updateGeneralField(
											'showBlogTab',
											cmsState.portfolio.showBlogTab === false ? true : false
										)
									}
									className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
										cmsState.portfolio.showBlogTab !== false ? 'bg-text' : 'bg-neutral-300'
									}`}
								>
									<span
										className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
											cmsState.portfolio.showBlogTab !== false ? 'translate-x-4' : 'translate-x-0'
										}`}
									/>
								</button>
							</div>
						</div>
					)}

					{/* Pillars Tab */}
					{activeTab === 'pillars' && (
						<div className="space-y-6">
							<div className="border-border flex items-center justify-between border-b pb-2">
								<span className="text-text font-sans text-xs font-bold uppercase">
									Engineering Pillar Cards ({cmsState.pillars.length})
								</span>
								<button
									onClick={addPillar}
									className="border-border text-text inline-flex cursor-pointer items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 font-sans text-xs font-bold uppercase shadow-2xs transition-all hover:bg-neutral-50"
								>
									<Plus size={13} /> Add Pillar Card
								</button>
							</div>

							{cmsState.pillars.map((pillar: PillarItem, idx: number) => (
								<div
									key={idx}
									className="border-border bg-bg-alt/50 group relative space-y-3 rounded-xl border p-4"
								>
									<div className="border-border flex items-center justify-between border-b pb-2">
										<span className="text-text font-sans text-xs font-bold uppercase">
											Pillar #{idx + 1}: {pillar.num}
										</span>
										<button
											onClick={() => deletePillar(idx)}
											title="Remove Card"
											className="text-text-muted cursor-pointer rounded p-1 transition-colors hover:bg-red-50 hover:text-red-600"
										>
											<Trash2 size={14} />
										</button>
									</div>
									<div className="grid grid-cols-3 gap-3">
										<div>
											<label className="text-text-muted block font-sans text-[10px] font-bold uppercase">
												Identifier / Num
											</label>
											<input
												type="text"
												value={pillar.num}
												onChange={(e) => updatePillar(idx, 'num', e.target.value)}
												className="border-border w-full rounded border bg-white px-3 py-1.5 font-sans text-xs"
											/>
										</div>
										<div>
											<label className="text-text-muted block font-sans text-[10px] font-bold uppercase">
												Title
											</label>
											<input
												type="text"
												value={pillar.title}
												onChange={(e) => updatePillar(idx, 'title', e.target.value)}
												className="border-border w-full rounded border bg-white px-3 py-1.5 text-xs font-bold"
											/>
										</div>
										<div>
											<label className="text-text-muted block font-sans text-[10px] font-bold uppercase">
												Subtitle
											</label>
											<input
												type="text"
												value={pillar.subtitle}
												onChange={(e) => updatePillar(idx, 'subtitle', e.target.value)}
												className="border-border w-full rounded border bg-white px-3 py-1.5 text-xs"
											/>
										</div>
									</div>
									<div>
										<label className="text-text-muted block font-sans text-[10px] font-bold uppercase">
											Description
										</label>
										<textarea
											rows={2}
											value={pillar.desc}
											onChange={(e) => updatePillar(idx, 'desc', e.target.value)}
											className="border-border w-full rounded border bg-white px-3 py-1.5 text-xs"
										/>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Skills Tab */}
					{activeTab === 'skills' && (
						<div className="space-y-6">
							<div className="border-border flex items-center justify-between border-b pb-2">
								<span className="text-text font-sans text-xs font-bold uppercase">
									Skill Categories ({cmsState.skills.length})
								</span>
								<button
									onClick={addSkillCategory}
									className="border-border text-text inline-flex cursor-pointer items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 font-sans text-xs font-bold uppercase shadow-2xs transition-all hover:bg-neutral-50"
								>
									<Plus size={13} /> Add Category
								</button>
							</div>

							{cmsState.skills.map((cat: SkillCategory, idx: number) => (
								<div key={idx} className="border-border bg-bg-alt/50 space-y-3 rounded-xl border p-4">
									<div className="border-border flex items-center justify-between border-b pb-2">
										<input
											type="text"
											value={cat.title}
											onChange={(e) => {
												const newSkills = [...cmsState.skills];
												newSkills[idx].title = e.target.value;
												setCmsState((prev: any) => ({ ...prev, skills: newSkills }));
											}}
											className="text-text border-border rounded border bg-white px-2 py-1 font-sans text-xs font-bold uppercase"
										/>
										<button
											onClick={() => deleteSkillCategory(idx)}
											title="Remove Category"
											className="text-text-muted cursor-pointer rounded p-1 transition-colors hover:bg-red-50 hover:text-red-600"
										>
											<Trash2 size={14} />
										</button>
									</div>
									<div>
										<label className="text-text-muted mb-1 block font-sans text-[10px] font-bold uppercase">
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
											className="border-border w-full rounded border bg-white px-3 py-2 font-sans text-xs"
										/>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Experiences Tab */}
					{activeTab === 'experiences' && (
						<div className="space-y-6">
							<div className="border-border flex items-center justify-between border-b pb-2">
								<span className="text-text font-sans text-xs font-bold uppercase">
									Work Experiences ({cmsState.experiences.length})
								</span>
								<button
									onClick={addExperience}
									className="border-border text-text inline-flex cursor-pointer items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 font-sans text-xs font-bold uppercase shadow-2xs transition-all hover:bg-neutral-50"
								>
									<Plus size={13} /> Add Experience Card
								</button>
							</div>

							{cmsState.experiences.map((exp: ExperienceItem, idx: number) => (
								<div key={idx} className="border-border bg-bg-alt/50 space-y-3 rounded-xl border p-4">
									<div className="border-border text-text flex items-center justify-between border-b pb-2 font-sans text-xs font-bold">
										<span>
											{exp.company || 'New Company'} / {exp.role}
										</span>
										<div className="flex items-center gap-2">
											<span className="text-text-muted">{exp.period}</span>
											<button
												onClick={() => deleteExperience(idx)}
												title="Remove Card"
												className="text-text-muted cursor-pointer rounded p-1 transition-colors hover:bg-red-50 hover:text-red-600"
											>
												<Trash2 size={14} />
											</button>
										</div>
									</div>
									<div className="grid grid-cols-3 gap-3">
										<div>
											<label className="text-text-muted block font-sans text-[10px] font-bold uppercase">
												Role
											</label>
											<input
												type="text"
												value={exp.role}
												onChange={(e) => updateExperience(idx, 'role', e.target.value)}
												className="border-border w-full rounded border bg-white px-3 py-1.5 text-xs"
											/>
										</div>
										<div>
											<label className="text-text-muted block font-sans text-[10px] font-bold uppercase">
												Company
											</label>
											<input
												type="text"
												value={exp.company}
												onChange={(e) => updateExperience(idx, 'company', e.target.value)}
												className="border-border w-full rounded border bg-white px-3 py-1.5 text-xs"
											/>
										</div>
										<div>
											<label className="text-text-muted block font-sans text-[10px] font-bold uppercase">
												Period
											</label>
											<input
												type="text"
												value={exp.period}
												onChange={(e) => updateExperience(idx, 'period', e.target.value)}
												className="border-border w-full rounded border bg-white px-3 py-1.5 text-xs"
											/>
										</div>
									</div>

									<div>
										<label className="text-text-muted mb-1 block font-sans text-[10px] font-bold uppercase">
											Achievement Bullets (one per line)
										</label>
										<textarea
											rows={3}
											value={(exp.bullets || []).join('\n')}
											onChange={(e) => {
												const newBullets = e.target.value
													.split('\n')
													.filter((line) => line.trim().length > 0);
												updateExperience(idx, 'bullets', newBullets);
											}}
											className="border-border w-full rounded border bg-white px-3 py-1.5 text-xs"
										/>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Testimonials Tab */}
					{activeTab === 'testimonials' && (
						<div className="space-y-6">
							<div className="border-border flex items-center justify-between border-b pb-2">
								<span className="text-text font-sans text-xs font-bold uppercase">
									Testimonials ({cmsState.recommendations.length})
								</span>
								<button
									onClick={addRecommendation}
									className="border-border text-text inline-flex cursor-pointer items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 font-sans text-xs font-bold uppercase shadow-2xs transition-all hover:bg-neutral-50"
								>
									<Plus size={13} /> Add Testimonial Card
								</button>
							</div>

							{cmsState.recommendations.map((rec: RecommendationItem, idx: number) => (
								<div key={idx} className="border-border bg-bg-alt/50 space-y-3 rounded-xl border p-4">
									<div className="border-border flex items-center justify-between border-b pb-2">
										<span className="text-text font-sans text-xs font-bold uppercase">
											Testimonial #{idx + 1} / {rec.company}
										</span>
										<button
											onClick={() => deleteRecommendation(idx)}
											title="Remove Card"
											className="text-text-muted cursor-pointer rounded p-1 transition-colors hover:bg-red-50 hover:text-red-600"
										>
											<Trash2 size={14} />
										</button>
									</div>
									<div>
										<label className="text-text-muted block font-sans text-[10px] font-bold uppercase">
											Quote
										</label>
										<textarea
											rows={3}
											value={rec.quote}
											onChange={(e) => updateRecommendation(idx, 'quote', e.target.value)}
											className="border-border w-full rounded border bg-white px-3 py-1.5 text-xs"
										/>
									</div>
									<div className="grid grid-cols-3 gap-3">
										<div>
											<label className="text-text-muted block font-sans text-[10px] font-bold uppercase">
												Author
											</label>
											<input
												type="text"
												value={rec.author}
												onChange={(e) => updateRecommendation(idx, 'author', e.target.value)}
												className="border-border w-full rounded border bg-white px-3 py-1.5 text-xs"
											/>
										</div>
										<div>
											<label className="text-text-muted block font-sans text-[10px] font-bold uppercase">
												Role
											</label>
											<input
												type="text"
												value={rec.role}
												onChange={(e) => updateRecommendation(idx, 'role', e.target.value)}
												className="border-border w-full rounded border bg-white px-3 py-1.5 text-xs"
											/>
										</div>
										<div>
											<label className="text-text-muted block font-sans text-[10px] font-bold uppercase">
												Company
											</label>
											<input
												type="text"
												value={rec.company}
												onChange={(e) => updateRecommendation(idx, 'company', e.target.value)}
												className="border-border w-full rounded border bg-white px-3 py-1.5 text-xs"
											/>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Footer info bar */}
				<div className="bg-bg-alt border-border text-text-muted flex items-center justify-between border-t p-3 font-sans text-[11px]">
					<div className="flex items-center gap-2">
						<Sparkles size={13} className="text-text-muted" />
						<span>Schema directory: `/tina/config.ts` &amp; `/content/*`</span>
					</div>
					<button
						onClick={handleSave}
						disabled={isSaving}
						className="text-text cursor-pointer font-bold uppercase hover:underline disabled:opacity-50"
					>
						{isSaving ? 'Saving...' : 'Apply Changes'}
					</button>
				</div>
			</div>
		</div>
	);
};
