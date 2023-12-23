import "./App.css";
import icon from "/wallstreetbetstop.png";
import TopWallStreetBetsTable from "./TopWallStreetBetsTable";

function App() {
  return (
    <div className="App">
      <div className="icon" style={{ backgroundImage: `url(${icon})` }}></div>

      <h1>Stock Sentiment Analysis</h1>
      <TopWallStreetBetsTable />
    </div>
  );
}

export default App;
