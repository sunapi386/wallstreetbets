// src/TopWallStreetBetsTable.tsx
import React, { useState, useEffect } from "react";
import { StockData } from "./StockData";
import { Table } from "@mantine/core";

const fakeData: StockData[] = [
  {
    ticker: "GME",
    mentions: 100,
    sentiment: 0.5,
    newsSummary: "GameStop is a video game retailer.",
  },
  {
    ticker: "AMC",
    mentions: 50,
    sentiment: 0.2,
    newsSummary: "AMC is a movie theater chain.",
  },
  {
    ticker: "TSLA",
    mentions: 10,
    sentiment: 0.1,
    newsSummary: "Tesla is an electric vehicle company.",
  },
];

const TopWallStreetBetsTable: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);

  useEffect(() => {
    setStocks(fakeData);

    async function fetchData() {
      const response = await fetch("http://localhost:5000/api/stocks");
      const data = await response.json();
      setStocks(data);
    }

    try {
      fetchData();
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th>Ticker</th>
          <th>Mentions</th>
          <th>Sentiment Score</th>
          <th>Daily News Summary</th>
        </tr>
      </thead>

      <tbody>
        {stocks.map((stock, index) => (
          <tr key={index}>
            <td>{stock.ticker}</td>
            <td>{stock.mentions}</td>
            <td>{stock.sentiment.toFixed(2)}</td>
            <td>{stock.newsSummary}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TopWallStreetBetsTable;
