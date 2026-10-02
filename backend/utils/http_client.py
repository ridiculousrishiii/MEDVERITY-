import httpx
from typing import Optional, Dict, Any
from core.logging import logger
from fastapi import HTTPException

class HTTPClient:
    def __init__(self, timeout: int = 15):
        self.timeout = timeout
        
    async def get(self, url: str, params: Optional[Dict[str, Any]] = None, headers: Optional[Dict[str, str]] = None) -> Any:
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, params=params, headers=headers)
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
            raise HTTPException(status_code=e.response.status_code, detail=f"External API error: {e.response.text}")
        except httpx.RequestError as e:
            logger.error(f"Request error occurred: {str(e)}")
            raise HTTPException(status_code=503, detail="External API is unavailable")
        except Exception as e:
            logger.error(f"Unexpected error in HTTP GET: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error while fetching data")

http_client = HTTPClient()
