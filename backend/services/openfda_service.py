from utils.http_client import http_client
from core.config import settings

class OpenFDAService:
    BASE_URL = "https://api.fda.gov/drug/event.json"

    async def search_events(self, drug_name: str, limit: int = 10):
        params = {
            "search": f"patient.drug.medicinalproduct:{drug_name}",
            "limit": limit
        }
        if settings.OPENFDA_API_KEY:
            params["api_key"] = settings.OPENFDA_API_KEY
            
        return await http_client.get(self.BASE_URL, params=params)

openfda_service = OpenFDAService()
