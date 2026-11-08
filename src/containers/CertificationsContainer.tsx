import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  ArrowLeft,
  ArrowUpRight,
  X,
  Maximize2,
  Lock
} from 'lucide-react';
import { CertificationItem } from '../features/dashboard/types';

interface CertificationsContainerProps {
  certifications: CertificationItem[];
  onBackToPortfolio: () => void;
  developerName: string;
}

export const CertificationsContainer: React.FC<CertificationsContainerProps> = ({
  certifications,
  onBackToPortfolio,
}) => {
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Convert Google Drive view or open URL to view-only preview URL for embed, or return static PDF url
  const getPreviewUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('/certifications/')) {
      return url;
    }
    if (url.includes('/preview')) return url;
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }
    return url;
  };

  // Helper to extract clean category label (e.g. AI, Security, Full Stack)
  const getCategoryLabel = (cert: CertificationItem) => {
    if (cert.category) return cert.category;
    if (cert.topic) {
      const topicLower = cert.topic.toLowerCase();
      if (topicLower.includes('genai') || topicLower.includes('ai')) return 'AI';
      if (topicLower.includes('security')) return 'Security';
      if (topicLower.includes('web') || topicLower.includes('full-stack')) return 'Full Stack';
      return cert.topic;
    }
    const titleLower = cert.title.toLowerCase();
    if (titleLower.includes('cursor') || titleLower.includes('genai') || titleLower.includes('ai')) return 'AI';
    if (titleLower.includes('security') || titleLower.includes('secure')) return 'Security';
    if (titleLower.includes('web') || titleLower.includes('bootcamp') || titleLower.includes('full-stack')) return 'Full Stack';
    return 'Engineering';
  };

  return (
    <div className="min-h-screen bg-white text-text font-sans antialiased pt-28 sm:pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Minimalist Header */}
          <div className="mb-12 sm:mb-16">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-text leading-tight font-heading">
                  Certifications
                </h1>
                  <p className="text-xs sm:text-sm text-text-muted font-normal mt-2">
                    Official credentials & verified engineering documentation
                  </p>
                    <p className="text-[10px] sm:text-[11px] text-text-muted/65 font-normal mt-2 tracking-wider select-none">
                      {certifications.length} {certifications.length === 1 ? 'certification' : 'certifications'}
                    </p>
                  </div>
                </div>

                {/* Full-width Certification Rows with Dividers */}
                <div className="divide-y divide-border/60 border-t border-b border-border/60">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      onClick={() => setSelectedCert(cert)}
                      className="group py-3.5 sm:py-4 px-1 sm:px-2 flex items-center justify-between gap-6 sm:gap-10 hover:bg-neutral-50/60 transition-colors cursor-pointer w-full"
                    >
                      {/* Category Label on the Left (Screenshot style) */}
                      <div className="w-20 sm:w-28 shrink-0 font-mono text-[11px] sm:text-xs text-neutral-400 font-normal tracking-wider select-none">
                        {getCategoryLabel(cert)}
                      </div>

                      {/* Certification Title & Issuer */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-text group-hover:text-neutral-600 transition-colors truncate">
                          {cert.title}
                        </h3>
                        <div className="text-xs text-text-muted mt-0.5 flex items-center gap-2">
                          <span>{cert.issuer}</span>
                          {cert.issueDate && (
                            <>
                              <span className="text-neutral-300">•</span>
                              <span>{cert.issueDate}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* View PDF Action Indicator */}
                      <div className="shrink-0 flex items-center gap-1.5 text-xs text-text-muted group-hover:text-text transition-colors font-medium">
                        <span className="hidden sm:inline">View PDF</span>
                        <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Back Navigation */}
                <div className="mt-12 sm:mt-16 flex items-center justify-start">
                  <button
                    type="button"
                    onClick={onBackToPortfolio}
                    className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-text transition-colors cursor-pointer group bg-transparent border-0 p-0 select-none"
                  >
                    <ArrowLeft size={13} className="text-neutral-400 group-hover:text-text group-hover:-translate-x-0.5 transition-all" />
                    <span className="font-normal tracking-wide">Back to Portfolio</span>
                  </button>
                </div>

            </div>

            {/* Show Google Drive & Local PDF Modal Viewer */}
            {selectedCert && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
                <div
                  className={`bg-white rounded-xl border border-border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isFullscreen
                      ? 'w-full h-full max-w-none max-h-none rounded-none'
                      : 'w-full max-w-4xl h-[85vh]'
                    }`}
                >
                  {/* Modal Header */}
                  <div className="px-4 sm:px-5 py-3 bg-neutral-50 border-b border-border flex items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText size={16} className="text-text shrink-0" />
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-semibold text-text truncate">
                          {selectedCert.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-text-muted">
                          <span>{selectedCert.issuer}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                            <Lock size={10} /> Verified PDF
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={getPreviewUrl(selectedCert.driveUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-border/80 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-xs text-text transition-all inline-flex items-center gap-1 shadow-2xs font-medium"
                        title="Open document in new tab"
                      >
                        <ExternalLink size={13} className="text-text-muted" />
                        <span className="hidden sm:inline">Open PDF</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-1.5 rounded-lg border border-border/80 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-text-muted hover:text-text transition-all cursor-pointer hidden sm:block shadow-2xs"
                        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                      >
                        <Maximize2 size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCert(null);
                          setIsFullscreen(false);
                        }}
                        className="p-1.5 rounded-lg border border-border/80 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-text-muted hover:text-text transition-all cursor-pointer shadow-2xs"
                        title="Close Preview"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Embedded PDF Viewer */}
                  <div className="flex-1 bg-neutral-100 relative overflow-hidden flex flex-col">
                    <iframe
                      src={getPreviewUrl(selectedCert.driveUrl)}
                      title={`${selectedCert.title} - PDF Document`}
                      className="w-full h-full border-0 bg-white"
                      allow="autoplay"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          );
};


