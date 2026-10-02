import httpx
from fastapi import APIRouter, HTTPException, Query, Body
from core.logging import logger
from services.pubmed_service import pubmed_service
from services.europe_pmc_service import europe_pmc_service
from schemas.pubmed import PubMedSearchResponse
from schemas.europe_pmc import EuropePMCSearchResponse
from services.openfda_service import openfda_service
from schemas.openfda import OpenFDASearchResponse
from services.verification_service import verification_service
from schemas.verification import VerificationRequest, VerificationResponse

router = APIRouter()

MAX_LIMIT = 10


@router.get(
    "/pubmed/search",
    response_model=PubMedSearchResponse,
    summary="Search PubMed articles",
    description=(
        "Search PubMed via NCBI E-utilities (ESearch + EFetch). "
        "Returns structured article metadata including PMID, title, authors, "
        "journal, publication date, abstract, and PubMed URL. "
        "Limit is capped at 10 per request."
    ),
)
async def search_pubmed(
    q: str = Query(..., min_length=1, description="PubMed search query"),
    limit: int = Query(
        default=10,
        ge=1,
        le=MAX_LIMIT,
        description=f"Number of results to return (1–{MAX_LIMIT})",
    ),
) -> PubMedSearchResponse:
    capped_limit = min(limit, MAX_LIMIT)
    logger.info(f"PubMed search endpoint called | q='{q}' limit={capped_limit}")

    try:
        return await pubmed_service.search(query=q, limit=capped_limit)

    except httpx.HTTPStatusError as exc:
        status = exc.response.status_code
        logger.error(f"PubMed upstream HTTP error {status}")
        raise HTTPException(
            status_code=502,
            detail=f"PubMed API returned an error (HTTP {status}). Please try again later.",
        )
    except httpx.RequestError as exc:
        logger.error(f"PubMed connection error: {exc}")
        raise HTTPException(
            status_code=503,
            detail="PubMed API is currently unreachable. Please try again later.",
        )
    except ValueError as exc:
        logger.error(f"PubMed response parse error: {exc}")
        raise HTTPException(
            status_code=502,
            detail="Failed to parse PubMed response. Please try again.",
        )
    except Exception as exc:
        logger.exception(f"Unexpected error in PubMed search: {exc}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while querying PubMed.",
        )


@router.get(
    "/europe-pmc/search",
    response_model=EuropePMCSearchResponse,
    summary="Search Europe PMC articles",
    description=(
        "Search the Europe PMC biomedical literature database. "
        "Returns structured article metadata including PMID, PMCID, DOI, title, "
        "authors, journal, publication date, abstract, and Europe PMC URL. "
        "No API key required. Limit is capped at 10 per request."
    ),
)
async def search_europe_pmc(
    q: str = Query(..., min_length=1, description="Europe PMC search query"),
    limit: int = Query(
        default=10,
        ge=1,
        le=MAX_LIMIT,
        description=f"Number of results to return (1\u201310)",
    ),
) -> EuropePMCSearchResponse:
    capped_limit = min(limit, MAX_LIMIT)
    logger.info(f"Europe PMC search endpoint called | q='{q}' limit={capped_limit}")

    try:
        return await europe_pmc_service.search(query=q, limit=capped_limit)

    except httpx.HTTPStatusError as exc:
        status = exc.response.status_code
        logger.error(f"Europe PMC upstream HTTP error {status}")
        raise HTTPException(
            status_code=502,
            detail=f"Europe PMC API returned an error (HTTP {status}). Please try again later.",
        )
    except httpx.RequestError as exc:
        logger.error(f"Europe PMC connection error: {exc}")
        raise HTTPException(
            status_code=503,
            detail="Europe PMC API is currently unreachable. Please try again later.",
        )
    except Exception as exc:
        logger.exception(f"Unexpected error in Europe PMC search: {exc}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while querying Europe PMC.",
        )
@router.get(
    "/openfda/search",
    response_model=OpenFDASearchResponse,
    summary="Search OpenFDA adverse drug events",
    description=(
        "Search the official openFDA drug adverse-event database. "
        "Returns real FDA adverse-event data for a drug or medicinal product. "
        "Limit is capped at 10 per request."
    ),
)
async def search_openfda(
    q: str = Query(
        ...,
        min_length=1,
        description="Drug or medicinal product name",
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=MAX_LIMIT,
        description=f"Number of results to return (1–{MAX_LIMIT})",
    ),
) -> OpenFDASearchResponse:
    capped_limit = min(limit, MAX_LIMIT)
    logger.info(
        f"OpenFDA search endpoint called | q='{q}' limit={capped_limit}"
    )

    try:
        response = await openfda_service.search_labels(
            query=q,
            limit=capped_limit,
        )

        results = response.get("results", [])
        total_found = response.get("meta", {}).get("results", {}).get("total", 0)

        return OpenFDASearchResponse(
            query=q,
            total_found=total_found,
            limit=capped_limit,
            results=results,
        )

    except httpx.HTTPStatusError as exc:
        status = exc.response.status_code
        logger.error(f"OpenFDA upstream HTTP error {status}")
        raise HTTPException(
            status_code=502,
            detail=f"OpenFDA API returned an error (HTTP {status}).",
        )
    except httpx.RequestError as exc:
        logger.error(f"OpenFDA connection error: {exc}")
        raise HTTPException(
            status_code=503,
            detail="OpenFDA API is currently unreachable.",
        )
    except Exception as exc:
        logger.exception(f"Unexpected error in OpenFDA search: {exc}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while querying OpenFDA.",
        )


@router.post(
    "/verify",
    response_model=VerificationResponse,
    summary="Evidence Aggregator & Verification Pipeline",
    description=(
        "Verifies a medical claim by aggregating evidence from PubMed, Europe PMC, "
        "and OpenFDA (if applicable). Returns a verified stance, confidence, and "
        "structured evidence breakdown."
    ),
)
async def verify_medical_claim(
    request: VerificationRequest = Body(...)
) -> VerificationResponse:
    logger.info(f"Verification endpoint called | query='{request.query}' limit={request.limit_per_source}")
    try:
        return await verification_service.verify_claim(request)
    except Exception as exc:
        logger.exception(f"Unexpected error in verify_medical_claim: {exc}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while verifying the medical claim.",
        )
