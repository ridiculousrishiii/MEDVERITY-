from utils.http_client import http_client
from core.config import settings

class OpenFDAService:
    BASE_URL = "https://api.fda.gov/drug/label.json"

    async def search_labels(self, query: str, limit: int = 10):
        # OpenFDA full-text search
        search_term = query.replace(' ', '+').replace('?', '')
        params = {
            "search": search_term,
            "limit": limit
        }
        if settings.OPENFDA_API_KEY:
            params["api_key"] = settings.OPENFDA_API_KEY
            
        return await http_client.get(self.BASE_URL, params=params)

openfda_service = OpenFDAService()
