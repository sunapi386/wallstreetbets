import os
import weaviate  # pip install weaviate-client
from dotenv import load_dotenv

load_dotenv()

hostname = os.getenv("WEAVIATE_HOST")
assert hostname, "WEAVIATE_HOST environment variable not set"


def create_schema(client):
    schema = {
        "classes": [
            {
                "class": "RedditPost",
                "description": "A post from Reddit",
                "properties": [
                    {
                        "name": "title",
                        "dataType": ["string"],
                        "description": "The title of the post",
                    },
                    {
                        "name": "content",
                        "dataType": ["string"],
                        "description": "The content of the post",
                    },
                    {
                        "name": "summary",
                        "dataType": ["string"],
                        "description": "A summary of the post",
                    },
                    {
                        "name": "sentiment",
                        "dataType": ["number"],
                        "description": "The sentiment score of the post",
                    },
                    {
                        "name": "stocks",
                        "dataType": ["string[]"],
                        "description": "List of stock symbols mentioned in the post",
                    },
                    {
                        "name": "created_utc",
                        "dataType": ["date"],
                        "description": "The creation time of the post",
                    },
                    {
                        "name": "url",
                        "dataType": ["string"],
                        "description": "The URL of the post",
                    },
                ],
            }
        ]
    }

    existing_classes = client.schema.get()["classes"]
    class_names = [cls["class"] for cls in existing_classes]

    if "RedditPost" not in class_names:
        client.schema.create(schema)
        print("Schema created.")
    else:
        print("Schema already exists.")


def insert_posts_into_weaviate(client, posts):
    for post in posts:
        post_data = {
            "title": post["title"],
            "content": post["content"],
            "summary": post["summary"],
            "sentiment": post["sentiment"],
            "stocks": post["stocks"],
            "created_utc": post["created_utc"],
            "url": post["url"],
        }
        client.data_object.create(data_object=post_data, class_name="RedditPost")


def get_posts(client):
    posts = client.data_object.get(class_name="RedditPost", limit=100)
    return posts


if __name__ == "__main__":
    client = weaviate.Client(hostname)
    create_schema(client)

    posts = [
        {
            "title": "I love $GME",
            "content": "I love $GME",
            "summary": "I love $GME",
            "sentiment": 0.9,
            "stocks": ["GME"],
            "created_utc": "2021-01-01T00:00:00Z",
            "url": "https://reddit.com/r/wallstreetbets/1",
        },
        {
            "title": "I love $AMC",
            "content": "I love $AMC",
            "summary": "I love $AMC",
            "sentiment": 0.9,
            "stocks": ["AMC"],
            "created_utc": "2021-01-01T00:00:00Z",
            "url": "https://reddit.com/r/wallstreetbets/2",
        },
    ]
    insert_posts_into_weaviate(client, posts)
    print("Inserted posts into Weaviate.")

    posts = get_posts(client)
    print(posts)
