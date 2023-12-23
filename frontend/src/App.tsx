import React from "react";
import { Container, Title, Text, Paper } from "@mantine/core";
import TopWallStreetBetsTable from "./TopWallStreetBetsTable";

const App: React.FC = () => {
  return (
    <Container size="md" className="App">
      <Paper>
        <Title order={1}>Welcome to WallStreetBets.Top!</Title>
        <Text>
          WallStreetBets.Top is a cutting-edge platform that provides real-time
          insights into stock trading by analyzing the sentiment of discussions
          from the WallStreetBets community on Reddit.
        </Text>
      </Paper>

      <Title order={2}>Sample Top WallStreetBets for Today</Title>
      <TopWallStreetBetsTable />

      <Paper>
        <Title order={3}>Fetching Posts from /r/wallstreetbets</Title>
        <Text>
          We use the Reddit API to fetch posts from the /r/wallstreetbets
          subreddit.
        </Text>
      </Paper>
    </Container>
  );
};

export default App;
