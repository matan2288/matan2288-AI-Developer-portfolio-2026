import React, { useState, useRef } from 'react';
import { Reorder, useDragControls } from 'motion/react';
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
	Upload,
	LogOut,
	Loader2,
	AlertCircle,
	RefreshCw,
	GripVertical,
} from 'lucide-react';
import {
	getStoredTinaContent,
	saveTinaContent,
	persistTinaContentToServer,
	resetTinaContentToDefaults,
	defaultTinaContent,
	PortfolioGeneralContent,
} from '../services/tinaContent';
import { ExperienceItem, RecommendationItem, CertificationItem } from '../features/dashboard/types';
import { HeroContainer } from './HeroContainer';
import { AboutContainer } from './AboutContainer';
import { ExperienceContainer } from './ExperienceContainer';
import { TestimonialsContainer } from './TestimonialsContainer';
import { ContactContainer } from './ContactContainer';
import { FooterContainer } from './FooterContainer';
import { CertificationsContainer } from './CertificationsContainer';

interface SortableCertificationCardProps {
	cert: CertificationItem;
	idx: number;
	onUpdate: (index: number, field: keyof CertificationItem, value: any) => void;
	onDelete: (index: number) => void;
}

const SortableCertificationCard: React.FC<SortableCertificationCardProps> = ({ cert, idx, onUpdate, onDelete }) => {
	const dragControls = useDragControls();

	return (
		<Reorder.Item
			value={cert}
			dragListener={false}
			dragControls={dragControls}
			className="border-border/80 hover:border-text/40 list-none space-y-3 rounded-xl border bg-white p-4 shadow-2xs transition-colors"
			whileDrag={{ scale: 1.01, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}
		>
			{/* Top Bar: Drag Handle, Row # and Delete */}
			<div className="border-border/60 flex items-center justify-between border-b pb-2">
				<div className="flex items-center gap-2">
					<button
						type="button"
						onPointerDown={(e) => dragControls.start(e)}
						className="hover:text-text -ml-1 cursor-grab touch-none rounded p-1 text-neutral-400 transition-colors active:cursor-grabbing"
						title="Drag to reorder"
						aria-label="Drag to reorder certification"
					>
						<GripVertical size={14} />
					</button>
					<span className="border-border text-text-muted flex h-5 w-5 items-center justify-center rounded-full border bg-neutral-100 font-sans text-[10px] font-medium">
						{idx + 1}
					</span>
					<span className="text-text max-w-[240px] truncate text-xs font-medium">
						{cert.title
							? `${cert.title
									.replace(/[^a-zA-Z0-9\s_-]/g, '')
									.trim()
									.replace(/[\s]+/g, '_')}.pdf`
							: 'Untitled.pdf'}
					</span>
				</div>
				<button
					type="button"
					onClick={() => onDelete(idx)}
					className="text-text-muted cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-red-50 hover:text-red-600"
					title="Delete file"
				>
					<Trash2 size={13} />
				</button>
			</div>

			{/* Document Name & Category */}
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<div>
					<label className="text-text-muted mb-1 block text-[11px] font-medium">Document Name</label>
					<input
						type="text"
						value={cert.title}
						onChange={(e) => onUpdate(idx, 'title', e.target.value)}
						placeholder="e.g. Full-Stack Web Development Diploma"
						className="border-border text-text focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3 py-1.5 text-xs font-medium transition-all outline-none focus:bg-white"
					/>
				</div>
				<div>
					<label className="text-text-muted mb-1 block text-[11px] font-medium">Category Label (Left)</label>
					<input
						type="text"
						value={cert.category || ''}
						onChange={(e) => onUpdate(idx, 'category', e.target.value)}
						placeholder="e.g. AI, Security, Full Stack"
						className="border-border text-text focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3 py-1.5 font-mono text-xs font-medium transition-all outline-none focus:bg-white"
					/>
				</div>
			</div>

			{/* Issuer & Year */}
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<div>
					<label className="text-text-muted mb-1 block text-[11px] font-medium">Issuer</label>
					<input
						type="text"
						value={cert.issuer}
						onChange={(e) => onUpdate(idx, 'issuer', e.target.value)}
						placeholder="e.g. Etgar College"
						className="border-border text-text focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3 py-1.5 text-xs transition-all outline-none focus:bg-white"
					/>
				</div>
				<div>
					<label className="text-text-muted mb-1 block text-[11px] font-medium">Year</label>
					<input
						type="text"
						value={cert.issueDate}
						onChange={(e) => onUpdate(idx, 'issueDate', e.target.value)}
						placeholder="e.g. 2020"
						className="border-border text-text focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3 py-1.5 font-mono text-xs transition-all outline-none focus:bg-white"
					/>
				</div>
			</div>

			{/* Google Drive PDF URL */}
			<div>
				<label className="text-text-muted mb-1 block text-[11px] font-medium">Google Drive Link</label>
				<div className="flex items-center gap-2">
					<input
						type="url"
						value={cert.driveUrl}
						onChange={(e) => onUpdate(idx, 'driveUrl', e.target.value)}
						placeholder="https://drive.google.com/file/d/.../preview"
						className="border-border text-text focus:border-text flex-1 truncate rounded-lg border bg-neutral-50/50 px-3 py-1.5 font-mono text-xs transition-all outline-none focus:bg-white"
					/>
					{cert.driveUrl && (
						<a
							href={cert.driveUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="border-border text-text-muted hover:text-text shrink-0 rounded-lg border p-2 transition-colors hover:bg-neutral-100"
							title="Test link in new tab"
						>
							<ExternalLink size={13} />
						</a>
					)}
				</div>
			</div>
		</Reorder.Item>
	);
};

interface SortableTestimonialCardProps {
	rec: RecommendationItem;
	idx: number;
	onUpdate: (index: number, field: keyof RecommendationItem, value: string) => void;
	onDelete: (index: number) => void;
}

const SortableTestimonialCard: React.FC<SortableTestimonialCardProps> = ({ rec, idx, onUpdate, onDelete }) => {
	const dragControls = useDragControls();

	return (
		<Reorder.Item
			value={rec}
			dragListener={false}
			dragControls={dragControls}
			className="border-border/80 hover:border-text/40 list-none space-y-4 rounded-xl border bg-white p-5 shadow-2xs transition-colors"
			whileDrag={{ scale: 1.01, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}
		>
			<div className="border-border/60 flex items-center justify-between border-b pb-2.5">
				<div className="flex items-center gap-2">
					<button
						type="button"
						onPointerDown={(e) => dragControls.start(e)}
						className="hover:text-text -ml-1 cursor-grab touch-none rounded p-1 text-neutral-400 transition-colors active:cursor-grabbing"
						title="Drag to reorder"
						aria-label="Drag to reorder testimonial"
					>
						<GripVertical size={14} />
					</button>
					<span className="text-text text-xs font-semibold">
						Testimonial #{idx + 1} <span className="text-border/80 mx-1">/</span>{' '}
						<span className="text-text-muted font-normal">{rec.company}</span>
					</span>
				</div>
				<button
					type="button"
					onClick={() => onDelete(idx)}
					title="Remove Card"
					className="text-text-muted cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-red-50 hover:text-red-600"
				>
					<Trash2 size={13} />
				</button>
			</div>

			<div>
				<label className="text-text-muted mb-1 block text-[11px] font-medium">Quote</label>
				<textarea
					rows={3}
					value={rec.quote}
					onChange={(e) => onUpdate(idx, 'quote', e.target.value)}
					className="border-border focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3 py-2 text-xs leading-relaxed italic transition-all outline-none focus:bg-white"
				/>
			</div>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
				<div>
					<label className="text-text-muted mb-1 block text-[11px] font-medium">Author Name</label>
					<input
						type="text"
						value={rec.author}
						onChange={(e) => onUpdate(idx, 'author', e.target.value)}
						className="border-border focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3 py-1.5 text-xs font-medium transition-all outline-none focus:bg-white"
					/>
				</div>
				<div>
					<label className="text-text-muted mb-1 block text-[11px] font-medium">Role Title</label>
					<input
						type="text"
						value={rec.role}
						onChange={(e) => onUpdate(idx, 'role', e.target.value)}
						className="border-border focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3 py-1.5 text-xs transition-all outline-none focus:bg-white"
					/>
				</div>
				<div>
					<label className="text-text-muted mb-1 block text-[11px] font-medium">Company / Org</label>
					<input
						type="text"
						value={rec.company}
						onChange={(e) => onUpdate(idx, 'company', e.target.value)}
						className="border-border focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3 py-1.5 text-xs transition-all outline-none focus:bg-white"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
				<div>
					<label className="text-text-muted mb-1 block text-[11px] font-medium">
						Avatar Image URL (LinkedIn / API)
					</label>
					<input
						type="url"
						value={rec.avatarUrl || ''}
						onChange={(e) => onUpdate(idx, 'avatarUrl', e.target.value)}
						placeholder="https://... (LinkedIn profile photo / API)"
						className="border-border focus:border-text text-text w-full rounded-lg border bg-neutral-50/50 px-3 py-1.5 font-mono text-xs transition-all outline-none focus:bg-white"
					/>
				</div>
				<div>
					<label className="text-text-muted mb-1 block text-[11px] font-medium">LinkedIn Profile URL</label>
					<input
						type="url"
						value={rec.linkedInUrl || ''}
						onChange={(e) => onUpdate(idx, 'linkedInUrl', e.target.value)}
						placeholder="https://www.linkedin.com/in/..."
						className="border-border focus:border-text text-text w-full rounded-lg border bg-neutral-50/50 px-3 py-1.5 font-mono text-xs transition-all outline-none focus:bg-white"
					/>
				</div>
			</div>
		</Reorder.Item>
	);
};

interface AdminPageContainerProps {
	onBackToPortfolio: () => void;
	onLogout?: () => void;
}

export const AdminPageContainer: React.FC<AdminPageContainerProps> = ({ onBackToPortfolio, onLogout }) => {
	const [activeTab, setActiveTab] = useState<
		'general' | 'experiences' | 'testimonials' | 'certifications' | 'blog' | 'json'
	>('general');
	const [cmsState, setCmsState] = useState(() => getStoredTinaContent());
	const [mobilePanel, setMobilePanel] = useState<'editor' | 'preview'>('editor');
	const [isSaved, setIsSaved] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [saveStatusMessage, setSaveStatusMessage] = useState<string | null>(null);
	const [saveError, setSaveError] = useState<string | null>(null);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [copiedJson, setCopiedJson] = useState(false);
	const [isEditingJson, setIsEditingJson] = useState(false);
	const [jsonInput, setJsonInput] = useState('');
	const [jsonError, setJsonError] = useState<string | null>(null);
	const [jsonSuccess, setJsonSuccess] = useState(false);
	const [isRefreshingRecs, setIsRefreshingRecs] = useState(false);
	const [recsRefreshStatus, setRecsRefreshStatus] = useState<string | null>(null);
	const [recsRefreshError, setRecsRefreshError] = useState<string | null>(null);

	const previewScrollRef = useRef<HTMLDivElement>(null);

	// Sync state changes
	const handleStateChange = (updater: (prev: typeof cmsState) => typeof cmsState) => {
		setCmsState((prev: typeof cmsState) => {
			const next = updater(prev);
			setHasUnsavedChanges(true);
			return next;
		});
	};

	// Save changes to persistent storage and physical JSON files
	const handleSave = async () => {
		setIsSaving(true);
		setSaveError(null);
		try {
			const result = await persistTinaContentToServer(cmsState, 'cms: update site content via admin');
			if (result.success) {
				setHasUnsavedChanges(false);
				setIsSaved(true);
				const destination = result.local
					? 'Saved to content/siteContent.json (local disk)'
					: result.commitSha
						? `Committed to GitHub (${result.commitSha.slice(0, 7)})`
						: 'Saved to content/siteContent.json';
				setSaveStatusMessage(destination);
				setTimeout(() => setIsSaved(false), 3500);
			} else {
				setSaveError(result.error || 'Failed to save content to backend');
			}
		} catch (err: any) {
			setSaveError(err.message || 'An unexpected error occurred while saving.');
		} finally {
			setIsSaving(false);
		}
	};

	// Reset to defaults
	const handleReset = () => {
		if (
			confirm(
				'Are you sure you want to reset all portfolio data back to default TinaCMS JSON collections? This will override unsaved modifications.'
			)
		) {
			resetTinaContentToDefaults();
			const defaults = getStoredTinaContent();
			setCmsState(defaults);
			setHasUnsavedChanges(false);
			setIsSaved(true);
			setSaveStatusMessage('Reset to defaults');
			setTimeout(() => setIsSaved(false), 2500);
		}
	};

	// Apply custom pasted JSON
	const handleApplyJson = async () => {
		try {
			const parsed = JSON.parse(jsonInput);
			if (!parsed || typeof parsed !== 'object') {
				throw new Error('Root JSON must be a valid object.');
			}
			const validatedState = {
				...defaultTinaContent,
				...parsed,
				portfolio: {
					...defaultTinaContent.portfolio,
					...(parsed.portfolio || {}),
				},
				experiences: Array.isArray(parsed.experiences) ? parsed.experiences : defaultTinaContent.experiences,
				recommendations: Array.isArray(parsed.recommendations)
					? parsed.recommendations
					: defaultTinaContent.recommendations,
				certifications: Array.isArray(parsed.certifications)
					? parsed.certifications
					: defaultTinaContent.certifications,
				skills: Array.isArray(parsed.skills) ? parsed.skills : defaultTinaContent.skills,
			};
			setCmsState(validatedState);
			setIsSaving(true);
			const result = await persistTinaContentToServer(
				validatedState,
				'cms: update siteContent.json from JSON editor'
			);
			if (result.success) {
				setJsonError(null);
				setJsonSuccess(true);
				setIsEditingJson(false);
				setHasUnsavedChanges(false);
				const destination = result.local
					? 'Saved to content/siteContent.json (local disk)'
					: result.commitSha
						? `Committed to GitHub (${result.commitSha.slice(0, 7)})`
						: 'Saved to content/siteContent.json';
				setSaveStatusMessage(destination);
				setTimeout(() => setJsonSuccess(false), 3500);
			} else {
				setJsonError(result.error || 'Failed to persist to file');
			}
		} catch (err: any) {
			setJsonError(err.message || 'Invalid JSON syntax. Please check formatting.');
		} finally {
			setIsSaving(false);
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
		handleStateChange((prev) => ({
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
				'Engineered responsive customer buyflow journeys resulting in +18% conversion.',
			],
			skills: ['TypeScript', 'React', 'Node.js', 'TinaCMS'],
		};
		handleStateChange((prev) => ({ ...prev, experiences: [newExp, ...prev.experiences] }));
	};

	const updateExperience = (index: number, field: keyof ExperienceItem, val: any) => {
		const updated = [...cmsState.experiences];
		updated[index] = { ...updated[index], [field]: val };
		handleStateChange((prev) => ({ ...prev, experiences: updated }));
	};

	const deleteExperience = (index: number) => {
		if (cmsState.experiences.length <= 1) {
			alert('You must keep at least one Experience card.');
			return;
		}
		const updated = cmsState.experiences.filter((_, i) => i !== index);
		handleStateChange((prev) => ({ ...prev, experiences: updated }));
	};

	// Testimonial handlers
	const addRecommendation = () => {
		const newRec: RecommendationItem = {
			id: `rec_${Date.now()}`,
			quote: 'Matan is an exceptional engineer who consistently ships reliable, high-performance web systems.',
			author: 'VP of Engineering',
			role: 'Technical Leadership',
			company: 'Enterprise Partner',
			avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
			linkedInUrl: 'https://www.linkedin.com/in/matan-elmaliach/',
		};
		handleStateChange((prev) => ({ ...prev, recommendations: [...prev.recommendations, newRec] }));
	};

	const updateRecommendation = (index: number, field: keyof RecommendationItem, val: string) => {
		const updated = [...cmsState.recommendations];
		updated[index] = { ...updated[index], [field]: val };
		handleStateChange((prev) => ({ ...prev, recommendations: updated }));
	};

	const deleteRecommendation = (index: number) => {
		if (cmsState.recommendations.length <= 1) {
			alert('You must keep at least one Testimonial card.');
			return;
		}
		const updated = cmsState.recommendations.filter((_, i) => i !== index);
		handleStateChange((prev) => ({ ...prev, recommendations: updated }));
	};

	const handleSyncRecommendations = async () => {
		setIsRefreshingRecs(true);
		setRecsRefreshStatus(null);
		setRecsRefreshError(null);

		try {
			let res = await fetch('/api/recommendations?refresh=true');
			if (res.status === 404) {
				const netlifyRes = await fetch('/.netlify/functions/recommendations?refresh=true');
				if (netlifyRes.status !== 404) {
					res = netlifyRes;
				}
			}

			const contentType = res.headers.get('content-type') || '';
			if (!contentType.includes('application/json')) {
				throw new Error(`Unexpected response from server (status ${res.status})`);
			}

			const json = await res.json();
			if (!res.ok || !json.success || !Array.isArray(json.data)) {
				throw new Error(json.error || `Failed to fetch recommendations (status ${res.status})`);
			}

			const existingMap = new Map<string, RecommendationItem>();
			(cmsState.recommendations || []).forEach((r: RecommendationItem) => {
				if (r.id) existingMap.set(r.id, r);
				if (r.author) existingMap.set(r.author, r);
			});

			let newCount = 0;
			const synced: RecommendationItem[] = json.data.map((item: RecommendationItem) => {
				const existing = (item.id && existingMap.get(item.id)) || existingMap.get(item.author);
				if (!existing) newCount += 1;
				return {
					...item,
					role: existing?.role || item.role,
					company: existing?.company || item.company,
				};
			});

			handleStateChange((prev) => ({ ...prev, recommendations: synced }));
			setRecsRefreshStatus(
				newCount > 0
					? `Synced ${synced.length} recommendations (${newCount} new). Click Save Changes to publish.`
					: `Synced ${synced.length} recommendations from LinkedIn API. Click Save Changes to publish.`
			);
		} catch (err: any) {
			setRecsRefreshError(err?.message || 'Failed to sync recommendations from external API.');
		} finally {
			setIsRefreshingRecs(false);
		}
	};

	const updateCertification = (index: number, field: string, val: any) => {
		const certs = cmsState.certifications || defaultTinaContent.certifications;
		const updated = [...certs];
		updated[index] = { ...updated[index], [field]: val };
		handleStateChange((prev) => ({ ...prev, certifications: updated }));
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
			skills: ['Cloud Architecture', 'Security'],
		};
		handleStateChange((prev) => ({ ...prev, certifications: [...certs, newCert] }));
	};

	const deleteCertification = (index: number) => {
		const certs = cmsState.certifications || defaultTinaContent.certifications;
		if (certs.length <= 1) {
			alert('You must keep at least one Certification item.');
			return;
		}
		const updated = certs.filter((_, i) => i !== index);
		handleStateChange((prev) => ({ ...prev, certifications: updated }));
	};

	return (
		<div className="bg-bg-alt text-text flex h-[100dvh] h-screen max-h-screen flex-col overflow-hidden font-sans antialiased">
			{/* Studio Header Bar - Spacious, Air-Gapped & Classy */}
			<header className="border-border/80 z-30 flex h-16 min-h-[64px] shrink-0 items-center justify-between border-b bg-white/95 px-4 pt-2 pb-2 shadow-2xs backdrop-blur-md sm:h-18 sm:px-7 sm:pt-2.5 sm:pb-2.5">
				{/* Left: Back & Context */}
				<div className="flex min-w-0 items-center gap-3 sm:gap-4">
					<button
						onClick={onBackToPortfolio}
						className="text-text-muted hover:text-text border-border/80 group inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border bg-white px-3.5 py-2 text-xs font-medium shadow-2xs transition-all hover:border-neutral-300 hover:bg-neutral-50"
						title="Return to public portfolio"
					>
						<ArrowLeft
							size={14}
							className="text-text-muted transition-transform group-hover:-translate-x-0.5"
						/>
						<span className="hidden sm:inline">Back to Portfolio</span>
						<span className="sm:hidden">Portfolio</span>
					</button>

					<div className="bg-border/70 hidden h-5 w-px sm:block" />

					<div className="flex items-center gap-2.5">
						<span className="text-text hidden text-xs font-semibold tracking-tight sm:inline">
							Content Studio
						</span>
					</div>

					{onLogout && (
						<button
							onClick={onLogout}
							className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-red-200/60 bg-red-50/60 px-3 py-2 text-xs font-medium text-red-600 shadow-2xs transition-all hover:bg-red-50 hover:text-red-700"
							title="Sign out of Content Editor"
						>
							<LogOut size={13} />
							<span className="hidden sm:inline">Sign Out</span>
						</button>
					)}
				</div>

				{/* Mobile View Toggle (< md screens only) */}
				<div className="border-border/70 flex items-center rounded-xl border bg-neutral-50 p-1 shadow-2xs md:hidden">
					<button
						onClick={() => setMobilePanel('editor')}
						className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
							mobilePanel === 'editor'
								? 'text-text border-border/40 border bg-white font-semibold shadow-2xs'
								: 'text-text-muted hover:text-text'
						}`}
					>
						Editor
					</button>
					<button
						onClick={() => setMobilePanel('preview')}
						className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
							mobilePanel === 'preview'
								? 'text-text border-border/40 border bg-white font-semibold shadow-2xs'
								: 'text-text-muted hover:text-text'
						}`}
					>
						Preview
					</button>
				</div>

				{/* Right Actions */}
				<div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
					<button
						onClick={handleOpenNewTab}
						title="Open live site in separate tab"
						className="text-text border-border/80 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border bg-white px-3 py-2 text-xs font-medium shadow-2xs transition-all hover:border-neutral-300 hover:bg-neutral-50"
					>
						<ExternalLink size={13} className="text-text-muted" />
						<span className="hidden sm:inline">Live Site</span>
					</button>

					<button
						onClick={handleReset}
						className="text-text-muted inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-transparent px-3 py-2 text-xs font-medium transition-all hover:border-red-200/60 hover:bg-red-50/70 hover:text-red-600"
						title="Reset all content to initial defaults"
					>
						<RotateCcw size={12} />
						<span className="hidden sm:inline">Reset</span>
					</button>

					<button
						onClick={handleSave}
						disabled={isSaving}
						className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold shadow-2xs transition-all sm:px-4.5 ${
							isSaving
								? 'text-text-muted cursor-not-allowed border-neutral-300 bg-neutral-100 opacity-80'
								: isSaved
									? 'border-emerald-300 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200/40 hover:bg-emerald-100'
									: saveError
										? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
										: 'text-text border-border/80 bg-white hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98]'
						}`}
					>
						{isSaving ? (
							<Loader2 size={13} className="text-text-muted animate-spin" />
						) : isSaved ? (
							<Check size={13} className="text-emerald-600" />
						) : saveError ? (
							<AlertCircle size={13} className="text-red-600" />
						) : (
							<Save size={13} className="text-text-muted" />
						)}
						<span>
							{isSaving
								? 'Saving...'
								: isSaved
									? 'Saved to JSON!'
									: saveError
										? 'Retry Save'
										: 'Save Changes'}
						</span>
					</button>
				</div>
			</header>

			{/* Studio Workspace Main Split View */}
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
				{/* Left Side: Headless Content Schema Form Inspector */}
				<div
					className={`${mobilePanel === 'editor' ? 'flex' : 'hidden md:flex'} border-border/80 h-full min-h-0 w-full shrink-0 flex-col overflow-hidden border-r bg-white md:w-[460px] lg:w-[490px] xl:w-[530px] 2xl:w-[570px]`}
				>
					{/* Schema Category Tabs */}
					<div className="border-border flex shrink-0 scrollbar-none items-center gap-1.5 overflow-x-auto border-b bg-neutral-50/70 px-3.5 py-2.5">
						{[
							{ id: 'general', label: 'General', icon: FileText },
							{
								id: 'experiences',
								label: `Experience (${cmsState.experiences.length})`,
								icon: Briefcase,
							},
							{
								id: 'testimonials',
								label: `Testimonials (${cmsState.recommendations.length})`,
								icon: Award,
							},
							{
								id: 'certifications',
								label: `Certs (${(cmsState.certifications || defaultTinaContent.certifications).length})`,
								icon: Award,
							},
							{
								id: 'blog',
								label: cmsState.portfolio.showBlogTab !== false ? 'Blog Embed' : 'Blog (Hidden)',
								icon: Globe,
							},
							{ id: 'json', label: 'JSON', icon: Code },
						].map((tab) => {
							const Icon = tab.icon;
							const isActive = activeTab === tab.id;
							return (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id as any)}
									className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
										isActive
											? 'text-text border-border/80 bg-white shadow-2xs'
											: 'text-text-muted hover:text-text border-transparent hover:bg-neutral-100/70'
									}`}
								>
									<Icon size={13} className={isActive ? 'text-text' : 'text-text-muted'} />
									<span>{tab.label}</span>
								</button>
							);
						})}
					</div>

					{/* Tab Content Form Fields */}
					<div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
						{/* General Tab */}
						{activeTab === 'general' && (
							<div className="space-y-6">
								<div className="border-border/70 border-b pb-3">
									<h3 className="text-text text-xs font-semibold">Developer Profile & Bio</h3>
									<p className="text-text-muted mt-0.5 text-[11px]">
										Live updates reflect immediately in the right preview canvas.
									</p>
								</div>

								<div className="border-border/80 space-y-4 rounded-xl border bg-white p-5 shadow-2xs">
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<div>
											<label className="text-text-muted mb-1.5 block text-[11px] font-medium">
												Developer Name
											</label>
											<input
												type="text"
												value={cmsState.portfolio.developerName}
												onChange={(e) => updateGeneralField('developerName', e.target.value)}
												className="border-border focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3.5 py-2 text-xs font-semibold transition-all outline-none focus:bg-white"
											/>
										</div>

										<div>
											<label className="text-text-muted mb-1.5 block text-[11px] font-medium">
												Professional Title
											</label>
											<input
												type="text"
												value={cmsState.portfolio.title}
												onChange={(e) => updateGeneralField('title', e.target.value)}
												className="border-border focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3.5 py-2 text-xs transition-all outline-none focus:bg-white"
											/>
										</div>
									</div>

									<div className="space-y-4">
										<div>
											<label className="text-text-muted mb-1.5 block text-[11px] font-medium">
												Location
											</label>
											<input
												type="text"
												value={cmsState.portfolio.location}
												onChange={(e) => updateGeneralField('location', e.target.value)}
												className="border-border focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3.5 py-2 text-xs transition-all outline-none focus:bg-white"
											/>
										</div>

										<div>
											<label className="text-text-muted mb-1.5 block text-[11px] font-medium">
												Avatar Image URL or Direct File Upload
											</label>
											<div className="flex w-full min-w-0 items-center gap-2">
												<input
													type="text"
													value={cmsState.portfolio.avatarUrl}
													onChange={(e) => updateGeneralField('avatarUrl', e.target.value)}
													placeholder="/profile.png or paste image URL"
													className="border-border focus:border-text min-w-0 flex-1 rounded-lg border bg-neutral-50/50 px-3.5 py-2 text-xs transition-all outline-none focus:bg-white"
												/>
												<label className="border-border hover:border-text text-text flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border bg-neutral-50 px-3 py-2 text-xs font-medium whitespace-nowrap shadow-2xs transition-colors hover:bg-white">
													<Upload className="text-text-muted h-3.5 w-3.5 shrink-0" />
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
																		updateGeneralField(
																			'avatarUrl',
																			ev.target.result as string
																		);
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
										<label className="text-text-muted mb-1.5 block text-[11px] font-medium">
											About Section Title
										</label>
										<input
											type="text"
											value={cmsState.portfolio.aboutTitle}
											onChange={(e) => updateGeneralField('aboutTitle', e.target.value)}
											className="border-border focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3.5 py-2 text-xs transition-all outline-none focus:bg-white"
										/>
									</div>

									<div>
										<label className="text-text-muted mb-1.5 block text-[11px] font-medium">
											About Bio
										</label>
										<textarea
											rows={4}
											value={cmsState.portfolio.aboutBio1}
											onChange={(e) => updateGeneralField('aboutBio1', e.target.value)}
											className="border-border focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3.5 py-2 text-xs leading-relaxed transition-all outline-none focus:bg-white"
										/>
									</div>
								</div>

								<div className="border-border/80 space-y-4 rounded-xl border bg-white p-5 shadow-2xs">
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<div>
											<label className="text-text-muted mb-1.5 block text-[11px] font-medium">
												Contact Email
											</label>
											<input
												type="email"
												value={cmsState.portfolio.contactEmail}
												onChange={(e) => updateGeneralField('contactEmail', e.target.value)}
												className="border-border focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3.5 py-2 text-xs transition-all outline-none focus:bg-white"
											/>
										</div>

										<div>
											<label className="text-text-muted mb-1.5 block text-[11px] font-medium">
												LinkedIn Profile URL
											</label>
											<input
												type="text"
												value={cmsState.portfolio.linkedInUrl}
												onChange={(e) => updateGeneralField('linkedInUrl', e.target.value)}
												className="border-border focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3.5 py-2 text-xs transition-all outline-none focus:bg-white"
											/>
										</div>
									</div>
								</div>

								{/* Quantitative Stats */}
								<div className="border-border/80 space-y-3 rounded-xl border bg-white p-5 shadow-2xs">
									<div className="border-border/60 flex items-center justify-between border-b pb-1">
										<div>
											<h4 className="text-text text-xs font-semibold">Hero Quantitative Stats</h4>
											<p className="text-text-muted mt-0.5 text-[11px]">
												Metrics displayed in the experience highlight strip.
											</p>
										</div>
										<div className="flex items-center gap-2.5">
											<span className="text-text-muted text-[11px]">
												{cmsState.portfolio.stats?.length || 0} metrics
											</span>
											<button
												type="button"
												onClick={addStat}
												className="border-border text-text inline-flex cursor-pointer items-center gap-1 rounded-lg border bg-white px-2.5 py-1 text-xs font-medium shadow-2xs transition-colors hover:bg-neutral-50"
											>
												<Plus size={12} />
												<span>Add Metric</span>
											</button>
										</div>
									</div>
									<div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
										{cmsState.portfolio.stats?.map(
											(st: { value: string; label: string }, idx: number) => (
												<div
													key={idx}
													className="border-border/70 group relative space-y-2.5 rounded-lg border bg-neutral-50/70 p-3.5"
												>
													<div className="flex items-center justify-between">
														<span className="text-text-muted text-[10px] font-semibold tracking-wider uppercase">
															Metric #{idx + 1}
														</span>
														<button
															type="button"
															onClick={() => deleteStat(idx)}
															className="text-text-muted cursor-pointer rounded p-1 transition-colors hover:bg-red-50 hover:text-red-600"
															title="Delete metric"
														>
															<Trash2 size={13} />
														</button>
													</div>
													<div>
														<label className="text-text-muted mb-1 block text-[10px] font-medium">
															Metric Value
														</label>
														<input
															type="text"
															value={st.value}
															onChange={(e) => {
																const newStats = [...cmsState.portfolio.stats];
																newStats[idx].value = e.target.value;
																updateGeneralField('stats', newStats);
															}}
															className="border-border focus:border-text w-full rounded-lg border bg-white px-3 py-1.5 text-xs font-bold outline-none"
														/>
													</div>
													<div>
														<label className="text-text-muted mb-1 block text-[10px] font-medium">
															Metric Label
														</label>
														<input
															type="text"
															value={st.label}
															onChange={(e) => {
																const newStats = [...cmsState.portfolio.stats];
																newStats[idx].label = e.target.value;
																updateGeneralField('stats', newStats);
															}}
															className="border-border text-text-muted focus:border-text w-full rounded-lg border bg-white px-3 py-1.5 text-xs outline-none"
														/>
													</div>
												</div>
											)
										)}
									</div>
								</div>
							</div>
						)}

						{/* Experiences Tab */}
						{activeTab === 'experiences' && (
							<div className="space-y-5">
								<div className="border-border/70 flex items-center justify-between border-b pb-3">
									<div>
										<h3 className="text-text text-xs font-semibold">
											Career Experiences ({cmsState.experiences.length})
										</h3>
										<p className="text-text-muted mt-0.5 text-[11px]">
											Timeline roles, achievements, and technology tags.
										</p>
									</div>
									<button
										onClick={addExperience}
										className="border-border text-text inline-flex cursor-pointer items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-medium shadow-2xs transition-colors hover:bg-neutral-50"
									>
										<Plus size={13} />
										<span>Add Experience</span>
									</button>
								</div>

								{cmsState.experiences.map((exp: ExperienceItem, idx: number) => (
									<div
										key={exp.id || idx}
										className="border-border/80 space-y-4 rounded-xl border bg-white p-5 shadow-2xs"
									>
										<div className="border-border/60 text-text flex items-center justify-between border-b pb-2.5 text-xs font-semibold">
											<span>
												{exp.company || 'New Company'}{' '}
												<span className="text-border/80 mx-1">/</span>{' '}
												<span className="text-text-muted font-normal">{exp.role}</span>
											</span>
											<div className="flex items-center gap-2">
												<span className="text-text-muted text-[11px] font-normal">
													{exp.period}
												</span>
												<button
													onClick={() => deleteExperience(idx)}
													title="Remove Card"
													className="text-text-muted cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-red-50 hover:text-red-600"
												>
													<Trash2 size={13} />
												</button>
											</div>
										</div>

										<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
											<div>
												<label className="text-text-muted mb-1 block text-[11px] font-medium">
													Role Title
												</label>
												<input
													type="text"
													value={exp.role}
													onChange={(e) => updateExperience(idx, 'role', e.target.value)}
													className="border-border focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3 py-1.5 text-xs font-medium transition-all outline-none focus:bg-white"
												/>
											</div>
											<div>
												<label className="text-text-muted mb-1 block text-[11px] font-medium">
													Company / Org
												</label>
												<input
													type="text"
													value={exp.company}
													onChange={(e) => updateExperience(idx, 'company', e.target.value)}
													className="border-border focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3 py-1.5 text-xs transition-all outline-none focus:bg-white"
												/>
											</div>
											<div>
												<label className="text-text-muted mb-1 block text-[11px] font-medium">
													Period
												</label>
												<input
													type="text"
													value={exp.period}
													onChange={(e) => updateExperience(idx, 'period', e.target.value)}
													className="border-border focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3 py-1.5 font-mono text-xs transition-all outline-none focus:bg-white"
												/>
											</div>
										</div>

										<div>
											<label className="text-text-muted mb-1 block text-[11px] font-medium">
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
												className="border-border focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3 py-2 text-xs leading-relaxed transition-all outline-none focus:bg-white"
												placeholder="Bullet 1&#10;Bullet 2&#10;Bullet 3"
											/>
										</div>

										<div>
											<label className="text-text-muted mb-1 block text-[11px] font-medium">
												Skill Tags (comma separated)
											</label>
											<input
												type="text"
												value={(exp.skills || []).join(', ')}
												onChange={(e) => {
													const newSkills = e.target.value
														.split(',')
														.map((s) => s.trim())
														.filter(Boolean);
													updateExperience(idx, 'skills', newSkills);
												}}
												className="border-border focus:border-text w-full rounded-lg border bg-neutral-50/50 px-3 py-1.5 text-xs transition-all outline-none focus:bg-white"
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
								<div className="border-border/70 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
									<div>
										<h3 className="text-text text-xs font-semibold">
											Client & Partner Endorsements ({cmsState.recommendations.length})
										</h3>
										<p className="text-text-muted mt-0.5 text-[11px]">
											Testimonial quotes and author credentials.
										</p>
									</div>
									<div className="flex items-center gap-2">
										<button
											type="button"
											onClick={handleSyncRecommendations}
											disabled={isRefreshingRecs}
											className="border-border text-text inline-flex cursor-pointer items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-medium shadow-2xs transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
											title="Fetch latest recommendations from SocialCrawl LinkedIn API"
										>
											<RefreshCw size={13} className={isRefreshingRecs ? 'animate-spin' : ''} />
											<span>{isRefreshingRecs ? 'Syncing...' : 'Sync from API'}</span>
										</button>
										<button
											type="button"
											onClick={addRecommendation}
											className="border-border text-text inline-flex cursor-pointer items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-medium shadow-2xs transition-colors hover:bg-neutral-50"
										>
											<Plus size={13} />
											<span>Add Testimonial</span>
										</button>
									</div>
								</div>

								{recsRefreshStatus && (
									<div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
										<Check size={14} className="shrink-0" />
										<span>{recsRefreshStatus}</span>
									</div>
								)}

								{recsRefreshError && (
									<div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
										<AlertCircle size={14} className="shrink-0" />
										<span>{recsRefreshError}</span>
									</div>
								)}

								<Reorder.Group
									axis="y"
									values={cmsState.recommendations}
									onReorder={(newOrder) =>
										handleStateChange((prev) => ({ ...prev, recommendations: newOrder }))
									}
									className="space-y-4"
								>
									{cmsState.recommendations.map((rec: RecommendationItem, idx: number) => (
										<SortableTestimonialCard
											key={
												rec.id ||
												`${rec.author}-${rec.company}-${rec.quote?.slice(0, 16) || idx}`
											}
											rec={rec}
											idx={idx}
											onUpdate={updateRecommendation}
											onDelete={deleteRecommendation}
										/>
									))}
								</Reorder.Group>
							</div>
						)}

						{/* Certifications Tab */}
						{activeTab === 'certifications' && (
							<div className="space-y-5">
								<div className="border-border/70 flex items-center justify-between border-b pb-3">
									<div>
										<h3 className="text-text text-xs font-semibold">Certifications & Documents</h3>
										<p className="text-text-muted mt-0.5 text-[11px]">
											Document names & Google Drive show-only links.
										</p>
									</div>
									<button
										onClick={addCertification}
										className="border-border text-text inline-flex cursor-pointer items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-medium shadow-2xs transition-colors hover:bg-neutral-50"
									>
										<Plus size={13} />
										<span>Add File</span>
									</button>
								</div>

								<Reorder.Group
									axis="y"
									values={cmsState.certifications || defaultTinaContent.certifications}
									onReorder={(newOrder) =>
										handleStateChange((prev) => ({ ...prev, certifications: newOrder }))
									}
									className="space-y-3.5"
								>
									{(cmsState.certifications || defaultTinaContent.certifications).map((cert, idx) => (
										<SortableCertificationCard
											key={cert.id || idx}
											cert={cert}
											idx={idx}
											onUpdate={updateCertification}
											onDelete={deleteCertification}
										/>
									))}
								</Reorder.Group>
							</div>
						)}

						{/* Blog iFrame Configuration Tab */}
						{activeTab === 'blog' && (
							<div className="space-y-5">
								<div className="border-border/70 border-b pb-3">
									<div className="flex items-center gap-2">
										<Globe size={15} className="text-text" />
										<h3 className="text-text text-xs font-semibold">Blog iFrame Embed URL</h3>
									</div>
									<p className="text-text-muted mt-0.5 text-[11px] leading-relaxed">
										Set the destination blog URL displayed in the full-screen Blog tab. Only you can
										configure this URL from Editor Mode.
									</p>
								</div>

								{/* Privacy and Editor-Only Notice Card */}
								<div className="border-border/80 space-y-1.5 rounded-xl border bg-neutral-50/80 p-4 text-xs">
									<div className="text-text flex items-center gap-2 font-semibold">
										<span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
										<span>Editor-Controlled Embedding</span>
									</div>
									<p className="text-text-muted text-[11px] leading-relaxed">
										Public visitors to your portfolio cannot modify or see configuration controls on
										the blog page. They experience your embedded engineering articles cleanly and
										edge-to-edge.
									</p>
								</div>

								{/* Blog Navigation Tab Visibility Toggle */}
								<div className="border-border/80 flex items-center justify-between gap-4 rounded-xl border bg-white p-4 shadow-2xs">
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<span className="text-text text-xs font-semibold">Blog Tab in Navbar</span>
											<span
												className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
													cmsState.portfolio.showBlogTab !== false
														? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
														: 'border border-neutral-200 bg-neutral-100 text-neutral-500'
												}`}
											>
												{cmsState.portfolio.showBlogTab !== false
													? 'Active & Visible'
													: 'Hidden from Navbar'}
											</span>
										</div>
										<p className="text-text-muted text-[11px] leading-relaxed">
											Toggle whether the &quot;Blog&quot; tab appears in the main portfolio
											navigation bar for visitors.
										</p>
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
										className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
											cmsState.portfolio.showBlogTab !== false ? 'bg-text' : 'bg-neutral-300'
										}`}
									>
										<span
											className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
												cmsState.portfolio.showBlogTab !== false
													? 'translate-x-5'
													: 'translate-x-0'
											}`}
										/>
									</button>
								</div>

								{/* Target URL Input */}
								<div className="border-border/80 space-y-3 rounded-xl border bg-white p-5 shadow-2xs">
									<label className="text-text-muted block text-[11px] font-medium">
										Destination Blog URL (HTTPS)
									</label>
									<div className="flex items-center gap-2">
										<input
											type="url"
											placeholder="https://blog.google/technology/ai/"
											value={cmsState.portfolio.blogUrl || ''}
											onChange={(e) => updateGeneralField('blogUrl', e.target.value)}
											className="border-border focus:border-text text-text flex-1 rounded-lg border bg-neutral-50/50 px-3.5 py-2 font-mono text-xs outline-none focus:bg-white"
										/>
										{cmsState.portfolio.blogUrl && (
											<a
												href={cmsState.portfolio.blogUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="border-border text-text-muted hover:text-text shrink-0 rounded-lg border p-2 transition-colors hover:bg-neutral-100"
												title="Open in new window"
											>
												<ExternalLink size={14} />
											</a>
										)}
									</div>
								</div>

								{/* Active Embed Summary */}
								<div className="border-border/70 text-text-muted space-y-1 rounded-xl border bg-neutral-50/80 p-3.5 text-[11px]">
									<div className="text-text font-medium">Active Embed Target:</div>
									<div className="text-text font-mono text-[10px] break-all">
										{cmsState.portfolio.blogUrl?.trim() ||
											'https://blog.google/technology/ai/ (Default)'}
									</div>
								</div>
							</div>
						)}

						{/* JSON Tab */}
						{activeTab === 'json' && (
							<div className="space-y-4">
								<div className="border-border/70 flex flex-wrap items-center justify-between gap-3 border-b pb-3">
									<div>
										<h3 className="text-text text-xs font-semibold">Consolidated Site JSON</h3>
										<p className="text-text-muted mt-0.5 text-[11px]">
											Live serializable state backing portfolio, experiences, recommendations, and
											certifications.
										</p>
									</div>
									<div className="flex items-center gap-2">
										<button
											type="button"
											onClick={() => {
												if (!isEditingJson) {
													setJsonInput(JSON.stringify(cmsState, null, 2));
													setJsonError(null);
												}
												setIsEditingJson(!isEditingJson);
											}}
											className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium shadow-2xs transition-colors ${
												isEditingJson
													? 'border-text text-text bg-neutral-100'
													: 'border-border hover:border-text text-text bg-white'
											}`}
										>
											<Code size={13} />
											<span>{isEditingJson ? 'Close Editor' : 'Paste / Edit JSON'}</span>
										</button>
										<button
											type="button"
											onClick={() => {
												navigator.clipboard.writeText(JSON.stringify(cmsState, null, 2));
												setCopiedJson(true);
												setTimeout(() => setCopiedJson(false), 2000);
											}}
											className="border-border hover:border-text text-text inline-flex cursor-pointer items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-medium shadow-2xs transition-colors"
										>
											{copiedJson ? (
												<Check size={13} className="text-emerald-600" />
											) : (
												<FileText size={13} />
											)}
											<span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
										</button>
									</div>
								</div>

								{jsonSuccess && (
									<div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
										<Check size={14} className="shrink-0 text-emerald-600" />
										<span>JSON successfully validated and applied to the entire app!</span>
									</div>
								)}

								{jsonError && (
									<div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
										<span className="font-semibold">JSON Parse Error: </span>
										{jsonError}
									</div>
								)}

								{isEditingJson ? (
									<div className="space-y-3">
										<div className="text-text-muted text-[11px]">
											Paste or edit your consolidated site JSON below. Pressing{' '}
											<strong>Apply JSON to App</strong> will update all sections instantly.
										</div>
										<textarea
											value={jsonInput}
											onChange={(e) => {
												setJsonInput(e.target.value);
												setJsonError(null);
											}}
											rows={18}
											className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3.5 font-mono text-[11px] leading-relaxed text-emerald-400 outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600"
											placeholder="Paste JSON here..."
										/>
										<div className="flex items-center justify-between">
											<span className="text-text-subtle font-mono text-[11px]">
												Validates: portfolio, experiences, recommendations, certifications,
												skills
											</span>
											<div className="flex gap-2">
												<button
													type="button"
													onClick={() => {
														setIsEditingJson(false);
														setJsonError(null);
													}}
													className="border-border text-text-muted hover:text-text cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-neutral-50"
												>
													Cancel
												</button>
												<button
													type="button"
													onClick={handleApplyJson}
													className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-black"
												>
													<Save size={13} />
													<span>Apply JSON to App</span>
												</button>
											</div>
										</div>
									</div>
								) : (
									<div className="max-h-[500px] overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900 p-4 font-mono text-[11px] leading-relaxed text-neutral-100">
										<pre>{JSON.stringify(cmsState, null, 2)}</pre>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Subtle Form Status Strip */}
					<div className="border-border/80 text-text-muted flex shrink-0 items-center justify-between border-t bg-neutral-50/60 px-5 py-3 text-[11px]">
						<span className="flex max-w-[70%] items-center gap-2 truncate">
							<span
								className={`h-1.5 w-1.5 shrink-0 rounded-full ${
									isSaving
										? 'animate-pulse bg-amber-500'
										: saveError
											? 'bg-red-500'
											: 'bg-emerald-500'
								}`}
							/>
							<span className="truncate">
								{isSaving
									? 'Persisting to content/siteContent.json...'
									: saveError
										? `Save issue: ${saveError}`
										: saveStatusMessage
											? saveStatusMessage
											: hasUnsavedChanges
												? 'Unsaved changes (click Save Changes to write to JSON)'
												: 'Synced with content/siteContent.json'}
							</span>
						</span>
						<span className="text-text-subtle shrink-0 font-mono text-[10px]">
							content/siteContent.json
						</span>
					</div>
				</div>

				{/* Right Side: Interactive Real-Time Live Preview Pane */}
				<div
					className={`${mobilePanel === 'preview' ? 'flex' : 'hidden md:flex'} h-full min-h-0 flex-1 flex-col overflow-hidden bg-white`}
				>
					{/* Canvas Sub-Header Bar */}
					<div className="border-border/70 z-10 flex h-11 shrink-0 items-center justify-between gap-3 border-b bg-white px-4 sm:px-6">
						{/* Left: Section Jump Shortcuts */}
						<div className="flex min-w-0 scrollbar-none items-center gap-1 overflow-x-auto py-0.5">
							<span className="text-text-muted mr-1.5 hidden text-[11px] font-medium sm:inline">
								Jump:
							</span>
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
									className="text-text-muted hover:text-text cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition-colors hover:bg-neutral-100"
								>
									{sec.label}
								</button>
							))}
						</div>

						{/* Right: Actions / Spacer */}
						<div className="flex shrink-0 items-center gap-2" />
					</div>

					{/* Full Width Live Preview Container */}
					<div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-white">
						{activeTab === 'blog' ? (
							<div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-neutral-100">
								<div className="border-border/70 text-text-muted flex h-8 shrink-0 items-center justify-between border-b bg-white px-4 text-[11px]">
									<div className="text-text flex items-center gap-1.5 font-medium">
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
						) : activeTab === 'certifications' ? (
							<div className="text-text min-h-0 flex-1 overflow-y-auto scroll-smooth bg-white font-sans">
								<CertificationsContainer
									certifications={cmsState.certifications || defaultTinaContent.certifications}
									developerName={cmsState.portfolio.developerName}
									onBackToPortfolio={() => setActiveTab('general')}
								/>
							</div>
						) : (
							<div
								ref={previewScrollRef}
								className="text-text min-h-0 flex-1 overflow-y-auto scroll-smooth bg-white font-sans"
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
										title={cmsState.portfolio.aboutTitle}
										content={cmsState.portfolio.aboutBio1}
									/>
								</div>

								{/* Experience Section */}
								<div id="preview-experience">
									<ExperienceContainer experiences={cmsState.experiences} />
								</div>

								{/* Testimonials Section */}
								<div id="preview-testimonials">
									<TestimonialsContainer recommendations={cmsState.recommendations} />
								</div>

								{/* Contact Section */}
								<div id="preview-contact">
									<ContactContainer portfolio={cmsState.portfolio} />
								</div>

								{/* Footer Section */}
								<FooterContainer
									developerName={cmsState.portfolio.developerName}
									contactEmail={cmsState.portfolio.contactEmail}
									linkedInUrl={cmsState.portfolio.linkedInUrl}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
