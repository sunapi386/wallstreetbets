import { ArrowUp, MessageSquare, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProcessedPost } from "@/lib/types";

function timeAgo(date: Date): string {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000,
  );
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const sentimentStyles = {
  bullish: "bg-green-100 text-green-800",
  bearish: "bg-red-100 text-red-800",
  neutral: "bg-gray-100 text-gray-800",
};

export function TrendingDDs({ posts }: { posts: ProcessedPost[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Trending High-Quality DDs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    {post.tickers.map((ticker) => (
                      <Badge key={ticker} variant="secondary" className="font-mono text-xs">
                        {ticker}
                      </Badge>
                    ))}
                    <Badge
                      variant="outline"
                      className={`text-xs ${sentimentStyles[post.sentiment]}`}
                    >
                      {post.sentiment}
                    </Badge>
                  </div>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium leading-snug hover:underline"
                  >
                    {post.title}
                  </a>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {post.summary}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>u/{post.author}</span>
                    <span className="flex items-center gap-1">
                      <ArrowUp className="h-3 w-3" />
                      {post.upvotes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {post.numComments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {post.ddQualityScore.toFixed(1)}
                    </span>
                    <span>{timeAgo(post.createdUtc)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
