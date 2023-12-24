# To insert the processed Reddit posts into ClickHouse
import datetime
from clickhouse_driver import Client  # pip install clickhouse-driver


# Connect to ClickHouse
client = Client(host="localhost")

# Assuming a table schema like this (modify according to your actual table schema):
# CREATE TABLE reddit_posts (
#     title String,
#     content String,
#     summary String,
#     sentiment Float64,
#     stocks Array(String),
#     created_utc DateTime,
#     url String
# ) ENGINE = MergeTree()
# ORDER BY created_utc;


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
