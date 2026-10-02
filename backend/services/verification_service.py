import asyncio
from typing import List, Dict, Any, Set
from core.logging import logger
from schemas.verification import (
    VerificationRequest, VerificationResponse, EvidenceItem,
    Verdict, EvidenceStance
)
from services.pubmed_service import pubmed_service
from services.europe_pmc_service import europe_pmc_service
from services.openfda_service import openfda_service

class VerificationService:
    async def verify_claim(self, request: VerificationRequest) -> VerificationResponse:
        query = request.query.strip().lower()
        limit = request.limit_per_source
        
        logger.info(f"Verification pipeline started for query: '{query}' (limit: {limit})")
        
        # 1. Fetch concurrently
        tasks = [
            pubmed_service.search(query=query, limit=limit),
            europe_pmc_service.search(query=query, limit=limit)
        ]
        
        # Basic heuristic for OpenFDA: check for drug-related keywords or short product names
        drug_keywords = {"drug", "medicine", "medication", "pill", "adverse", "side effect", "fda", "dose", "tablet", "vaccine"}
        use_fda = any(kw in query for kw in drug_keywords) or len(query.split()) <= 3
        if use_fda:
            # Note: openfda_service currently expects drug_name, so we pass the whole query
            tasks.append(openfda_service.search_events(drug_name=query, limit=limit))
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        pubmed_res = results[0] if not isinstance(results[0], Exception) else None
        epmc_res = results[1] if not isinstance(results[1], Exception) else None
        fda_res = results[2] if use_fda and not isinstance(results[2], Exception) else None
        
        if isinstance(results[0], Exception):
            logger.warning(f"PubMed verification error: {results[0]}")
        if isinstance(results[1], Exception):
            logger.warning(f"Europe PMC verification error: {results[1]}")
        if use_fda and isinstance(results[2], Exception):
            logger.warning(f"OpenFDA verification error: {results[2]}")
        
        evidence_list: List[EvidenceItem] = []
        seen_identifiers: Set[str] = set()
        
        # 2. Normalize PubMed
        if pubmed_res and hasattr(pubmed_res, "results"):
            for article in pubmed_res.results:
                if article.pmid in seen_identifiers:
                    continue
                if article.pmid:
                    seen_identifiers.add(article.pmid)
                
                snippet = article.abstract or ""
                relevance = self._calculate_relevance(query, article.title, snippet)
                stance = self._classify_stance(snippet)
                
                evidence_list.append(EvidenceItem(
                    title=article.title,
                    source_type="PubMed",
                    url=article.pubmed_url,
                    publication_date=article.publication_date,
                    pmid=article.pmid,
                    snippet=snippet[:600] + ("..." if len(snippet) > 600 else ""),
                    stance=stance,
                    relevance_score=relevance
                ))
                
        # 3. Normalize Europe PMC
        if epmc_res and hasattr(epmc_res, "results"):
            for article in epmc_res.results:
                if article.pmid and article.pmid in seen_identifiers:
                    continue
                if article.doi and article.doi in seen_identifiers:
                    continue
                if article.pmid:
                    seen_identifiers.add(article.pmid)
                if article.doi:
                    seen_identifiers.add(article.doi)
                    
                snippet = article.abstract or ""
                relevance = self._calculate_relevance(query, article.title, snippet)
                stance = self._classify_stance(snippet)
                
                evidence_list.append(EvidenceItem(
                    title=article.title,
                    source_type="Europe PMC",
                    url=article.europe_pmc_url,
                    publication_date=article.publication_date,
                    pmid=article.pmid,
                    pmcid=article.pmcid,
                    doi=article.doi,
                    snippet=snippet[:600] + ("..." if len(snippet) > 600 else ""),
                    stance=stance,
                    relevance_score=relevance
                ))
                
        # 4. Normalize OpenFDA
        if fda_res and isinstance(fda_res, dict) and "results" in fda_res:
            for label in fda_res.get("results", []):
                openfda_meta = label.get("openfda", {})
                brand_names = openfda_meta.get("brand_name", [])
                brand_name = brand_names[0] if brand_names else "Unknown Product"
                
                generic_names = openfda_meta.get("generic_name", [])
                generic_name = generic_names[0] if generic_names else ""
                
                name_str = f"{brand_name} ({generic_name})" if generic_name else brand_name
                title = f"FDA Official Label: {name_str}"
                
                if title in seen_identifiers:
                    continue
                seen_identifiers.add(title)

                warnings_list = label.get("warnings", [])
                warnings = warnings_list[0] if warnings_list else ""
                
                adverse_list = label.get("adverse_reactions", [])
                adverse = adverse_list[0] if adverse_list else ""
                
                indications_list = label.get("indications_and_usage", [])
                indications = indications_list[0] if indications_list else ""
                
                snippet_parts = []
                if indications:
                    snippet_parts.append(f"Indications: {indications[:200]}...")
                if warnings:
                    snippet_parts.append(f"Warnings: {warnings[:200]}...")
                if adverse:
                    snippet_parts.append(f"Adverse Reactions: {adverse[:200]}...")
                    
                snippet = " | ".join(snippet_parts)
                if not snippet:
                    continue
                
                stance = self._classify_stance(snippet)
                
                evidence_list.append(EvidenceItem(
                    title=title,
                    source_type="OpenFDA",
                    url="https://open.fda.gov/apis/drug/label/",
                    publication_date=label.get("effective_time", "Unknown"),
                    snippet=snippet,
                    stance=stance,
                    relevance_score=self._calculate_relevance(query, title, snippet)
                ))
                
        # 5. Rank and group evidence
        evidence_list.sort(key=lambda x: x.relevance_score, reverse=True)
        
        supporting = [e for e in evidence_list if e.stance == EvidenceStance.SUPPORTING]
        conflicting = [e for e in evidence_list if e.stance == EvidenceStance.CONFLICTING]
        neutral = [e for e in evidence_list if e.stance == EvidenceStance.NEUTRAL]
        
        # 6. Determine Verdict
        total_evidence = len(evidence_list)
        if total_evidence == 0:
            verdict = Verdict.INSUFFICIENT_EVIDENCE
            confidence = 0.0
            explanation = "No relevant peer-reviewed literature or FDA reports were found for this query."
        else:
            sup_ratio = len(supporting) / total_evidence
            con_ratio = len(conflicting) / total_evidence
            
            if sup_ratio > 0.5 and sup_ratio >= con_ratio * 1.5:
                verdict = Verdict.TRUE
                confidence = round((sup_ratio + (len(neutral)*0.1)) * 100, 1)
                explanation = f"Based on {total_evidence} sources, the evidence predominantly indicates safety, efficacy, or beneficial outcomes."
            elif con_ratio > 0.5 and con_ratio >= sup_ratio * 1.5:
                verdict = Verdict.FALSE
                confidence = round((con_ratio + (len(neutral)*0.1)) * 100, 1)
                explanation = f"Based on {total_evidence} sources, the evidence predominantly indicates risks, adverse effects, or potential harm."
            else:
                verdict = Verdict.MIXED
                confidence = round(max(sup_ratio, con_ratio) * 100, 1) if max(sup_ratio, con_ratio) > 0 else 50.0
                explanation = f"Based on {total_evidence} sources, the evidence is mixed or neutral. This indicates a nuanced topic requiring careful interpretation."
                
            # Cap confidence at 99.0
            confidence = min(confidence, 99.0)
                
        return VerificationResponse(
            query=request.query,
            verdict=verdict,
            confidence=confidence,
            explanation=explanation,
            supporting_evidence=supporting,
            conflicting_evidence=conflicting,
            neutral_evidence=neutral
        )
        
    def _calculate_relevance(self, query: str, title: str, snippet: str) -> float:
        score = 0.0
        query_terms = set(query.lower().replace("?", "").split())
        title_lower = title.lower()
        snippet_lower = snippet.lower()
        
        for term in query_terms:
            if len(term) <= 3:
                continue
            if term in title_lower:
                score += 5.0
            if term in snippet_lower:
                score += 2.0
        return score
        
    def _classify_stance(self, text: str) -> EvidenceStance:
        if not text:
            return EvidenceStance.NEUTRAL
            
        text_lower = text.lower()
        
        positive_words = ["safe", "effective", "beneficial", "improves", "efficacy", "protect", "treatment", "healthy", "positive", "supports", "attenuates"]
        negative_words = ["adverse", "harm", "toxic", "risk", "danger", "death", "warning", "contraindication", "harmful", "negative", "side effect", "impairment"]
        
        pos_count = sum(text_lower.count(w) for w in positive_words)
        neg_count = sum(text_lower.count(w) for w in negative_words)
        
        if pos_count > neg_count * 1.5:
            return EvidenceStance.SUPPORTING
        elif neg_count > pos_count * 1.5:
            return EvidenceStance.CONFLICTING
            
        return EvidenceStance.NEUTRAL

verification_service = VerificationService()
