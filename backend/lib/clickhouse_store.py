# To insert the processed Reddit posts into ClickHouse
import os
from clickhouse_driver import Client  # pip install clickhouse-driver
from dotenv import load_dotenv

"""
CREATE USER u IDENTIFIED WITH plaintext_password BY 'pass';
CREATE DATABASE db;
GRANT ALL ON db.* TO u;
"""
"""
DROP TABLE IF EXISTS reddit_posts
"""
"""
CREATE TABLE reddit_posts (
    title String,
    content String,
    summary String,
    sentiment Float64,
    entities Array(String),
    created_utc DateTime,
    url String,
    last_updated DateTime DEFAULT now()
) ENGINE = ReplacingMergeTree(last_updated)
ORDER BY (title, content, url, created_utc);

"""


load_dotenv()

hostname = os.getenv("CLICKHOUSE_HOST")
username = os.getenv("CLICKHOUSE_USER")
password = os.getenv("CLICKHOUSE_PASSWORD")
database = os.getenv("CLICKHOUSE_DATABASE")

assert hostname, "CLICKHOUSE_HOST environment variable not set"
assert username, "CLICKHOUSE_USER environment variable not set"
assert password, "CLICKHOUSE_PASSWORD environment variable not set"
assert database, "CLICKHOUSE_DATABASE environment variable not set"

# Connect to ClickHouse
client = Client(host=hostname, user=username, password=password, database=database)


def insert_posts_into_clickhouse(posts):
    # Prepare the data for insertion
    data_to_insert = [
        (
            post["title"],
            post["content"],
            post["summary"],
            post["sentiment"],
            post["entities"],
            post["created_utc"],
            post["url"],
        )
        for post in posts
    ]

    # Insert the data
    client.execute(
        "INSERT INTO reddit_posts (title, content, summary, sentiment, entities, created_utc, url) VALUES",
        data_to_insert,
    )


def get_processed_posts():
    result = client.execute("SELECT created_utc, title, last_updated FROM reddit_posts")
    return result


if __name__ == "__main__":
    # Example usage
    example_post = {
        "title": "Netflix is going down",
        "content": "Netflix is going down, and I'm going down with it.",
        "summary": "Netflix is going down, and I'm going down with it.",
        "sentiment": 0.0,
        "entities": ["NFLX"],
        "created_utc": 1360684800,
        "url": "https://www.reddit.com/r/wallstreetbets/comments/18ls2i6/netflix_is_going_down/",
    }
    insert_posts_into_clickhouse([example_post])
    print(get_processed_posts())
