from typing import TypedDict, List
from datetime import datetime


class ProcessedPost(TypedDict):
    title: str
    content: str
    summary: str
    sentiment: float
    stocks: List[str]
    created_utc: datetime
    url: str
