"use client";

import BookModal from "./BookModal";
import { motion } from "framer-motion";
import {
  MapPin,
  Factory,
  Calendar,
  Sparkles,
  Star,
  Users,
  Clock,
  Shield,
} from "lucide-react";

type Reason = {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
};

export default function BookWithUs() {
  const reasons: Array<Reason> = [
    {
      title: "Expert Local Guides",
      description:
        "Our team of experienced and knowledgeable guides ensures you get the most authentic and informative experience.",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Exclusive Factory Access",
      description:
        "Gain behind-the-scenes access to top factories and manufacturing facilities typically closed to the public.",
      icon: Factory,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Customized Itineraries",
      description:
        "Whether you're a curious traveler or business delegate, we tailor each visit to meet your interests and goals.",
      icon: Calendar,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Seamless Experience",
      description:
        "From transportation to translation - we handle all logistics so you can focus on learning and enjoying.",
      icon: Clock,
      color: "from-amber-500 to-amber-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-linear-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Why Choose Us
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-950 mb-4">
            Why Book With Us
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Experience the difference with our premium services and dedicated
            team
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12"
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                {/* Gradient Top Bar */}
                <div className={`h-2 bg-linear-to-r ${reason.color}`} />

                <div className="p-6 sm:p-8">
                  {/* Icon and Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-linear-to-r ${reason.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
                    >
                      <reason.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                      {reason.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed pl-16">
                    {reason.description}
                  </p>

                  {/* Decorative element */}
                  <div className="mt-4 pl-16">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="text-xs text-gray-400 ml-2">
                        Premium Service
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-blue-600">500+</div>
            <div className="text-sm text-gray-500">Happy Clients</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-blue-600">50+</div>
            <div className="text-sm text-gray-500">Factory Tours</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-blue-600">10+</div>
            <div className="text-sm text-gray-500">Expert Guides</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-blue-600">100%</div>
            <div className="text-sm text-gray-500">Satisfaction</div>
          </div>
        </motion.div> */}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <BookModal />

          {/* Additional Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4 text-green-600" />
              Secure Booking
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4 text-blue-600" />
              24/7 Support
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4 text-red-600" />
              Global Coverage
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
