from flask import Flask, jsonify, request
from flask_cors import CORS
import main as wsb_processor
import process_reddit_url as url_processor

app = Flask(__name__)
CORS(app)


@app.route("/api/stocks", methods=["GET"])
def get_stocks():
    # This is where you would fetch data from your database
    # Placeholder data
    stocks = [
        {
            "ticker": "AAPL",
            "mentions": 100,
            "sentiment": 0.8,
            "news_summary": "Positive Q3 results...",
        },
        # Add more stock data
    ]
    return jsonify(stocks)


@app.route("/process", methods=["POST"])
def process_request():
    data = request.json

    # Process based on the provided type in the request
    if data.get("type") == "subreddit":
        subreddit = data.get("subreddit", "wallstreetbets")
        try:
            processed_posts = wsb_processor.get_processed_posts(subreddit)
            return jsonify({"success": True, "data": processed_posts})
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    elif data.get("type") == "url":
        url = data.get("url")
        if url:
            try:
                processed_post = url_processor.process_reddit_post(url)
                return jsonify({"success": True, "data": processed_post})
            except Exception as e:
                return jsonify({"success": False, "error": str(e)}), 500
        else:
            return jsonify({"success": False, "error": "URL not provided"}), 400

    else:
        return jsonify({"success": False, "error": "Invalid request type"}), 400


if __name__ == "__main__":
    app.run(debug=True)
