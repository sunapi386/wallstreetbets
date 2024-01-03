# main.py

from lib.post import ProcessedPost
from lib.fetch_posts import fetch_new_posts
from lib.sentiment_analyzer import analyze_sentiment
from lib.stock_extractor import extract_stock_symbols
from lib.text_summarizer import summarize_text
from lib.clickhouse_store import insert_posts_into_clickhouse


def process_post(reddit_post):
    content = reddit_post.title + " " + reddit_post.selftext
    summary = summarize_text(content)
    sentiment = analyze_sentiment(content)
    stock_symbols = extract_stock_symbols(content)
    processed_posts = ProcessedPost (
        title=reddit_post.title,
        content=reddit_post.selftext,
        summary=summary, # type: ignore
        sentiment=sentiment, # type: ignore
        entities=stock_symbols,
        created_utc=reddit_post.created_utc,
        url=reddit_post.url,
    )
    insert_posts_into_clickhouse(processed_posts)
    return


def get_processed_posts(subreddit):
    return [process_post(reddit_post) for reddit_post in fetch_new_posts(subreddit)]


if __name__ == "__main__":
    processed_posts = get_processed_posts("wallstreetbets")
