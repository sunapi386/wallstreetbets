# PRAW (Python Reddit API Wrapper) library to fetch posts `pip install praw`
# Reddit's developer portal to get your client_id, client_secret, and user_agent.

import praw

def fetch_posts(subreddit, client_id, client_secret, user_agent):
    reddit = praw.Reddit(client_id=client_id, 
                         client_secret=client_secret, 
                         user_agent=user_agent)

    posts = []
    for post in reddit.subreddit(subreddit).new(limit=1000):  # Adjust the limit as needed
        if post.created_utc > time.time() - 86400:  # Last 24 hours
            posts.append(post.title + ' ' + post.selftext)  # Combining title and body

    return posts

