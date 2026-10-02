import React from 'react';
import { Lightbulb, AlertOctagon, Dna } from 'lucide-react';

interface ClinicalNuanceCardProps {
  clinicalContext: string;
  nuanceExplanation: string;
  scientificMechanism: string;
  potentialRisks: string[];
}

export const ClinicalNuanceCard: React.FC<ClinicalNuanceCardProps> = ({
  clinicalContext,
  nuanceExplanation,
  scientificMechanism,
  potentialRisks,
}) => {
  return (
    <div className="space-y-4">
      {/* Nuance & Context */}
      <div className="p-5 rounded-xl bg-white border border-ink-200/80 shadow-soft space-y-3 text-left">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900 font-mono">
            Scientific Nuance & Contextual Analysis
          </h4>
        </div>
        <p className="text-xs sm:text-sm text-ink-700 leading-relaxed font-sans">
          {nuanceExplanation}
        </p>
        <div className="pt-2 border-t border-ink-100">
          <p className="text-xs text-ink-600 leading-relaxed">
            <strong className="text-ink-800">Clinical Perspective:</strong> {clinicalContext}
          </p>
        </div>
      </div>

      {/* Biological Mechanism */}
      {scientificMechanism && (
        <div className="p-5 rounded-xl bg-white border border-ink-200/80 shadow-soft space-y-2 text-left">
          <div className="flex items-center gap-2">
            <Dna className="w-4 h-4 text-verity-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900 font-mono">
              Biochemical / Physiological Mechanism
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-ink-700 leading-relaxed font-sans font-mono bg-background-subtle p-3 rounded-lg border border-ink-100">
            {scientificMechanism}
          </p>
        </div>
      )}

      {/* Potential Clinical Risks */}
      {potentialRisks && potentialRisks.length > 0 && (
        <div className="p-5 rounded-xl bg-rose-50/40 border border-rose-200/70 shadow-soft space-y-3 text-left">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 font-mono">
              Reported Health Risks & Misinformation Hazards
            </h4>
          </div>
          <ul className="space-y-1.5">
            {potentialRisks.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-rose-900 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
