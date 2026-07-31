import { BlogPost } from './types';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'e-commerce-telecom-buyflows',
    slug: 'e-commerce-telecom-buyflows',
    title: 'Architecting High-Conversion E-Commerce Buyflows at Enterprise Telecom Scale',
    excerpt: 'How we reduced cart abandonment by 18% across 4 major telecom networks by decoupling multi-step checkout state and optimizing checkout render cycles.',
    category: 'Architecture',
    date: 'July 14, 2026',
    readTime: '6 min read',
    featured: true,
    tags: ['React', 'Redux-Saga', 'E-Commerce', 'Performance', 'Telecom'],
    author: {
      name: 'Matan Elmaliah',
      role: 'Fullstack & Frontend Specialist',
      avatar: 'https://picsum.photos/seed/matandev/200/200'
    },
    content: [
      'Enterprise telecom buyflows are notoriously complex. Unlike simple single-item checkout flows, purchasing a smartphone subscription involves device selection, trade-in valuation, credit checks, eSIM provisioning, multi-tier plan customization, and regulatory address verification.',
      '### The Challenge: State Bloat & Async Race Conditions',
      'When working on transactions across Altice, 3UK, USCellular, and T-Mobile systems, we encountered a common bottleneck: deeply nested state objects being mutated asynchronously during third-party credit check callbacks. This caused frequent UI re-renders, input jank, and phantom cart state drops during step transitions.',
      '```typescript\n// Anti-pattern: Monolithic cart state causing top-level re-renders\nconst [cartState, setCartState] = useState({\n  device: selectedPhone,\n  plan: selectedPlan,\n  tradeIn: tradeInDetails,\n  userAddress: addressVerification,\n});\n```',
      '### The Solution: Decoupled State Machine & Saga Orchestration',
      'To eliminate state race conditions, we restructured the transaction pipeline into a deterministic state machine managed via Redux-Saga. Each checkout step operates as an isolated, validated boundary:',
      '1. **Normalized Entity Storage:** Device, plan, and addon selections are stored as atomic normalized IDs rather than deep objects.',
      '2. **Asynchronous Sagas for Third-Party APIs:** Credit check queries and SIM validation are managed with non-blocking saga side effects, ensuring the UI remains crisp at 60 FPS.',
      '3. **Optimistic Form Presets:** Address validation pre-populates fields using local caching before server validation resolves.',
      '### Results & Impact',
      'By decoupling state and eliminating unnecessary re-renders, average checkout completion times dropped by 24%, resulting in an 18% increase in converted order completions across enterprise campaigns.'
    ]
  },
  {
    id: 'gtm-datalayers-adobe-analytics',
    slug: 'gtm-datalayers-adobe-analytics',
    title: 'Building Type-Safe GTM DataLayers with Adobe Analytics & TypeScript',
    excerpt: 'A practical guide to implementing bulletproof client-side analytics tracking without memory leaks or missing event payloads.',
    category: 'DataLayers & GTM',
    date: 'June 28, 2026',
    readTime: '5 min read',
    featured: false,
    tags: ['TypeScript', 'GTM', 'Adobe Analytics', 'DataLayers', 'Telemetry'],
    author: {
      name: 'Matan Elmaliah',
      role: 'Fullstack & Frontend Specialist',
      avatar: 'https://picsum.photos/seed/matandev/200/200'
    },
    content: [
      'Digital analytics pipelines live and die by data quality. In large-scale frontend applications, standard `window.dataLayer.push()` calls frequently suffer from missing event fields, inconsistent naming conventions, or race conditions where tracking triggers before marketing tags load.',
      '### Creating a Strongly-Typed Telemetry Abstraction',
      'Instead of allowing direct `window.dataLayer.push` calls scattered across visual components, we create a centralized, strongly-typed Analytics Service:',
      '```typescript\nexport interface PurchaseEvent {\n  event: "ecom_purchase";\n  transaction_id: string;\n  value: number;\n  currency: "USD" | "GBP" | "EUR";\n  items: Array<{\n    item_id: string;\n    item_name: string;\n    price: number;\n  }>;\n}\n\nexport function trackEvent<T extends AnalyticsEvent>(payload: T): void {\n  if (typeof window !== "undefined" && window.dataLayer) {\n    window.dataLayer.push(payload);\n  }\n}\n```',
      '### Synchronizing Adobe Launch & GTM Signals',
      'When supporting both Google Tag Manager and Adobe Analytics concurrently, event payload mapping can easily diverge. Using a unified schema bridge ensures both telemetry engines receive structured data simultaneously without duplicating code or degrading runtime performance.'
    ]
  },
  {
    id: 'navy-diving-technician-to-frontend',
    slug: 'navy-diving-technician-to-frontend',
    title: 'From IDF Navy Diving Technician to Senior Frontend Engineer: Lessons in Rigor',
    excerpt: 'How military technical discipline, under-pressure troubleshooting, and methodical maintenance translate directly into resilient software architecture.',
    category: 'Career & Discipline',
    date: 'May 19, 2026',
    readTime: '4 min read',
    featured: false,
    tags: ['Career', 'Engineering Discipline', 'Leadership', 'Problem Solving'],
    author: {
      name: 'Matan Elmaliah',
      role: 'Fullstack & Frontend Specialist',
      avatar: 'https://picsum.photos/seed/matandev/200/200'
    },
    content: [
      'Serving as a navy diving technician in the IDF demands extreme technical precision. Underwater life support systems leave zero room for oversight—every valve check, pressure seal, and maintenance log must follow strict protocol.',
      '### Parallel 1: Root Cause Analysis vs. Quick Patches',
      'In high-stakes marine environments, band-aid fixes can be dangerous. The same principle applies to software engineering: when a critical production bug surfaces in a payment checkout or state store, patching the symptom without understanding the root cause invites future failures.',
      '### Parallel 2: Calm Execution Under Pressure',
      'Whether diagnosing sonar telemetry during exercises or triaging a high-severity production outage on Black Friday, maintaining composure and clear communication with your team is essential for fast, error-free resolution.',
      '### Summary',
      'Technical mastery is built on discipline, consistency, and clear standards. Every codebase benefits from clear documentation, automated test suites, and methodical peer reviews.'
    ]
  },
  {
    id: 'micro-frontends-telecom-portals',
    slug: 'micro-frontends-telecom-portals',
    title: 'Micro-Frontend Modularization in Enterprise Telecom Portals',
    excerpt: 'Combining Vue 3, React, and SCSS modules under a unified host container while preserving design system consistency.',
    category: 'Architecture',
    date: 'April 02, 2026',
    readTime: '7 min read',
    featured: false,
    tags: ['Vue 3', 'React', 'Micro-Frontends', 'CSS Modules', 'Web Architecture'],
    author: {
      name: 'Matan Elmaliah',
      role: 'Fullstack & Frontend Specialist',
      avatar: 'https://picsum.photos/seed/matandev/200/200'
    },
    content: [
      'Telecom enterprise portals often combine legacy modules built in Vue 3 with modern React applications. Ensuring seamless visual consistency across these distinct frameworks requires a shared design system token contract.',
      '### Shared Design Tokens with Tailwind & CSS Variables',
      'By defining atomic CSS variables at the root document level, both React and Vue components consume the exact same typography scales, color palettes, and container padding math:',
      '```css\n:root {\n  --color-text: #111827;\n  --color-border: #E5E7EB;\n  --color-accent: #2563EB;\n  --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;\n}\n```',
      'This guarantees that regardless of which team deploys a specific micro-frontend widget, the end user experiences a unified, seamless interface.'
    ]
  }
];
