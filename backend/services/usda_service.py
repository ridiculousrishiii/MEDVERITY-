from utils.http_client import http_client
from core.config import settings

class USDAService:
    BASE_URL = "https://api.nal.usda.gov/fdc/v1"

    async def search_food(self, query: str, page_size: int = 10):
        url = f"{self.BASE_URL}/foods/search"
        params = {
            "query": query,
            "pageSize": page_size
        }
        if settings.USDA_API_KEY:
            params["api_key"] = settings.USDA_API_KEY
        else:
            params["api_key"] = "DEMO_KEY"
            
        return await http_client.get(url, params=params)

usda_service = USDAService()
