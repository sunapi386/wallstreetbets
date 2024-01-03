# This file will only handle fetching posts from Reddit
import os
import praw
from dotenv import load_dotenv

load_dotenv()


def create_reddit_instance():
    client_id = os.getenv("REDDIT_API_ID")
    client_secret = os.getenv("REDDIT_API_SECRET")
    user_agent = "script:wallstreetbets_top:v1.0"
    return praw.Reddit(
        client_id=client_id, client_secret=client_secret, user_agent=user_agent
    )


def fetch_new_posts(subreddit, limit=10):
    reddit = create_reddit_instance()
    return list(reddit.subreddit(subreddit).new(limit=limit))
