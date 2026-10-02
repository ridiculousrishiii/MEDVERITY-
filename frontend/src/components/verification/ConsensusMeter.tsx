import React from 'react';

interface ConsensusMeterProps {
  supports: number;
  refutes: number;
  inconclusive: number;
}

export const ConsensusMeter: React.FC<ConsensusMeterProps> = ({
  supports,
  refutes,
  inconclusive,
}) => {
  return (
    <div className="space-y-3 bg-white p-5 rounded-xl border border-ink-200/80 shadow-soft">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-ink-800 font-mono">
          Scientific Literature Consensus
        </h4>
        <span className="text-[11px] font-mono text-ink-500">Peer-Reviewed Cohort</span>
      </div>

      {/* Multi-segment progress bar */}
      <div className="w-full h-3 bg-ink-100 rounded-full overflow-hidden flex shadow-inner">
        <div
          style={{ width: `${supports}%` }}
          className="bg-emerald-500 h-full transition-all duration-500"
          title={`Supports Claim: ${supports}%`}
        />
        <div
          style={{ width: `${refutes}%` }}
          className="bg-rose-500 h-full transition-all duration-500"
          title={`Refutes / Contradicts: ${refutes}%`}
        />
        <div
          style={{ width: `${inconclusive}%` }}
          className="bg-slate-400 h-full transition-all duration-500"
          title={`Inconclusive / Mixed: ${inconclusive}%`}
        />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
          <span className="block text-xs font-bold text-emerald-800">{supports}%</span>
          <span className="text-[10px] text-emerald-700">Supports</span>
        </div>
        <div className="p-2 rounded-lg bg-rose-50 border border-rose-100">
          <span className="block text-xs font-bold text-rose-800">{refutes}%</span>
          <span className="text-[10px] text-rose-700">Refutes</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
          <span className="block text-xs font-bold text-slate-800">{inconclusive}%</span>
          <span className="text-[10px] text-slate-600">Inconclusive</span>
        </div>
      </div>
    </div>
  );
};
