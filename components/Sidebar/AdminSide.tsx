"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Store,
  UsersRound,
  TrendingUp,
  Package,
  ShoppingCart,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

type SideMenu = {
  title: string;
  link: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badgeKey?: string;
};

type BadgeCounts = {
  orders: number;
  requests: number;
  tickets: number;
  customers: number;
  exchangeRequests: number;
};

export default function AdminSide() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fetch badge counts
  const { data: badgeCounts } = useQuery<BadgeCounts>({
    queryKey: ["adminBadgeCounts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/badge-counts");
      if (!res.ok) throw new Error("Failed to fetch badge counts");
      return res.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Emit collapse state to parent layout
  useEffect(() => {
    const event = new CustomEvent("sidebarToggle", { detail: { isCollapsed } });
    window.dispatchEvent(event);
  }, [isCollapsed]);

  const sideMenu: SideMenu[] = [
    { title: "Dashboard", link: "/admin", icon: LayoutDashboard },
    {
      title: "Product & Services",
      link: "/admin/product-services",
      icon: Package,
    },
    {
      title: "Orders & Request",
      link: "/admin/orders-request",
      icon: ShoppingCart,
      badgeKey: "orders",
    },
    {
      title: "Currency Exchange",
      link: "/admin/exchange-transactions",
      icon: ArrowRightLeft,
      badgeKey: "exchangeRequests",
    },
    { title: "Customers", link: "/admin/customers", icon: UsersRound },
    {
      title: "Support & Tickets",
      link: "/admin/support-tickets",
      icon: MessageSquare,
      badgeKey: "tickets",
    },
    { title: "Analytics", link: "/admin/analytics", icon: TrendingUp },
    { title: "Settings", link: "/admin/settings", icon: Settings },
  ];

  const getBadgeCount = (badgeKey?: string): number | undefined => {
    if (!badgeKey || !badgeCounts) return undefined;
    return badgeCounts[badgeKey as keyof BadgeCounts] || 0;
  };

  const isActive = (link: string) => {
    if (link === "/admin") return pathname === link;
    return pathname.startsWith(link);
  };

  return (
    <aside
      className={`relative bg-white h-full transition-all duration-300 ${isCollapsed ? "w-20" : "w-72"}`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:shadow-lg transition-all z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* Logo Area */}
      <div
        className={`p-6 border-b border-gray-100 ${isCollapsed ? "px-4" : ""}`}
      >
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2"}`}
        >
          <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">FT</span>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-gray-800">Admin Panel</h2>
              <p className="text-xs text-gray-500">Manage your store</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {sideMenu.map((item) => {
            const active = isActive(item.link);
            const Icon = item.icon;
            const badgeCount = getBadgeCount(item.badgeKey);

            return (
              <Link
                key={item.title}
                href={item.link}
                className={`
                  flex items-center ${isCollapsed ? "justify-center" : "justify-between"} 
                  px-3 py-2.5 rounded-lg transition-all duration-200
                  ${
                    active
                      ? "bg-linear-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
                title={isCollapsed ? item.title : undefined}
              >
                <div
                  className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}
                >
                  <Icon
                    className={`w-5 h-5 ${active ? "text-blue-600" : "text-gray-400"}`}
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.title}</span>
                  )}
                </div>
                {!isCollapsed && badgeCount !== undefined && badgeCount > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${active ? "bg-blue-200 text-blue-800" : "bg-red-100 text-red-600"}`}
                  >
                    {badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100">
        <Link href="/shop">
          <Button
            className={`w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg py-5 font-medium cursor-pointer ${isCollapsed ? "px-2" : ""}`}
          >
            <Store
              className={`w-4 h-4 ${!isCollapsed && "mr-2"} group-hover:scale-110 transition-transform`}
            />
            {!isCollapsed && "Back to Store"}
          </Button>
        </Link>
      </div>
    </aside>
  );
}
