from pydantic import BaseModel
from typing import List, Optional


class EuropePMCArticle(BaseModel):
    pmid: Optional[str] = None
    pmcid: Optional[str] = None
    doi: Optional[str] = None
    title: str
    authors: List[str]
    journal: str
    publication_date: str
    abstract: Optional[str] = None
    europe_pmc_url: str


class EuropePMCSearchResponse(BaseModel):
    query: str
    total_found: int
    limit: int
    results: List[EuropePMCArticle]
