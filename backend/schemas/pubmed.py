from pydantic import BaseModel
from typing import List, Optional


class PubMedArticle(BaseModel):
    pmid: str
    title: str
    authors: List[str]
    journal: str
    publication_date: str
    abstract: Optional[str]
    pubmed_url: str


class PubMedSearchResponse(BaseModel):
    query: str
    total_found: int
    limit: int
    results: List[PubMedArticle]
