import React from 'react';

interface MacroChartProps {
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  glycemicIndex: {
    score: number;
    category: 'Low' | 'Medium' | 'High';
  };
  healthScore: number;
}

export const NutritionMacroChart: React.FC<MacroChartProps> = ({
  calories,
  macros,
  glycemicIndex,
  healthScore,
}) => {
  const giColors = {
    Low: 'bg-emerald-500 text-emerald-50',
    Medium: 'bg-amber-500 text-amber-50',
    High: 'bg-rose-500 text-rose-50',
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-ink-200/80 shadow-soft space-y-6">
      {/* Top metrics summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-lg bg-background-subtle border border-ink-100 text-center">
          <span className="block text-2xl font-black font-mono text-ink-900">{calories}</span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-ink-500">Calories</span>
        </div>
        <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-center">
          <span className="block text-2xl font-black font-mono text-emerald-800">{healthScore}/100</span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700">Health Index</span>
        </div>
        <div className="p-3.5 rounded-lg bg-background-subtle border border-ink-100 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-2xl font-black font-mono text-ink-900">{glycemicIndex.score}</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${giColors[glycemicIndex.category]}`}>
              {glycemicIndex.category}
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-ink-500">Glycemic Index</span>
        </div>
      </div>

      {/* Macronutrient Bars */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-ink-800 font-mono">
          Macronutrient Profile
        </h4>

        {/* Protein */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-ink-700 font-medium">Protein</span>
            <span className="font-bold text-ink-900">{macros.protein}g</span>
          </div>
          <div className="w-full h-2 bg-ink-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${Math.min(100, (macros.protein / 50) * 100)}%` }}
              className="bg-blue-600 h-full rounded-full"
            />
          </div>
        </div>

        {/* Carbs */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-ink-700 font-medium">Total Carbs (Fiber: {macros.fiber}g, Sugar: {macros.sugar}g)</span>
            <span className="font-bold text-ink-900">{macros.carbs}g</span>
          </div>
          <div className="w-full h-2 bg-ink-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${Math.min(100, (macros.carbs / 80) * 100)}%` }}
              className="bg-amber-500 h-full rounded-full"
            />
          </div>
        </div>

        {/* Fat */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-ink-700 font-medium">Total Lipids (Fat)</span>
            <span className="font-bold text-ink-900">{macros.fat}g</span>
          </div>
          <div className="w-full h-2 bg-ink-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${Math.min(100, (macros.fat / 40) * 100)}%` }}
              className="bg-rose-500 h-full rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
