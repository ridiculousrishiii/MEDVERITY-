import { VerificationResult, VerdictType, Citation } from '../types';
import { SAMPLE_VERIFICATIONS } from '../mock/mockData';
import { EvidenceItemData } from '../components/verification/EvidencePanel';

export interface VerificationRequest {
  query: string;
  sourceUrl?: string;
  imageFile?: File | null;
  category?: string;
  strictness?: 'conservative' | 'balanced' | 'broad';
}

/** Raw backend response shape from POST /api/v1/medical/verify */
interface BackendEvidenceItem {
  title: string;
  source_type: string;
  url: string;
  publication_date: string;
  pmid?: string | null;
  pmcid?: string | null;
  doi?: string | null;
  snippet: string;
  stance: 'SUPPORTING' | 'CONFLICTING' | 'NEUTRAL';
  relevance_score: number;
}

interface BackendVerificationResponse {
  query: string;
  verdict: 'TRUE' | 'FALSE' | 'MIXED' | 'INSUFFICIENT_EVIDENCE';
  confidence: number;
  explanation: string;
  supporting_evidence: BackendEvidenceItem[];
  conflicting_evidence: BackendEvidenceItem[];
  neutral_evidence: BackendEvidenceItem[];
  disclaimer: string;
}

/** The enriched result combining existing VerificationResult + new evidence data */
export interface EnrichedVerificationResult extends VerificationResult {
  /** Raw evidence from the backend */
  backendEvidence: {
    supporting: EvidenceItemData[];
    conflicting: EvidenceItemData[];
    neutral: EvidenceItemData[];
  };
  backendDisclaimer: string;
  backendVerdict: string;
  backendConfidence: number;
  backendExplanation: string;
  isFromBackend: boolean;
}

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const STORAGE_VERIFICATIONS_KEY = 'medverity_history_verifications';

/**
 * Map backend verdict string → existing VerdictType enum.
 */
function mapVerdictType(backendVerdict: string): VerdictType {
  switch (backendVerdict) {
    case 'TRUE':
      return 'confirmed_true';
    case 'FALSE':
      return 'false_debunked';
    case 'MIXED':
      return 'misleading_nuanced';
    case 'INSUFFICIENT_EVIDENCE':
    default:
      return 'unproven_inconclusive';
  }
}

/**
 * Map backend verdict → human-readable title.
 */
function mapVerdictTitle(backendVerdict: string): string {
  switch (backendVerdict) {
    case 'TRUE':
      return 'Evidence Supports This Claim';
    case 'FALSE':
      return 'Evidence Contradicts This Claim';
    case 'MIXED':
      return 'Mixed Evidence — Requires Clinical Nuance';
    case 'INSUFFICIENT_EVIDENCE':
    default:
      return 'Insufficient Evidence Available';
  }
}

/**
 * Strip HTML tags from snippets (Europe PMC sometimes includes them).
 */
function cleanHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

/**
 * Transform backend evidence items → existing Citation[] shape.
 */
function evidenceToCitations(items: BackendEvidenceItem[]): Citation[] {
  return items.map((item, idx) => ({
    id: `cit_${Date.now()}_${idx}`,
    title: item.title,
    authors: item.source_type,
    journal: item.source_type,
    year: parseInt(item.publication_date?.slice(0, 4) || '0', 10) || 0,
    doi: item.doi || undefined,
    pmid: item.pmid || undefined,
    studyType: 'Systematic Review' as Citation['studyType'],
    evidenceGrade: 'Moderate (Level 2)' as Citation['evidenceGrade'],
    url: item.url,
    summary: cleanHtml(item.snippet.slice(0, 300)),
    sentiment: item.stance === 'SUPPORTING' ? 'supports' as const :
               item.stance === 'CONFLICTING' ? 'refutes' as const :
               'neutral' as const,
  }));
}

/**
 * Build VerificationResult from the backend response.
 */
function transformBackendResponse(
  response: BackendVerificationResponse,
  originalRequest: VerificationRequest
): EnrichedVerificationResult {
  const allEvidence = [
    ...response.supporting_evidence,
    ...response.conflicting_evidence,
    ...response.neutral_evidence,
  ];

  const supCount = response.supporting_evidence.length;
  const conCount = response.conflicting_evidence.length;
  const neuCount = response.neutral_evidence.length;
  const total = supCount + conCount + neuCount;

  const supports = total > 0 ? Math.round((supCount / total) * 100) : 0;
  const refutes = total > 0 ? Math.round((conCount / total) * 100) : 0;
  const inconclusive = total > 0 ? 100 - supports - refutes : 100;

  return {
    id: `ver_${Date.now()}`,
    query: response.query,
    timestamp: new Date().toISOString(),
    category: (originalRequest.category as VerificationResult['category']) || 'general_health',
    verdict: mapVerdictType(response.verdict),
    verdictTitle: mapVerdictTitle(response.verdict),
    confidenceScore: Math.round(response.confidence),
    consensusPercentage: {
      supports,
      refutes,
      inconclusive,
    },
    executiveSummary: response.explanation,
    clinicalContext: response.disclaimer,
    nuanceExplanation: `Based on ${total} real biomedical sources retrieved from PubMed, Europe PMC, and OpenFDA. ` +
      `${supCount} source(s) support the claim, ${conCount} source(s) conflict with it, and ${neuCount} are neutral or provide background context.`,
    potentialRisks: conCount > 0
      ? response.conflicting_evidence.slice(0, 3).map(
          (e) => `${e.source_type}: ${e.title.slice(0, 120)}${e.title.length > 120 ? '...' : ''}`
        )
      : [],
    scientificMechanism: '',
    claimBreakdown: [
      {
        sentence: response.query,
        verdict: mapVerdictType(response.verdict),
        explanation: response.explanation,
        confidence: Math.round(response.confidence),
      },
    ],
    citations: evidenceToCitations(allEvidence.slice(0, 10)),
    verifiedByAiModel: 'MedVerity Evidence Aggregation Pipeline v1.0',
    sourceUrl: originalRequest.sourceUrl,
    saved: false,

    // Enriched fields
    backendEvidence: {
      supporting: response.supporting_evidence,
      conflicting: response.conflicting_evidence,
      neutral: response.neutral_evidence,
    },
    backendDisclaimer: response.disclaimer,
    backendVerdict: response.verdict,
    backendConfidence: response.confidence,
    backendExplanation: response.explanation,
    isFromBackend: true,
  };
}

export const verificationService = {
  async getStoredVerifications(): Promise<VerificationResult[]> {
    const saved = localStorage.getItem(STORAGE_VERIFICATIONS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back to default
      }
    }
    localStorage.setItem(STORAGE_VERIFICATIONS_KEY, JSON.stringify(SAMPLE_VERIFICATIONS));
    return SAMPLE_VERIFICATIONS;
  },

  async verifyClaim(req: VerificationRequest): Promise<EnrichedVerificationResult> {
    // Always try the real backend first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch(`${BACKEND_URL}/v1/medical/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: req.query,
          limit_per_source: 5,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Backend returned HTTP ${response.status}: ${response.statusText}`);
      }

      const data: BackendVerificationResponse = await response.json();
      const enriched = transformBackendResponse(data, req);

      await this.saveToHistory(enriched);
      return enriched;
    } catch (err) {
      console.error('Backend verification API error:', err);

      // Rethrow with a user-friendly message — do NOT fall back to mock
      const msg =
        err instanceof DOMException && err.name === 'AbortError'
          ? 'Verification request timed out. The backend took too long to respond. Please try again.'
          : err instanceof TypeError && err.message.includes('fetch')
          ? 'Cannot reach the MEDVERITY backend server. Please ensure the backend is running on port 8000.'
          : err instanceof Error
          ? err.message
          : 'Unknown error during verification.';
      throw new Error(msg);
    }
  },

  async saveToHistory(item: VerificationResult): Promise<void> {
    const list = await this.getStoredVerifications();
    const filtered = list.filter(v => v.id !== item.id);
    const updated = [item, ...filtered];
    localStorage.setItem(STORAGE_VERIFICATIONS_KEY, JSON.stringify(updated));
  },

  async toggleSaveVerification(id: string): Promise<boolean> {
    const list = await this.getStoredVerifications();
    let newSavedState = false;
    const updated = list.map((item) => {
      if (item.id === id) {
        newSavedState = !item.saved;
        return { ...item, saved: newSavedState };
      }
      return item;
    });
    localStorage.setItem(STORAGE_VERIFICATIONS_KEY, JSON.stringify(updated));
    return newSavedState;
  }
};
