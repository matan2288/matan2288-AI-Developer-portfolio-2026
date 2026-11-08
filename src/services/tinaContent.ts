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
  showBlogTab?: boolean;
  stats: { value: string; label: string }[];
}

const LOCAL_STORAGE_KEY = 'tina_cms_portfolio_content_v6';
const RUNTIME_STORAGE_KEY = 'tina_cms_runtime_content_v1';

export const defaultTinaContent = {
  portfolio: mainPortfolioData as PortfolioGeneralContent,
  pillars: [buyflowPillar, migrationsPillar, telemetryPillar] as PillarItem[],
  skills: skillCategoriesData.categories as SkillCategory[],
  experiences: [amdocsExp, bootcampExp, navyExp] as ExperienceItem[],
  recommendations: [alticeRec, threeukRec, uscellularRec] as RecommendationItem[],
  certifications: certificationsData.certifications as CertificationItem[],
};

// Global in-memory draft state (allows live real-time preview in editor)
let liveDraftContent: typeof defaultTinaContent | null = null;
// In-memory runtime state fetched dynamically from TinaCloud or GitHub without rebuilding
let runtimeFetchedContent: typeof defaultTinaContent | null = null;

export function getTinaEnv() {
  const clientId = 
    (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_TINA_CLIENT_ID || import.meta.env?.TINA_CLIENT_ID)) ||
    (typeof process !== 'undefined' && process.env?.TINA_CLIENT_ID) ||
    '';
  const token = 
    (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_TINA_TOKEN || import.meta.env?.TINA_TOKEN)) ||
    (typeof process !== 'undefined' && process.env?.TINA_TOKEN) ||
    '';
  const branch = 
    (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_TINA_BRANCH || import.meta.env?.VITE_GITHUB_BRANCH || import.meta.env?.TINA_BRANCH)) ||
    (typeof process !== 'undefined' && (process.env?.TINA_BRANCH || process.env?.HEAD)) ||
    'main';
  const githubOwner = 
    (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_GITHUB_OWNER || import.meta.env?.GITHUB_OWNER)) ||
    (typeof process !== 'undefined' && process.env?.GITHUB_OWNER) ||
    '';
  const githubRepo = 
    (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_GITHUB_REPO || import.meta.env?.GITHUB_REPO)) ||
    (typeof process !== 'undefined' && process.env?.GITHUB_REPO) ||
    '';

  return {
    clientId: String(clientId).trim(),
    token: String(token).trim(),
    branch: String(branch).trim(),
    githubOwner: String(githubOwner).trim(),
    githubRepo: String(githubRepo).trim(),
  };
}

// Helper to get active Tina CMS content:
// Priority: 1. Live Editor Draft -> 2. In-Memory Runtime Content -> 3. Local Editor Saves -> 4. Cached Runtime Storage -> 5. Bundled Defaults
export function getStoredTinaContent(): typeof defaultTinaContent {
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

  if (runtimeFetchedContent) {
    return runtimeFetchedContent;
  }

  try {
    // Check manual editor local storage override first
    const saved = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
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
          stats: (Array.isArray(parsed.portfolio?.stats) && parsed.portfolio.stats.length === 4) 
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

    // Check cached runtime storage
    const runtimeSaved = typeof window !== 'undefined' ? localStorage.getItem(RUNTIME_STORAGE_KEY) : null;
    if (runtimeSaved) {
      const parsed = JSON.parse(runtimeSaved);
      if (parsed && parsed.portfolio) {
        return {
          ...defaultTinaContent,
          ...parsed,
          portfolio: { ...defaultTinaContent.portfolio, ...(parsed.portfolio || {}) },
          pillars: Array.isArray(parsed.pillars) && parsed.pillars.length > 0 ? parsed.pillars : defaultTinaContent.pillars,
          skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : defaultTinaContent.skills,
          experiences: Array.isArray(parsed.experiences) && parsed.experiences.length > 0 ? parsed.experiences : defaultTinaContent.experiences,
          recommendations: Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0 ? parsed.recommendations : defaultTinaContent.recommendations,
          certifications: Array.isArray(parsed.certifications) && parsed.certifications.length > 0 ? parsed.certifications : defaultTinaContent.certifications,
        };
      }
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

// Runtime Content Delivery Engine (TinaCloud GraphQL & GitHub Raw with SWR caching)
let isRevalidating = false;

export async function revalidateRuntimeContent(): Promise<boolean> {
  if (typeof window === 'undefined' || isRevalidating) return false;
  const { clientId, token, branch, githubOwner, githubRepo } = getTinaEnv();

  // If neither TinaCloud nor GitHub credentials/repo are available, rely on bundled defaults
  if (!clientId && !githubOwner) {
    return false;
  }

  isRevalidating = true;
  try {
    let freshData: Partial<typeof defaultTinaContent> | null = null;

    // Strategy A: TinaCloud Read-Only GraphQL Content API
    if (clientId && token) {
      try {
        const url = `https://content.tinajs.io/content/${encodeURIComponent(clientId)}/github/${encodeURIComponent(branch)}`;
        const query = `
          query GetProductionPortfolioContent {
            portfolio(relativePath: "main.json") {
              developerName
              title
              location
              avatarUrl
              heroBio
              aboutTitle
              aboutBio1
              aboutBio2
              contactEmail
              linkedInUrl
              blogUrl
              showBlogTab
              stats {
                value
                label
              }
            }
            experiencesConnection {
              edges {
                node {
                  id
                  company
                  role
                  location
                  period
                  isLatest
                  bullets
                  skills
                }
              }
            }
            recommendationsConnection {
              edges {
                node {
                  quote
                  author
                  role
                  company
                  avatarUrl
                  linkedInUrl
                }
              }
            }
            certifications(relativePath: "certifications.json") {
              certifications {
                id
                title
                category
                topic
                issuer
                issueDate
                credentialId
                description
                skills
                driveUrl
                verificationUrl
              }
            }
          }
        `;

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': token,
          },
          body: JSON.stringify({ query }),
        });

        if (res.ok) {
          const gqlRes = await res.json();
          if (gqlRes?.data) {
            const d = gqlRes.data;
            const expList = d.experiencesConnection?.edges?.map((e: any) => e.node) || [];
            const recList = d.recommendationsConnection?.edges?.map((e: any) => e.node) || [];
            freshData = {
              portfolio: d.portfolio ? { ...defaultTinaContent.portfolio, ...d.portfolio } : undefined,
              experiences: expList.length > 0 ? expList : undefined,
              recommendations: recList.length > 0 ? recList : undefined,
              certifications: d.certifications?.certifications || undefined,
            };
          }
        }
      } catch (tinaErr) {
        console.warn('TinaCloud runtime fetch note:', tinaErr);
      }
    }

    // Strategy B: GitHub Raw JSON Fallback
    if (!freshData && githubOwner && githubRepo) {
      try {
        const base = `https://raw.githubusercontent.com/${encodeURIComponent(githubOwner)}/${encodeURIComponent(githubRepo)}/${encodeURIComponent(branch)}/content`;
        const cacheBuster = `?t=${Date.now()}`;
        
        const [portfolioRes, certsRes] = await Promise.allSettled([
          fetch(`${base}/portfolio/main.json${cacheBuster}`).then(r => r.ok ? r.json() : null),
          fetch(`${base}/certifications/certifications.json${cacheBuster}`).then(r => r.ok ? r.json() : null),
        ]);

        freshData = {
          portfolio: portfolioRes.status === 'fulfilled' && portfolioRes.value ? { ...defaultTinaContent.portfolio, ...portfolioRes.value } : undefined,
          certifications: certsRes.status === 'fulfilled' && certsRes.value?.certifications ? certsRes.value.certifications : undefined,
        };
      } catch (ghErr) {
        console.warn('GitHub Raw runtime fetch note:', ghErr);
      }
    }

    if (freshData) {
      const current = getStoredTinaContent();
      const updated: typeof defaultTinaContent = {
        ...current,
        portfolio: freshData.portfolio || current.portfolio,
        experiences: freshData.experiences || current.experiences,
        recommendations: freshData.recommendations || current.recommendations,
        certifications: freshData.certifications || current.certifications,
      };

      runtimeFetchedContent = updated;
      try {
        localStorage.setItem(RUNTIME_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      notifySubscribers();
      return true;
    }
  } catch (err) {
    console.warn('Runtime content revalidation error:', err);
  } finally {
    isRevalidating = false;
  }

  return false;
}

export const refreshTinaContent = revalidateRuntimeContent;

// Set up cross-window, postMessage, and background revalidation listeners
if (typeof window !== 'undefined') {
  // Revalidate on page focus or when reconnecting
  window.addEventListener('focus', () => {
    revalidateRuntimeContent();
  });

  window.addEventListener('online', () => {
    revalidateRuntimeContent();
  });

  // Background polling interval: check for commits every 60 seconds
  setInterval(() => {
    revalidateRuntimeContent();
  }, 60000);

  // Initial asynchronous check after first paint
  setTimeout(() => {
    revalidateRuntimeContent();
  }, 200);

  window.addEventListener('storage', (e) => {
    if (e.key === LOCAL_STORAGE_KEY || e.key === RUNTIME_STORAGE_KEY) {
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

