// components/ServicesOffered.tsx
"use client";

import { motion } from "framer-motion";
import {
  Plane,
  Hotel,
  Map,
  Factory,
  Compass,
  ShoppingBag,
  RefreshCw,
  Shield,
  Sparkles,
} from "lucide-react";

interface Service {
  name: string;
  icon: React.ElementType;
  description: string;
}

export default function ServicesOffered() {
  const services: Service[] = [
    {
      name: "Airport Pickup",
      icon: Plane,
      description: "Stress-free arrival and departure",
    },
    {
      name: "Hotel Booking",
      icon: Hotel,
      description: "Best rates guaranteed",
    },
    { name: "City Tours", icon: Map, description: "Explore hidden gems" },
    {
      name: "Factory Visits",
      icon: Factory,
      description: "Behind-the-scenes access",
    },
    {
      name: "Cultural Experiences",
      icon: Compass,
      description: "Immerse in local culture",
    },
    {
      name: "Shopping Assistance",
      icon: ShoppingBag,
      description: "Expert shopping guides",
    },
    {
      name: "Currency Exchange",
      icon: RefreshCw,
      description: "Competitive exchange rates",
    },
    {
      name: "Travel Insurance",
      icon: Shield,
      description: "Peace of mind coverage",
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 w-full py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            What We Offer
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Services Offered
          </h2>
          <div className="w-20 h-1 bg-white/30 mx-auto rounded-full" />
          <p className="text-blue-200 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
            Comprehensive travel and business solutions tailored to your needs
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40">
                {/* Icon */}
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-7 h-7 text-white" />
                </div>

                {/* Service Name */}
                <h3 className="text-white font-semibold text-base sm:text-lg mb-2">
                  {service.name}
                </h3>

                {/* Description */}
                <p className="text-blue-200 text-xs sm:text-sm">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12 sm:mt-16"
        >
          <button className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
            Book Your Experience Today
          </button>
          <p className="text-blue-200 text-sm mt-4">
            Contact us for customized service packages
          </p>
        </motion.div>
      </div>
    </section>
  );
}
