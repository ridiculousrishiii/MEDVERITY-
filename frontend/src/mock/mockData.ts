import { VerificationResult, NutritionAnalysisResult, ProductScanResult, UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_mv_98214',
  name: 'Dr. Sarah Lin, MD',
  email: 's.lin@medverity-health.org',
  role: 'Healthcare Professional',
  specialty: 'Internal Medicine & Preventive Cardiology',
  institution: 'Johns Hopkins Medicine',
  avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
  verifiedBadge: true,
  createdAt: '2025-01-15T08:30:00Z',
  preferences: {
    mockMode: true,
    emailAlerts: true,
    citationFormat: 'Vancouver',
    strictnessLevel: 'conservative',
  }
};

export const SAMPLE_VERIFICATIONS: VerificationResult[] = [
  {
    id: 'ver_001',
    query: 'Drinking lemon water every morning alkalizes your blood and prevents cancer',
    timestamp: '2026-03-28T14:20:00Z',
    category: 'viral_trend',
    verdict: 'false_debunked',
    verdictTitle: 'Debunked by Human Physiology & Oncology Data',
    confidenceScore: 98,
    consensusPercentage: {
      supports: 1,
      refutes: 97,
      inconclusive: 2,
    },
    executiveSummary: 'Human blood pH is tightly regulated within a narrow physiological window (7.35–7.45) by the renal and pulmonary buffering systems. Dietary intake of citrus cannot alter systemic pH, nor does it destroy malignant cells in vivo.',
    clinicalContext: 'While lemons supply Vitamin C and polyphenols that support antioxidant defense, consuming lemon water has zero capacity to modulate blood pH or treat neoplastic tumors. In vitro acid-base sensitivity tests do not reflect complex mammalian tumor microenvironments.',
    nuanceExplanation: 'Citric acid produces alkaline byproducts (citrate/bicarbonate) during renal excretion, slightly raising urine pH, which frequently misleads lay advocates who test urine test-strips and falsely conflate urinary pH with systemic serum pH.',
    potentialRisks: [
      'Delayed conventional oncology intervention if used as an alternative therapy',
      'Dental enamel erosion from repeated daily exposure to undiluted citric acid',
      'Exacerbation of gastroesophageal reflux disease (GERD)'
    ],
    scientificMechanism: 'Systemic pH is governed by the carbonic acid-bicarbonate buffer system (H2CO3/HCO3-). Ingested organic acids are metabolized in the Krebs cycle into CO2 and H2O, eliminated by alveolar ventilation without altering serum homeostasis.',
    claimBreakdown: [
      {
        sentence: 'Drinking lemon water alkalizes your blood.',
        verdict: 'false_debunked',
        explanation: 'Blood pH is rigidly buffered (7.35–7.45); oral intake cannot alter systemic blood pH.',
        confidence: 99
      },
      {
        sentence: 'An alkaline body prevents and cures cancer.',
        verdict: 'false_debunked',
        explanation: 'Tumor microenvironments generate local acidity due to Warburg glycolysis, independent of systemic diet.',
        confidence: 97
      }
    ],
    citations: [
      {
        id: 'cit_101',
        title: 'The Alkaline Diet and Cancer: Systematic Review of the Evidence for an Alkaline Urine pH Therapy',
        authors: 'Fenton TR, Huang T.',
        journal: 'BMJ Open',
        year: 2021,
        doi: '10.1136/bmjopen-2016-010438',
        pmid: '27296820',
        studyType: 'Systematic Review',
        evidenceGrade: 'High (Level 1)',
        sampleSize: 8278,
        url: 'https://pubmed.ncbi.nlm.nih.gov/27296820/',
        summary: 'Rigorous systematic analysis found zero causal links between diet-induced acid load and cancer incidence or survival.',
        sentiment: 'refutes'
      },
      {
        id: 'cit_102',
        title: 'Renal Acid Base Balance and Regulation of Systemic Homeostasis in Humans',
        authors: 'Hamm LL, Nakhoul N, Hering-Smith KS.',
        journal: 'Clinical Journal of the American Society of Nephrology',
        year: 2023,
        doi: '10.2215/CJN.0000000000000102',
        pmid: '36809513',
        studyType: 'Clinical Guideline',
        evidenceGrade: 'High (Level 1)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/36809513/',
        summary: 'Demonstrates complete physiological mechanisms buffering food acidity within normal renal function limits.',
        sentiment: 'refutes'
      }
    ],
    verifiedByAiModel: 'MedVerity Clinical Consensus Engine v4.2 (BioMed-LLM)',
    saved: true
  },
  {
    id: 'ver_002',
    query: 'Creatine monohydrate supplementation causes kidney damage in healthy individuals',
    timestamp: '2026-03-25T11:15:00Z',
    category: 'pharmacology',
    verdict: 'false_debunked',
    verdictTitle: 'Debunked by Long-Term Randomized Controlled Trials',
    confidenceScore: 96,
    consensusPercentage: {
      supports: 2,
      refutes: 94,
      inconclusive: 4,
    },
    executiveSummary: 'Over 30 years of randomized clinical trials confirm that creatine monohydrate supplementation (3–5g/day) does not impair renal glomerular filtration rate or cause nephrotoxicity in healthy adults without pre-existing renal disease.',
    clinicalContext: 'Creatine degrades naturally into serum creatinine, the biomarker commonly used to estimate GFR. An elevated serum creatinine level following supplementation represents increased substrate turnover rather than true intrinsic renal parenchymal injury.',
    nuanceExplanation: 'Patients with pre-existing stage 3-5 Chronic Kidney Disease (CKD) should still exercise caution and seek nephrology guidance before using ergogenic nitrogenous compounds.',
    potentialRisks: [
      'Transient false alarm during routine blood tests due to elevated serum creatinine artifact',
      'Mild gastrointestinal discomfort if loading doses (>20g/day) are taken without sufficient water'
    ],
    scientificMechanism: 'Phosphocreatine donates phosphate to ADP via creatine kinase. Creatine breakdown is a non-enzymatic spontaneous conversion to creatinine filtered freely by glomeruli.',
    claimBreakdown: [
      {
        sentence: 'Creatine causes kidney damage in healthy adults.',
        verdict: 'false_debunked',
        explanation: 'Meta-analyses of >25 RCTs show no change in Cystatin-C or actual inulin clearance.',
        confidence: 96
      }
    ],
    citations: [
      {
        id: 'cit_201',
        title: 'Common Questions and Misconceptions About Creatine Supplementation: What Does the Scientific Evidence Really Show?',
        authors: 'Antonio J, Candow DG, Forbes SC, et al.',
        journal: 'Journal of the International Society of Sports Nutrition',
        year: 2021,
        doi: '10.1186/s12970-021-00412-w',
        pmid: '33557850',
        studyType: 'Systematic Review',
        evidenceGrade: 'High (Level 1)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/33557850/',
        summary: 'Exhaustive review concluding that creatine does not induce renal dysfunction or damage in recommended dosages.',
        sentiment: 'refutes'
      }
    ],
    verifiedByAiModel: 'MedVerity Clinical Consensus Engine v4.2',
    saved: true
  },
  {
    id: 'ver_003',
    query: 'High-dose Vitamin D3 (50,000 IU daily) cures autoimmune disorders and prevents all viral infections',
    timestamp: '2026-03-21T09:40:00Z',
    category: 'pharmacology',
    verdict: 'misleading_nuanced',
    verdictTitle: 'Misleading — Immunomodulatory Benefits Conflated with Hypervitaminosis D Risk',
    confidenceScore: 92,
    consensusPercentage: {
      supports: 18,
      refutes: 74,
      inconclusive: 8,
    },
    executiveSummary: 'Vitamin D plays a critical physiological role in immune modulation and T-cell regulation. However, mega-dosing 50,000 IU daily over prolonged periods without medical monitoring carries severe risks of hypercalcemia, vascular calcification, and nephrocalcinosis.',
    clinicalContext: 'Target serum 25(OH)D levels are ideally maintained between 30–50 ng/mL. While bolus therapy is clinically used for acute severe deficiency under supervision, daily unmonitored mega-dosing is hazardous.',
    nuanceExplanation: 'Co-factors such as Vitamin K2 and magnesium modulate calcium deposition, but claims of complete autoimmune eradication lack phase III clinical validation.',
    potentialRisks: [
      'Hypercalcemia leading to cardiac arrhythmias and kidney stones',
      'Acute renal insufficiency from calcium phosphate deposition',
      'False sense of immunity displacing evidence-based therapies'
    ],
    scientificMechanism: 'Calcitriol binds the nuclear Vitamin D Receptor (VDR), suppressing pro-inflammatory Th17 cytokines. Excess levels saturate binding globulin, elevating free calcium in serum.',
    claimBreakdown: [
      {
        sentence: 'Vitamin D supports immune health and auto-immunity balance.',
        verdict: 'confirmed_true',
        explanation: 'Confirmed immunomodulatory role in multiple sclerosis and autoimmune thyroiditis prevention.',
        confidence: 94
      },
      {
        sentence: 'Taking 50,000 IU daily is completely safe and cures disease.',
        verdict: 'false_debunked',
        explanation: 'Extreme dosing risks hypercalcemia and acute kidney injury.',
        confidence: 91
      }
    ],
    citations: [
      {
        id: 'cit_301',
        title: 'Vitamin D Toxicity: A Clinical Perspective and Systemic Review',
        authors: 'Marcinowska-Suchowierska E, et al.',
        journal: 'Frontiers in Endocrinology',
        year: 2022,
        doi: '10.3389/fendo.2018.00550',
        pmid: '30294301',
        studyType: 'Systematic Review',
        evidenceGrade: 'High (Level 1)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30294301/',
        summary: 'Documents pathology of chronic excessive cholecalciferol ingestion and hypercalcemic complications.',
        sentiment: 'refutes'
      }
    ],
    verifiedByAiModel: 'MedVerity Clinical Consensus Engine v4.2',
    saved: false
  },
  {
    id: 'ver_004',
    query: 'Intermittent Fasting (16:8) significantly improves insulin sensitivity and cellular autophagy in humans',
    timestamp: '2026-03-18T16:05:00Z',
    category: 'nutrition',
    verdict: 'confirmed_true',
    verdictTitle: 'Confirmed True by Clinical Trials & Metabolic Studies',
    confidenceScore: 91,
    consensusPercentage: {
      supports: 88,
      refutes: 6,
      inconclusive: 6,
    },
    executiveSummary: 'Time-restricted eating protocols (16 hours fasting, 8 hours feeding) reliably improve glycemic control, lower fasting insulin levels, and upregulate cellular repair markers compared to ad-libitum grazing.',
    clinicalContext: 'Benefits are primarily mediated through caloric moderation, prolonged periods of low baseline insulin allowing lipolysis, and circadian clock alignment.',
    nuanceExplanation: 'Calorie-matched continuous restriction yields similar total weight loss, indicating that while autophagy occurs, time-restriction is one viable tool among several metabolic regimens.',
    potentialRisks: [
      'Not recommended during pregnancy, lactation, or history of eating disorders',
      'Hypoglycemia risk in patients on sulfonylureas or insulin without dose adjustments'
    ],
    scientificMechanism: 'Depletion of liver glycogen activates AMPK and SIRT1 pathways while downregulating mTOR, initiating chaperone-mediated macroautophagy and mitochondrial biogenesis.',
    claimBreakdown: [
      {
        sentence: 'Intermittent fasting improves insulin sensitivity.',
        verdict: 'confirmed_true',
        explanation: 'Demonstrated in numerous human RCTs with statistically significant HOMA-IR reduction.',
        confidence: 93
      }
    ],
    citations: [
      {
        id: 'cit_401',
        title: 'Effects of Intermittent Fasting on Health, Aging, and Disease',
        authors: 'de Cabo R, Mattson MP.',
        journal: 'New England Journal of Medicine (NEJM)',
        year: 2020,
        doi: '10.1056/NEJMra1905136',
        pmid: '31881139',
        studyType: 'Systematic Review',
        evidenceGrade: 'High (Level 1)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31881139/',
        summary: 'Definitive review confirming cellular stress resistance and insulin sensitivity improvements across animal and human cohorts.',
        sentiment: 'supports'
      }
    ],
    verifiedByAiModel: 'MedVerity Clinical Consensus Engine v4.2',
    saved: true
  }
];

export const SAMPLE_NUTRITION_ITEMS: Record<string, NutritionAnalysisResult> = {
  'apple_cider_vinegar': {
    id: 'nut_001',
    itemName: 'Raw Apple Cider Vinegar (15ml / 1 tbsp)',
    portionSize: '1 Tablespoon (15ml) diluted in 250ml water',
    calories: 3,
    macros: {
      protein: 0.1,
      carbs: 0.9,
      fat: 0.0,
      fiber: 0.1,
      sugar: 0.4,
      sodium: 1.0,
    },
    glycemicIndex: {
      score: 5,
      category: 'Low'
    },
    healthScore: 84,
    dietaryClaims: [
      {
        claim: 'Blunts postprandial glucose spike when taken before high-carb meals',
        verdict: 'confirmed_true',
        evidence: 'Acetic acid delays gastric emptying and inhibits alpha-glucosidase activity in the small intestine.'
      },
      {
        claim: 'Melts belly fat overnight without dietary changes',
        verdict: 'false_debunked',
        evidence: 'No rigorous clinical evidence demonstrates targeted visceral fat loss without a sustained caloric deficit.'
      }
    ],
    keyBenefits: [
      'Moderate 20-30% reduction in post-meal blood sugar surges',
      'Mild antimicrobial properties in gut microbiome balance',
      'Enhances satiety response prior to carbohydrate ingestion'
    ],
    cautionsAndAllergens: [
      {
        name: 'Acidic Tooth Enamel Erosion',
        severity: 'moderate',
        description: 'Always dilute with water and avoid brushing teeth immediately after consumption.'
      },
      {
        name: 'Esophageal Irritation',
        severity: 'mild',
        description: 'Undiluted intake can cause mucosal burn in sensitive gastrointestinal tracts.'
      }
    ],
    dietCompatibility: {
      keto: true,
      diabeticFriendly: true,
      heartHealthy: true,
      lowFodmap: true,
      vegan: true,
      glutenFree: true
    },
    evidenceCitations: [
      {
        id: 'nut_cit_1',
        title: 'Vinegar consumption can attenuate postprandial glucose and insulin responses',
        authors: 'Johnston CS, et al.',
        journal: 'Journal of the Academy of Nutrition and Dietetics',
        year: 2021,
        studyType: 'Meta-Analysis',
        evidenceGrade: 'High (Level 1)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/15555528/',
        summary: 'Randomized crossover trials show consistent glycemic blunting in both prediabetic and diabetic subjects.',
        sentiment: 'supports'
      }
    ]
  },
  'chia_seed_pudding': {
    id: 'nut_002',
    itemName: 'Organic Chia Seed & Almond Milk Bowl (150g)',
    portionSize: '1 Bowl (150g serving)',
    calories: 210,
    macros: {
      protein: 6.5,
      carbs: 18.0,
      fat: 11.5,
      fiber: 10.2,
      sugar: 2.1,
      sodium: 85.0,
    },
    glycemicIndex: {
      score: 15,
      category: 'Low'
    },
    healthScore: 94,
    dietaryClaims: [
      {
        claim: 'Rich source of plant-based Alpha-Linolenic Acid (ALA Omega-3)',
        verdict: 'confirmed_true',
        evidence: 'Provides over 4,500mg ALA per 30g serving, promoting cardioprotective lipid profiles.'
      },
      {
        claim: 'High soluble fiber supports bowel motility and microbiome diversity',
        verdict: 'confirmed_true',
        evidence: 'Forms mucilage gel that slows carbohydrate digestion and feeds beneficial short-chain fatty acid producers.'
      }
    ],
    keyBenefits: [
      'High soluble mucilage fiber content (over 35% RDA)',
      'Rich in cardioprotective polyphenols (quercetin, kaempferol)',
      'Stable blood glucose curve throughout the morning'
    ],
    cautionsAndAllergens: [
      {
        name: 'Nut Allergens (Almond base)',
        severity: 'severe',
        description: 'Contains tree nuts if prepared with commercial almond milk.'
      }
    ],
    dietCompatibility: {
      keto: true,
      diabeticFriendly: true,
      heartHealthy: true,
      lowFodmap: true,
      vegan: true,
      glutenFree: true
    },
    evidenceCitations: []
  }
};

export const SAMPLE_PRODUCTS: ProductScanResult[] = [
  {
    id: 'prod_001',
    productName: 'Electrolyte Energy Hydro-Blast 500ml',
    brand: 'Apex Performance Lab',
    barcode: '8901234567890',
    category: 'Energy & Performance Beverage',
    overallSafetyRating: 'Moderate Concern',
    safetyScore: 58,
    cleanScore: 52,
    summary: 'Contains high doses of artificial sweeteners and synthetic food colorants linked to intestinal permeability, alongside high caffeine concentration.',
    ocrExtractedText: 'INGREDIENTS: Carbonated Water, Citric Acid, Sucralose (E955), Acesulfame Potassium (E950), Taurine, Caffeine (200mg), Sodium Benzoate (E211), Allura Red (E129), Natural & Artificial Berry Flavors.',
    ingredientsList: [
      {
        name: 'Sucralose',
        eNumber: 'E955',
        category: 'Sweetener',
        riskLevel: 'caution',
        description: 'Synthetic high-intensity organochlorine sweetener.',
        potentialHealthImpact: 'Recent clinical trials note alteration of gut microbiome homeostasis and glycemic response modulation in sensitive populations.'
      },
      {
        name: 'Allura Red AC',
        eNumber: 'E129',
        category: 'Artificial Color',
        riskLevel: 'high_risk',
        description: 'Azo dye synthetic colorant.',
        bannedInRegions: ['Selected EU warning requirement', 'Switzerland (restricted)'],
        potentialHealthImpact: 'Linked with pediatric hyperactivity and potential histamine-mediated allergic triggers.'
      },
      {
        name: 'Sodium Benzoate',
        eNumber: 'E211',
        category: 'Preservative',
        riskLevel: 'caution',
        description: 'Aromatic antimicrobial preservative.',
        potentialHealthImpact: 'Can form trace benzene (carcinogen) in the presence of ascorbic acid (Vitamin C) under heat/light exposure.'
      },
      {
        name: 'Caffeine Anhydrous',
        category: 'Active Ingredient',
        riskLevel: 'safe',
        description: 'Central nervous system stimulant (200mg dosage).',
        potentialHealthImpact: 'Safe under 400mg daily for adults; caution with underlying cardiac arrhythmias or anxiety disorders.'
      }
    ],
    scannedAt: '2026-03-27T10:14:00Z',
    recommendations: [
      'Consider switching to naturally flavored unsweetened electrolyte powders',
      'Avoid consuming alongside Vitamin C enriched foods to prevent potential benzene formation',
      'Do not consume within 6 hours of scheduled sleep'
    ]
  },
  {
    id: 'prod_002',
    productName: 'Ultra-Pure Collagen Peptides + Hyaluronic Acid',
    brand: 'VerityBio Organics',
    barcode: '8909876543210',
    category: 'Nutraceutical Supplement',
    overallSafetyRating: 'Safe & Clean',
    safetyScore: 96,
    cleanScore: 95,
    summary: 'Clean formulation free of synthetic fillers, artificial colorants, silicon dioxide, or questionable preservatives. Heavy metals tested third-party compliant.',
    ocrExtractedText: 'INGREDIENTS: Hydrolyzed Bovine Collagen Peptides (Types I & III), Low-Molecular Sodium Hyaluronate, Vitamin C (as Ascorbic Acid), Natural Vanilla Bean Extract.',
    ingredientsList: [
      {
        name: 'Hydrolyzed Collagen Peptides',
        category: 'Active Ingredient',
        riskLevel: 'safe',
        description: 'Enzymatically broken down bioavailable amino acid chains.',
        potentialHealthImpact: 'Supports dermal elasticity and joint cartilage extracellular matrix synthesis.'
      },
      {
        name: 'Sodium Hyaluronate',
        category: 'Active Ingredient',
        riskLevel: 'safe',
        description: 'Water-binding glycosaminoglycan.',
        potentialHealthImpact: 'Enhances skin hydration and synovial fluid viscosity.'
      }
    ],
    scannedAt: '2026-03-26T15:30:00Z',
    recommendations: [
      'Safe for daily use; best taken with morning hydration',
      'Third-party verified heavy metal analysis available via QR batch lookup'
    ]
  }
];

export const TRENDING_MYTHS = [
  {
    id: 'tr_1',
    claim: 'Eating raw garlic on an empty stomach cures hypertension immediately',
    category: 'Nutrition',
    searches: '24.5k queries this week',
    verdict: 'misleading_nuanced' as const,
    summary: 'Allicin has mild vasodilatory effects, but will not replace anti-hypertensive pharmacology or produce immediate cure.'
  },
  {
    id: 'tr_2',
    claim: 'Microwaving vegetables destroys all vitamins and produces carcinogenic radiation',
    category: 'General Health',
    searches: '18.2k queries this week',
    verdict: 'false_debunked' as const,
    summary: 'Microwaving uses non-ionizing RF energy and preserves more water-soluble vitamins than traditional boiling due to shorter heat exposure.'
  },
  {
    id: 'tr_3',
    claim: 'GLP-1 agonists cause permanent muscle wasting in 100% of patients',
    category: 'Pharmacology',
    searches: '32.1k queries this week',
    verdict: 'misleading_nuanced' as const,
    summary: 'Lean mass loss accompanies rapid weight reduction on any hypocaloric protocol, but can be prevented with adequate protein and resistance training.'
  },
  {
    id: 'tr_4',
    claim: 'Regular zone 2 cardiovascular exercise promotes mitochondrial density and longevity',
    category: 'Wellness',
    searches: '15.9k queries this week',
    verdict: 'confirmed_true' as const,
    summary: 'Robust longitudinal epidemiology and biopsy data confirm lactate clearance and mitochondrial biogenesis improvements.'
  }
];
