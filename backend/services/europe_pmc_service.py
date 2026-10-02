"""
Europe PMC service using the Europe PMC REST API (no API key required).
API docs: https://europepmc.org/RestfulWebService

Response shape used (resultType=core):
  data['hitCount']                      → total matching records
  data['resultList']['result']          → list of article dicts
  article['pmid']                       → PubMed ID (MED source only)
  article['id']                         → Europe PMC internal id (may be PMCID for PMC source)
  article['doi']                        → DOI
  article['title']                      → article title
  article['authorList']['author']       → list of author dicts with 'fullName'
  article['authorString']               → comma-separated fallback
  article['journalInfo']['journal']['title'] → journal name
  article['pubYear']                    → 4-digit year string
  article['abstractText']               → abstract (may be absent)

NOTE: httpx encodes the query string correctly — never pre-encode with quote_plus.
"""

import httpx
from typing import List, Optional

from core.config import settings
from core.logging import logger
from schemas.europe_pmc import EuropePMCArticle, EuropePMCSearchResponse


SEARCH_URL      = "https://www.ebi.ac.uk/europepmc/webservices/rest/search"
ARTICLE_BASE    = "https://europepmc.org/article"

_TIMEOUT = httpx.Timeout(connect=5.0, read=20.0, write=5.0, pool=5.0)


# ---------------------------------------------------------------------------
# Parsing helpers
# ---------------------------------------------------------------------------

def _parse_authors(article: dict) -> List[str]:
    """Extract author full names from authorList, fall back to authorString."""
    author_list_node = article.get("authorList", {})
    raw_authors = author_list_node.get("author", []) if isinstance(author_list_node, dict) else []

    if raw_authors:
        names = []
        for a in raw_authors:
            name = a.get("fullName") or (
                f"{a.get('lastName', '')} {a.get('firstName', '')}".strip()
            )
            if name:
                names.append(name)
        if names:
            return names

    # Fallback: split the pre-formatted string
    author_string = article.get("authorString", "")
    if author_string:
        # Strip trailing period that EPMC often appends
        return [n.strip().rstrip(".") for n in author_string.split(",") if n.strip()]

    return []


def _parse_journal(article: dict) -> str:
    """Extract journal title from nested journalInfo."""
    ji = article.get("journalInfo")
    if not ji or not isinstance(ji, dict):
        return ""
    journal = ji.get("journal")
    if not journal or not isinstance(journal, dict):
        return ""
    return journal.get("title") or journal.get("isoAbbreviation") or ""


def _parse_pub_date(article: dict) -> str:
    """
    Build publication date string.
    pubYear is always present. firstPublicationDate (YYYY-MM-DD) is more precise.
    """
    full_date = article.get("firstPublicationDate") or article.get("electronicPublicationDate")
    if full_date:
        return full_date
    return article.get("pubYear") or ""


def _europe_pmc_url(article: dict) -> str:
    """
    Build canonical Europe PMC article URL.
    Format: https://europepmc.org/article/{SOURCE}/{ID}
    """
    source = article.get("source", "MED")
    art_id = article.get("id", "")
    return f"{ARTICLE_BASE}/{source}/{art_id}"


def _parse_article(raw: dict) -> Optional[EuropePMCArticle]:
    """Map a raw Europe PMC result dict to an EuropePMCArticle. Returns None on error."""
    try:
        title = (raw.get("title") or "").strip()
        if not title:
            return None

        # PMID is only present for MED (MEDLINE/PubMed) source records
        pmid  = raw.get("pmid") or None

        # PMCID: present when article is in PubMed Central
        pmcid = raw.get("pmcid") or None

        return EuropePMCArticle(
            pmid=pmid,
            pmcid=pmcid,
            doi=raw.get("doi") or None,
            title=title,
            authors=_parse_authors(raw),
            journal=_parse_journal(raw),
            publication_date=_parse_pub_date(raw),
            abstract=raw.get("abstractText") or None,
            europe_pmc_url=_europe_pmc_url(raw),
        )
    except Exception as exc:
        logger.warning(f"Skipping malformed Europe PMC article: {exc}")
        return None


# ---------------------------------------------------------------------------
# Service class
# ---------------------------------------------------------------------------

class EuropePMCService:

    async def search(self, query: str, limit: int = 10) -> EuropePMCSearchResponse:
        """
        Search Europe PMC REST API and return structured results.

        Uses resultType=core to get abstracts, author lists, and journal info
        in a single request — no secondary fetch required.
        """
        query = query.strip()
        if not query:
            return EuropePMCSearchResponse(query=query, total_found=0, limit=limit, results=[])

        logger.info(f"Europe PMC search | query='{query}' limit={limit}")

        params = {
            "query":      query,       # raw string — httpx encodes correctly
            "format":     "json",
            "resultType": "core",      # includes abstract, full author list, journal info
            "pageSize":   limit,
            "cursorMark": "*",         # start from the first page
        }

        async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
            try:
                resp = await client.get(SEARCH_URL, params=params)
                logger.info(f"Europe PMC HTTP {resp.status_code} | url={resp.url}")
                resp.raise_for_status()
            except httpx.HTTPStatusError as exc:
                logger.error(f"Europe PMC HTTP error {exc.response.status_code}")
                raise
            except httpx.RequestError as exc:
                logger.error(f"Europe PMC connection error: {exc}")
                raise

        data = resp.json()
        total_found: int = int(data.get("hitCount", 0))
        raw_results: list = data.get("resultList", {}).get("result", [])

        logger.info(f"Europe PMC total_found={total_found} raw_results={len(raw_results)}")

        articles: List[EuropePMCArticle] = []
        for raw in raw_results:
            parsed = _parse_article(raw)
            if parsed:
                articles.append(parsed)

        logger.info(f"Europe PMC parsed {len(articles)} articles for query='{query}'")

        return EuropePMCSearchResponse(
            query=query,
            total_found=total_found,
            limit=limit,
            results=articles,
        )


europe_pmc_service = EuropePMCService()
