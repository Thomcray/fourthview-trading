"use client";

import Image from "next/image";
import Link from "next/link";
import fourthviewLogo from "@/public/fourthviewLogo.png";
import { Dancing_Script } from "next/font/google";
import {
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
  BookOpen,
  ShoppingBag,
  RefreshCw,
  GraduationCap,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/app/_lib/supabase-browser";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});

type Notification = {
  id: number;
  title: string;
  message?: string;
  type: "order" | "booking" | "refund" | "study_application";
  reference_id?: string;
  is_read: boolean;
  created_at: string;
};

const notificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "order":
      return <ShoppingBag className="w-4 h-4 text-blue-500" />;
    case "booking":
      return <BookOpen className="w-4 h-4 text-purple-500" />;
    case "refund":
      return <RefreshCw className="w-4 h-4 text-red-500" />;
    case "study_application":
      return <GraduationCap className="w-4 h-4 text-green-500" />;
  }
};

const notificationLink = (type: Notification["type"], referenceId?: string) => {
  switch (type) {
    case "order":
      return `/admin/orders/${referenceId}`;
    case "booking":
      return `/admin/orders-request`;
    case "refund":
      return `/admin/refunds/${referenceId}`;
    case "study_application":
      return `/admin/study-applications/${referenceId}`;
    default:
      return "/admin";
  }
};

export default function AdminHeader() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const supabase = createBrowserClient();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Fetch initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (data) setNotifications(data);
    };

    fetchNotifications();
  }, []);

  // Subscribe to realtime notifications
  useEffect(() => {
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Mark notification as read
  const markAsRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  };

  // Mark all as read
  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("is_read", false);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2 group">
              <div className="relative">
                <Image
                  src={fourthviewLogo}
                  alt="Fourthview Logo"
                  width={40}
                  height={40}
                  priority
                  className="object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-blue-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity" />
              </div>
              <div className="hidden sm:block">
                <h2
                  className={`text-xl font-bold text-blue-950 leading-tight ${dancingScript.className}`}
                >
                  fourthview
                </h2>
                <p className="text-xs text-gray-500 -mt-1">
                  Trading Company. Ltd
                </p>
              </div>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="hidden lg:block relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4.5 h-4.5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold px-1">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="fixed sm:absolute right-0 sm:right-0 left-0 sm:left-auto top-16 sm:top-auto sm:mt-2 w-full sm:w-96 bg-white sm:rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="overflow-y-auto max-h-80">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={async () => {
                            await markAsRead(notif.id);
                            setShowNotifications(false);
                            router.push(
                              notificationLink(notif.type, notif.reference_id),
                            );
                          }}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 ${
                            !notif.is_read ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0">
                              {notificationIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm ${!notif.is_read ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}
                              >
                                {notif.title}
                              </p>
                              {notif.message && (
                                <p className="text-xs text-gray-500 mt-0.5 truncate">
                                  {notif.message}
                                </p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notif.created_at).toLocaleDateString(
                                  "en-NG",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </p>
                            </div>
                            {!notif.is_read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        router.push("/admin/notifications");
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 w-full text-center cursor-pointer"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {session?.user?.firstName?.charAt(0) || "A"}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-800">
                    {session?.user?.firstName || "Admin"}{" "}
                    {session?.user?.lastName || ""}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
                    <p className="text-sm font-medium text-gray-800">
                      {session?.user?.firstName || "Admin"}{" "}
                      {session?.user?.lastName || ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session?.user?.email || "admin@fourthview.com"}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/admin/profile")}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => router.push("/admin/settings")}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/signin" })}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
