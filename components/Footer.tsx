"use client";

import {
  Facebook,
  Mail,
  MessageCircle,
  Phone,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Shield,
  RefreshCw,
  CreditCard,
  Video,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type StoreSettings = {
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Shop", href: "/shop" },
  { name: "Contact", href: "/contact" },
  { name: "FAQs", href: "/faq" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms & Conditions", href: "/terms" },
];

const serviceFeatures = [
  { icon: RefreshCw, text: "Easy Returns", subtext: "30-day return policy" },
  { icon: Shield, text: "Secure Payment", subtext: "100% secure transactions" },
  {
    icon: CreditCard,
    text: "Multiple Payments",
    subtext: "Cards, Bank, Crypto",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {
        // Fail silently — footer still renders with fallbacks
      });
  }, []);

  // Build social links dynamically from DB — only show if value exists
  const socialLinks = [
    {
      icon: Facebook,
      href: settings?.facebook
        ? `https://facebook.com/${settings.facebook}`
        : null,
      label: "Facebook",
      color: "hover:text-blue-500",
    },
    {
      icon: Twitter,
      href: settings?.twitter ? `https://x.com/${settings.twitter}` : null,
      label: "X (Twitter)",
      color: "hover:text-sky-500",
    },
    {
      icon: Instagram,
      href: settings?.instagram
        ? `https://instagram.com/${settings.instagram}`
        : null,
      label: "Instagram",
      color: "hover:text-pink-500",
    },
    {
      icon: Youtube,
      href: settings?.youtube
        ? `https://youtube.com/${settings.youtube}`
        : null,
      label: "YouTube",
      color: "hover:text-red-600",
    },
    {
      icon: Video,
      href: settings?.tiktok ? `https://tiktok.com/${settings.tiktok}` : null,
      label: "TikTok",
      color: "hover:text-white",
    },
    {
      icon: MessageCircle,
      href: settings?.whatsapp
        ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`
        : null,
      label: "WhatsApp",
      color: "hover:text-green-500",
    },
  ].filter((s) => s.href !== null); // Hide socials with no value

  const contactInfo = [
    {
      icon: Phone,
      text: settings?.storePhone,
      href: `tel:${settings?.storePhone?.replace(/\s/g, "") || ""}`,
    },
    {
      icon: Mail,
      text: settings?.storeEmail,
      href: `mailto:${settings?.storeEmail || ""}`,
    },
    {
      icon: MapPin,
      text: settings?.storeAddress || "Lagos, Nigeria",
      href: `https://maps.google.com/?q=${encodeURIComponent(settings?.storeAddress || "Lagos, Nigeria")}`,
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              {settings?.storeName}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {settings?.description ||
                "Your trusted partner for fashion, travel, currency exchange, and global trade solutions."}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.map((info) => (
                <li key={info.text}>
                  <Link
                    href={info.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    <info.icon className="w-4 h-4 shrink-0" />
                    <span>{info.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Service Features */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">Why Choose Us</h3>
            <div className="space-y-3">
              {serviceFeatures.map((feature) => (
                <div key={feature.text} className="flex items-start gap-3">
                  <feature.icon className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {feature.text}
                    </p>
                    <p className="text-xs text-gray-400">{feature.subtext}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              &copy; {currentYear} {settings?.storeName || "Fourthview Trading"}
              . All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white text-xs transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white text-xs transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-white text-xs transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button — only shows if whatsapp is set */}
      {settings?.whatsapp && (
        <Link
          href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </Link>
      )}
    </footer>
  );
}
