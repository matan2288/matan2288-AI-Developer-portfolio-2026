import { useState, useEffect } from 'react';
import mainPortfolioData from '../../content/portfolio/main.json';
import buyflowPillar from '../../content/pillars/buyflow.json';
import migrationsPillar from '../../content/pillars/migrations.json';
import telemetryPillar from '../../content/pillars/telemetry.json';
import skillCategoriesData from '../../content/skills/categories.json';
import amdocsExp from '../../content/experiences/amdocs.json';
import bootcampExp from '../../content/experiences/bootcamp.json';
import navyExp from '../../content/experiences/navy.json';
import alticeRec from '../../content/recommendations/altice.json';
import threeukRec from '../../content/recommendations/threeuk.json';
import uscellularRec from '../../content/recommendations/uscellular.json';
import certificationsData from '../../content/certifications/certifications.json';

import { PillarItem, SkillCategory, RecommendationItem, ExperienceItem, CertificationItem } from '../features/dashboard/types';

export interface PortfolioGeneralContent {
  developerName: string;
  title: string;
  location: string;
  avatarUrl: string;
  heroBio: string;
  aboutTitle: string;
  aboutBio1: string;
  aboutBio2: string;
  contactEmail: string;
  linkedInUrl: string;
  blogUrl?: string;
  stats: { value: string; label: string }[];
}

const LOCAL_STORAGE_KEY = 'tina_cms_portfolio_content_v3';

export const defaultTinaContent = {
  portfolio: mainPortfolioData as PortfolioGeneralContent,
  pillars: [buyflowPillar, migrationsPillar, telemetryPillar] as PillarItem[],
  skills: skillCategoriesData.categories as SkillCategory[],
  experiences: [amdocsExp, bootcampExp, navyExp] as ExperienceItem[],
  recommendations: [alticeRec, threeukRec, uscellularRec] as RecommendationItem[],
  certifications: certificationsData.certifications as CertificationItem[],
};

// Global in-memory draft state (allows live real-time preview without saving)
let liveDraftContent: typeof defaultTinaContent | null = null;

// Helper to get active Tina CMS content (live draft > localStorage > default JSON)
export function getStoredTinaContent() {
  if (liveDraftContent) {
    return {
      ...defaultTinaContent,
      ...liveDraftContent,
      portfolio: {
        ...defaultTinaContent.portfolio,
        ...(liveDraftContent.portfolio || {}),
        stats: Array.isArray(liveDraftContent.portfolio?.stats) ? liveDraftContent.portfolio.stats : defaultTinaContent.portfolio.stats,
      },
      pillars: Array.isArray(liveDraftContent.pillars) && liveDraftContent.pillars.length > 0 ? liveDraftContent.pillars : defaultTinaContent.pillars,
      skills: Array.isArray(liveDraftContent.skills) && liveDraftContent.skills.length > 0 ? liveDraftContent.skills : defaultTinaContent.skills,
      experiences: Array.isArray(liveDraftContent.experiences) && liveDraftContent.experiences.length > 0 ? liveDraftContent.experiences : defaultTinaContent.experiences,
      recommendations: Array.isArray(liveDraftContent.recommendations) && liveDraftContent.recommendations.length > 0 ? liveDraftContent.recommendations : defaultTinaContent.recommendations,
      certifications: Array.isArray(liveDraftContent.certifications) && liveDraftContent.certifications.length > 0 ? liveDraftContent.certifications : defaultTinaContent.certifications,
    };
  }
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const safeAvatarUrl = (!parsed.portfolio?.avatarUrl || parsed.portfolio.avatarUrl.includes('picsum.photos'))
        ? defaultTinaContent.portfolio.avatarUrl
        : parsed.portfolio.avatarUrl;
      const title = (parsed.portfolio?.title === 'Software Developer' || !parsed.portfolio?.title)
        ? defaultTinaContent.portfolio.title
        : parsed.portfolio.title;
      return {
        ...defaultTinaContent,
        ...parsed,
        portfolio: {
          ...defaultTinaContent.portfolio,
          ...(parsed.portfolio || {}),
          title,
          avatarUrl: safeAvatarUrl,
          stats: Array.isArray(parsed.portfolio?.stats) 
            ? parsed.portfolio.stats 
            : defaultTinaContent.portfolio.stats,
        },
        pillars: Array.isArray(parsed.pillars) && parsed.pillars.length > 0 ? parsed.pillars : defaultTinaContent.pillars,
        skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : defaultTinaContent.skills,
        experiences: Array.isArray(parsed.experiences) && parsed.experiences.length > 0 ? parsed.experiences : defaultTinaContent.experiences,
        recommendations: Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0 ? parsed.recommendations : defaultTinaContent.recommendations,
        certifications: Array.isArray(parsed.certifications) && parsed.certifications.length > 0 ? parsed.certifications : defaultTinaContent.certifications,
      };
    }
  } catch (e) {
    console.warn('Failed to load stored Tina CMS content:', e);
  }
  return defaultTinaContent;
}

// Global subscribers for real-time reactivity when Tina CMS updates
type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeToTinaContent(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifySubscribers() {
  listeners.forEach((fn) => fn());
}

export function setLiveDraftTinaContent(draft: typeof defaultTinaContent | null) {
  liveDraftContent = draft;
  notifySubscribers();
}

export function saveTinaContent(newContent: typeof defaultTinaContent) {
  try {
    liveDraftContent = null;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newContent));
    notifySubscribers();
    // Also dispatch custom storage event for same-window iframes
    window.dispatchEvent(new Event('tina-content-updated'));
  } catch (e) {
    console.error('Failed to save Tina CMS content:', e);
  }
}

export function updateAvatarUrl(newAvatarUrl: string) {
  const current = getStoredTinaContent();
  const updated = {
    ...current,
    portfolio: {
      ...current.portfolio,
      avatarUrl: newAvatarUrl,
    },
  };
  saveTinaContent(updated);
}

export const getTinaContent = getStoredTinaContent;

export function resetTinaContentToDefaults() {
  liveDraftContent = null;
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  notifySubscribers();
  window.dispatchEvent(new Event('tina-content-updated'));
}

// Set up cross-window and postMessage listeners for live iframe synchronization
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === LOCAL_STORAGE_KEY) {
      liveDraftContent = null;
      notifySubscribers();
    }
  });

  window.addEventListener('tina-content-updated', () => {
    liveDraftContent = null;
    notifySubscribers();
  });

  window.addEventListener('message', (event) => {
    try {
      if (event.data && event.data.type === 'TINA_CMS_LIVE_DRAFT') {
        liveDraftContent = event.data.payload;
        notifySubscribers();
      } else if (event.data && event.data.type === 'TINA_CMS_CLEAR_DRAFT') {
        liveDraftContent = null;
        notifySubscribers();
      }
    } catch (err) {
      console.warn('Error handling Tina CMS message:', err);
    }
  });
}

// React Hooks for Tina Content
export function useTinaPortfolio() {
  const [content, setContent] = useState<PortfolioGeneralContent>(() => getStoredTinaContent().portfolio);

  useEffect(() => {
    const unsubscribe = subscribeToTinaContent(() => {
      setContent(getStoredTinaContent().portfolio);
    });
    return unsubscribe;
  }, []);

  return content;
}

export function useTinaPillars() {
  const [pillars, setPillars] = useState<PillarItem[]>(() => getStoredTinaContent().pillars);

  useEffect(() => {
    const unsubscribe = subscribeToTinaContent(() => {
      setPillars(getStoredTinaContent().pillars);
    });
    return unsubscribe;
  }, []);

  return pillars;
}

export function useTinaSkills() {
  const [skills, setSkills] = useState<SkillCategory[]>(() => getStoredTinaContent().skills);

  useEffect(() => {
    const unsubscribe = subscribeToTinaContent(() => {
      setSkills(getStoredTinaContent().skills);
    });
    return unsubscribe;
  }, []);

  return skills;
}

export function useTinaExperiences() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(() => getStoredTinaContent().experiences);

  useEffect(() => {
    const unsubscribe = subscribeToTinaContent(() => {
      setExperiences(getStoredTinaContent().experiences);
    });
    return unsubscribe;
  }, []);

  return experiences;
}

export function useTinaRecommendations() {
  const [recs, setRecs] = useState<RecommendationItem[]>(() => getStoredTinaContent().recommendations);

  useEffect(() => {
    const unsubscribe = subscribeToTinaContent(() => {
      setRecs(getStoredTinaContent().recommendations);
    });
    return unsubscribe;
  }, []);

  return recs;
}

export function useTinaCertifications() {
  const [certs, setCerts] = useState<CertificationItem[]>(() => getStoredTinaContent().certifications || defaultTinaContent.certifications);

  useEffect(() => {
    const unsubscribe = subscribeToTinaContent(() => {
      setCerts(getStoredTinaContent().certifications || defaultTinaContent.certifications);
    });
    return unsubscribe;
  }, []);

  return certs;
}

