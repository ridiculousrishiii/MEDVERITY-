import React from 'react';
import { BMICalculationResult } from '../../types';

interface BMIArcGaugeProps {
  result: BMICalculationResult;
}

export const BMIArcGauge: React.FC<BMIArcGaugeProps> = ({ result }) => {
  // Normalize BMI between 15 and 40 for visual percentage positioning
  const clampedBmi = Math.max(15, Math.min(40, result.bmi));
  const percentage = ((clampedBmi - 15) / (40 - 15)) * 100;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-ink-200/90 shadow-card text-center space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-mono uppercase tracking-widest text-ink-500">
          Calculated Body Mass Index
        </span>
        <div className="text-5xl sm:text-6xl font-black font-mono text-ink-900 tracking-tight">
          {result.bmi}
        </div>
        <div
          style={{ color: result.color }}
          className="text-lg font-bold font-sans tracking-tight"
        >
          {result.category}
        </div>
      </div>

      {/* Visual Spectrum Slider */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="relative w-full h-3.5 rounded-full overflow-hidden flex bg-ink-100 shadow-inner">
          {/* Underweight */}
          <div className="w-[14%] bg-blue-400 h-full" title="Underweight (<18.5)" />
          {/* Normal */}
          <div className="w-[26%] bg-emerald-500 h-full" title="Normal (18.5-24.9)" />
          {/* Overweight */}
          <div className="w-[20%] bg-amber-400 h-full" title="Overweight (25-29.9)" />
          {/* Obese */}
          <div className="w-[40%] bg-rose-500 h-full" title="Obese (≥30)" />
        </div>

        {/* Indicator marker */}
        <div className="relative w-full h-4">
          <div
            style={{ left: `${percentage}%` }}
            className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
          >
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-ink-900" />
            <span className="text-[10px] font-mono font-bold text-ink-900">YOU</span>
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between text-[10px] font-mono text-ink-500 pt-1">
          <span>15.0</span>
          <span className="text-emerald-700 font-bold">18.5 Normal</span>
          <span className="text-amber-700 font-bold">25.0</span>
          <span className="text-rose-700 font-bold">30.0</span>
          <span>40.0+</span>
        </div>
      </div>

      {/* Ideal Range & BMR Summary */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-ink-100 max-w-md mx-auto font-mono text-left">
        <div className="p-3 bg-background-subtle rounded-xl border border-ink-100">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block">Healthy Weight Range</span>
          <span className="text-sm font-bold text-ink-900">
            {result.healthyWeightRange.minKg} – {result.healthyWeightRange.maxKg} kg
          </span>
          <span className="text-[10px] text-ink-400 block">({result.healthyWeightRange.minLbs} – {result.healthyWeightRange.maxLbs} lbs)</span>
        </div>

        <div className="p-3 bg-background-subtle rounded-xl border border-ink-100">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block">Est. Daily Energy (TDEE)</span>
          <span className="text-sm font-bold text-ink-900">{result.tdeeEstimatedCalories} kcal/day</span>
          <span className="text-[10px] text-ink-400 block">BMR: {result.bmrEstimatedCalories} kcal</span>
        </div>
      </div>
    </div>
  );
};
