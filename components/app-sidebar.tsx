"use client";

import {
  BarChart3,
  Eye,
  Bell,
  TrendingUp,
  LayoutDashboard,
  Search,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Stock Screener", url: "/screener", icon: Search },
  { title: "Portfolio", url: "/portfolio", icon: Briefcase },
  { title: "Watchlist", url: "/watchlist", icon: Eye },
  { title: "My Alerts", url: "/alerts", icon: Bell },
  { title: "Trending DDs", url: "/trending", icon: TrendingUp },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-green-500" />
          <div>
            <h1 className="text-lg font-bold leading-tight">WSB</h1>
            <p className="text-xs text-muted-foreground">
              AI Investment Intelligence
            </p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={pathname === item.url}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
