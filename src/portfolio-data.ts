import { PillarItem, SkillCategory, RecommendationItem } from './features/dashboard/types';

export const portfolioPillars: PillarItem[] = [
  {
    id: "Buyflow Optimization",
    num: "01.1A",
    title: "E-Commerce Buyflows",
    subtitle: "High-Converting Checkout Pipes",
    desc: "Refactored key checkout pipelines and subscriber registration pathways for Altice and 3UK. Implemented reactive validation, dynamic form caching, and secure payment integrations using modern React, Redux-Saga, and Vue 3."
  },
  {
    id: "Site Migrations",
    num: "01.1B",
    title: "Drupal & Vue 3 Custom Solutions",
    subtitle: "Enterprise-Scale Platforms",
    desc: "Re-engineered legacy web architectures, moving from rigid CMS frameworks to highly composable Vue 3 components backed by Drupal and PHP. Standardized UI components while reducing bundle weight and page interactive lag."
  },
  {
    id: "Telemetry & Tagging",
    num: "01.1C",
    title: "Adobe Analytics & GA4",
    subtitle: "Strict Telemetry & Tag Automation",
    desc: "Led Adobe Analytics integration, establishing robust schemas to feed GA4 dataLayers. Developed custom interaction telemetry within Adobe Experience Manager (AEM) to track customer friction and transaction funnels."
  }
];

export const portfolioSkills: SkillCategory[] = [
  {
    title: "Core Frontend Frameworks",
    items: ["React", "React Native", "Vue 3", "Redux Toolkit", "Redux-Saga", "Vuex", "TypeScript", "JavaScript (ES6+)"]
  },
  {
    title: "Styling & UI Architecture",
    items: ["Sass / SCSS", "Tailwind CSS", "Storybook", "Framer Motion", "Semantic HTML5", "ARIA Accessibility"]
  },
  {
    title: "Backend & Databases",
    items: ["Node.js", "Java", "Express.js", "MySQL", "MongoDB", "RESTful APIs"]
  },
  {
    title: "CMS & Platforms",
    items: ["Adobe Experience Manager (AEM)", "Drupal", "PHP", "Contentful CMS"]
  }
];

export const portfolioRecommendations: RecommendationItem[] = [
  {
    quote: "Matan possesses a unique mix of raw programming talent, systematic focus, and extreme attention to detail. He completely took charge of our e-commerce subscriber checkout portal migration, delivering bulletproof validation logic that immediately saw an uplift in successful transactions.",
    author: "Senior Delivery Director",
    role: "Amdocs Telecom Delivery",
    company: "Altice Program"
  },
  {
    quote: "A dedicated engineer who consistently goes above and beyond to make sure systems are optimized. During our major broadband product launch, Matan resolved deep-seated concurrency race conditions in the Redux state, keeping checkout latency down to a minimum.",
    author: "Principal Architect",
    role: "Core Order Engineering",
    company: "3UK Program"
  },
  {
    quote: "Working with Matan on the GA4 dataLayer mapping was a masterclass in clean architecture. He led the technical sessions, automated custom interaction tags in AEM, and made sure all stakeholders had verified dashboards. Highly recommended.",
    author: "Stakeholder Lead",
    role: "Digital Performance Analytics",
    company: "USCellular Program"
  }
];
