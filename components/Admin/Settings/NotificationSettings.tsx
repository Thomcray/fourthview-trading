"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  ShoppingBag,
  Users,
  Package,
  CreditCard,
  Mail,
  MessageSquare,
  Smartphone,
  Save,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

type NotificationChannel = {
  id: string;
  name: string;
  icon: React.ElementType;
  enabled: boolean;
  recipients?: string[];
};

type NotificationEvent = {
  id: string;
  name: string;
  description: string;
  channels: string[];
  enabled: boolean;
};

const notificationChannels: NotificationChannel[] = [
  {
    id: "email",
    name: "Email",
    icon: Mail,
    enabled: true,
    recipients: ["admin@fourthview.com"],
  },
  {
    id: "sms",
    name: "SMS",
    icon: MessageSquare,
    enabled: false,
    recipients: ["+2348123456789"],
  },
  { id: "push", name: "Push Notification", icon: Bell, enabled: false },
  { id: "database", name: "In-App", icon: Bell, enabled: true },
];

const notificationEvents: NotificationEvent[] = [
  {
    id: "new_order",
    name: "New Order",
    description: "When a customer places a new order",
    channels: ["email", "database"],
    enabled: true,
  },
  {
    id: "order_status_change",
    name: "Order Status Change",
    description:
      "When order status is updated (processing, shipped, delivered)",
    channels: ["email", "sms", "database"],
    enabled: true,
  },
  {
    id: "new_customer",
    name: "New Customer Registration",
    description: "When a new customer creates an account",
    channels: ["email", "database"],
    enabled: true,
  },
  {
    id: "low_stock",
    name: "Low Stock Alert",
    description: "When product stock falls below threshold",
    channels: ["email", "database", "push"],
    enabled: true,
  },
  {
    id: "payment_received",
    name: "Payment Received",
    description: "When a payment is successfully processed",
    channels: ["email", "database"],
    enabled: true,
  },
  {
    id: "refund_processed",
    name: "Refund Processed",
    description: "When a refund is issued to a customer",
    channels: ["email", "database"],
    enabled: true,
  },
];

export default function NotificationSettings() {
  const [channels, setChannels] = useState(notificationChannels);
  const [events, setEvents] = useState(notificationEvents);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleChannelToggle = (channelId: string, enabled: boolean) => {
    setChannels(
      channels.map((c) => (c.id === channelId ? { ...c, enabled } : c)),
    );
    setIsDirty(true);
  };

  const handleEventToggle = (eventId: string, enabled: boolean) => {
    setEvents(events.map((e) => (e.id === eventId ? { ...e, enabled } : e)));
    setIsDirty(true);
  };

  const handleRecipientsUpdate = (channelId: string, recipients: string[]) => {
    setChannels(
      channels.map((c) => (c.id === channelId ? { ...c, recipients } : c)),
    );
    setIsDirty(true);
  };

  const handleTestNotification = async () => {
    setIsTesting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Test notification sent successfully!");
    } catch (error) {
      toast.error("Failed to send test notification");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Notification settings saved successfully!");
      setIsDirty(false);
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setChannels(notificationChannels);
    setEvents(notificationEvents);
    setIsDirty(false);
    toast.info("Changes discarded");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Notification Configuration
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage notification channels and events
          </p>
        </div>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full"
          >
            <AlertCircle className="w-3 h-3" />
            Unsaved changes
          </motion.div>
        )}
      </div>

      {/* Notification Channels */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Notification Channels</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <div key={channel.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-800">
                      {channel.name}
                    </span>
                  </div>
                  <Switch
                    checked={channel.enabled}
                    onCheckedChange={(checked) =>
                      handleChannelToggle(channel.id, checked)
                    }
                  />
                </div>

                {channel.enabled && channel.recipients && (
                  <div className="mt-3">
                    <Label className="text-sm">Recipients</Label>
                    <Input
                      value={channel.recipients.join(", ")}
                      onChange={(e) =>
                        handleRecipientsUpdate(
                          channel.id,
                          e.target.value.split(",").map((r) => r.trim()),
                        )
                      }
                      placeholder="email1@example.com, email2@example.com"
                      className="mt-1 text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Separate multiple recipients with commas
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Notification Events */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Notification Events</h3>
        </div>

        <div className="space-y-3">
          {events.map((event) => {
            const eventIcons: Record<string, React.ElementType> = {
              new_order: ShoppingBag,
              order_status_change: Package,
              new_customer: Users,
              low_stock: AlertCircle,
              payment_received: CreditCard,
              refund_processed: RefreshCw,
            };
            const EventIcon = eventIcons[event.id] || Bell;

            return (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <EventIcon className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-800">
                      {event.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {event.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {event.channels.map((channel) => {
                      const channelConfig = channels.find(
                        (c) => c.id === channel,
                      );
                      const isChannelEnabled = channelConfig?.enabled;
                      return (
                        <span
                          key={channel}
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            isChannelEnabled
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {channel}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <Switch
                  checked={event.enabled}
                  onCheckedChange={(checked) =>
                    handleEventToggle(event.id, checked)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Test Notification */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Test Notification</h3>
            <p className="text-sm text-gray-500">
              Send a test notification to verify your settings
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleTestNotification}
            disabled={isTesting}
            className="gap-2"
          >
            <Bell className={`w-4 h-4 ${isTesting ? "animate-pulse" : ""}`} />
            {isTesting ? "Sending..." : "Send Test"}
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isSaving || !isDirty}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {!isDirty && !isSaving && (
        <div className="flex items-center justify-end gap-1 text-xs text-green-600">
          <CheckCircle className="w-3 h-3" />
          All settings saved
        </div>
      )}
    </div>
  );
}
