"use client";

import { useState } from "react";
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
} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function GeneralSettings() {
  const [settings, setSettings] = useState({
    storeName: "Fourthview Trading",
    storeEmail: "admin@fourthview.com",
    storePhone: "+234 813 123 4567",
    storeAddress: "Lagos, Nigeria",
    websiteUrl: "https://fourthview.com",
    description:
      "Your trusted partner for fashion, travel, currency exchange, and global trade solutions.",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string): string => {
    if (!value.trim()) return `${name} is required`;

    switch (name) {
      case "storeEmail":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Invalid email format";
        break;
      case "websiteUrl":
        const urlRegex = /^https?:\/\/.+\..+/;
        if (value && !urlRegex.test(value)) return "Invalid URL format";
        break;
      case "storePhone":
        const phoneRegex = /^[\+\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value.replace(/\s/g, "")))
          return "Invalid phone format";
        break;
    }
    return "";
  };

  const handleChange = (field: string, value: string) => {
    setSettings({ ...settings, [field]: value });
    setIsDirty(true);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleBlur = (field: string, value: string) => {
    const error = validateField(field, value);
    if (error) {
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleSave = async () => {
    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.entries(settings).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors before saving");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("General settings saved successfully!");
      setIsDirty(false);
    } catch (err) {
      console.error("Failed to save settings:", err);
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      storeName: "Fourthview Trading",
      storeEmail: "admin@fourthview.com",
      storePhone: "+234 813 123 4567",
      storeAddress: "Lagos, Nigeria",
      websiteUrl: "https://fourthview.com",
      description:
        "Your trusted partner for fashion, travel, currency exchange, and global trade solutions.",
    });
    setIsDirty(false);
    setErrors({});
    toast.info("Settings reset to default");
  };

  const inputFields = [
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            General Information
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Update your store&apos;s basic information
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

      {/* Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {inputFields.map((field) => (
          <div
            key={field.name}
            className={field.name === "description" ? "lg:col-span-2" : ""}
          >
            <Label className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="relative mt-1.5">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <field.icon className="w-4 h-4" />
              </div>
              {field.type === "textarea" ? (
                <Textarea
                  value={
                    settings[field.name as keyof typeof settings] as string
                  }
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={(e) => handleBlur(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  rows={field.rows}
                  className={`pl-10 ${errors[field.name] ? "border-red-500 focus:ring-red-500" : ""}`}
                />
              ) : (
                <Input
                  type={field.type}
                  value={
                    settings[field.name as keyof typeof settings] as string
                  }
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={(e) => handleBlur(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className={`pl-10 ${errors[field.name] ? "border-red-500 focus:ring-red-500" : ""}`}
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

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isLoading || !isDirty}
          className="cursor-pointer"
        >
          Reset
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
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

      {/* Save Indicator */}
      {!isDirty && !isLoading && (
        <div className="flex items-center justify-end gap-1 text-xs text-green-600">
          <CheckCircle className="w-3 h-3" />
          All changes saved
        </div>
      )}
    </div>
  );
}
