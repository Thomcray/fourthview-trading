import Link from "next/link";
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
import { getStoreSettings } from "@/app/_lib/settings";
import WhatsAppButton from "./WhatsAppButton";

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
  { icon: CreditCard, text: "Multiple Payments", subtext: "Cards, Bank" },
];

export default async function Footer() {
  const settings = await getStoreSettings();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    settings?.facebook && {
      icon: Facebook,
      href: `https://facebook.com/${settings.facebook}`,
      label: "Facebook",
      color: "hover:text-blue-500",
    },
    settings?.twitter && {
      icon: Twitter,
      href: `https://x.com/${settings.twitter}`,
      label: "X (Twitter)",
      color: "hover:text-sky-500",
    },
    settings?.instagram && {
      icon: Instagram,
      href: `https://instagram.com/${settings.instagram}`,
      label: "Instagram",
      color: "hover:text-pink-500",
    },
    settings?.youtube && {
      icon: Youtube,
      href: `https://youtube.com/${settings.youtube}`,
      label: "YouTube",
      color: "hover:text-red-600",
    },
    settings?.tiktok && {
      icon: Video,
      href: `https://tiktok.com/${settings.tiktok}`,
      label: "TikTok",
      color: "hover:text-white",
    },
    settings?.whatsapp && {
      icon: MessageCircle,
      href: `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`,
      label: "WhatsApp",
      color: "hover:text-green-500",
    },
  ].filter(Boolean) as Array<{
    icon: typeof Facebook;
    href: string;
    label: string;
    color: string;
  }>;

  const contactInfo = [
    settings?.storePhone && {
      icon: Phone,
      text: settings.storePhone,
      href: `tel:${settings.storePhone.replace(/\s/g, "")}`,
    },
    settings?.storeEmail && {
      icon: Mail,
      text: settings.storeEmail,
      href: `mailto:${settings.storeEmail}`,
    },
    {
      icon: MapPin,
      text: settings?.storeAddress || "Lagos, Nigeria",
      href: `https://maps.google.com/?q=${encodeURIComponent(settings?.storeAddress || "Lagos, Nigeria")}`,
    },
  ].filter(Boolean) as Array<{
    icon: typeof Phone;
    text: string;
    href: string;
  }>;

  return (
    <footer className="bg-linear-to-b from-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              {settings?.storeName || "Fourthview"}
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
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
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
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.map((info, idx) => (
                <li key={idx}>
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
          </div>

          {/* Features */}
          <div className="space-y-4">
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
          </div>
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

      {/* WhatsApp Button */}
      {settings?.whatsapp && <WhatsAppButton whatsapp={settings.whatsapp} />}
    </footer>
  );
}
