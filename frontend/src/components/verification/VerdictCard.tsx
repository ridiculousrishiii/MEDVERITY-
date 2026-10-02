import React from 'react';
import { VerdictType } from '../../types';
import { VerdictBadge } from '../common/Badge';
import { ShieldCheck, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

interface VerdictCardProps {
  verdict: VerdictType;
  verdictTitle: string;
  confidenceScore: number;
  executiveSummary: string;
  verifiedByAiModel: string;
  timestamp: string;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({
  verdict,
  verdictTitle,
  confidenceScore,
  executiveSummary,
  verifiedByAiModel,
  timestamp,
}) => {
  const configs = {
    confirmed_true: {
      bg: 'bg-emerald-50/70 border-emerald-300',
      iconBg: 'bg-emerald-100 text-emerald-700',
      icon: <ShieldCheck className="w-8 h-8" />,
      accentColor: 'text-emerald-900',
    },
    false_debunked: {
      bg: 'bg-rose-50/70 border-rose-300',
      iconBg: 'bg-rose-100 text-rose-700',
      icon: <XCircle className="w-8 h-8" />,
      accentColor: 'text-rose-900',
    },
    misleading_nuanced: {
      bg: 'bg-amber-50/70 border-amber-300',
      iconBg: 'bg-amber-100 text-amber-700',
      icon: <AlertTriangle className="w-8 h-8" />,
      accentColor: 'text-amber-900',
    },
    unproven_inconclusive: {
      bg: 'bg-slate-50/70 border-slate-300',
      iconBg: 'bg-slate-100 text-slate-700',
      icon: <HelpCircle className="w-8 h-8" />,
      accentColor: 'text-slate-900',
    },
  };

  const cfg = configs[verdict] || configs.unproven_inconclusive;

  return (
    <div className={`p-6 sm:p-8 rounded-2xl border ${cfg.bg} shadow-card transition-all`}>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl shrink-0 ${cfg.iconBg} shadow-sm`}>
            {cfg.icon}
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <VerdictBadge verdict={verdict} size="md" />
              <span className="font-mono text-xs text-ink-500">
                Confidence: <strong className="text-ink-800">{confidenceScore}%</strong>
              </span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${cfg.accentColor}`}>
              {verdictTitle}
            </h2>
          </div>
        </div>

        {/* Confidence pill */}
        <div className="hidden md:flex flex-col items-end shrink-0 text-right">
          <div className="text-3xl font-black font-mono text-ink-900 leading-none">
            {confidenceScore}%
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-ink-500 mt-1">
            Evidence Weight
          </span>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mt-6 pt-5 border-t border-ink-200/60">
        <h4 className="text-xs font-bold uppercase tracking-wider text-ink-700 font-mono mb-2">
          Clinical Executive Summary
        </h4>
        <p className="text-sm sm:text-base text-ink-800 leading-relaxed font-sans">
          {executiveSummary}
        </p>
      </div>

      {/* Metadata footer */}
      <div className="mt-5 pt-3 border-t border-ink-200/40 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-ink-500">
        <span>Verified by: {verifiedByAiModel}</span>
        <span>Indexed: {new Date(timestamp).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
      </div>
    </div>
  );
};
