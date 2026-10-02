import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { NutritionMacroChart } from '../components/nutrition/NutritionMacroChart';
import { HealthImpactCard } from '../components/nutrition/HealthImpactCard';
import { VerdictBadge } from '../components/common/Badge';
import { CitationList } from '../components/verification/CitationList';
import { nutritionService } from '../services/nutritionService';
import { NutritionAnalysisResult } from '../types';
import { useToast } from '../context/ToastContext';
import { Apple, Sparkles, Scale, HeartHandshake } from 'lucide-react';

export const NutritionPage: React.FC = () => {
  const { addToast } = useToast();
  const [foodQuery, setFoodQuery] = useState('Apple Cider Vinegar');
  const [portionSize, setPortionSize] = useState('1 Tablespoon (15ml) diluted');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NutritionAnalysisResult | null>(null);

  const handleAnalyze = async (queryToUse?: string) => {
    const q = queryToUse || foodQuery;
    if (!q.trim()) {
      addToast({
        type: 'warning',
        title: 'Input Required',
        message: 'Please enter a food, superfood, or dietary recipe.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await nutritionService.analyzeFood({
        queryOrRecipe: q,
        servingSize: portionSize,
      });
      setResult(res);
      addToast({
        type: 'success',
        title: 'Nutritional Analysis Complete',
        message: `Parsed macronutrients, glycemic load, and evidence claims for ${res.itemName}`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      addToast({
        type: 'error',
        title: 'Analysis Error',
        message: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sampleFoods = [
    { name: 'Apple Cider Vinegar', portion: '1 Tbsp diluted' },
    { name: 'Organic Chia Seed Pudding', portion: '150g bowl' },
    { name: 'Matcha Green Tea', portion: '1 cup (2g powder)' },
    { name: 'Cold-Pressed Extra Virgin Olive Oil', portion: '15ml' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        badgeText="NUTRITION & METABOLISM"
        badgeVariant="verity"
        title="Food & Dietary Claim Intelligence"
        description="Analyze macro/micronutrients, glycemic indices, superfood claims, and potential allergen irritants with clinical evidence."
      />

      {/* Input formulation */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-ink-200/90 shadow-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Food Item, Superfood, or Recipe Name"
              placeholder="e.g. Raw Apple Cider Vinegar, Golden Turmeric Latte, Grass-fed Ghee..."
              value={foodQuery}
              onChange={(e) => setFoodQuery(e.target.value)}
              leftIcon={<Apple className="w-4 h-4" />}
            />
          </div>
          <div>
            <Input
              label="Serving / Portion Size"
              placeholder="e.g. 1 Tablespoon, 100g, 1 Cup"
              value={portionSize}
              onChange={(e) => setPortionSize(e.target.value)}
              leftIcon={<Scale className="w-4 h-4" />}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-ink-400">Quick Samples:</span>
            {sampleFoods.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setFoodQuery(s.name);
                  setPortionSize(s.portion);
                  handleAnalyze(s.name);
                }}
                className="text-xs text-ink-700 bg-background-subtle border border-ink-200 hover:border-verity-400 hover:text-verity-900 px-2.5 py-1 rounded-md transition-colors"
              >
                {s.name}
              </button>
            ))}
          </div>

          <Button
            variant="verity"
            size="md"
            isLoading={isLoading}
            onClick={() => handleAnalyze()}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Analyze Nutrition
          </Button>
        </div>
      </div>

      {/* Results View */}
      {result && !isLoading && (
        <div className="space-y-8 animate-fade-in">
          {/* Header Title */}
          <div className="bg-white p-6 rounded-2xl border border-ink-200/90 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-500">
                PORTION: {result.portionSize}
              </span>
              <h2 className="text-2xl font-black text-ink-900 mt-0.5">{result.itemName}</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                Nutritional Integrity Score: {result.healthScore}/100
              </span>
            </div>
          </div>

          {/* 12-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 cols: Macros, Dietary Claims */}
            <div className="lg:col-span-7 space-y-6">
              <NutritionMacroChart
                calories={result.calories}
                macros={result.macros}
                glycemicIndex={result.glycemicIndex}
                healthScore={result.healthScore}
              />

              {/* Dietary Claims Breakdown */}
              <div className="bg-white p-6 rounded-xl border border-ink-200/80 shadow-soft space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900 font-mono flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-verity-600" />
                  Popular Dietary Claims Evaluated
                </h4>

                <div className="space-y-3">
                  {result.dietaryClaims.map((claim, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-background-subtle border border-ink-100 space-y-2 text-left"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs font-bold text-ink-900 font-sans">
                          "{claim.claim}"
                        </span>
                        <VerdictBadge verdict={claim.verdict} size="sm" />
                      </div>
                      <p className="text-xs text-ink-600 font-sans leading-relaxed">
                        <strong className="text-ink-800">Literature Evidence:</strong> {claim.evidence}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Citations if any */}
              {result.evidenceCitations && result.evidenceCitations.length > 0 && (
                <CitationList citations={result.evidenceCitations} />
              )}
            </div>

            {/* Right 5 cols: Health Impact, Allergens, Compatibility */}
            <div className="lg:col-span-5 space-y-6">
              <HealthImpactCard
                compatibility={result.dietCompatibility}
                cautions={result.cautionsAndAllergens}
                benefits={result.keyBenefits}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
