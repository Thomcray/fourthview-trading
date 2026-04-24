"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  Globe,
  Award,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Placeholder image - replace with your actual image
import studyInChinaImage from "@/public/study-in-china.jpg";

const features = [
  {
    icon: Award,
    title: "Top Universities",
    description: "Access to China's most prestigious institutions",
  },
  {
    icon: Globe,
    title: "Global Recognition",
    description: "Degrees recognized worldwide",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Full support throughout application process",
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Quick response and visa assistance",
  },
];

export default function StudyInChina() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative w-full overflow-hidden bg-linear-to-br from-white to-blue-50 py-16 sm:py-20 lg:py-24">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              <div className="relative bg-linear-to-br from-blue-100 to-purple-100 rounded-2xl shadow-xl overflow-hidden h-100 flex items-center justify-center">
                <GraduationCap className="w-32 h-32 text-blue-400 opacity-50" />
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 flex flex-col gap-6"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium w-fit">
              <GraduationCap className="w-4 h-4" />
              Education Abroad
            </div>

            {/* Heading */}
            <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl text-blue-950 leading-tight">
              Study in China
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg leading-relaxed text-gray-700">
              Pursue your academic dreams at China&apos;s top universities. Our
              comprehensive guidance helps international students navigate the
              admission process, secure scholarships, and obtain student visas
              with ease.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <feature.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {feature.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link href="/study-in-china">
              <Button
                className="group bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Apply Now
                <ArrowRight
                  className={`w-4 h-4 ml-2 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
                />
              </Button>
            </Link>

            {/* Trust Indicators */}
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Expert Consultation
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Scholarship Assistance
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Visa Guidance
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
