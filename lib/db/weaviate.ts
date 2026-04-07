import weaviate, { type WeaviateClient } from "weaviate-client";

let clientInstance: WeaviateClient | null = null;

export async function getWeaviateClient(): Promise<WeaviateClient> {
  if (!clientInstance) {
    const url = process.env.WEAVIATE_URL;
    const apiKey = process.env.WEAVIATE_API_KEY;
    if (!url) throw new Error("WEAVIATE_URL is required");

    if (apiKey) {
      clientInstance = await weaviate.connectToWeaviateCloud(url, {
        authCredentials: new weaviate.ApiKey(apiKey),
      });
    } else {
      clientInstance = await weaviate.connectToLocal();
    }
  }
  return clientInstance;
}

const COLLECTION_NAME = "RedditPost";

export async function initSchema() {
  const client = await getWeaviateClient();
  const exists = await client.collections.exists(COLLECTION_NAME);
  if (!exists) {
    await client.collections.create({
      name: COLLECTION_NAME,
      properties: [
        { name: "postId", dataType: "text" },
        { name: "title", dataType: "text" },
        { name: "content", dataType: "text" },
        { name: "summary", dataType: "text" },
        { name: "tickers", dataType: "text[]" },
        { name: "sentiment", dataType: "text" },
        { name: "ddQualityScore", dataType: "number" },
        { name: "createdUtc", dataType: "date" },
        { name: "url", dataType: "text" },
        { name: "author", dataType: "text" },
      ],
    });
  }
}

export async function insertPost(post: {
  id: string;
  title: string;
  content: string;
  summary: string;
  tickers: string[];
  sentiment: string;
  ddQualityScore: number;
  createdUtc: Date;
  url: string;
  author: string;
}) {
  const client = await getWeaviateClient();
  const collection = client.collections.get(COLLECTION_NAME);
  await collection.data.insert({
    properties: {
      postId: post.id,
      title: post.title,
      content: post.content,
      summary: post.summary,
      tickers: post.tickers,
      sentiment: post.sentiment,
      ddQualityScore: post.ddQualityScore,
      createdUtc: post.createdUtc.toISOString(),
      url: post.url,
      author: post.author,
    },
  });
}

export async function semanticSearch(
  query: string,
  limit = 10,
): Promise<
  {
    postId: string;
    title: string;
    summary: string;
    tickers: string[];
    sentiment: string;
    ddQualityScore: number;
    url: string;
    author: string;
    score: number;
  }[]
> {
  const client = await getWeaviateClient();
  const collection = client.collections.get(COLLECTION_NAME);
  const result = await collection.query.nearText(query, {
    limit,
    returnProperties: [
      "postId",
      "title",
      "summary",
      "tickers",
      "sentiment",
      "ddQualityScore",
      "url",
      "author",
    ],
  });

  return result.objects.map((obj) => ({
    postId: obj.properties.postId as string,
    title: obj.properties.title as string,
    summary: obj.properties.summary as string,
    tickers: obj.properties.tickers as string[],
    sentiment: obj.properties.sentiment as string,
    ddQualityScore: obj.properties.ddQualityScore as number,
    url: obj.properties.url as string,
    author: obj.properties.author as string,
    score: obj.metadata?.distance ?? 0,
  }));
}
