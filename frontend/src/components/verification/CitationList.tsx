import React from 'react';
import { Citation } from '../../types';
import { ExternalLink, BookOpen, Award, FileText } from 'lucide-react';
import { Badge } from '../common/Badge';

interface CitationListProps {
  citations: Citation[];
}

export const CitationList: React.FC<CitationListProps> = ({ citations }) => {
  if (!citations || citations.length === 0) {
    return (
      <div className="p-6 bg-background-subtle rounded-xl border border-dashed border-ink-200 text-center text-xs text-ink-500">
        No direct PubMed indexed citations required for this baseline physiological premise.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-verity-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-900 font-mono">
            Biomedical Citations & Clinical Evidence ({citations.length})
          </h3>
        </div>
        <span className="text-[11px] font-mono text-ink-500">Peer-Reviewed Sources</span>
      </div>

      <div className="space-y-3">
        {citations.map((cit) => {
          const sentimentBadges = {
            supports: <Badge variant="verity" size="sm">Evidence Supports Claim</Badge>,
            refutes: <Badge variant="crimson" size="sm">Evidence Refutes Claim</Badge>,
            neutral: <Badge variant="slate" size="sm">Equivocal / Background</Badge>,
          };

          return (
            <div
              key={cit.id}
              className="p-5 rounded-xl bg-white border border-ink-200/90 shadow-soft hover:border-ink-300 transition-all space-y-3 text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-ink-100 text-ink-800">
                      <FileText className="w-3 h-3 text-ink-500" />
                      {cit.studyType}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <Award className="w-3 h-3 text-emerald-600" />
                      GRADE: {cit.evidenceGrade}
                    </span>
                    {sentimentBadges[cit.sentiment]}
                  </div>
                  <h4 className="text-sm font-bold text-ink-900 leading-snug pt-1">
                    {cit.title}
                  </h4>
                </div>

                <a
                  href={cit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-verity-700 hover:text-verity-900 underline shrink-0 transition-colors"
                >
                  <span>PubMed / DOI</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <p className="text-xs text-ink-600 leading-relaxed font-sans bg-background-subtle p-3 rounded-lg border border-ink-100">
                <strong className="text-ink-800">Study Finding:</strong> {cit.summary}
              </p>

              <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-ink-500 gap-2 pt-1 border-t border-ink-100">
                <span>Authors: {cit.authors}</span>
                <span>
                  {cit.journal} ({cit.year}) {cit.pmid ? `• PMID: ${cit.pmid}` : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
