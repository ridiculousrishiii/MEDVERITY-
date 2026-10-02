import httpx
import asyncio
import json

async def test_frontend_flow():
    """
    Simulate exactly what the frontend does:
    1. POST to /api/v1/medical/verify with the query
    2. Print the full response as the frontend would receive it
    """
    url = 'http://127.0.0.1:8000/api/v1/medical/verify'
    payload = {'query': 'Is drinking tea harmful?', 'limit_per_source': 5}
    
    print("=" * 80)
    print("MEDVERITY Frontend -> Backend Integration Test")
    print("=" * 80)
    print(f"Query: '{payload['query']}'")
    print(f"Backend URL: POST {url}")
    print()
    
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(url, json=payload)
    
    print(f"HTTP Status: {r.status_code}")
    
    if r.status_code != 200:
        print(f"ERROR: {r.text}")
        return
    
    data = r.json()
    
    print(f"\n{'-' * 60}")
    print("VERDICT CARD (what VerdictCard.tsx displays)")
    print(f"{'-' * 60}")
    print(f"  Verdict:     {data['verdict']}")
    print(f"  Confidence:  {data['confidence']}%")
    print(f"  Explanation: {data['explanation']}")
    
    sup = data['supporting_evidence']
    con = data['conflicting_evidence']
    neu = data['neutral_evidence']
    total = len(sup) + len(con) + len(neu)
    
    print(f"\n{'-' * 60}")
    print("CONSENSUS METER (what ConsensusMeter.tsx displays)")
    print(f"{'-' * 60}")
    sup_pct = round((len(sup) / total) * 100) if total > 0 else 0
    con_pct = round((len(con) / total) * 100) if total > 0 else 0
    neu_pct = 100 - sup_pct - con_pct if total > 0 else 100
    print(f"  Supports:     {sup_pct}% ({len(sup)} sources)")
    print(f"  Refutes:      {con_pct}% ({len(con)} sources)")
    print(f"  Inconclusive: {neu_pct}% ({len(neu)} sources)")
    
    print(f"\n{'-' * 60}")
    print("EVIDENCE PANEL (what EvidencePanel.tsx displays)")
    print(f"{'-' * 60}")
    
    for label, items in [("SUPPORTING", sup), ("CONFLICTING", con), ("NEUTRAL", neu)]:
        if items:
            print(f"\n  -- {label} ({len(items)}) --")
            for i, ev in enumerate(items[:3], 1):
                print(f"  [{i}] {ev['title'][:80]}")
                print(f"      Source: {ev['source_type']} | Date: {ev['publication_date']}")
                if ev.get('pmid'): print(f"      PMID: {ev['pmid']}")
                if ev.get('pmcid'): print(f"      PMCID: {ev['pmcid']}")
                if ev.get('doi'): print(f"      DOI: {ev['doi']}")
                print(f"      URL: {ev['url']}")
                snippet = ev['snippet'].replace('<', '').replace('>', '')[:120]
                print(f"      Snippet: {snippet}...")
    
    print(f"\n{'-' * 60}")
    print("MEDICAL DISCLAIMER (what the disclaimer banner shows)")
    print(f"{'-' * 60}")
    print(f"  {data['disclaimer']}")
    
    # Save full JSON
    with open("test_frontend_flow_output.json", "w") as f:
        json.dump(data, f, indent=2)
    print(f"\n✓ Full JSON saved to test_frontend_flow_output.json")

if __name__ == '__main__':
    asyncio.run(test_frontend_flow())
