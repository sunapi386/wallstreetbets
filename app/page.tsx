import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { MarketOverview } from "@/components/market-overview";
import { WatchlistCard } from "@/components/watchlist-card";
import { SentimentChart } from "@/components/sentiment-chart";
import { DDQualityChart } from "@/components/dd-quality-chart";
import { TrendingDDs } from "@/components/trending-dds";
import {
  getDashboardTrendingPosts,
  getDashboardSentiment,
  getDashboardDDQuality,
  getDashboardMarketIndices,
  getDashboardWatchlist,
} from "@/lib/data";

export const revalidate = 60;

export default async function DashboardPage() {
  const [posts, sentiment, ddQuality, indices, watchlist] = await Promise.all([
    getDashboardTrendingPosts(),
    getDashboardSentiment(),
    getDashboardDDQuality(),
    getDashboardMarketIndices(),
    getDashboardWatchlist(),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 items-center gap-2 border-b px-6">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </header>
      <main className="flex-1 space-y-6 p-6">
        <MarketOverview indices={indices} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <WatchlistCard items={watchlist} />
            <SentimentChart data={sentiment} />
            <DDQualityChart data={ddQuality} />
          </div>
          <div className="lg:col-span-2">
            <TrendingDDs posts={posts} />
          </div>
        </div>
      </main>
    </div>
  );
}
