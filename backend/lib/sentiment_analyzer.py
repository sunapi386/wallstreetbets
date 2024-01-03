from transformers import pipeline, AutoTokenizer

# Initialize the sentiment analysis model and tokenizer
sentiment_analyzer = pipeline("sentiment-analysis")
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

def analyze_sentiment(content):
    """
    Analyze the sentiment of the provided content.
    Returns a sentiment score between -1 and 1, where -1 is very negative and 1 is very positive.
    """
    # Truncate the content to fit the model's max token limit
    max_token_limit = tokenizer.model_max_length
    tokens = tokenizer(content, truncation=True, max_length=max_token_limit, return_tensors="pt")

    # Perform sentiment analysis
    result = sentiment_analyzer(tokens)

    # Convert result to a score between -1 and 1
    score = result[0]["score"] # type: ignore
    if result[0]["label"] == "NEGATIVE": # type: ignore
        score = -score
    return score


# Example usage
if __name__ == "__main__":
    sample_text = "I love using transformers. They make text processing easy!"
    print(f"Sample text: {sample_text}")
    print(f"Sentiment score: {analyze_sentiment(sample_text)}")
