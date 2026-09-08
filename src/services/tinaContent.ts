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

const LOCAL_STORAGE_KEY = 'tina_cms_portfolio_content_v2';

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
    return liveDraftContent;
  }
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
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

