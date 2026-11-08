import React from 'react';

interface AboutContainerProps {
  title?: string;
  content?: string;
}

export const AboutContainer: React.FC<AboutContainerProps> = ({
  title = "Where Software Engineering Meets AI.",
  content = "I’m a AI-Driven Software Engineer with about ~5 years of experience building digital products, scalable applications, and user-focused experiences. My background spans frontend engineering, backend development, and enterprise digital platforms. Today, I’m expanding that foundation into AI engineering exploring LLMs, intelligent systems, and agent-based workflows to build smarter, more capable software."
}) => {
  return (
    <section id="about" className="py-16 md:py-24 bg-[#F9FAFB] border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Title Aside */}
          <div className="lg:col-span-5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text leading-tight">
              {title}
            </h2>
          </div>

          {/* Description with smaller, dimmed minimalist font */}
          <div className="lg:col-span-7">
            <p className="text-sm sm:text-base text-neutral-500 font-normal leading-relaxed tracking-normal">
              {content}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
