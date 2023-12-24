import weaviate  # pip install weaviate-client


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
                        "dataType": ["dateTime"],
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


# Initialize Weaviate client
client = weaviate.Client(
    "http://localhost:8080"
)  # Replace with your Weaviate instance URL

# Create schema (runs if it doesn't exist yet)
create_schema(client)
