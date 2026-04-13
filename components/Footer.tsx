// components/Footer.tsx
"use client";

import {
  Facebook,
  Mail,
  MessageCircle,
  MessageSquareText,
  Phone,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Clock,
  Shield,
  Truck,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://facebook.com",
      label: "Facebook",
      color: "hover:text-blue-500",
    },
    {
      icon: Twitter,
      href: "https://twitter.com",
      label: "Twitter",
      color: "hover:text-sky-500",
    },
    {
      icon: Instagram,
      href: "https://instagram.com",
      label: "Instagram",
      color: "hover:text-pink-500",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com",
      label: "LinkedIn",
      color: "hover:text-blue-600",
    },
    {
      icon: Youtube,
      href: "https://youtube.com",
      label: "YouTube",
      color: "hover:text-red-600",
    },
    {
      icon: MessageCircle,
      href: "https://wa.me/2348123456789",
      label: "WhatsApp",
      color: "hover:text-green-500",
    },
  ];

  const contactInfo = [
    { icon: Phone, text: "+234 813 123 4567", href: "tel:+2348131234567" },
    {
      icon: Mail,
      text: "support@fourthview.com",
      href: "mailto:support@fourthview.com",
    },
    { icon: MapPin, text: "Lagos, Nigeria", href: "https://maps.google.com" },
  ];

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
    {
      icon: Shield,
      text: "Secure Payment",
      subtext: "100% secure transactions",
    },
    {
      icon: CreditCard,
      text: "Multiple Payments",
      subtext: "Cards, Bank, Crypto",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

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
              Fourthview Trading
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for fashion, travel, currency exchange, and
              global trade solutions. Experience excellence with our premium
              services.
            </p>
            <div className="flex space-x-3 pt-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
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
                    href={info.href || "#"}
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    <info.icon className="w-4 h-4" />
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
                  <feature.icon className="w-5 h-5 text-blue-400 mt-0.5" />
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
            <div className="text-center sm:text-left">
              <p className="text-gray-400 text-sm">
                &copy; {currentYear} Fourthview Trading. All rights reserved.
              </p>
            </div>
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

      {/* WhatsApp Floating Button */}
      <Link
        href="https://wa.me/2348123456789"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </Link>
    </footer>
  );
}
