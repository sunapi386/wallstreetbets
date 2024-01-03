# main.py

from lib.fetch_posts import fetch_new_posts
from lib.sentiment_analyzer import analyze_sentiment
from lib.stock_extractor import extract_stock_symbols
from lib.text_summarizer import summarize_text
from lib.clickhouse_store import insert_posts_into_clickhouse


def process_post(post):
    content = post.title + " " + post.selftext
    summary = summarize_text(content)
    sentiment = analyze_sentiment(content)
    stock_symbols = extract_stock_symbols(content)
    return {
        "title": post.title,
        "content": post.selftext,
        "summary": summary,
        "sentiment": sentiment,
        "stocks": stock_symbols,
        "created_utc": post.created_utc,
        "url": post.url,
    }


def get_processed_posts(subreddit):
    posts = fetch_new_posts(subreddit)
    return [process_post(post) for post in posts]


if __name__ == "__main__":
    processed_posts = get_processed_posts("wallstreetbets")
    # Here you would add code to insert these posts into ClickHouse and/or Weaviate
    print(processed_posts)
    insert_posts_into_clickhouse(processed_posts)
    print("Posts have been inserted into ClickHouse.")
