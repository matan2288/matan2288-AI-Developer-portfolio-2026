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

export const portfolioPillars: PillarItem[] = [
  {
    id: "buyflow",
    num: "01",
    title: "Checkout Buyflow Redesign",
    subtitle: "High-Converting Digital Pipelines",
    desc: "Spearheaded enterprise-level Buyflow checkouts, converting complex legacy code into modern Vue.js and lightweight component structures (Altice, 3UK). Reduced drop-off and boosted conversion metrics through seamless and highly secure transactional flows."
  },
  {
    id: "analytics",
    num: "02",
    title: "Telemetry & GTM Automation",
    subtitle: "High-Fidelity Interaction Analytics",
    desc: "Engineered self-acting scripts mapping click navigations automatically straight to GA4 dataLayers. Configured complex tag manager setups to track critical metrics with bulletproof precision and direct stakeholder alignment."
  },
  {
    id: "typesafety",
    num: "03",
    title: "TypeScript / Full-Stack Spezialisation",
    subtitle: "Zero-Friction Systems",
    desc: "Committed to robust type structures in React/Vue on the frontend and Express/PHP backends. Designed unified state models and responsive caching patterns that resist regression and build cleanly."
  },
  {
    id: "discipline",
    num: "04",
    title: "Systematic Progress",
    subtitle: "Focus and Consistent Form",
    desc: "Bringing absolute structure, careful attention to detail, and progressive tuning to software performance, load handling, and database optimization."
  }
];

export const portfolioExperiences: ExperienceItem[] = [
  {
    company: "Altice Project",
    role: "Senior Full Stack Specialist",
    location: "Tel Aviv, Israel",
    period: "2023 — Present",
    bullets: [
      "Pioneered enterprise-wide migration of flagship platform from legacy React to modern Drupal & Vue component framework.",
      "Redesigned the consumer checkout buyflow, accelerating load efficiency and decreasing checkout abandonment.",
      "Built custom interactive widgets (dynamic carousels, context tooltips, complex responsive forms).",
      "Architected Adobe Analytics and OKTA SSO federations, driving analytics review directly with stakeholders.",
      "Researched server rate-limiting concepts to protect backend pathways under peak load."
    ],
    skills: ["Vue 3", "Drupal", "PHP", "React", "Redux", "GraphQL", "Adobe Analytics", "OKTA SSO", "TypeScript"]
  },
  {
    company: "3UK Project",
    role: "Full Stack Engineer",
    location: "Contract Delivery",
    period: "2022 — 2023",
    bullets: [
      "Simultaneously delivered e-commerce buyflows, portal streams, and mobile app-wrappers in React and Redux-Saga.",
      "Drove rapid resolution of UK production checkout performance bottlenecks on-site.",
      "Designed and integrated the flagship Home Broadband checkout workflow, expanding sign-up rates.",
      "Optimized client-side webpack bundles, implementing lazy-loading to reach strict Core Web Vitals thresholds."
    ],
    skills: ["React.js", "Redux", "Redux-Saga", "SCSS", "Webpack", "JSON API", "Material UI"]
  },
  {
    company: "USCC Project",
    role: "eCommerce Component Engineer",
    location: "Contract Delivery",
    period: "2021 — 2022",
    bullets: [
      "Created high-performance modular components in Adobe Experience Manager (AEM) utilizing pure Vanilla JS engines.",
      "Led cross-team dataLayer analytics standardization, authoring clear enterprise tracking rules.",
      "Developed a custom automation script capturing click-nav interactions based on structural attributes, eliminating manual tracking setups.",
      "Engineered automated URL context absolute converters, saving extensive developer deployment time."
    ],
    skills: ["AEM (HTL, Sling)", "Vanilla JS", "GTM / GA4", "Docker", "CSS3 / Sass"]
  }
];

export const portfolioSkills: SkillCategory[] = [
  {
    title: "Core Technologies",
    items: ["TypeScript", "JavaScript", "React.js", "Vue 3", "Node.js (Express)", "PHP (Laravel / Drupal)"]
  },
  {
    title: "State & Analytics",
    items: ["Redux / Redux-Saga", "Pinia", "Google Tag Manager", "GA4 dataLayers", "Adobe Analytics", "Adobe Target"]
  },
  {
    title: "Backend & Systems",
    items: ["PostgreSQL", "SQL Queries", "MongoDB", "GraphQL", "AEM OSGi", "Docker", "RESTful APIs"]
  }
];

export const portfolioRecommendations: RecommendationItem[] = [
  {
    quote: "Matan completely overhauled our e-commerce checkout flow. His attention to precise page loads, analytical integration, and clean TypeScript state was exactly what our enterprise project required. His speed under tight client deadlines is remarkable.",
    author: "Enterprise Delivery Lead",
    role: "Altice Migration Contract",
    company: "Telecom Partner"
  },
  {
    quote: "Matan came on board for our checkout streams under immense pressure. He resolved persistent state synchronization bugs and delivered a highly converting broadband subscriber flow without breaking existing systems. Extremely technical and focused.",
    author: "Principal Engineer",
    role: "eCommerce Division",
    company: "3UK Contract"
  },
  {
    quote: "An absolute asset for analytics integration and modular component building. Matan automated our GA4 tracking elements with lightweight Vanilla JS scripts, saving hundreds of hours of manual setup. Pragmatic, fast, and high-standard.",
    author: "Marketing Technology Director",
    role: "Digital Tag Infrastructure",
    company: "USCC Contract"
  }
];
