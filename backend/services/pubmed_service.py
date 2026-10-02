"""
PubMed service using NCBI E-utilities.
  ESearch  → search PubMed and get a list of PMIDs + total count
  EFetch   → retrieve full article XML (title, authors, abstract, etc.)

IMPORTANT: httpx already URL-encodes params dict values — never pre-encode
the query string with quote_plus or similar, or NCBI receives double-encoded
characters and returns zero results.

Identification params (tool + email) are required by NCBI policy:
https://www.ncbi.nlm.nih.gov/books/NBK25497/#chapter2.Usage_Guidelines_and_Requirements
"""

import xml.etree.ElementTree as ET
import httpx
from typing import List, Optional

from core.config import settings
from core.logging import logger
from schemas.pubmed import PubMedArticle, PubMedSearchResponse


ESEARCH_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
EFETCH_URL  = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"
PUBMED_BASE = "https://pubmed.ncbi.nlm.nih.gov"

# connect 5 s, read 20 s — generous for slow NCBI responses
_TIMEOUT = httpx.Timeout(connect=5.0, read=20.0, write=5.0, pool=5.0)


def _ncbi_base_params() -> dict:
    """Identification params required by NCBI for every E-utilities request."""
    params: dict = {
        "tool":  settings.NCBI_TOOL_NAME,
        "email": settings.NCBI_EMAIL,
    }
    if settings.NCBI_API_KEY:
        params["api_key"] = settings.NCBI_API_KEY
    return params


# ---------------------------------------------------------------------------
# XML parsing helpers
# ---------------------------------------------------------------------------

def _first_text(node, tag: str, default: str = "") -> str:
    """Return stripped text of the first matching child tag, or default."""
    child = node.find(tag)
    return (child.text or "").strip() if child is not None else default


def _build_pub_date(pd_node) -> str:
    """Build a clean publication date string from a PubDate XML node."""
    if pd_node is None:
        return ""
    year  = _first_text(pd_node, "Year")
    month = _first_text(pd_node, "Month")
    day   = _first_text(pd_node, "Day")
    # Fallback for records that only have a MedlineDate (e.g. "2023 Jan-Feb")
    medline = _first_text(pd_node, "MedlineDate")

    if year:
        parts = [year]
        if month:
            parts.append(month)
        if day:
            parts.append(day)
        return "-".join(parts)
    return medline


def _parse_articles(xml_root) -> List[PubMedArticle]:
    """Parse a PubmedArticleSet XML root into PubMedArticle objects."""
    articles: List[PubMedArticle] = []

    for article_node in xml_root.findall(".//PubmedArticle"):
        medline = article_node.find(".//MedlineCitation")
        if medline is None:
            continue

        pmid = _first_text(medline, "PMID")
        if not pmid:
            continue

        article = medline.find("Article")
        if article is None:
            continue

        # -- Title --
        title = _first_text(article, "ArticleTitle") or "No title available"

        # -- Authors --
        authors: List[str] = []
        author_list = article.find("AuthorList")
        if author_list is not None:
            for author in author_list.findall("Author"):
                last = _first_text(author, "LastName")
                fore = _first_text(author, "ForeName")
                coll = _first_text(author, "CollectiveName")
                if last:
                    authors.append(f"{last} {fore}".strip())
                elif coll:
                    authors.append(coll)

        # -- Journal --
        journal = ""
        journal_node = article.find("Journal")
        if journal_node is not None:
            journal = (
                _first_text(journal_node, "Title")
                or _first_text(journal_node, "ISOAbbreviation")
            )

        # -- Publication date --
        pub_date = ""
        if journal_node is not None:
            ji = journal_node.find("JournalIssue")
            if ji is not None:
                pub_date = _build_pub_date(ji.find("PubDate"))

        # -- Abstract (structured or plain) --
        abstract_parts: List[str] = []
        abstract_node = article.find("Abstract")
        if abstract_node is not None:
            for ab in abstract_node.findall("AbstractText"):
                label = ab.get("Label")
                # Inner text may be split across sub-elements (italics, etc.);
                # ET.tostring gives us full text including tail text of children
                text = "".join(ab.itertext()).strip()
                if text:
                    abstract_parts.append(f"{label}: {text}" if label else text)
        abstract: Optional[str] = " ".join(abstract_parts) if abstract_parts else None

        articles.append(
            PubMedArticle(
                pmid=pmid,
                title=title,
                authors=authors,
                journal=journal,
                publication_date=pub_date,
                abstract=abstract,
                pubmed_url=f"{PUBMED_BASE}/{pmid}/",
            )
        )

    return articles


# ---------------------------------------------------------------------------
# Public service
# ---------------------------------------------------------------------------

class PubMedService:

    async def search(self, query: str, limit: int = 10) -> PubMedSearchResponse:
        """
        Two-step NCBI E-utilities pipeline:
          1. ESearch  – find PMIDs matching *query*, store result on NCBI server
          2. EFetch   – retrieve XML for those PMIDs via server-side history
        """
        # Sanitise query: strip whitespace, reject empty after stripping
        query = query.strip()
        if not query:
            return PubMedSearchResponse(query=query, total_found=0, limit=limit, results=[])

        logger.info(f"PubMed ESearch | query='{query}' limit={limit}")

        async with httpx.AsyncClient(timeout=_TIMEOUT) as client:

            # ----------------------------------------------------------------
            # Step 1 — ESearch
            # NOTE: pass raw query string; httpx encodes it correctly.
            # ----------------------------------------------------------------
            esearch_params = {
                **_ncbi_base_params(),
                "db":         "pubmed",
                "term":       query,       # ← raw string, NOT quote_plus(query)
                "retmode":    "json",
                "retmax":     limit,
                "usehistory": "y",         # store result set server-side for EFetch
            }
            try:
                esearch_resp = await client.get(ESEARCH_URL, params=esearch_params)
                logger.info(
                    f"ESearch HTTP {esearch_resp.status_code} | "
                    f"url={esearch_resp.url}"
                )
                esearch_resp.raise_for_status()
            except httpx.HTTPStatusError as exc:
                logger.error(f"ESearch HTTP error {exc.response.status_code}")
                raise
            except httpx.RequestError as exc:
                logger.error(f"ESearch connection error: {exc}")
                raise

            esearch_data = esearch_resp.json()
            result_set   = esearch_data.get("esearchresult", {})
            id_list: List[str] = result_set.get("idlist", [])
            total_found: int   = int(result_set.get("count", 0))
            web_env: str       = result_set.get("webenv", "")
            query_key: str     = result_set.get("querykey", "")

            logger.info(
                f"ESearch result | total_found={total_found} "
                f"pmids_returned={len(id_list)} webenv={'yes' if web_env else 'no'}"
            )

            if not id_list:
                return PubMedSearchResponse(
                    query=query,
                    total_found=total_found,   # ← preserve real count, not 0
                    limit=limit,
                    results=[],
                )

            # ----------------------------------------------------------------
            # Step 2 — EFetch (XML)
            # Use server-side history (WebEnv + query_key) when available;
            # fall back to explicit PMID list if history was not stored.
            # ----------------------------------------------------------------
            efetch_params: dict = {
                **_ncbi_base_params(),
                "db":      "pubmed",
                "retmode": "xml",
                "rettype": "abstract",
            }
            if web_env and query_key:
                efetch_params["WebEnv"]    = web_env
                efetch_params["query_key"] = query_key
                efetch_params["retmax"]    = limit
            else:
                efetch_params["id"] = ",".join(id_list)

            try:
                efetch_resp = await client.get(EFETCH_URL, params=efetch_params)
                logger.info(f"EFetch HTTP {efetch_resp.status_code}")
                efetch_resp.raise_for_status()
            except httpx.HTTPStatusError as exc:
                logger.error(f"EFetch HTTP error {exc.response.status_code}")
                raise
            except httpx.RequestError as exc:
                logger.error(f"EFetch connection error: {exc}")
                raise

            # ----------------------------------------------------------------
            # Step 3 — Parse XML
            # ----------------------------------------------------------------
            try:
                xml_root = ET.fromstring(efetch_resp.text)
            except ET.ParseError as exc:
                logger.error(f"EFetch XML parse error: {exc}")
                raise ValueError(f"Failed to parse PubMed XML: {exc}") from exc

            articles = _parse_articles(xml_root)
            logger.info(f"Parsed {len(articles)} articles for query='{query}'")

            return PubMedSearchResponse(
                query=query,
                total_found=total_found,
                limit=limit,
                results=articles,
            )


pubmed_service = PubMedService()
