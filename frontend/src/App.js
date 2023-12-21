import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:5000/api/stocks');
      const data = await response.json();
      setStocks(data);
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>Stock Sentiment Analysis</h1>
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Mentions</th>
            <th>Sentiment</th>
            <th>News Summary</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <tr key={index}>
              <td>{stock.ticker}</td>
              <td>{stock.mentions}</td>
              <td>{stock.sentiment}</td>
              <td>{stock.news_summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

