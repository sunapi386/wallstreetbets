from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/stocks', methods=['GET'])
def get_stocks():
    # This is where you would fetch data from your database
    # Placeholder data
    stocks = [
        {"ticker": "AAPL", "mentions": 100, "sentiment": 0.8, "news_summary": "Positive Q3 results..."},
        # Add more stock data
    ]
    return jsonify(stocks)

if __name__ == '__main__':
    app.run(debug=True)
