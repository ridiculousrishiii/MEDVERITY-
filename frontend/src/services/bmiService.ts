import { BMICalculationResult } from '../types';

export interface BMICalculationParams {
  system: 'metric' | 'imperial';
  heightCm?: number;
  weightKg?: number;
  heightFt?: number;
  heightIn?: number;
  weightLbs?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
}

export const bmiService = {
  calculate(params: BMICalculationParams): BMICalculationResult {
    let weightInKg = 0;
    let heightInMeters = 0;

    if (params.system === 'metric') {
      weightInKg = params.weightKg || 70;
      heightInMeters = (params.heightCm || 175) / 100;
    } else {
      const totalInches = (params.heightFt || 5) * 12 + (params.heightIn || 9);
      heightInMeters = (totalInches * 2.54) / 100;
      weightInKg = (params.weightLbs || 154) * 0.45359237;
    }

    if (heightInMeters <= 0) heightInMeters = 1.75;
    if (weightInKg <= 0) weightInKg = 70;

    const rawBmi = weightInKg / (heightInMeters * heightInMeters);
    const bmi = Math.round(rawBmi * 10) / 10;

    let category: BMICalculationResult['category'] = 'Normal Weight';
    let color = '#10B981'; // emerald
    let healthRiskLevel: BMICalculationResult['healthRiskLevel'] = 'Low';

    if (bmi < 16.0) {
      category = 'Severe Underweight';
      color = '#EF4444';
      healthRiskLevel = 'High';
    } else if (bmi < 18.5) {
      category = 'Underweight';
      color = '#F59E0B';
      healthRiskLevel = 'Moderate';
    } else if (bmi < 25.0) {
      category = 'Normal Weight';
      color = '#10B981';
      healthRiskLevel = 'Low';
    } else if (bmi < 30.0) {
      category = 'Overweight';
      color = '#F59E0B';
      healthRiskLevel = 'Increased';
    } else if (bmi < 35.0) {
      category = 'Obese Class I';
      color = '#F97316';
      healthRiskLevel = 'Moderate';
    } else if (bmi < 40.0) {
      category = 'Obese Class II';
      color = '#EA580C';
      healthRiskLevel = 'High';
    } else {
      category = 'Obese Class III';
      color = '#DC2626';
      healthRiskLevel = 'Extremely High';
    }

    // Ideal body weight range (BMI 18.5 - 24.9)
    const minIdealKg = Math.round(18.5 * (heightInMeters * heightInMeters) * 10) / 10;
    const maxIdealKg = Math.round(24.9 * (heightInMeters * heightInMeters) * 10) / 10;

    // BMR estimation using Mifflin-St Jeor equation
    const age = params.age || 30;
    const gender = params.gender || 'male';
    const heightInCm = heightInMeters * 100;

    let bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else if (gender === 'female') {
      bmr -= 161;
    } else {
      bmr -= 78;
    }
    const bmrEstimatedCalories = Math.round(bmr);

    // Multiplier for TDEE
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very_active: 1.725,
      extra_active: 1.9,
    };
    const act = params.activityLevel || 'moderate';
    const tdeeEstimatedCalories = Math.round(bmrEstimatedCalories * activityMultipliers[act]);

    const clinicalRecommendations: string[] = [];
    const metabolicInsights: string[] = [];

    if (bmi < 18.5) {
      clinicalRecommendations.push('Prioritize nutrient-dense complex carbohydrates and healthy unsaturated fats (avocados, nuts, extra virgin olive oil).');
      clinicalRecommendations.push('Incorporate progressive resistance training 3x/week to encourage lean skeletal muscle hypertrophy.');
      clinicalRecommendations.push('Screen for micronutrient deficiencies (Ferritin, Vitamin D3, B12, and Zinc).');
      metabolicInsights.push('Low BMI in adults may correlate with reduced bone mineral density and altered immune cell function.');
    } else if (bmi >= 18.5 && bmi < 25.0) {
      clinicalRecommendations.push('Maintain cardiovascular aerobic conditioning (150 min moderate-intensity or 75 min vigorous weekly as per AHA/WHO guidelines).');
      clinicalRecommendations.push('Adopt an anti-inflammatory dietary pattern (rich in polyphenols, dietary fiber ≥ 30g/day, and omega-3 fatty acids).');
      clinicalRecommendations.push('Ensure optimal sleep hygiene (7–9 hours nightly) to preserve endocrine metabolic equilibrium.');
      metabolicInsights.push('Normal BMI range is associated with the lowest all-cause cardiovascular and metabolic mortality across longitudinal studies.');
    } else if (bmi >= 25.0 && bmi < 30.0) {
      clinicalRecommendations.push('Implement a modest caloric moderation (-300 to -500 kcal/day) focusing on high-protein satiety (>1.4g/kg target).');
      clinicalRecommendations.push('Incorporate High-Intensity Interval Training (HIIT) alongside resistance exercise to improve insulin sensitivity.');
      clinicalRecommendations.push('Monitor fasting blood glucose, HbA1c, and ApoB lipid fractions during routine annual wellness checks.');
      metabolicInsights.push('Body composition context is key: athletic individuals with high muscularity may register elevated BMI without visceral adiposity risk.');
    } else {
      clinicalRecommendations.push('Consult a licensed clinical dietitian or physician for a comprehensive metabolic evaluation.');
      clinicalRecommendations.push('Prioritize non-scale victories: blood pressure reduction, visceral fat loss, and mobility improvements.');
      clinicalRecommendations.push('Screen for obstructive sleep apnea (OSA) and fatty liver (MASLD) biomarkers if indicated.');
      metabolicInsights.push('Visceral adipose tissue produces pro-inflammatory adipokines (IL-6, TNF-alpha); gradual 5–10% body weight reduction yields profound systemic cardiovascular benefits.');
    }

    const evidencePoints = [
      'WHO Technical Report Series 894: Obesity and Metabolic Health Thresholds',
      'American Heart Association Scientific Statement on Body Composition & Cardiometabolic Risk',
      'Lancet Diabetes & Endocrinology: The Limits of BMI and Importance of Waist-to-Height Ratio'
    ];

    return {
      bmi,
      category,
      color,
      healthyWeightRange: {
        minKg: minIdealKg,
        maxKg: maxIdealKg,
        minLbs: Math.round(minIdealKg * 2.20462),
        maxLbs: Math.round(maxIdealKg * 2.20462),
      },
      bmrEstimatedCalories,
      tdeeEstimatedCalories,
      healthRiskLevel,
      clinicalRecommendations,
      metabolicInsights,
      evidencePoints,
    };
  }
};
