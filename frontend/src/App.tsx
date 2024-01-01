import React from "react";
import { Container, Title, Text, Paper } from "@mantine/core";
import TopWallStreetBetsTable from "./TopWallStreetBetsTable";

const App: React.FC = () => {
  return (
    <Container size="md" className="App">
      <Paper shadow="sm">
        <Title order={1}>Welcome to WallStreetBets.Top!</Title>
        <Text>WallStreetBets.Top is a cutting-edge platform...</Text>
      </Paper>

      <Title order={2} my="lg">
        Sample Top WallStreetBets for Today
      </Title>
      <TopWallStreetBetsTable />

      <Paper shadow="sm">
        <Title order={3}>Fetching Posts from /r/wallstreetbets</Title>
        <Text>We use the Reddit API to fetch posts...</Text>
      </Paper>
    </Container>
  );
};

export default App;
