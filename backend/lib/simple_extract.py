import re
import csv

# Sample data
data = [
    "MARA, COIN, RIOT 2024 A lot of people on WSB have made insane gains from BTC proxies. Where do you think prices will be in Jan 2024?\n\nA. BTC proxies will moon\n\nB. BTC proxies will get decimated\n\nC. BTC proxies will move minimally from current levels",
    "Merry Christmas, ya filthy animals. See you Tuesday ",
    "I won! Time to delete Robinhood or lose it all over again?",
    "$180k SOFI YOLO Was assigned 180 CSPs at the $10 Strike. Premium collected was $0.30/contract. So cost basis will be $9.70. This should be your sign to take a short position on SOFI.\n\nI thought 2024 would be different.... merry Christmas.\n\nSave me queen Cathie. Save me king Noto.\n\n&#x200B;\n\nhttps://preview.redd.it/a2hw7gkp128c1.png?width=632&format=png&auto=webp&s=978fd3840a004b329e2259d6e351b8f3017e9d74\n\nhttps://preview.redd.it/dlje3738028c1.png?width=2586&format=png&auto=webp&s=78d72c0e2c43225d73d9714c9b4e3c0e21f4072a",
    "How do you know which stock would be how much on what date? I have done this for 12 years -- there is absolutely no way we can know it! ",
    "Anyone think BOWL has potential to run? It’s heavily shorted (83%) which is understandable due to its seemingly dying business. Although they are making moves to raise capital and expand their footprint, which could benefit with possible rate cuts coming. It was mentioned in a more highly regarded sub as a squeeze which makes me want to buy puts but even a broken clock is right twice a day. No positions yet, thoughts?",
    "What can happen with $MARA? $BTC looking good and if we take a look at the numbers of $MARA... What do you people think?\n\nShare Statistics\n\nAvg Vol (3 month) 3\t45.68M\n\nAvg Vol (10 day) 3\t76.47M\n\nShares Outstanding 5\t222.62M\nImplied Shares Outstanding 6\t222.62M\nFloat 8\t221.55M\n\n% Held by Insiders 1\t2.67%\n% Held by Institutions 1\t38.22%\n\nShares Short (Nov 29, 2023) 4\t50.03M\n\nShort Ratio (Nov 29, 2023) 4\t1.19\n\nShort % of Float (Nov 29, 2023) 4\t22.57%\n\nShort % of Shares Outstanding (Nov 29, 2023) 4\t22.47%\n\nShares Short (prior month Oct 30, 2023) 4\t53.04M",
    "Why do investing subs don’t have live daily threads? In the old days, you could sort any thread by live comment. Those were good days, I used to have the daily thread open all day and I could always find market moving news in seconds (along with good jokes) because people would comment on it immediately.\n\n\n\n\nBut then Reddit decided to remove live sorting, and over some time I stopped entering this sub cause who the duck refreshes all day to get comments\n\n\n\n\nBut now I’ve seen that there are “community chats” or something like that, I’ve seen it on other subs but not on any of the investing ones.\n\n\n\nAny specific reason? It’d be better if the daily thread is like that",
    "I can afford presents for the missus I made a little bit of money this year. Slow and steady.",
    "Why Microsoft's gross margins are expanding (up 1.89% QoQ).  At this stage, Microsoft is essentially an AI copilot factory, as Satya explained in the conference call:\n\n\"We're using this AI inflection point to redefine our role in business applications. We are becoming the Copilot-led business process transformation layer on top of existing CRM systems like Salesforce.\"\n\nIt is a unified server that dishes out business applications to billions of people worldwide. As folks use these apps, they generate data, which can then be used to train AIs that automate work.\n\nWhat' was interesting is we saw margins expand this quarter (Q1 FY2024).\n\nMicrosoft’s gross margin came in at 71.16% in Q1 FY2024, up from 69.84% last quarter–a high since 2014.\n\nIn turn, operating margin came in at 47.59%, up from 41.08% last quarter \\[1\\].\n\nIt turns out this was mostly due to a novel architecture that Microsoft has deployed, to obtain maximum leverage per AI model.\n\nAccording to management, increases in gross margin are due primarily to ‘improvements’ in the cloud and Office 365 businesses. Satya clarifies these improvements during the Q&A:\n\n\"But the thing is, we have scale leverage of one large model that was trained and one large model that's being used for inference across all our first-party SaaS apps, as well as our API in our Azure AI service…\n\nThe lesson learned from the cloud side is–we're not running a conglomerate of different businesses, it's all one tech stack up and down Microsoft's portfolio, and that, I think, is going to be very important because that discipline, given what it will look like for this AI transition, any business that's not disciplined about their capital spend accruing across all their businesses could run into trouble.\"\n\nOver time, this architecture will enable Microsoft to maximize the number of users engaged with copilots daily, while minimizing computing expenses. This should ultimately equate to a higher earning power.\n\nI wonder whether other cloud players are doing the same?",
]


# Function to extract stock symbol and summary
def extract_info(line):
    # Extract stock symbol
    stock_symbol = re.findall(r"\b[A-Z]{2,5}\b", line)
    stock_symbol = ", ".join(stock_symbol)

    # Extract a summary (first sentence)
    summary = line.split(".")[0]

    # Assign an arbitrary sentiment score for demonstration
    sentiment_score = 0.0  # Replace this with a real sentiment analysis result

    return stock_symbol, summary, sentiment_score


# Process each line and store the results
results = [extract_info(line) for line in data]

# Write to a CSV file
with open("output.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["Stock Symbol", "Summary", "Sentiment Score"])
    for result in results:
        writer.writerow(result)

print("CSV file created successfully.")
