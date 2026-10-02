import React from 'react';
import { BMICalculationResult } from '../../types';
import { HeartPulse, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

interface BMIRecommendationCardProps {
  result: BMICalculationResult;
}

export const BMIRecommendationCard: React.FC<BMIRecommendationCardProps> = ({ result }) => {
  return (
    <div className="space-y-4">
      {/* Risk Level Banner */}
      <div className="p-4 rounded-xl bg-background-subtle border border-ink-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <HeartPulse className="w-5 h-5 text-verity-600" />
          <span className="text-xs font-mono uppercase tracking-wider text-ink-600">
            Cardiometabolic Risk Profile:
          </span>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-white border border-ink-200 text-ink-900 shadow-2xs">
          {result.healthRiskLevel} Relative Risk
        </span>
      </div>

      {/* Clinical Recommendations */}
      <div className="p-6 bg-white rounded-xl border border-ink-200/90 shadow-soft space-y-3 text-left">
        <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900 font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Evidence-Based Metabolic Guidelines
        </h4>
        <ul className="space-y-2.5">
          {result.clinicalRecommendations.map((rec, i) => (
            <li key={i} className="text-xs sm:text-sm text-ink-700 flex items-start gap-2 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Metabolic Insights */}
      <div className="p-5 bg-white rounded-xl border border-ink-200/90 shadow-soft space-y-2.5 text-left">
        <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900 font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          Physiological & Adiposity Considerations
        </h4>
        <ul className="space-y-2">
          {result.metabolicInsights.map((insight, i) => (
            <li key={i} className="text-xs text-ink-600 leading-relaxed">
              {insight}
            </li>
          ))}
        </ul>
      </div>

      {/* Literature References */}
      <div className="p-4 bg-background-subtle rounded-xl border border-ink-100 text-left space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400 font-bold flex items-center gap-1.5">
          <BookOpen className="w-3 h-3 text-ink-400" />
          Scientific Guidelines Reference
        </span>
        <ul className="space-y-1 text-[11px] text-ink-500 font-mono">
          {result.evidencePoints.map((pt, i) => (
            <li key={i}>• {pt}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
