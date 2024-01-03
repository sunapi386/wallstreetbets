from typing import List
from datetime import datetime
from pydantic import BaseModel


class ProcessedPost(BaseModel):
    title: str
    content: str
    summary: str
    sentiment: float
    entities: List[str]
    created_utc: datetime
    url: str
