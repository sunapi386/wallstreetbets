"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  postId: string;
  title: string;
  summary: string;
  tickers: string[];
  sentiment: string;
  ddQualityScore: number;
  url: string;
  author: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&limit=20`,
      );
      if (res.ok) {
        setResults(await res.json());
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  const sentimentStyles: Record<string, string> = {
    bullish: "bg-green-100 text-green-800",
    bearish: "bg-red-100 text-red-800",
    neutral: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 items-center gap-2 border-b px-6">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <h2 className="text-lg font-semibold">Search DDs</h2>
      </header>
      <main className="flex-1 p-6">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mb-6">
          <Input
            placeholder="Search for topics, tickers, or themes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>

        {searched && results.length === 0 && !loading && (
          <p className="text-muted-foreground">
            No results found. Try a different search term.
          </p>
        )}

        <div className="space-y-4 max-w-4xl">
          {results.map((result) => (
            <Card key={result.postId}>
              <CardContent className="pt-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {result.tickers.map((ticker) => (
                    <Badge key={ticker} variant="secondary" className="font-mono text-xs">
                      {ticker}
                    </Badge>
                  ))}
                  <Badge
                    variant="outline"
                    className={`text-xs ${sentimentStyles[result.sentiment] ?? ""}`}
                  >
                    {result.sentiment}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Quality: {result.ddQualityScore.toFixed(1)}/5
                  </span>
                </div>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  {result.title}
                </a>
                <p className="mt-1 text-sm text-muted-foreground">
                  {result.summary}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  by u/{result.author}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
