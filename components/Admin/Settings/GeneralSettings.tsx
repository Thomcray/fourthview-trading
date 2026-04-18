"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Save,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Video,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

type Settings = {
  id: string;
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  websiteUrl: string;
  description: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  twitter: string;
  tiktok: string;
  youtube: string;
};

const defaultSettings: Omit<Settings, "id"> = {
  storeName: "",
  storeEmail: "",
  storePhone: "",
  storeAddress: "",
  websiteUrl: "",
  description: "",
  whatsapp: "",
  instagram: "",
  facebook: "",
  twitter: "",
  tiktok: "",
  youtube: "",
};

export default function GeneralSettings() {
  const [settings, setSettings] = useState<Settings>({
    id: "",
    ...defaultSettings,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch settings from DB on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.settings) {
          setSettings({
            id: data.settings.id,
            storeName: data.settings.storeName,
            storeEmail: data.settings.storeEmail,
            storePhone: data.settings.storePhone,
            storeAddress: data.settings.storeAddress,
            websiteUrl: data.settings.websiteUrl,
            description: data.settings.description,
            whatsapp: data.settings.whatsapp ?? "",
            instagram: data.settings.instagram ?? "",
            facebook: data.settings.facebook ?? "",
            twitter: data.settings.twitter ?? "",
            tiktok: data.settings.tiktok ?? "",
            youtube: data.settings.youtube ?? "",
          });
        }
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setIsFetching(false);
      }
    }
    fetchSettings();
  }, []);

  const validateField = (name: string, value: string): string => {
    if (typeof value !== "string") return "";

    const requiredFields = [
      "storeName",
      "storeEmail",
      "storePhone",
      "storeAddress",
    ];
    if (requiredFields.includes(name) && !value.trim()) {
      return `This field is required`;
    }

    switch (name) {
      case "storeEmail": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) return "Invalid email format";
        break;
      }
      case "websiteUrl": {
        const urlRegex = /^https?:\/\/.+\..+/;
        if (value && !urlRegex.test(value)) return "Invalid URL format";
        break;
      }
      case "storePhone": {
        const phoneRegex = /^[\+\d\s\-\(\)]{10,}$/;
        if (value && !phoneRegex.test(value.replace(/\s/g, "")))
          return "Invalid phone format";
        break;
      }
    }
    return "";
  };

  const handleChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (field: string, value: string) => {
    const error = validateField(field, value);
    if (error) setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};
    Object.entries(settings).forEach(([key, value]) => {
      const error = validateField(key, value as string);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors before saving");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success("Settings saved successfully!");
      setIsDirty(false);
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const generalFields = [
    {
      name: "storeName",
      label: "Store Name",
      icon: Building2,
      type: "text",
      placeholder: "Your store name",
      required: true,
    },
    {
      name: "storeEmail",
      label: "Store Email",
      icon: Mail,
      type: "email",
      placeholder: "admin@yourstore.com",
      required: true,
    },
    {
      name: "storePhone",
      label: "Store Phone",
      icon: Phone,
      type: "tel",
      placeholder: "+234 123 456 7890",
      required: true,
    },
    {
      name: "storeAddress",
      label: "Store Address",
      icon: MapPin,
      type: "textarea",
      placeholder: "Your store address",
      rows: 2,
      required: true,
    },
    {
      name: "websiteUrl",
      label: "Website URL",
      icon: Globe,
      type: "text",
      placeholder: "https://yourstore.com",
      required: false,
    },
    {
      name: "description",
      label: "Store Description",
      icon: FileText,
      type: "textarea",
      placeholder: "Describe your store...",
      rows: 3,
      required: false,
    },
  ];

  const socialFields = [
    {
      name: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      placeholder: "+234 813 123 4567",
      prefix: "wa.me/",
    },
    {
      name: "instagram",
      label: "Instagram",
      icon: Instagram,
      placeholder: "yourhandle",
      prefix: "instagram.com/",
    },
    {
      name: "facebook",
      label: "Facebook",
      icon: Facebook,
      placeholder: "yourpage",
      prefix: "facebook.com/",
    },
    {
      name: "twitter",
      label: "X (Twitter)",
      icon: Twitter,
      placeholder: "yourhandle",
      prefix: "x.com/",
    },
    {
      name: "tiktok",
      label: "TikTok",
      icon: Video,
      placeholder: "@yourhandle",
      prefix: "tiktok.com/",
    },
    {
      name: "youtube",
      label: "YouTube",
      icon: Youtube,
      placeholder: "yourchannel",
      prefix: "youtube.com/",
    },
  ];

  if (isFetching) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            General Information
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Update your store&apos;s basic information and social handles
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

      {/* General Fields */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-4">
          Store Details
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {generalFields.map((field) => (
            <div
              key={field.name}
              className={
                field.name === "description" || field.name === "storeAddress"
                  ? "lg:col-span-2"
                  : ""
              }
            >
              <Label className="text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <div className="relative mt-1.5">
                <div className="absolute left-3 top-3 text-gray-400">
                  <field.icon className="w-4 h-4" />
                </div>
                {field.type === "textarea" ? (
                  <Textarea
                    value={settings[field.name as keyof Settings] as string}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    onBlur={(e) => handleBlur(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={field.rows}
                    className={`pl-10 ${errors[field.name] ? "border-red-500" : ""}`}
                  />
                ) : (
                  <Input
                    type={field.type}
                    value={settings[field.name as keyof Settings] as string}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    onBlur={(e) => handleBlur(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className={`pl-10 ${errors[field.name] ? "border-red-500" : ""}`}
                  />
                )}
              </div>
              {errors[field.name] && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors[field.name]}
                </motion.p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Social Handles */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-1">
          Social Handles
        </h4>
        <p className="text-xs text-gray-400 mb-4">
          Enter just your handle or number — no need for full URLs
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {socialFields.map((field) => (
            <div key={field.name}>
              <Label className="text-sm font-medium text-gray-700">
                {field.label}
              </Label>
              <div className="relative mt-1.5 flex items-center">
                <div className="absolute left-3 text-gray-400">
                  <field.icon className="w-4 h-4" />
                </div>
                <span className="absolute left-9 text-xs text-gray-400 pointer-events-none">
                  {field.prefix}
                </span>
                <Input
                  value={settings[field.name as keyof Settings] as string}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className={`pl-${field.prefix.length > 10 ? "28" : "24"}`}
                  style={{
                    paddingLeft: `${field.prefix.length * 7 + 36}px`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsDirty(false);
            setErrors({});
            toast.info("Changes discarded");
          }}
          disabled={isLoading || !isDirty}
          className="cursor-pointer"
        >
          Discard
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading || !isDirty}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          {isLoading ? (
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

      {!isDirty && !isLoading && !isFetching && (
        <div className="flex items-center justify-end gap-1 text-xs text-green-600">
          <CheckCircle className="w-3 h-3" />
          All changes saved
        </div>
      )}
    </div>
  );
}
