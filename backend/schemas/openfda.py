from pydantic import BaseModel
from typing import Any


class OpenFDASearchResponse(BaseModel):
    query: str
    total_found: int
    limit: int
    results: list[dict[str, Any]]