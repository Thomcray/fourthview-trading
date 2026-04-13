// app/change-money/page.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import currencyImage from "@/public/currencyImage.png";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MessageCircle,
  PhoneIncoming,
  TrendingUp,
  Shield,
  Clock,
  ArrowRight,
  Copy,
} from "lucide-react";
import { ExchangeModal } from "@/components/ExchangeModal";
import exchangerates from "@/components/ChangeMoney/exCurr";
import { motion } from "framer-motion";

type Steps = {
  id: number;
  step: string;
  description?: string;
};

// Match the actual type from your exCurr file
type ExchangeRate = {
  from: string;
  to: string;
  rate: number; // Changed from string to number
  available: boolean;
};

export default function CurrencyExchangePage() {
  const [copiedRate, setCopiedRate] = useState<string | null>(null);

  const steps: Steps[] = [
    {
      id: 1,
      step: "Choose currencies you wish to change",
      description: "Select from our supported currency pairs",
    },
    {
      id: 2,
      step: "Enter amount you wish to convert",
      description: "Get automatic feedback on the amount you'll receive",
    },
    {
      id: 3,
      step: "Select payment method",
      description: "Choose from our provider options",
    },
    {
      id: 4,
      step: "Make transfer",
      description: "Take a screenshot or print receipt",
    },
    {
      id: 5,
      step: "Upload receipt",
      description: "Receive barcode confirmation",
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

  const handleCopyRate = (rate: number, pair: string) => {
    navigator.clipboard.writeText(rate.toString());
    setCopiedRate(pair);
    setTimeout(() => setCopiedRate(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50">
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
                  <Button
                    variant="outline"
                    className="border-blue-200 hover:bg-blue-50"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Right Image - clip the glow inside its own wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 flex justify-center"
            >
              <div className="relative overflow-hidden rounded-full w-64 h-64 lg:w-80 lg:h-80">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
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

      {/* Current Rates Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-950 mb-4">
              Current Exchange Rates
            </h2>
            <p className="text-gray-600">
              Real-time rates updated every minute
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {exchangerates.map((rate: ExchangeRate, index: number) => (
              <motion.div
                key={`${rate.from}-${rate.to}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 text-center border border-gray-100"
              >
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  {rate.from} → {rate.to}
                </p>
                <div className="relative group">
                  <div className="relative">
                    <Button
                      variant="outline"
                      className="w-full bg-blue-950 text-white hover:bg-blue-800 font-mono text-lg mb-2"
                    >
                      {rate.rate.toFixed(4)}
                    </Button>
                    {/* Copy button is now a sibling, not nested inside Button */}
                    <button
                      onClick={() =>
                        handleCopyRate(rate.rate, `${rate.from}-${rate.to}`)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity mb-2"
                    >
                      <Copy className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  {copiedRate === `${rate.from}-${rate.to}` && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-green-500 text-white px-2 py-1 rounded whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${rate.available ? "bg-green-500" : "bg-red-500"} animate-pulse`}
                  ></div>
                  <p
                    className={`text-xs font-medium ${rate.available ? "text-green-600" : "text-red-600"}`}
                  >
                    {rate.available ? "Available" : "Unavailable"}
                  </p>
                </div>
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
              Exchange currency in 5 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-blue-400/30 -translate-x-1/2"></div>
                )}
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-400">
                    <span className="text-white font-bold text-xl">
                      {step.id}
                    </span>
                  </div>
                  <div className="bg-blue-800/30 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-white text-sm font-medium mb-2">
                      {step.step}
                    </p>
                    <p className="text-blue-300 text-xs">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
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
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <PhoneIncoming className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Call us</p>
                <p className="font-semibold text-gray-900">+234 813 123 4567</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email us</p>
                <p className="font-semibold text-gray-900">
                  support@fourthview.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Live chat</p>
                <p className="font-semibold text-gray-900">
                  Start conversation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
