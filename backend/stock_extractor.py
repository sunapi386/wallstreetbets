from transformers import pipeline

# Initialize the NER model
ner_model = pipeline(
    "ner",
    model="dbmdz/bert-large-cased-finetuned-conll03-english",
    aggregation_strategy="simple",
)


def extract_stock_symbols(content):
    """
    Extract potential stock symbols or company names from the content.
    Returns a list of unique entities that might be stock symbols.
    """
    ner_results = ner_model(content)
    potential_symbols = [
        entity["word"] for entity in ner_results if entity["entity_group"] == "ORG"
    ]
    return list(set(potential_symbols))  # Return unique symbols


# Example usage
if __name__ == "__main__":
    sample_text = "Apple Inc. (AAPL) and Microsoft (MSFT) are leading the tech industry, but also worth looking into Amazon."
    print(f"Extracted symbols: {extract_stock_symbols(sample_text)}")
