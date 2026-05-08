"use client";

import { motion } from "framer-motion";
import { Shield, Globe, Handshake } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Trusted Sourcing",
    description: "We work only with verified suppliers and manufacturers.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connecting you to opportunities across borders.",
  },
  {
    icon: Handshake,
    title: "Long-term Partnerships",
    description: "We build lasting relationships with our clients.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-blue-900 to-blue-800 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            About Us
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-24 h-1 bg-blue-400 mx-auto rounded-full"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
        >
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Welcome to Fourth View Trading Company
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Fourth View Trading Company is a trusted sourcing, procurement,
              and global business support company committed to helping
              individuals, startups, and businesses access reliable products and
              opportunities across borders.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              We specialize in product sourcing, factory verification, quality
              inspection, international procurement, payment assistance to
              factories, and trading support, ensuring that our clients enjoy a
              smooth, transparent, and stress-free experience from start to
              finish.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              At Fourth View, we understand that successful business
              transactions require trust, proper verification, and efficient
              coordination. That is why we work closely with verified suppliers
              and manufacturers to deliver quality solutions tailored to our
              clients&apos; needs.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Beyond sourcing and procurement, we also provide guidance and
              support for school applications and other international
              business-related services, helping our clients navigate global
              opportunities with confidence.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 my-8 border border-blue-100">
              <p className="text-lg font-semibold text-blue-900 text-center">
                Our goal is simple:
              </p>
              <p className="text-xl font-bold text-blue-800 text-center mt-2">
                To provide reliable solutions, build lasting partnerships, and
                make global trade easier and more accessible.
              </p>
              <p className="text-center text-blue-600 mt-4 italic">
                Trusted sourcing. Verified suppliers. Seamless delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <value.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{value.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
