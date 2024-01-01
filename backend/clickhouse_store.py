# To insert the processed Reddit posts into ClickHouse
import datetime
import os
from clickhouse_driver import Client  # pip install clickhouse-driver

from dotenv import load_dotenv

load_dotenv()

hostname = os.getenv("CLICKHOUSE_HOST") or "localhost"
username = os.getenv("CLICKHOUSE_USER") or "default"
password = os.getenv("CLICKHOUSE_PASSWORD") or ""
database = os.getenv("CLICKHOUSE_DATABASE") or "default"

# Connect to ClickHouse
client = Client(host=hostname, user=username, password=password, database=database)

# Assuming a table schema like this (modify according to your actual table schema):
"""
CREATE TABLE reddit_posts (
    title String,
    content String,
    summary String,
    sentiment Float64,
    stocks Array(String),
    created_utc DateTime,
    url String
) ENGINE = MergeTree()
ORDER BY created_utc;
"""


def insert_posts_into_clickhouse(posts):
    # Prepare the data for insertion
    data_to_insert = [
        (
            post["title"],
            post["content"],
            post["summary"],
            post["sentiment"],
            post["stocks"],
            datetime.fromtimestamp(post["created_utc"]),
            post["url"],
        )
        for post in posts
    ]

    # Insert the data
    client.execute(
        "INSERT INTO reddit_posts (title, content, summary, sentiment, stocks, created_utc, url) VALUES",
        data_to_insert,
    )


def get_most_recent_date():
    result = client.execute("SELECT max(created_utc) FROM reddit_posts")
    return result[0][0]


if __name__ == "__main__":
    # Example usage
    example_post = {
        "title": "Netflix is going down",
        "content": "Netflix is going down, and I'm going down with it.",
        "summary": "Netflix is going down, and I'm going down with it.",
        "sentiment": 0.0,
        "stocks": ["NFLX"],
        "created_utc": 1360684800,
        "url": "https://www.reddit.com/r/wallstreetbets/comments/18ls2i6/netflix_is_going_down/",
    }
    insert_posts_into_clickhouse([example_post])
