from transformers import pipeline

# Initialize the sentiment analysis model
sentiment_analyzer = pipeline("sentiment-analysis")


def analyze_sentiment(content):
    """
    Analyze the sentiment of the provided content.
    Returns a sentiment score between -1 and 1, where -1 is very negative and 1 is very positive.
    """
    result = sentiment_analyzer(content)
    # Convert result to a score between -1 and 1
    # Assuming the model returns 'LABEL_0' for negative and 'LABEL_1' for positive sentiment
    score = result[0]["score"]
    if result[0]["label"] == "NEGATIVE":
        score = -score
    return score


# Example usage
if __name__ == "__main__":
    sample_text = "I love using transformers. They make text processing easy!"
    print(f"Sample text: {sample_text}")
    print(f"Sentiment score: {analyze_sentiment(sample_text)}")
