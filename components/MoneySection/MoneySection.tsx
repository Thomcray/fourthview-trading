// components/MoneySection.tsx
"use client";

import Image from "next/image";
import nairaCurrency from "@/public/naira-image.png";
import yuanCurrency from "@/public/yuan-image.png";
import cryptoTether from "@/public/tether-image.png";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Clock } from "lucide-react";

const currencyImages = [
  {
    src: nairaCurrency,
    alt: "Naira Currency",
    width: 150,
    height: 180,
    wide: false,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    src: yuanCurrency,
    alt: "Yuan Currency",
    width: 160,
    height: 180,
    wide: false,
    gradient: "from-red-500 to-rose-600",
  },
  {
    src: cryptoTether,
    alt: "Crypto Tether",
    width: 160,
    height: 80,
    wide: true,
    gradient: "from-blue-500 to-cyan-600",
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

export default function MoneySection() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16 sm:py-20 lg:py-24">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16"
        >
          {/* Currency Cards Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-5 w-full lg:w-1/2"
          >
            {currencyImages.map(
              ({ src, alt, width, height, wide, gradient }, index) => (
                <motion.div
                  key={alt}
                  variants={imageVariants}
                  whileHover="hover"
                  className={`relative group ${wide ? "col-span-2" : ""}`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
                  />
                  <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                    <div className="flex items-center justify-center">
                      <Image
                        src={src}
                        alt={alt}
                        width={width}
                        height={height}
                        placeholder="blur"
                        className={`object-contain transition-transform duration-300 group-hover:scale-110 ${
                          wide ? "w-40 h-20" : "w-36 h-36"
                        }`}
                      />
                    </div>
                    {/* Currency Label */}
                    <p className="text-center text-sm font-medium text-gray-600 mt-3">
                      {alt.replace(" Currency", "").replace(" Crypto", "")}
                    </p>
                  </div>
                </motion.div>
              ),
            )}
          </motion.div>

          {/* Content Section */}
          <motion.div
            variants={itemVariants}
            className="w-full lg:w-1/2 flex flex-col gap-6"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium w-fit">
              <TrendingUp className="w-4 h-4" />
              Currency Exchange
            </div>

            <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl text-blue-950 leading-tight">
              Change money with us
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-gray-700">
              Experience hassle-free currency exchange at your finger tips.
              Whether you&apos;re traveling abroad, sending money to loved ones,
              or managing international payments, we offer fast, transparent,
              and secure transactions.
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 py-2">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <feature.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-800">
                    {feature.title}
                  </p>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              className="group bg-gradient-to-r from-blue-950 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto self-start"
              onClick={() => router.push("/change-money")}
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            {/* Trust Badge */}
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Live Rates
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                No Hidden Fees
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                24/7 Support
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
