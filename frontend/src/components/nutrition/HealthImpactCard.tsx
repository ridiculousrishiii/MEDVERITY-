import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

interface AllergenItem {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
}

interface CompatibilityProps {
  compatibility: {
    keto: boolean;
    diabeticFriendly: boolean;
    heartHealthy: boolean;
    lowFodmap: boolean;
    vegan: boolean;
    glutenFree: boolean;
  };
  cautions: AllergenItem[];
  benefits: string[];
}

export const HealthImpactCard: React.FC<CompatibilityProps> = ({
  compatibility,
  cautions,
  benefits,
}) => {
  return (
    <div className="space-y-4">
      {/* Dietary Compatibility */}
      <div className="p-5 rounded-xl bg-white border border-ink-200/80 shadow-soft space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-verity-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900 font-mono">
            Dietary Regimen Compatibility
          </h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {compatibility.diabeticFriendly && <Badge variant="verity" size="sm">Diabetic-Friendly</Badge>}
          {compatibility.heartHealthy && <Badge variant="verity" size="sm">Cardioprotective</Badge>}
          {compatibility.keto && <Badge variant="sapphire" size="sm">Keto-Compliant</Badge>}
          {compatibility.glutenFree && <Badge variant="default" size="sm">Gluten-Free</Badge>}
          {compatibility.vegan && <Badge variant="default" size="sm">Plant-Based (Vegan)</Badge>}
          {compatibility.lowFodmap && <Badge variant="amber" size="sm">Low-FODMAP</Badge>}
        </div>
      </div>

      {/* Key Benefits */}
      <div className="p-5 rounded-xl bg-white border border-ink-200/80 shadow-soft space-y-2.5 text-left">
        <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900 font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Evidence-Supported Health Benefits
        </h4>
        <ul className="space-y-2">
          {benefits.map((b, i) => (
            <li key={i} className="text-xs text-ink-700 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cautions & Allergens */}
      {cautions.length > 0 && (
        <div className="p-5 rounded-xl bg-amber-50/40 border border-amber-200/70 shadow-soft space-y-2.5 text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Cautions & Known Irritants
          </h4>
          <div className="space-y-2">
            {cautions.map((c, i) => (
              <div key={i} className="text-xs text-amber-900">
                <strong className="font-semibold">{c.name}:</strong> {c.description}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
