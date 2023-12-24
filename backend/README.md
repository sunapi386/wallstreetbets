# Reddit Post Analyzer for /r/wallstreetbets

This project is designed to fetch, process, and analyze posts from Reddit, specifically from the /r/wallstreetbets subreddit. It includes sentiment analysis, stock symbol extraction, summarization of posts, and storing the processed data in ClickHouse and Weaviate databases.

## Components

1. **Fetch Posts (`fetch_posts.py`)**: This module uses PRAW (Python Reddit API Wrapper) to fetch the latest posts from the /r/wallstreetbets subreddit.

2. **Process Posts (`process_today_wsb.py`)**: Processes the fetched posts by performing sentiment analysis, extracting stock symbols, and summarizing the content.

3. **Process Reddit URL (`process_reddit_url.py`)**: Processes a Reddit post given its URL. Validates the URL, fetches the post, and performs the same processing as for subreddit posts.

4. **Sentiment Analyzer (`sentiment_analyzer.py`)**: Analyzes the sentiment of the post's content.

5. **Stock Symbol Extractor (`stock_extractor.py`)**: Extracts stock symbols mentioned in the post.

6. **Text Summarizer (`text_summarizer.py`)**: Summarizes the post's content.

7. **Database Integration**: Code to insert the processed posts into ClickHouse and Weaviate for storage and further analysis.

## Setup

To run the project, ensure you have the following installed:

- Python 3.x
- PRAW (`pip install praw`)
- Transformers (`pip install transformers torch`)
- ClickHouse Python Driver (`pip install clickhouse-driver`)
- Weaviate Python Client (`pip install weaviate-client`)

```
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install Flask
```

## Configuration

Set up the following environment variables in a `.env` file:

- `REDDIT_API_ID`: Your Reddit API Client ID
- `REDDIT_API_SECRET`: Your Reddit API Secret

# Database Integration

Ensure your ClickHouse and Weaviate instances are set up and schemas are defined. Use the provided functions to insert data into these databases.

## Notes

This project is configured for /r/wallstreetbets, but can be adapted for other subreddits.
Ensure to handle large data volumes efficiently and consider asynchronous processing for scalability.

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
