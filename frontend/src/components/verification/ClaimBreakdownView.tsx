import React from 'react';
import { ClaimSentenceBreakdown } from '../../types';
import { VerdictBadge } from '../common/Badge';
import { Split } from 'lucide-react';

interface ClaimBreakdownViewProps {
  breakdown: ClaimSentenceBreakdown[];
}

export const ClaimBreakdownView: React.FC<ClaimBreakdownViewProps> = ({ breakdown }) => {
  if (!breakdown || breakdown.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Split className="w-4 h-4 text-verity-600" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink-900 font-mono">
          Sentence-by-Sentence Claim Dissection
        </h3>
      </div>

      <div className="space-y-2.5">
        {breakdown.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white border border-ink-200/80 shadow-soft space-y-2 text-left"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-ink-500">
                SEGMENT 0{idx + 1}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-ink-500">
                  Confidence: {item.confidence}%
                </span>
                <VerdictBadge verdict={item.verdict} size="sm" />
              </div>
            </div>

            <p className="text-sm font-semibold text-ink-900 font-sans italic">
              "{item.sentence}"
            </p>

            <p className="text-xs text-ink-600 leading-relaxed font-sans pt-1 border-t border-ink-100">
              <strong className="text-ink-800 font-medium">Evaluation:</strong> {item.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
