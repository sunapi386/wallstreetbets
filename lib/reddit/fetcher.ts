/**
 * Reddit API client using raw OAuth2 fetch.
 * Simpler and more reliable than snoowrap for server-side use.
 */

interface RedditToken {
  accessToken: string;
  expiresAt: number;
}

let cachedToken: RedditToken | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.accessToken;
  }

  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const userAgent = process.env.REDDIT_USER_AGENT ?? "wallstreetbets-top:v2.0";

  if (!clientId || !clientSecret) {
    throw new Error("REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET are required");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": userAgent,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`Reddit auth failed: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.accessToken;
}

export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  subreddit: string;
  score: number;
  upvote_ratio: number;
  num_comments: number;
  created_utc: number;
  link_flair_text: string | null;
  url: string;
  permalink: string;
}

async function redditFetch(path: string): Promise<unknown> {
  const token = await getAccessToken();
  const userAgent = process.env.REDDIT_USER_AGENT ?? "wallstreetbets-top:v2.0";

  const response = await fetch(`https://oauth.reddit.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": userAgent,
    },
  });

  if (!response.ok) {
    throw new Error(`Reddit API error: ${response.status} on ${path}`);
  }

  return response.json();
}

function extractPosts(listing: unknown): RedditPost[] {
  const data = listing as {
    data: { children: { data: Record<string, unknown> }[] };
  };
  return data.data.children.map((child) => ({
    id: child.data.name as string,
    title: child.data.title as string,
    selftext: child.data.selftext as string,
    author: child.data.author as string,
    subreddit: child.data.subreddit as string,
    score: child.data.score as number,
    upvote_ratio: child.data.upvote_ratio as number,
    num_comments: child.data.num_comments as number,
    created_utc: child.data.created_utc as number,
    link_flair_text: (child.data.link_flair_text as string) ?? null,
    url: child.data.url as string,
    permalink: child.data.permalink as string,
  }));
}

export async function fetchNewPosts(
  subreddit = "wallstreetbets",
  limit = 100,
): Promise<RedditPost[]> {
  const listing = await redditFetch(
    `/r/${subreddit}/new?limit=${limit}&raw_json=1`,
  );
  return extractPosts(listing);
}

export async function fetchHotPosts(
  subreddit = "wallstreetbets",
  limit = 100,
): Promise<RedditPost[]> {
  const listing = await redditFetch(
    `/r/${subreddit}/hot?limit=${limit}&raw_json=1`,
  );
  return extractPosts(listing);
}

export async function fetchTopPosts(
  subreddit = "wallstreetbets",
  limit = 100,
  timeframe: "hour" | "day" | "week" = "day",
): Promise<RedditPost[]> {
  const listing = await redditFetch(
    `/r/${subreddit}/top?limit=${limit}&t=${timeframe}&raw_json=1`,
  );
  return extractPosts(listing);
}
