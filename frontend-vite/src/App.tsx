import React from "react";
import { MantineProvider, Container, Title, Text, Paper } from "@mantine/core";
import TopWallStreetBetsTable from "./TopWallStreetBetsTable";
import FileEmbeddingCount from "./FileEmbeddingCount";
import EmbeddingSearch from "./EmbeddingSearch";

const App: React.FC = () => {
  return (
    <MantineProvider>
      <Container size="md" className="App">
        {/* <Paper> */}
        {/* <div className="icon"></div>
          <Title order={1}>Welcome to WallStreetBets.Top!</Title>
          <Text>
            WallStreetBets.Top is a cutting-edge platform that provides
            real-time insights into stock trading by analyzing the sentiment of
            discussions from the WallStreetBets community on Reddit.
          </Text>

          <Title order={2}>Sample Top WallStreetBets for Today</Title>
          <TopWallStreetBetsTable /> */}

        <FileEmbeddingCount />
        <EmbeddingSearch />

        {/* <Paper>
            <Title order={3}>Fetching Posts from /r/wallstreetbets</Title>
            <Text>
              We use the Reddit API to fetch posts from the /r/wallstreetbets
              subreddit.
            </Text>
          </Paper> */}

        {/* Repeat for other sections */}
        {/* </Paper> */}
      </Container>
    </MantineProvider>
  );
};

export default App;
