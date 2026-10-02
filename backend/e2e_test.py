import httpx
import asyncio
import json

async def test_query(client, query):
    url = 'http://127.0.0.1:8000/api/v1/medical/verify'
    payload = {'query': query, 'limit_per_source': 5}
    print(f"\n========================================================")
    print(f"Testing Query: '{query}'")
    print(f"========================================================")
    
    try:
        r = await client.post(url, json=payload, timeout=40)
        print(f"HTTP Status: {r.status_code}")
        
        if r.status_code != 200:
            print(f"ERROR: {r.text}")
            return
        
        data = r.json()
        print(f"\nVERDICT: {data['verdict']} (Confidence: {data['confidence']}%)")
        print(f"EXPLANATION: {data['explanation']}")
        
        sup = data['supporting_evidence']
        con = data['conflicting_evidence']
        neu = data['neutral_evidence']
        
        print(f"\nSOURCES FOUND: {len(sup)} Supporting | {len(con)} Conflicting | {len(neu)} Neutral")
        
        # Check if FDA was used
        fda_sources = [ev for items in [sup, con, neu] for ev in items if ev['source_type'] == 'OpenFDA']
        pm_epmc_sources = [ev for items in [sup, con, neu] for ev in items if ev['source_type'] in ['PubMed', 'Europe PMC']]
        
        print(f"OpenFDA Results: {len(fda_sources)}")
        print(f"PubMed/EuropePMC Results: {len(pm_epmc_sources)}")
        
        print("\nTOP 2 EVIDENCES:")
        all_ev = sup + con + neu
        for i, ev in enumerate(all_ev[:2], 1):
            print(f"  [{i}] {ev['source_type']} - {ev['title'][:60]}...")
            print(f"      Stance: {ev['stance']}")
            print(f"      URL: {ev['url']}")
            
    except Exception as e:
        print(f"REQUEST FAILED: {e}")

async def main():
    queries = [
        "Is drinking tea harmful?",
        "Is aspirin associated with adverse events?",
        "What are the health effects of green tea?"
    ]
    async with httpx.AsyncClient() as client:
        for q in queries:
            await test_query(client, q)

if __name__ == '__main__':
    asyncio.run(main())
