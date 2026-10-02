import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { BMIArcGauge } from '../components/bmi/BMIArcGauge';
import { BMIRecommendationCard } from '../components/bmi/BMIRecommendationCard';
import { bmiService, BMICalculationParams } from '../services/bmiService';
import { RefreshCw } from 'lucide-react';

export const BMICalculatorPage: React.FC = () => {
  const [system, setSystem] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);
  const [weightLbs, setWeightLbs] = useState(160);
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [activityLevel, setActivityLevel] = useState<BMICalculationParams['activityLevel']>('moderate');

  const result = useMemo(() => {
    return bmiService.calculate({
      system,
      heightCm,
      weightKg,
      heightFt,
      heightIn,
      weightLbs,
      age,
      gender,
      activityLevel,
    });
  }, [system, heightCm, weightKg, heightFt, heightIn, weightLbs, age, gender, activityLevel]);

  const resetDefaults = () => {
    setHeightCm(175);
    setWeightKg(72);
    setHeightFt(5);
    setHeightIn(9);
    setWeightLbs(160);
    setAge(30);
    setGender('male');
    setActivityLevel('moderate');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        badgeText="METABOLIC BIOMARKERS"
        badgeVariant="verity"
        title="Clinical BMI & Metabolic Health Calculator"
        description="Calculate body mass index, basal metabolic rate (Mifflin-St Jeor), ideal body weight bounds, and evidence-supported cardiometabolic guidelines."
        actions={
          <button
            onClick={resetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ink-200 text-xs font-semibold text-ink-600 hover:bg-ink-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        }
      />

      {/* 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 cols): Controls & Sliders */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-ink-200/90 shadow-card space-y-6 text-left">
            {/* Unit Toggle */}
            <div className="flex items-center justify-between border-b border-ink-100 pb-4">
              <span className="text-xs font-mono uppercase font-bold text-ink-700">Measurement System:</span>
              <div className="flex rounded-lg border border-ink-200 p-0.5 bg-background-subtle">
                <button
                  onClick={() => setSystem('metric')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    system === 'metric' ? 'bg-ink-900 text-white shadow-2xs' : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  Metric (cm / kg)
                </button>
                <button
                  onClick={() => setSystem('imperial')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    system === 'imperial' ? 'bg-ink-900 text-white shadow-2xs' : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  Imperial (ft / lbs)
                </button>
              </div>
            </div>

            {/* Height Input */}
            {system === 'metric' ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-ink-800">Height:</span>
                  <span className="text-emerald-700 font-bold">{heightCm} cm</span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="230"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-verity-600 cursor-pointer"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink-700">Feet (ft)</label>
                  <input
                    type="number"
                    min="3"
                    max="7"
                    value={heightFt}
                    onChange={(e) => setHeightFt(Number(e.target.value))}
                    className="w-full bg-white border border-ink-200 rounded-lg p-2 text-sm text-ink-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink-700">Inches (in)</label>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={heightIn}
                    onChange={(e) => setHeightIn(Number(e.target.value))}
                    className="w-full bg-white border border-ink-200 rounded-lg p-2 text-sm text-ink-900"
                  />
                </div>
              </div>
            )}

            {/* Weight Input */}
            {system === 'metric' ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-ink-800">Body Weight:</span>
                  <span className="text-emerald-700 font-bold">{weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="200"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-verity-600 cursor-pointer"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-ink-800">Body Weight:</span>
                  <span className="text-emerald-700 font-bold">{weightLbs} lbs</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="440"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full accent-verity-600 cursor-pointer"
                />
              </div>
            )}

            {/* Age & Biological Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-ink-700 font-mono">Age (Years)</label>
                <input
                  type="number"
                  min="14"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-white border border-ink-200 rounded-lg p-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-verity-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-ink-700 font-mono">Biological Sex</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                  className="w-full bg-white border border-ink-200 rounded-lg p-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-verity-500/20"
                >
                  <option value="male">Male (XY)</option>
                  <option value="female">Female (XX)</option>
                </select>
              </div>
            </div>

            {/* Physical Activity Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-ink-700 font-mono">Weekly Physical Activity</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as BMICalculationParams['activityLevel'])}
                className="w-full bg-white border border-ink-200 rounded-lg p-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-verity-500/20"
              >
                <option value="sedentary">Sedentary (Little or no exercise)</option>
                <option value="light">Light Activity (1-3 days/week)</option>
                <option value="moderate">Moderate Exercise (3-5 days/week)</option>
                <option value="very_active">Very Active (6-7 days/week)</option>
                <option value="extra_active">Extra Active / Athlete (2x training/day)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Gauge & Personalized Metabolic Guidelines */}
        <div className="lg:col-span-7 space-y-6">
          <BMIArcGauge result={result} />
          <BMIRecommendationCard result={result} />
        </div>
      </div>
    </div>
  );
};
