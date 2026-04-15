"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Send,
  Settings,
  Users,
  ShoppingBag,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Truck,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  enabled: boolean;
};

const defaultTemplates: EmailTemplate[] = [
  {
    id: "welcome",
    name: "Welcome Email",
    subject: "Welcome to Fourthview Trading!",
    body: "Dear {{name}},\n\nWelcome to Fourthview Trading! We're excited to have you on board.\n\nBest regards,\nFourthview Team",
    enabled: true,
  },
  {
    id: "order_confirmation",
    name: "Order Confirmation",
    subject: "Order Confirmation #{{orderId}}",
    body: "Dear {{name}},\n\nThank you for your order! Your order #{{orderId}} has been confirmed.\n\nOrder Details:\n{{orderDetails}}\n\nTotal: {{total}}\n\nWe'll notify you once your order ships.\n\nBest regards,\nFourthview Team",
    enabled: true,
  },
  {
    id: "shipping_notification",
    name: "Shipping Notification",
    subject: "Your order has been shipped!",
    body: "Dear {{name}},\n\nGreat news! Your order #{{orderId}} has been shipped.\n\nTracking Number: {{trackingNumber}}\n\nEstimated Delivery: {{deliveryDate}}\n\nTrack your package: {{trackingLink}}\n\nBest regards,\nFourthview Team",
    enabled: true,
  },
  {
    id: "order_delivered",
    name: "Order Delivered",
    subject: "Your order has been delivered",
    body: "Dear {{name}},\n\nYour order #{{orderId}} has been delivered. We hope you love your purchase!\n\nIf you have any issues, please contact our support team.\n\nBest regards,\nFourthview Team",
    enabled: true,
  },
];

export default function EmailSettings() {
  const [smtpSettings, setSmtpSettings] = useState({
    host: "smtp.gmail.com",
    port: 587,
    username: "",
    password: "",
    encryption: "tls",
    fromEmail: "noreply@fourthview.com",
    fromName: "Fourthview Trading",
  });

  const [templates, setTemplates] = useState(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSmtpChange = (field: string, value: string | number) => {
    setSmtpSettings({ ...smtpSettings, [field]: value });
    setIsDirty(true);
  };

  const handleTemplateUpdate = (template: EmailTemplate) => {
    setTemplates(templates.map((t) => (t.id === template.id ? template : t)));
    setSelectedTemplate(null);
    setIsDirty(true);
  };

  const handleTestEmail = async () => {
    setIsTesting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Test email sent successfully!");
    } catch (err) {
      console.error("Failed to send test email:", err);
      toast.error("Failed to send test email");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Email settings saved successfully!");
      setIsDirty(false);
    } catch (err) {
      console.error("Failed to save settings:", err);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSmtpSettings({
      host: "smtp.gmail.com",
      port: 587,
      username: "",
      password: "",
      encryption: "tls",
      fromEmail: "noreply@fourthview.com",
      fromName: "Fourthview Trading",
    });
    setTemplates(defaultTemplates);
    setIsDirty(false);
    toast.info("Changes discarded");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Email Configuration
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure SMTP settings and email templates
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

      {/* SMTP Settings */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">SMTP Configuration</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="font-medium">SMTP Host</Label>
            <Input
              value={smtpSettings.host}
              onChange={(e) => handleSmtpChange("host", e.target.value)}
              className="mt-1"
              placeholder="smtp.gmail.com"
            />
          </div>
          <div>
            <Label className="font-medium">SMTP Port</Label>
            <Input
              type="number"
              value={smtpSettings.port}
              onChange={(e) => handleSmtpChange("port", Number(e.target.value))}
              className="mt-1"
              placeholder="587"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="font-medium">Username</Label>
            <Input
              value={smtpSettings.username}
              onChange={(e) => handleSmtpChange("username", e.target.value)}
              className="mt-1"
              placeholder="your-email@gmail.com"
            />
          </div>
          <div>
            <Label className="font-medium">Password</Label>
            <div className="relative mt-1">
              <Input
                type={showPassword ? "text" : "password"}
                value={smtpSettings.password}
                onChange={(e) => handleSmtpChange("password", e.target.value)}
                className="pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="font-medium">Encryption</Label>
            <select
              value={smtpSettings.encryption}
              onChange={(e) => handleSmtpChange("encryption", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
            >
              <option value="tls">TLS</option>
              <option value="ssl">SSL</option>
              <option value="none">None</option>
            </select>
          </div>
          <div>
            <Label className="font-medium">From Email</Label>
            <Input
              type="email"
              value={smtpSettings.fromEmail}
              onChange={(e) => handleSmtpChange("fromEmail", e.target.value)}
              className="mt-1"
              placeholder="noreply@yourstore.com"
            />
          </div>
        </div>

        <div>
          <Label className="font-medium">From Name</Label>
          <Input
            value={smtpSettings.fromName}
            onChange={(e) => handleSmtpChange("fromName", e.target.value)}
            className="mt-1 max-w-md"
            placeholder="Your Store Name"
          />
        </div>

        <Button
          variant="outline"
          onClick={handleTestEmail}
          disabled={isTesting}
          className="gap-2"
        >
          <Send className={`w-4 h-4 ${isTesting ? "animate-pulse" : ""}`} />
          {isTesting ? "Sending..." : "Send Test Email"}
        </Button>
      </div>

      {/* Email Templates */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Email Templates</h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border rounded-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-3 bg-gray-50">
                <div className="flex items-center gap-3">
                  {template.id === "welcome" && (
                    <Users className="w-4 h-4 text-blue-600" />
                  )}
                  {template.id === "order_confirmation" && (
                    <ShoppingBag className="w-4 h-4 text-green-600" />
                  )}
                  {template.id === "shipping_notification" && (
                    <Truck className="w-4 h-4 text-purple-600" />
                  )}
                  {template.id === "order_delivered" && (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  )}
                  <span className="font-medium text-gray-800">
                    {template.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={template.enabled}
                    onCheckedChange={(checked) => {
                      setTemplates(
                        templates.map((t) =>
                          t.id === template.id ? { ...t, enabled: checked } : t,
                        ),
                      );
                      setIsDirty(true);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    Edit
                  </Button>
                </div>
              </div>

              {selectedTemplate?.id === template.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 space-y-3 border-t"
                >
                  <div>
                    <Label className="font-medium">Subject</Label>
                    <Input
                      value={selectedTemplate.subject}
                      onChange={(e) =>
                        setSelectedTemplate({
                          ...selectedTemplate,
                          subject: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="font-medium">Body</Label>
                    <Textarea
                      value={selectedTemplate.body}
                      onChange={(e) =>
                        setSelectedTemplate({
                          ...selectedTemplate,
                          body: e.target.value,
                        })
                      }
                      rows={8}
                      className="mt-1 font-mono text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Available variables:{" "}
                      {
                        "{{name}}, {{orderId}}, {{orderDetails}}, {{total}}, {{trackingNumber}}, {{deliveryDate}}, {{trackingLink}}"
                      }
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTemplate(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleTemplateUpdate(selectedTemplate)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Save Template
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
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
