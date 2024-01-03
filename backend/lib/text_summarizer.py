from transformers import pipeline

# Initialize the summarizer model
summarizer_model = pipeline("summarization", model="facebook/bart-large-cnn")


def summarize_text(content, max_length=130, min_length=30, length_penalty=2.0):
    """
    Summarizes the provided content using a pre-trained BART model.
    Parameters:
    - max_length: Maximum length of the summary
    - min_length: Minimum length of the summary
    - length_penalty: Penalty for shorter sentences in the summary
    """
    # Truncate the content to fit the model's max token limit
    max_token_limit = 4096  # Adjust based on model's token limit
    if len(content) > max_token_limit:
        content = content[:max_token_limit]

    # Check if content length is shorter than the minimum length
    if len(content) < min_length:
        return content

    summary = summarizer_model(
        content,
        max_length=max_length,
        min_length=min_length,
        length_penalty=length_penalty,
        do_sample=False,
    )
    return summary[0]["summary_text"] # type: ignore


# Example usage
if __name__ == "__main__":
    ARTICLE = """
New York (CNN)When Liana Barrientos was 23 years old, she got married in Westchester County, New York.
A year later, she got married again in Westchester County, but to a different man and without divorcing her first husband.
Only 18 days after that marriage, she got hitched yet again. Then, Barrientos declared "I do" five more times, sometimes only within two weeks of each other.
In 2010, she married once more, this time in the Bronx. In an application for a marriage license, she stated it was her "first and only" marriage.
Barrientos, now 39, is facing two criminal counts of "offering a false instrument for filing in the first degree," referring to her false statements on the
2010 marriage license application, according to court documents.
Prosecutors said the marriages were part of an immigration scam.
On Friday, she pleaded not guilty at State Supreme Court in the Bronx, according to her attorney, Christopher Wright, who declined to comment further.
After leaving court, Barrientos was arrested and charged with theft of service and criminal trespass for allegedly sneaking into the New York subway through an emergency exit, said Detective
Annette Markowski, a police spokeswoman. In total, Barrientos has been married 10 times, with nine of her marriages occurring between 1999 and 2002.
All occurred either in Westchester County, Long Island, New Jersey or the Bronx. She is believed to still be married to four men, and at one time, she was married to eight men at once, prosecutors say.
Prosecutors said the immigration scam involved some of her husbands, who filed for permanent residence status shortly after the marriages.
Any divorces happened only after such filings were approved. It was unclear whether any of the men will be prosecuted.
The case was referred to the Bronx District Attorney\'s Office by Immigration and Customs Enforcement and the Department of Homeland Security\'s
Investigation Division. Seven of the men are from so-called "red-flagged" countries, including Egypt, Turkey, Georgia, Pakistan and Mali.
Her eighth husband, Rashid Rajput, was deported in 2006 to his native Pakistan after an investigation by the Joint Terrorism Task Force.
If convicted, Barrientos faces up to four years in prison.  Her next court appearance is scheduled for May 18.
"""
    print(f"Summary: {summarize_text(ARTICLE)}")
