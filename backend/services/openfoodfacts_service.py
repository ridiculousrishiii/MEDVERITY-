from utils.http_client import http_client

class OpenFoodFactsService:
    BASE_URL = "https://world.openfoodfacts.org/api/v2"

    async def get_product_by_barcode(self, barcode: str):
        url = f"{self.BASE_URL}/product/{barcode}.json"
        return await http_client.get(url)
        
    async def search_product(self, product_name: str, page_size: int = 10):
        url = f"https://world.openfoodfacts.org/cgi/search.pl"
        params = {
            "search_terms": product_name,
            "search_simple": 1,
            "action": "process",
            "json": 1,
            "page_size": page_size
        }
        return await http_client.get(url, params=params)

openfoodfacts_service = OpenFoodFactsService()
