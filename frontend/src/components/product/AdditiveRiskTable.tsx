import React from 'react';
import { Badge } from '../common/Badge';
import { AlertOctagon, Check, AlertTriangle } from 'lucide-react';

interface IngredientDetail {
  name: string;
  eNumber?: string;
  category: string;
  riskLevel: 'safe' | 'caution' | 'high_risk';
  description: string;
  bannedInRegions?: string[];
  potentialHealthImpact: string;
}

interface AdditiveRiskTableProps {
  ingredients: IngredientDetail[];
}

export const AdditiveRiskTable: React.FC<AdditiveRiskTableProps> = ({ ingredients }) => {
  const riskBadges = {
    safe: (
      <Badge variant="verity" size="sm" dot>
        Safe / Low Concern
      </Badge>
    ),
    caution: (
      <Badge variant="amber" size="sm" dot>
        Moderate Caution
      </Badge>
    ),
    high_risk: (
      <Badge variant="crimson" size="sm" dot>
        High Risk / Banned
      </Badge>
    ),
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900 font-mono">
          Additive & Ingredient Breakdown ({ingredients.length})
        </h4>
        <span className="text-[11px] font-mono text-ink-500">EFSA / FDA Toxicology Index</span>
      </div>

      <div className="space-y-2.5">
        {ingredients.map((ing, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white border border-ink-200/90 shadow-soft space-y-2 text-left"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-ink-900 font-sans">{ing.name}</span>
                {ing.eNumber && (
                  <span className="text-xs font-mono bg-ink-100 text-ink-700 px-2 py-0.5 rounded font-semibold">
                    {ing.eNumber}
                  </span>
                )}
                <span className="text-[11px] font-mono text-ink-500">({ing.category})</span>
              </div>
              {riskBadges[ing.riskLevel]}
            </div>

            <p className="text-xs text-ink-600 font-sans leading-relaxed">{ing.description}</p>

            <div className="text-xs bg-background-subtle p-2.5 rounded-lg border border-ink-100 space-y-1">
              <p className="text-ink-700">
                <strong className="text-ink-900">Health Impact:</strong> {ing.potentialHealthImpact}
              </p>
              {ing.bannedInRegions && ing.bannedInRegions.length > 0 && (
                <div className="text-rose-700 flex items-center gap-1.5 font-semibold pt-0.5 text-[11px]">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Restrictions: {ing.bannedInRegions.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
