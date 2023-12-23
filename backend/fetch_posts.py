# PRAW (Python Reddit API Wrapper) library to fetch posts `pip install praw`
# Reddit's developer portal to get your client_id, client_secret, and user_agent.

import os
import time
import praw
from dotenv import load_dotenv

load_dotenv()


def fetch_posts(subreddit):
    client_id = os.getenv("REDDIT_API_ID")
    client_secret = os.getenv("REDDIT_API_SECRET")
    user_agent = "script:wallstreetbets_top:v1.0"

    reddit = praw.Reddit(
        client_id=client_id, client_secret=client_secret, user_agent=user_agent
    )

    posts = []
    for post in reddit.subreddit(subreddit).new(limit=10):  # Adjust the limit as needed
        if post.created_utc > time.time() - 86400:  # Last 24 hours
            posts.append(post.title + " " + post.selftext)  # Combining title and body

    return posts


if __name__ == "__main__":
    print(fetch_posts("wallstreetbets"))
