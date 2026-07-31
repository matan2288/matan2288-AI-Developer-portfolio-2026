import React from 'react';
import { Briefcase, GraduationCap, Anchor, CheckCircle, Database, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface TimelineItemProps {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  icon: React.ReactNode;
  bullets: string[];
  skills?: string[];
  isLatest?: boolean;
}

const TimelineCard: React.FC<TimelineItemProps> = ({
  role,
  company,
  location,
  period,
  icon,
  bullets,
  skills,
  isLatest
}) => {
  return (
    <div className="relative pl-8 sm:pl-10 pb-12 last:pb-0 group">
      {/* Timeline line connecting items */}
      <div className="absolute left-[15px] top-2 bottom-0 w-[2px] bg-border group-last:hidden" />
      
      {/* Node icon */}
      <div className={`absolute left-0 top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-colors duration-300 ${
        isLatest 
          ? 'bg-accent border-accent text-white shadow-xs' 
          : 'bg-white border-border text-text-muted group-hover:border-text group-hover:text-text'
      }`}>
        {icon}
      </div>

      {/* Content wrapper */}
      <div className="bg-bg-alt rounded-2xl p-6 border border-border/80 hover:border-text transition-all duration-300 relative">
        {/* Timestamp header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-border/60">
          <div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider block font-mono mb-1">
              {company} {location && `· ${location}`}
            </span>
            <h4 className="text-base sm:text-lg font-bold text-text uppercase">
              {role}
            </h4>
          </div>
          <span className="text-xs font-mono text-text-muted bg-white border border-border px-3 py-1 rounded-lg shrink-0 self-start sm:self-auto">
            {period}
          </span>
        </div>

        {/* Detailed achievements bullets */}
        <ul className="space-y-3">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="text-xs sm:text-sm text-[#4B5563] leading-relaxed flex items-start gap-2.5">
              <CheckCircle className="text-text-subtle shrink-0 mt-0.5 group-hover:text-text transition-colors" size={14} />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        {/* Dynamic skills tagged */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-border/40">
            {skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] text-text font-medium bg-white border border-border hover:border-text px-2.5 py-1 rounded-md transition-all cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const Timeline: React.FC = () => {
  const experiences = [
    {
      id: 'amdocs',
      company: 'Amdocs (Delivery Unit)',
      role: 'Software Developer',
      location: 'Tel Aviv, Israel',
      period: '2022 — PRESENT',
      isLatest: true,
      icon: <Briefcase size={14} />,
      bullets: [
        "Took ownership of developing core Frontend features for a major client across their eCommerce platform, self-service portal, and mobile app, using React, TypeScript and Redux-Saga.",
        "Participated in a major site migration of a project from React and Contentful to Vue, Drupal, PHP and NodeJS while developing and maintaining custom E2E features and admin tools.",
        "Led Adobe Analytics development and architecture, implementing accurate data tracking while managing client engagements, gathering requirements, and providing support in bi-weekly meetings.",
        "Delivered custom CMS features and JavaScript based components in AEM and Drupal systems, improving editor efficiency and supporting enterprise content management.",
        "Built RESTful APIs while integrating platforms with multiple third-party services.",
        "Designed and built pixel-perfect, responsive, and accessible and mobile-first oriented user interfaces using SCSS and semantic HTML, following ARIA best practices.",
        "Conducted various successful Proof of Concepts (POCs) that successfully evolved into full-scale development initiatives.",
        "Collaborated with cross-functional teams and clients, providing direct technical support, and resolving critical production defects to ensure perfect alignment.",
        "Onboarded and mentored new team members while conducting regular code reviews to ensure scalability, readability, and maintainability of the codebase."
      ],
      skills: [
        'React', 'Redux-Saga', 'Vue 3', 'TypeScript', 'Node.js', 'PHP', 'Drupal', 'AEM', 'Adobe Analytics', 'SCSS', 'RESTful APIs', 'Docker'
      ]
    },
    {
      id: 'bootcamp',
      company: 'Etgar College',
      role: 'Web Development Bootcamp',
      location: 'Israel',
      period: '2020',
      icon: <GraduationCap size={14} />,
      bullets: [
        "Completed intensive web development training covering Full-Stack architectures.",
        "Built dynamic single page applications using modern JavaScript frameworks.",
        "Acquired deep fundamentals in relational schemas, state propagation, and web systems."
      ],
      skills: ['JavaScript', 'HTML5', 'CSS3', 'Sass', 'SQL', 'MongoDB']
    },
    {
      id: 'navy',
      company: 'IDF, Israeli Navy',
      role: 'Diving Gear Technician (Team Lead)',
      location: 'Israel',
      period: '2013 — 2019',
      icon: <Anchor size={14} />,
      bullets: [
        "Led a dedicated team of five specialists maintaining critical diving and life-support equipment.",
        "Engineered meticulous logging systems and protocols to eliminate operating failure in high-stakes environments.",
        "Managed inventory, conducted technical training, and delivered flawless equipment readiness."
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-2 mb-8">
        <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle font-bold block">
          Chronological Lifecycle
        </span>
        <h3 className="text-xl font-bold uppercase text-text tracking-tight">
          Professional Timestamp Timeline
        </h3>
      </div>
      
      <div className="relative">
        {experiences.map((exp) => (
          <TimelineCard
            key={exp.id}
            {...exp}
          />
        ))}
      </div>
    </div>
  );
};
