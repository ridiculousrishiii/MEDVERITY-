from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class Verdict(str, Enum):
    TRUE = "TRUE"
    FALSE = "FALSE"
    MIXED = "MIXED"
    INSUFFICIENT_EVIDENCE = "INSUFFICIENT_EVIDENCE"

class EvidenceStance(str, Enum):
    SUPPORTING = "SUPPORTING"
    CONFLICTING = "CONFLICTING"
    NEUTRAL = "NEUTRAL"

class EvidenceItem(BaseModel):
    title: str
    source_type: str  # e.g., "PubMed", "Europe PMC", "OpenFDA"
    url: str
    publication_date: str
    pmid: Optional[str] = None
    pmcid: Optional[str] = None
    doi: Optional[str] = None
    snippet: str
    stance: EvidenceStance
    relevance_score: float

class VerificationRequest(BaseModel):
    query: str = Field(..., min_length=2, description="Medical query or claim to verify")
    limit_per_source: int = Field(default=5, ge=1, le=20, description="Max results to fetch per source")

class VerificationResponse(BaseModel):
    query: str
    verdict: Verdict
    confidence: float
    explanation: str
    supporting_evidence: List[EvidenceItem]
    conflicting_evidence: List[EvidenceItem]
    neutral_evidence: List[EvidenceItem]
    disclaimer: str = (
        "DISCLAIMER: This information is aggregated automatically from medical databases "
        "and is for informational purposes only. It is NOT professional medical advice, "
        "diagnosis, or treatment. Always seek the advice of your physician or other "
        "qualified health provider with any questions you may have regarding a medical condition."
    )
