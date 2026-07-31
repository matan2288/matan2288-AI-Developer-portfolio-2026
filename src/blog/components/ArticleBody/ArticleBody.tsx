import React from 'react';
import { ArticleBodyProps } from './ArticleBody.types';

export const ArticleBody: React.FC<ArticleBodyProps> = ({ content }) => {
  return (
    <div className="prose prose-neutral max-w-none space-y-6 text-base text-text leading-relaxed">
      {content.map((paragraph, idx) => {
        if (paragraph.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-xl sm:text-2xl font-bold uppercase text-text pt-6 pb-2 border-b border-border font-sans">
              {paragraph.replace('### ', '')}
            </h3>
          );
        }
        if (paragraph.startsWith('```')) {
          const codeLines = paragraph.split('\n');
          const language = codeLines[0].replace('```', '');
          const codeContent = codeLines.slice(1, -1).join('\n');
          return (
            <div key={idx} className="my-6 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-100 p-4 font-mono text-xs overflow-x-auto shadow-sm">
              {language && (
                <div className="text-[10px] uppercase text-neutral-500 pb-2 mb-2 border-b border-neutral-800 font-mono">
                  {language}
                </div>
              )}
              <pre className="whitespace-pre-wrap leading-relaxed">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }
        return (
          <p key={idx} className="text-text/90 leading-relaxed font-sans">
            {paragraph}
          </p>
        );
      })}
    </div>
  );
};

export default ArticleBody;
