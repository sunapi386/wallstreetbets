import { fetchHotPosts, type RedditPost } from "@/lib/reddit/fetcher";
import { analyzePosts } from "@/lib/llm/analyzer";
import { insertPost, getExistingPostIds } from "@/lib/db/clickhouse";
import { insertPost as insertWeaviatePost } from "@/lib/db/weaviate";
import type { ProcessedPost } from "@/lib/types";

export interface PipelineResult {
  fetched: number;
  newPosts: number;
  processed: number;
  errors: number;
}

export async function runPipeline(
  subreddit = "wallstreetbets",
  limit = 50,
): Promise<PipelineResult> {
  console.log(`[Pipeline] Fetching ${limit} posts from r/${subreddit}...`);

  // 1. Fetch posts from Reddit
  const posts = await fetchHotPosts(subreddit, limit);
  console.log(`[Pipeline] Fetched ${posts.length} posts`);

  // 2. Dedup against ClickHouse
  const existingIds = await getExistingPostIds(posts.map((p) => p.id));
  const newPosts = posts.filter((p) => !existingIds.has(p.id));
  console.log(
    `[Pipeline] ${newPosts.length} new posts (${existingIds.size} already processed)`,
  );

  if (newPosts.length === 0) {
    return { fetched: posts.length, newPosts: 0, processed: 0, errors: 0 };
  }

  // 3. Filter to posts worth analyzing (skip very short posts, image-only posts)
  const worthAnalyzing = newPosts.filter(
    (p) => p.selftext && p.selftext.length > 100,
  );
  console.log(
    `[Pipeline] ${worthAnalyzing.length} posts worth analyzing (have text content)`,
  );

  // 4. Analyze with Claude
  const analyses = await analyzePosts(worthAnalyzing);
  console.log(`[Pipeline] Analyzed ${analyses.size} posts`);

  // 5. Store in both databases
  let processed = 0;
  let errors = 0;

  for (const post of worthAnalyzing) {
    const analysis = analyses.get(post.id);
    if (!analysis) {
      errors++;
      continue;
    }

    const processedPost: ProcessedPost = {
      id: post.id,
      subreddit: post.subreddit,
      title: post.title,
      content: post.selftext,
      author: post.author,
      summary: analysis.summary,
      sentiment: analysis.sentiment,
      sentimentScore: analysis.sentimentScore,
      tickers: analysis.tickers,
      ddQualityScore: analysis.ddQualityScore,
      flair: post.link_flair_text ?? "",
      upvotes: post.score,
      numComments: post.num_comments,
      upvoteRatio: post.upvote_ratio,
      createdUtc: new Date(post.created_utc * 1000),
      url: `https://reddit.com${post.permalink}`,
    };

    try {
      await insertPost(processedPost);

      // Also insert into Weaviate if configured
      if (process.env.WEAVIATE_URL) {
        try {
          await insertWeaviatePost(processedPost);
        } catch (err) {
          console.error(`[Pipeline] Weaviate insert failed for ${post.id}:`, err);
        }
      }

      processed++;
    } catch (err) {
      console.error(`[Pipeline] Failed to store post ${post.id}:`, err);
      errors++;
    }
  }

  // Also store posts without text content (but with minimal analysis)
  for (const post of newPosts) {
    if (post.selftext && post.selftext.length > 100) continue; // Already processed above
    const shortPost: ProcessedPost = {
      id: post.id,
      subreddit: post.subreddit,
      title: post.title,
      content: post.selftext ?? "",
      author: post.author,
      summary: post.title,
      sentiment: "neutral",
      sentimentScore: 0,
      tickers: [],
      ddQualityScore: 1,
      flair: post.link_flair_text ?? "",
      upvotes: post.score,
      numComments: post.num_comments,
      upvoteRatio: post.upvote_ratio,
      createdUtc: new Date(post.created_utc * 1000),
      url: `https://reddit.com${post.permalink}`,
    };

    try {
      await insertPost(shortPost);
      processed++;
    } catch (err) {
      console.error(`[Pipeline] Failed to store short post ${post.id}:`, err);
      errors++;
    }
  }

  console.log(
    `[Pipeline] Done: ${processed} processed, ${errors} errors`,
  );

  return {
    fetched: posts.length,
    newPosts: newPosts.length,
    processed,
    errors,
  };
}
