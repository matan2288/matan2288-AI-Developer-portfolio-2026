export interface PortfolioContent {
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

export interface PillarItem {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  desc: string;
}

export interface ExperienceItem {
  id?: string;
  company: string;
  role: string;
  location: string;
  period: string;
  bullets: string[];
  skills: string[];
  isLatest?: boolean;
  clientLogoPlaceholder?: string;
}

export interface SkillCategory {
  title: string;
  items: string[];
}

export interface RecommendationItem {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  description: string;
  skills: string[];
  driveUrl: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
