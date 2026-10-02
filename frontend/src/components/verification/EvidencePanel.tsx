import React from 'react';
import {
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  BookOpen,
  Calendar,
  Hash,
  Database,
} from 'lucide-react';

export interface EvidenceItemData {
  title: string;
  source_type: string;
  url: string;
  publication_date: string;
  pmid?: string | null;
  pmcid?: string | null;
  doi?: string | null;
  snippet: string;
  stance: 'SUPPORTING' | 'CONFLICTING' | 'NEUTRAL';
  relevance_score: number;
}

interface EvidencePanelProps {
  supporting: EvidenceItemData[];
  conflicting: EvidenceItemData[];
  neutral: EvidenceItemData[];
}

const stanceConfig = {
  SUPPORTING: {
    label: 'Supports Claim',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    borderColor: 'border-emerald-200/80',
    headerBg: 'bg-emerald-50/50',
    icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    dotColor: 'bg-emerald-500',
  },
  CONFLICTING: {
    label: 'Conflicts / Risk',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    borderColor: 'border-rose-200/80',
    headerBg: 'bg-rose-50/50',
    icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
    dotColor: 'bg-rose-500',
  },
  NEUTRAL: {
    label: 'Neutral / Background',
    badgeBg: 'bg-slate-50 text-slate-700 border-slate-200',
    borderColor: 'border-slate-200/80',
    headerBg: 'bg-slate-50/50',
    icon: <ShieldQuestion className="w-4 h-4 text-slate-500" />,
    dotColor: 'bg-slate-400',
  },
};

function cleanHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

const EvidenceCard: React.FC<{ item: EvidenceItemData }> = ({ item }) => {
  const cfg = stanceConfig[item.stance] || stanceConfig.NEUTRAL;

  return (
    <div
      className={`p-4 sm:p-5 rounded-xl bg-white border ${cfg.borderColor} shadow-soft hover:shadow-card transition-all space-y-3`}
    >
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div className="space-y-1.5 flex-1 min-w-0">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${cfg.badgeBg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor}`} />
              {cfg.label}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-ink-100 text-ink-700 border border-ink-200">
              <Database className="w-3 h-3 text-ink-400" />
              {item.source_type}
            </span>
          </div>
          {/* Title */}
          <h4 className="text-sm font-bold text-ink-900 leading-snug">
            {item.title}
          </h4>
        </div>
        {/* External link */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-verity-700 hover:text-verity-900 underline shrink-0 transition-colors mt-1 sm:mt-0"
        >
          <span>View Source</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Snippet */}
      {item.snippet && (
        <div className="text-xs text-ink-600 leading-relaxed font-sans bg-background-subtle p-3 rounded-lg border border-ink-100">
          <strong className="text-ink-800">Abstract: </strong>
          {cleanHtml(item.snippet)}
        </div>
      )}

      {/* Metadata footer */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-ink-500 pt-1 border-t border-ink-100">
        {item.publication_date && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {item.publication_date}
          </span>
        )}
        {item.pmid && (
          <span className="inline-flex items-center gap-1">
            <Hash className="w-3 h-3" />
            PMID: {item.pmid}
          </span>
        )}
        {item.pmcid && (
          <span className="inline-flex items-center gap-1">
            <Hash className="w-3 h-3" />
            {item.pmcid}
          </span>
        )}
        {item.doi && (
          <a
            href={`https://doi.org/${item.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-verity-700 hover:text-verity-900 underline"
          >
            DOI: {item.doi}
          </a>
        )}
        <span className="ml-auto">
          Relevance: {item.relevance_score.toFixed(1)}
        </span>
      </div>
    </div>
  );
};

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  supporting,
  conflicting,
  neutral,
}) => {
  const totalCount = supporting.length + conflicting.length + neutral.length;

  if (totalCount === 0) {
    return (
      <div className="p-6 bg-background-subtle rounded-xl border border-dashed border-ink-200 text-center text-xs text-ink-500">
        No relevant biomedical evidence was found for this query.
      </div>
    );
  }

  const sections = [
    { label: 'Supporting Evidence', items: supporting, stance: 'SUPPORTING' as const },
    { label: 'Conflicting Evidence', items: conflicting, stance: 'CONFLICTING' as const },
    { label: 'Neutral / Background Evidence', items: neutral, stance: 'NEUTRAL' as const },
  ].filter((s) => s.items.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-verity-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-900 font-mono">
            Real-Time Biomedical Evidence ({totalCount})
          </h3>
        </div>
        <span className="text-[11px] font-mono text-ink-500">
          PubMed • Europe PMC • OpenFDA
        </span>
      </div>

      {sections.map((section) => {
        const cfg = stanceConfig[section.stance];
        return (
          <div key={section.stance} className="space-y-3">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${cfg.headerBg} border ${cfg.borderColor}`}
            >
              {cfg.icon}
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-800 font-mono">
                {section.label} ({section.items.length})
              </h4>
            </div>
            <div className="space-y-3">
              {section.items.map((item, idx) => (
                <EvidenceCard key={`${section.stance}-${idx}`} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
