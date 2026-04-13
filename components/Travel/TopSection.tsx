// components/TopSection.tsx
"use client";

import AppCarousel from "../Slider";
import { motion } from "framer-motion";
import { Sparkles, Globe, ShoppingBag, Compass } from "lucide-react";

export default function TopSection() {
  const features = [
    {
      icon: Compass,
      title: "Guided Tours",
      description: "Expertly guided factory and cultural tours",
    },
    {
      icon: ShoppingBag,
      title: "Latest Fashion",
      description: "Trendy outfits, shoes, and accessories",
    },
    {
      icon: Globe,
      title: "Global Trade",
      description: "Import/export services worldwide",
    },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50">
      {/* Carousel Section */}
      <div className="w-full">
        <AppCarousel />
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Title with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Discover More With Us
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-950 mb-4">
            Discover More With Us
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed text-center">
            We specialize in providing personalized tour guide and factory visit
            services that connects you with the heart of the industry and
            culture. Whether you are exploring new business opportunities or
            simply curious about how things are made, our expertly guided tours
            offer an inside look you won&apos;t find anywhere else.
          </p>

          <p className="text-gray-700 text-base sm:text-lg leading-relaxed text-center">
            Let us handle the planning - you just enjoy the experience. From the
            latest fashionable outfits to shoes and accessories, import/export
            of goods, factory visits, travel guides, and currency exchange,
            we&apos;ve got you covered.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 sm:mt-16"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg">
            Explore Our Services
          </button>
        </motion.div>
      </div>
    </section>
  );
}
