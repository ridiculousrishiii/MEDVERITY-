import React, { useState } from 'react';
import { ShieldAlert, X, Info } from 'lucide-react';

interface DisclaimerBannerProps {
  floating?: boolean;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ floating = false }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (floating) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[92%] bg-ink-900/95 text-ink-200 border border-ink-700/80 px-4 py-3 rounded-xl shadow-elevated backdrop-blur-md flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-verity-400 shrink-0" />
          <span>
            <strong className="text-white font-semibold">Clinical Disclaimer:</strong> MEDVERITY AI is an evidence synthesis tool for scientific literacy. It does not provide medical diagnosis, treatment, or individualized triage.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-ink-400 hover:text-white p-1 rounded-md transition-colors"
          aria-label="Dismiss disclaimer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-ink-100/70 border-y border-ink-200/80 px-4 py-2.5 text-xs text-ink-600 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-ink-500 shrink-0" />
          <span>
            <strong>Medical Notice:</strong> Content generated via PubMed/Cochrane meta-analyses. Consult a board-certified physician for clinical guidance.
          </span>
        </div>
        <span className="font-mono text-[10px] text-ink-400 hidden sm:inline">
          PROTOCOL v4.2 • FDA/EFSA/WHO SYNTHESIS
        </span>
      </div>
    </div>
  );
};
