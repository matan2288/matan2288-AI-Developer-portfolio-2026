export interface PillarItem {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  desc: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  period: string;
  bullets: string[];
  skills: string[];
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
