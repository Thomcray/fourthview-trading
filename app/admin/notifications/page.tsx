"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  ShoppingBag,
  BookOpen,
  RefreshCw,
  GraduationCap,
  CheckCheck,
  Trash2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/app/_lib/supabase-browser";
import { toast } from "react-toastify";

type Notification = {
  id: number;
  title: string;
  message?: string;
  type: "order" | "booking" | "refund" | "study_application";
  reference_id?: string;
  is_read: boolean;
  created_at: string;
};

const typeConfig = {
  order: {
    label: "Orders",
    icon: ShoppingBag,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  booking: {
    label: "Bookings",
    icon: BookOpen,
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  refund: {
    label: "Refunds",
    icon: RefreshCw,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  study_application: {
    label: "Study Applications",
    icon: GraduationCap,
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-200",
  },
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

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | Notification["type"]>(
    "all",
  );
  const supabase = createBrowserClient();

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("notifications-page")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notifications" },
        (payload) => {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === payload.new.id ? (payload.new as Notification) : n,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setNotifications(data);
    setIsLoading(false);
  };

  const markAsRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("is_read", false);
    toast.success("All notifications marked as read");
  };

  const deleteNotification = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await supabase.from("notifications").delete().eq("id", id);
    toast.success("Notification deleted");
  };

  const deleteAllRead = async () => {
    setNotifications((prev) => prev.filter((n) => !n.is_read));
    await supabase.from("notifications").delete().eq("is_read", true);
    toast.success("Read notifications cleared");
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.is_read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const stats = {
    total: notifications.length,
    unread: unreadCount,
    orders: notifications.filter((n) => n.type === "order").length,
    bookings: notifications.filter((n) => n.type === "booking").length,
    refunds: notifications.filter((n) => n.type === "refund").length,
    study_applications: notifications.filter(
      (n) => n.type === "study_application",
    ).length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-600" />
              Notifications
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={markAllAsRead}
                className="gap-2 text-sm"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </Button>
            )}
            {notifications.some((n) => n.is_read) && (
              <Button
                variant="outline"
                onClick={deleteAllRead}
                className="gap-2 text-sm text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Clear read
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {Object.entries(typeConfig).map(([type, config]) => {
            const Icon = config.icon;
            const count = stats[type as keyof typeof stats] as number;
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all ${
                  filter === type
                    ? `${config.border} ring-2 ring-offset-1`
                    : "border-gray-100 hover:border-gray-200"
                }`}
                onClick={() =>
                  setFilter(
                    filter === type ? "all" : (type as Notification["type"]),
                  )
                }
              >
                <div
                  className={`w-8 h-8 ${config.bg} rounded-lg flex items-center justify-center mb-2`}
                >
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-800">{count}</p>
                <p className="text-xs text-gray-500">{config.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { key: "all", label: `All (${stats.total})` },
            { key: "unread", label: `Unread (${stats.unread})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                filter === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No notifications</p>
              <p className="text-sm text-gray-400 mt-1">
                {filter !== "all"
                  ? "Try changing your filter"
                  : "Notifications will appear here"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif, index) => {
              const config = typeConfig[notif.type];
              const Icon = config.icon;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={async () => {
                    await markAsRead(notif.id);
                    router.push(
                      notificationLink(notif.type, notif.reference_id),
                    );
                  }}
                  className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all hover:shadow-md ${
                    !notif.is_read
                      ? "border-blue-200 bg-blue-50/30"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 ${config.bg} rounded-xl flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm ${!notif.is_read ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}
                        >
                          {notif.title}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          {!notif.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                          <button
                            onClick={(e) => deleteNotification(notif.id, e)}
                            className="p-1 hover:bg-red-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      </div>
                      {notif.message && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {notif.message}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color} font-medium`}
                        >
                          {config.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(notif.created_at).toLocaleDateString(
                            "en-NG",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
