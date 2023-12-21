# Backend
Python application handles business logic, interacts with the database, performs sentiment analysis, and prepares data to be sent to the front-end.

## Setup

```
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install Flask
```

## Serve
```
python app.py
```
You can verify it works by
```
curl localhost:5000/api/stocks
[
  {
    "mentions": 100,
    "news_summary": "Positive Q3 results...",
    "sentiment": 0.8,
    "ticker": "AAPL"
  }
]
```
