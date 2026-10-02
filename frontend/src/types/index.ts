export type VerdictType = 'confirmed_true' | 'false_debunked' | 'misleading_nuanced' | 'unproven_inconclusive';

export interface Citation {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  pmid?: string;
  studyType: 'Meta-Analysis' | 'Systematic Review' | 'Randomized Controlled Trial (RCT)' | 'Cohort Study' | 'Clinical Guideline' | 'In Vitro / Animal Study';
  evidenceGrade: 'High (Level 1)' | 'Moderate (Level 2)' | 'Low (Level 3)' | 'Preclinical';
  sampleSize?: number;
  url: string;
  summary: string;
  sentiment: 'supports' | 'refutes' | 'neutral';
}

export interface ClaimSentenceBreakdown {
  sentence: string;
  verdict: VerdictType;
  explanation: string;
  confidence: number;
}

export interface VerificationResult {
  id: string;
  query: string;
  timestamp: string;
  category: 'pharmacology' | 'nutrition' | 'viral_trend' | 'chronic_illness' | 'general_health' | 'wellness';
  verdict: VerdictType;
  verdictTitle: string;
  confidenceScore: number; // 0 to 100
  consensusPercentage: {
    supports: number;
    refutes: number;
    inconclusive: number;
  };
  executiveSummary: string;
  clinicalContext: string;
  nuanceExplanation: string;
  potentialRisks: string[];
  scientificMechanism: string;
  claimBreakdown: ClaimSentenceBreakdown[];
  citations: Citation[];
  verifiedByAiModel: string;
  sourceUrl?: string;
  sourceImage?: string;
  saved?: boolean;
}

export interface NutritionAnalysisResult {
  id: string;
  itemName: string;
  portionSize: string;
  calories: number;
  macros: {
    protein: number; // in grams
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number; // in mg
  };
  glycemicIndex: {
    score: number;
    category: 'Low' | 'Medium' | 'High';
  };
  healthScore: number; // 0 - 100
  dietaryClaims: {
    claim: string;
    verdict: VerdictType;
    evidence: string;
  }[];
  keyBenefits: string[];
  cautionsAndAllergens: {
    name: string;
    severity: 'mild' | 'moderate' | 'severe';
    description: string;
  }[];
  dietCompatibility: {
    keto: boolean;
    diabeticFriendly: boolean;
    heartHealthy: boolean;
    lowFodmap: boolean;
    vegan: boolean;
    glutenFree: boolean;
  };
  evidenceCitations: Citation[];
}

export interface ProductScanResult {
  id: string;
  productName: string;
  brand?: string;
  barcode?: string;
  category: string;
  overallSafetyRating: 'Safe & Clean' | 'Moderate Concern' | 'High Risk Additives' | 'Hazardous / Banned';
  safetyScore: number; // 0-100
  ingredientsList: {
    name: string;
    eNumber?: string;
    category: 'Emulsifier' | 'Preservative' | 'Artificial Color' | 'Sweetener' | 'Active Ingredient' | 'Natural Extract' | 'Solvent';
    riskLevel: 'safe' | 'caution' | 'high_risk';
    description: string;
    bannedInRegions?: string[];
    potentialHealthImpact: string;
  }[];
  scannedAt: string;
  cleanScore: number;
  summary: string;
  ocrExtractedText?: string;
  recommendations: string[];
}

export interface BMICalculationResult {
  bmi: number;
  category: 'Severe Underweight' | 'Underweight' | 'Normal Weight' | 'Overweight' | 'Obese Class I' | 'Obese Class II' | 'Obese Class III';
  color: string;
  healthyWeightRange: {
    minKg: number;
    maxKg: number;
    minLbs: number;
    maxLbs: number;
  };
  bmrEstimatedCalories: number;
  tdeeEstimatedCalories: number;
  healthRiskLevel: 'Low' | 'Moderate' | 'Increased' | 'High' | 'Extremely High';
  clinicalRecommendations: string[];
  metabolicInsights: string[];
  evidencePoints: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'General User' | 'Medical Student' | 'Healthcare Professional' | 'Academic Researcher';
  specialty?: string;
  institution?: string;
  avatarUrl?: string;
  verifiedBadge?: boolean;
  createdAt: string;
  preferences: {
    mockMode: boolean;
    emailAlerts: boolean;
    citationFormat: 'APA' | 'Vancouver' | 'AMA';
    strictnessLevel: 'conservative' | 'balanced' | 'broad';
  };
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}
