"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { useSettings } from "@/components/SettingsProvider";

export default function ContactPage() {
  const settings = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send");

      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: settings.storeEmail || "info@fourthview.com",
      link: `mailto:${settings.storeEmail || "info@fourthview.com"}`,
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: settings.storePhone || "+234 813 123 4567",
      link: `tel:${(settings.storePhone || "+2348131234567").replace(/\s+/g, "")}`,
      color: "from-green-500 to-green-600",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: settings.storeAddress || "Lagos, Nigeria",
      link: `https://maps.google.com/?q=${encodeURIComponent(settings.storeAddress || "Lagos, Nigeria")}`,
      color: "from-red-500 to-red-600",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "We're available 24/7\nAlways here to help",
      link: undefined,
      color: "from-purple-500 to-purple-600",
    },
  ];

  const socialLinks = [
    settings.facebook && {
      icon: Facebook,
      href: settings.facebook,
      label: "Facebook",
      color: "hover:text-blue-600",
    },
    settings.twitter && {
      icon: Twitter,
      href: settings.twitter,
      label: "Twitter",
      color: "hover:text-sky-500",
    },
    settings.instagram && {
      icon: Instagram,
      href: settings.instagram,
      label: "Instagram",
      color: "hover:text-pink-500",
    },
    settings.whatsapp && {
      icon: MessageCircle,
      href: `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`,
      label: "WhatsApp",
      color: "hover:text-green-500",
    },
  ].filter(Boolean) as {
    icon: React.ElementType;
    href: string;
    label: string;
    color: string;
  }[];

  const whatsappNumber = settings.whatsapp || "";
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`
    : "https://wa.me/2348123456789";
  const whatsappDisplay =
    whatsappNumber || settings.storePhone || "+234 813 123 4567";

  return (
    <div className="min-h-screen bg-linear-30-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-blue-900 to-blue-800 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-blue-100 max-w-2xl mx-auto"
          >
            Have questions? We&apos;re here to help. Reach out and we&apos;ll
            get back to you within 24 hours.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-1 bg-blue-400 mx-auto rounded-full mt-6"
          />
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <motion.a
              key={info.title}
              href={info.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-linear-to-r ${info.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <info.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {info.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1 whitespace-pre-line">
                {info.details}
              </p>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Contact Form & Map Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="text-gray-700">Full Name *</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-700">Email Address *</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-700">Subject *</Label>
                <Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-700">Message *</Label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  rows={5}
                  required
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Map & Social */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Our Location</h3>
              </div>
              <div className="h-64 bg-gray-200 relative flex items-center justify-center">
                <p className="text-gray-400 text-sm">Map will be added here</p>
              </div>
              <div className="p-4 text-center text-sm text-gray-500">
                {settings.storeAddress || "Lagos, Nigeria"}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Connect With Us
              </h3>
              {socialLinks.length > 0 ? (
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-all ${social.color}`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  No social links configured yet.
                </p>
              )}
              {whatsappNumber && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Prefer to chat? Reach us on WhatsApp for quick responses.
                  </p>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-green-600 hover:text-green-700"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {whatsappDisplay}
                  </a>
                </div>
              )}
            </div>

            {/* FAQ Link */}
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
              <p className="text-sm text-blue-800">
                Have common questions? Check our{" "}
                <a href="/faq" className="font-semibold underline">
                  FAQ page
                </a>{" "}
                for quick answers.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
