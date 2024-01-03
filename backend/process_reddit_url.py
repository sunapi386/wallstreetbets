import praw
import os
from dotenv import load_dotenv
from urllib.parse import urlparse

# Assuming these modules are in the same directory
from backend.lib.sentiment_analyzer import analyze_sentiment
from backend.lib.stock_extractor import extract_stock_symbols
from backend.lib.text_summarizer import summarize_text

load_dotenv()


def is_valid_reddit_url(url):
    """
    Check if the given URL is a valid Reddit post URL.
    """
    parsed_url = urlparse(url)
    return parsed_url.netloc == "www.reddit.com" and parsed_url.path.startswith("/r/")


def create_reddit_instance():
    client_id = os.getenv("REDDIT_API_ID")
    client_secret = os.getenv("REDDIT_API_SECRET")
    user_agent = "script:reddit_url_processor:v1.0"
    return praw.Reddit(
        client_id=client_id, client_secret=client_secret, user_agent=user_agent
    )


def process_reddit_post(url):
    if not is_valid_reddit_url(url):
        raise ValueError("Invalid Reddit URL")

    reddit = create_reddit_instance()
    submission = reddit.submission(url=url)

    content = submission.title + " " + submission.selftext
    summary = summarize_text(content)
    sentiment = analyze_sentiment(content)
    stock_symbols = extract_stock_symbols(content)

    return {
        "title": submission.title,
        "content": submission.selftext,
        "summary": summary,
        "sentiment": sentiment,
        "stocks": stock_symbols,
        "created_utc": submission.created_utc,
        "url": url,
    }


# Example usage
if __name__ == "__main__":
    example_url = "https://www.reddit.com/r/wallstreetbets/comments/18ls2i6/netflix_is_going_down/"
    try:
        processed_post = process_reddit_post(example_url)
        print(processed_post)
    except ValueError as e:
        print(e)

# Example output:
# {
#     "title": "Netflix Is Going Down",
#     "content": "These boneheads reported nearly 100 billion hours watched over a six month period and disclosed all the shows by views last week like a bunch of idiots.\n\n99% of that related to 60 shows all released in 2023 except for a couple WSB favorites like Cocomelon Season 1.\n\nBasically the rest of the 18,000 titles are worthless from a stock perspective. No offense to those that enjoyed Waterworld or The Mask of Zorro. Those are absolute bangers. \n\nNetflix drops about $17 billion a year on content to keep up this pace and since nobody watches the shit from last year they gotta keep spending for the next 60.\n\nThis gives them about $8B in FCF annually  which is about $2B short of what they owe in debt less cash last quarter of $10B.\n\nSo they need about 61M net new subs to close that gap. \n\nNow they claim 100M people were non paid subs they kicked off during the password crackdown and they would get most of those back. Only 9M came back last quarter which is problem number 1.\n\nProblem number 2 is they need to continue to raise prices without losing subs.\n\nProblem number 3 is the churn of the content itself every year at an enormous cost and hitting 60 home run titles a year.\n\nEven with unlimited resources that model is going to crack soon at this ridiculous valuation. \n\nNetflix usually does the opposite of what I think so they will probably hit record growth next report and announce a partnership with GTA 6 and Taylor Swift.",
#     "summary": "Netflix reported nearly 100 billion hours watched over a six month period. 99% of that related to 60 shows all released in 2023 except for a couple WSB favorites like Cocomelon Season 1.",
#     "sentiment": -0.9993334412574768,
#     "stocks": ["WSB", "GTA 6", "Netflix", "Taylor Swift"],
#     "created_utc": 1702956699.0,
#     "url": "https://www.reddit.com/r/wallstreetbets/comments/18ls2i6/netflix_is_going_down/",
# }
