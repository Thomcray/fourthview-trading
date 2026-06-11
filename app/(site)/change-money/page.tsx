"use client";

import React from "react";
import Image from "next/image";
import currencyImage from "@/public/currencyImage.png";
import {
  Mail,
  MessageCircle,
  PhoneIncoming,
  TrendingUp,
  Shield,
  Clock,
  ArrowRight,
  CreditCard,
  Upload,
  QrCode,
  FileText,
  Phone,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSettings } from "@/components/SettingsProvider";
import { ExchangeModal } from "@/components/ExchangeModal";

type Steps = {
  id: number;
  step: string;
  description?: string;
  icon: React.ElementType;
};

export default function CurrencyExchangePage() {
  const settings = useSettings();

  const steps: Steps[] = [
    {
      id: 1,
      icon: CreditCard,
      step: "Make Payment",
      description: "Complete your payment using your preferred method",
    },
    {
      id: 2,
      icon: Upload,
      step: "Upload Receipt",
      description: "Upload a screenshot or photo of your payment receipt",
    },
    {
      id: 3,
      icon: QrCode,
      step: "Upload WeChat / Alipay QR Code",
      description: "Provide your WeChat or Alipay QR code for the transfer",
    },
    {
      id: 4,
      icon: FileText,
      step: "Add Narration",
      description: "Include any payment notes or narration if needed",
    },
    {
      id: 5,
      icon: Phone,
      step: "WhatsApp & Email",
      description: "Provide your WhatsApp number and email address",
    },
    {
      id: 6,
      icon: CheckCircle,
      step: "Done!",
      description:
        "We'll review your submission and contact you in a few minutes",
    },
  ];

  const features = [
    {
      icon: TrendingUp,
      title: "Live Rates",
      description: "Real-time exchange rates",
    },
    { icon: Shield, title: "Secure", description: "100% secure transactions" },
    { icon: Clock, title: "Fast", description: "Quick processing time" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-blue-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
                  <TrendingUp className="w-4 h-4" />
                  Live Exchange Rates
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-blue-950 mb-4">
                  Fourth View Currency Exchange
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  With live rates and real-time updates. Fast, secure, and
                  reliable currency exchange.
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <ExchangeModal />
                </div>
              </motion.div>
            </div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 flex justify-center"
            >
              <div className="relative overflow-hidden rounded-full w-64 h-64 lg:w-80 lg:h-80">
                <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <Image
                  src={currencyImage}
                  alt="Currency Exchange"
                  priority
                  className="relative z-10 w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-950 mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the best rates and fastest service for all your
              currency exchange needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-950 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-blue-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-blue-200 max-w-2xl mx-auto">
              Exchange currency in 6 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mb-4 border-2 border-blue-400 shrink-0 relative z-10">
                  <step.icon className="w-7 h-7 text-blue-200" />
                </div>

                <div className="bg-blue-800/30 rounded-lg p-4 backdrop-blur-sm text-center w-full">
                  <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">
                    Step {step.id}
                  </div>
                  <p className="text-white text-sm font-medium mb-2">
                    {step.step}
                  </p>
                  <p className="text-blue-300 text-xs">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center text-center mt-12">
            <ExchangeModal />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-950 mb-4">
              Need Help?
            </h2>
            <p className="text-gray-600">Our support team is available 24/7</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {settings.storePhone && (
              <a
                href={`tel:${settings.storePhone.replace(/\s+/g, "")}`}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <PhoneIncoming className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Call us</p>
                  <p className="font-semibold text-gray-900">
                    {settings.storePhone}
                  </p>
                </div>
              </a>
            )}

            {settings.storeEmail && (
              <a
                href={`mailto:${settings.storeEmail}`}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email us</p>
                  <p className="font-semibold text-gray-900">
                    {settings.storeEmail}
                  </p>
                </div>
              </a>
            )}

            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Live chat</p>
                  <p className="font-semibold text-gray-900">
                    Start conversation
                  </p>
                </div>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
